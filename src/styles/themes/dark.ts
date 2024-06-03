import { shade } from 'polished';

export default {
    title: 'dark',

    colors: {
        // Default Colors
        primary: '#131418',  // Очень тёмный серо-чёрный
        secundary: '#98C379',  // Используем яркий акцент для контраста
        accentColor: '#334455',  // Тёмно-синий, почти чёрный
        accentColor_dark: shade(0.1, '#334455'),
        transparent: 'transparent',
        // Background Levels
        background: '#1A1C1F',
        background_1: '#181A1D',
        background_2: '#16181B',
        background_3: '#141619',
        background_4: '#121417',
        background_5: '#101215',
        background_6: '#0D0F12',
        background_modal: 'rgba(13, 15, 18, 0.9)',  // Почти чёрный с небольшой прозрачностью
        // Buttons Colors
        buttonColor: '#0D0F12',  // Очень тёмный чёрный
        buttonBgColor: shade(0.35, '#334455'),  // Тёмный синий
        buttonBgHover: shade(0, '#334455'),  // Тёмный синий без изменения
        buttonBgPressed: '#98C379',  // Сохраняем зелёный для акцента
        // Input Colors
        inputColor: '#B1B7C3',  // Светлый серый для контраста
        inputColorFocus: '#B1B7C3',
        inputBgColor: '#0D0F12',  // Очень тёмный чёрный
        inputBgHover: '#121417',  // Чуть светлее чёрного
        inputBgFocus: '#0D0F12',
        inputBorder: '#0D0F12',
        inputErrorBg: '#1E2027',  // Тёмный серый
        inputErrorBorder: '#E06B74',  // Яркий красный для ошибок
        inputCorrectBorder: '#98C379',  // Зелёный
        // Link Colors
        linkColor: shade(0.35, '#334455'),  // Тёмно-синий
        linkHover: shade(0, '#334455'),  // Тёмно-синий
        linkActive: '#E06B74',  // Яркий красный
        // Text Colors
        color: '#B1B7C3',  // Светлый серый для контраста
        color_1: '#969DAB',  // Средне-серый
        color_2: '#727B8C',  // Тёмно-серый
        // Switch Colors
        switchOn: "#0D0F12",
        switchOff: "#c8d0d9",
        // App Colors
        appColorGreen: '#98C379',  // Зелёный
        appColorRed: '#E06B74',  // Красный
        appColorYellow: '#E5C07B',  // Жёлтый
        appColorOrange: '#D48100',  // Оранжевый
        appColorPink: '#ff008c',  // Яркий розовый
        appColorPink_1: '#C678DD',  // Лиловый
        appBorderColor: '#121417',  // Тёмно-чёрный
        // Icon Color
        appIconColor: '#B1B7C3',  // Светлый серый
    },

    settings: {
        // Setings - Just for Linux
        appBorderMargin: '5px',
        appBorderRadius: '10px',
    }
}
