import axios from "axios";
import UserAgent from "user-agents";
import { useDispatch } from "react-redux";
import { handleMagnetLinkRequest } from "@/store/actionCreators/torrents";
import { ITorrentProvider } from "./ITorrentProvider";
import { ITorrent } from "@/types/torrents";

export abstract class BaseTorrentProvider implements ITorrentProvider {
  abstract getTorrents(existingTorrents?: ITorrent[], page?: Number): Promise<ITorrent[] | void>;

  protected saveTorrent(link: string) {
    const dispatch = useDispatch();
    dispatch(handleMagnetLinkRequest(link));
  }

  protected requestWebPage(url: string): Promise<any> {
    const userAgent = new UserAgent();

    return axios
      .get(url, {
        headers: {
          "User-Agent": userAgent.toString(),
        },
      })
      .then((response) => response.data);
  }
}
