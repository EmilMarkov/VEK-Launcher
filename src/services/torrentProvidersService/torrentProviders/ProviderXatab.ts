import cheerio from 'cheerio';
import async, { AsyncQueue } from 'async';
import TorrentService from '@/services/torrentService/torrentService';
import { formatName, getFileBuffer, requestWebPage } from '@/services/torrentProvidersService/helpers';
import { xatabFormatter } from '@services/torrentProvidersService/formatters';

export class ProviderXatab {
  private torrentService = new TorrentService();
  private pageQueue: AsyncQueue<number>;
  private torrentQueue: AsyncQueue<{ url: string, title: string }>;
  private totalPages: number = 0;
  private processedPages: number = 0;
  private maxPageInQueue: number = 0;

  constructor() {
    this.pageQueue = async.queue((page: number, callback) => {
      console.log(`Обработка страницы в очереди: ${page}`);
      this.processPage(page, callback);
    }, 1);

    this.torrentQueue = async.queue((task, callback) => {
      console.log(`Обрабатываем торрент: ${task.title}`);
      this.addTorrentFromPage(task.url, task.title).then(() => callback()).catch(callback);
    }, 11);

    this.pageQueue.drain(() => {
      console.log(`Все задачи в pageQueue завершены.`);
      if (this.processedPages < this.totalPages) {
        console.log("Добавляем следующую партию страниц...");
        this.collectPages(Math.min(this.maxPageInQueue + 10, this.totalPages)); // Collect next pages batch
      } else {
        console.log('Все страницы обработаны.');
        this.torrentQueue.drain(() => {
          console.log('Все торренты обработаны.');
        });
      }
    });
  }

  private async request(path: string): Promise<string> {
    const url = `https://byxatab.com${path}`;
    try {
      return await requestWebPage(url);
    } catch (error) {
      console.error(`Ошибка запроса к странице ${url}: ${error instanceof Error ? error.message : String(error)}`);
      return '';  // Возвращаем пустую строку в случае ошибки
    }
  }

  private async addTorrentFromPage(url: string, title: string): Promise<string> {
    try {
      const data = await requestWebPage(url);
      const $ = cheerio.load(data);
      const $downloadButton = $(".download-torrent");
      if ($downloadButton.length === 0) {
        console.error('Кнопка загрузки не найдена.');
        console.log("KNOPKA: " + title + " | " + url)
        throw new Error('Кнопка загрузки не найдена');
      }
      const buffer = await getFileBuffer($downloadButton.attr('href')!);
      return await this.torrentService.addTorrentByBuffer(buffer, title);
    } catch (error) {
      console.error('Ошибка при добавлении торрента: ' + (error instanceof Error ? error.message : String(error)));
      return '';
    }
  }

  private processPage(page: number, callback: () => void): void {
    console.log(`Начинаем обработку страницы: ${page}`);
    this.request(`/page/${page}`).then((data) => {
      if (!data || data.length < 100) {  // Проверяем, что получен ответ достаточной длины
        console.log(`Получен недостаточный ответ от сервера для страницы ${page}`);
        callback();
        return;
      }
      const $ = cheerio.load(data);
      let count = 0;
      $(".entry__title a").each((_, element) => {
        const link = $(element).attr('href');
        const title = formatName(xatabFormatter($(element).text()));
        if (link && title) {
          console.log(`Добавляем торрент в очередь: ${title}`);
          this.torrentQueue.push({ url: link, title });
          count++;
        }
      });
      console.log(`Страница ${page} обработана, найдено ${count} торрентов.`);
      this.processedPages++;
      callback();
    }).catch((error) => {
      console.error(`Ошибка при обработке страницы ${page}: ${error instanceof Error ? error.message : String(error)}`);
      callback();
    }).finally(() => {
      console.log(`Обработка страницы ${page} завершена.`);
    });
  }

  private async getTotalPages(): Promise<number> {
    try {
      const firstPageData = await this.request('/page/1');
      const $ = cheerio.load(firstPageData);
      const totalPages = parseInt($("#bottom-nav > div.pagination > a:last-child").text(), 10);
      console.log(`Всего страниц: ${totalPages}`);
      return isNaN(totalPages) ? 1 : totalPages;
    } catch (error) {
      console.error('Ошибка при получении общего количества страниц: ' + (error instanceof Error ? error.message : String(error)));
      return 1;
    }
  }

  public async initScraping(): Promise<void> {
    this.totalPages = await this.getTotalPages(); // Убедитесь, что этот вызов корректно определяет количество страниц
    console.log(`Начинаем скрапинг. Всего страниц: ${this.totalPages}`);
    this.collectPages(Math.min(10, this.totalPages)); // Начните с первых 10 страниц или меньше, если страниц меньше
  }

  private collectPages(upToPage: number): void {
    let currentPage = this.maxPageInQueue + 1; // Продолжаем с последней обработанной страницы
    this.maxPageInQueue = upToPage;
    while (currentPage <= upToPage) {
      console.log(`Добавляем страницу ${currentPage} в очередь.`);
      this.pageQueue.push(currentPage, () => {
        console.log(`Страница ${currentPage} добавлена в очередь на обработку.`);
      });
      currentPage++;
    }
  }
}