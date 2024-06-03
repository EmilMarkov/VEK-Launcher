import { shade } from 'polished';

export default {
    title: 'light',

    colors: {
        // Default Colors
        primary: '#35495E',  // Тёмно-синий
        secundary: '#627c91', // Светло-серо-синий
        accentColor: '#41B883', // Зелёный
        accentColor_dark: shade(0.2, '#41B883'),
        transparent: 'transparent',
        // Background Levels
        background: '#ffffff', // Чисто белый
        background_1: '#f5f8fa', // Очень светлый серый (почти белый)
        background_2: '#ecf1f5', // Светло-серый
        background_3: '#e3e8ed', // Средне-светлый серый
        background_4: '#dae1e7', // Серый
        background_5: '#d1d9e1', // Тёмно-серый
        background_6: '#c8d0d9', // Ещё темнее серого
        background_modal: 'rgba(255, 255, 255, 0.9)', // Прозрачно-белый
        // Buttons Colors
        buttonColor: '#c8d0d9', // Тёмный синий
        buttonBgColor: '#c8d0d9', // Очень светлый серый
        buttonBgHover: '#bdc3c7', // Светло-серый
        buttonBgPressed: '#95a5a6', // Средний серый
        // Input Colors
        inputColor: '#34495e', // Тёмно-синий
        inputColorFocus: '#ffffff', // Белый
        inputBgColor: '#ecf0f1', // Очень светлый серый
        inputBgHover: '#bdc3c7', // Светло-серый
        inputBgFocus: '#95a5a6', // Средний серый
        inputBorder: '#bdc3c7', // Светло-серый
        inputErrorBg: '#e74c3c', // Ярко-красный
        inputErrorBorder: '#c0392b', // Темно-красный
        inputCorrectBorder: '#2ecc71', // Зеленый
        // Link Colors
        linkColor: '#3498db', // Ярко-синий
        linkHover: '#2980b9', // Темно-синий
        linkActive: '#34495e', // Темно-синий
        // Text Colors
        color: '#2c3e50', // Тёмный синий
        color_1: '#7f8c8d', // Средне-серый
        color_2: '#95a5a6', // Светло-серый
        // Switch Colors
        switchOn: "#0D0F12",
        switchOff: "#c8d0d9",
        // App Colors
        appColorGreen: '#2ecc71', // Зеленый
        appColorRed: '#e74c3c', // Красный
        appColorYellow: '#f1c40f', // Желтый
        appColorOrange: '#e67e22', // Оранжевый
        appColorPink: '#fd79a8', // Розовый
        appColorPink_1: '#d63031', // Темно-розовый
        appBorderColor: '#bdc3c7', // Светло-серый
        // Icon Color
        appIconColor: '#2c3e50', // Тёмный синий
    },

    settings: {
        // Настройки только для Linux
        appBorderMargin: '5px',
        appBorderRadius: '10px',
    }
}
