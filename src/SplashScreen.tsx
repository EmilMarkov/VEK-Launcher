import React, { useEffect, useState } from 'react';
import GlobalStyle from '@styles/global';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import dark from '@styles/themes/dark';
import usePersistedState from '@utils/userPersistedState';
import { listen } from '@tauri-apps/api/event';
import { Settings } from '@/Settings';
import { appWindow } from '@tauri-apps/api/window';
import { type } from '@tauri-apps/api/os';
import light from '@styles/themes/light';
import { BarLoader } from 'react-spinners';

const osType = await type();

function SplashScreen() {
    const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', dark);
    const [status, setStatus] = useState<string>('Загрузка...');

    useEffect(() => {
        // Listen for status updates
        const unlisten = listen<string>('update_status', (event) => {
            setStatus(event.payload);
        });

        // Clean up listener on unmount
        return () => {
            unlisten.then(f => f());
        };
    }, []);

    // Set appName on taskbar
    async function updateAppName() {
        await appWindow.setTitle(`${Settings.appName}: ${Settings.splashScreenLoadingText}`);
    }
    updateAppName();

    // Update theme when user changes in OS
    appWindow.onThemeChanged(() => {
        appWindow.theme().then(theme => {
            theme === 'dark' ? setTheme(dark) : setTheme(light);
        });
    });

    // Prevent context menu and shortcuts
    function disable_web_functions() {
        document.addEventListener('contextmenu', event => event.preventDefault());
        document.onkeydown = function (e) {
            if ((e.ctrlKey && e.key === 'F5') || (e.key === 'F5')) {
                e.preventDefault();
            } else if ((e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'R')) {
                e.preventDefault();
            } else if ((e.ctrlKey && e.key === 'p') || (e.ctrlKey && e.key === 'P')) {
                e.preventDefault();
            } else if ((e.ctrlKey && e.key === 'f') || (e.ctrlKey && e.key === 'F') || (e.key === 'F3')) {
                e.preventDefault();
            } else if ((e.key === 'F7')) {
                e.preventDefault();
            }
        };
    }

    if (window.location.hostname !== 'localhost') {
        disable_web_functions();
    } else if ((osType === "Linux") || (osType === "Darwin")) {
        disable_web_functions();
    }

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />

            <div data-tauri-drag-region className='preloader-app'>
                <div data-tauri-drag-region className='content'>
                    <img data-tauri-drag-region className='logo' src={Settings.appLogo} height={120} />
                    <div data-tauri-drag-region className='app-name'>{Settings.appName}</div>
                    <div data-tauri-drag-region className='status'>{status}</div>
                    <div data-tauri-drag-region className='loader-wrapper'>
                        <BarLoader color={theme.colors.color_1} width={'100%'} height={4} />
                    </div>
                    <div data-tauri-drag-region className='version'>{Settings.appVersion}</div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default SplashScreen;
