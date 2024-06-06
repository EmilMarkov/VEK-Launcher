import React, { KeyboardEvent, useContext, useState } from 'react'
import Switch from 'react-switch'
import { ThemeContext } from 'styled-components'
import { Props, Content } from './styles'
import IconRoundedButton from '@components/UIElements/Buttons/IconRoundedButton'
import { appWindow } from '@tauri-apps/api/window'
import { type } from '@tauri-apps/api/os';
const osType = await type()

// Themes
import light from '@styles/themes/light'
import dark from '@styles/themes/dark'

// SVG Icons
import {
    SvgIconClose,
    SvgIconMaximize, 
    SvgIconMinimize, 
    SvgIconRestore,
    SvgIconNotification
} from '@components/UIElements/Icons/SvgIcon'
import { Input } from '@/components/shadcn-ui/ui/input'
import { Separator } from '@/components/shadcn-ui/ui/separator'
import { gameService } from '@/services/gameService/gameService'
import usePersistedState from '@/utils/userPersistedState'
import Modals from '@/components/Navigation/Modals'
import { GameSearchResults } from '@/types'


const Header: React.FC<Props> = ({
    focus,
    isAppMaximized, 
    setTheme, 
    appName,
    leftInformation,
    actualPageName
})=>{
  const [searchResults, setSearchResults] = useState<GameSearchResults>();
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const handleOpenModal = (modalName: string) => {
    setSelectedModal(modalName);
  };

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  // Set useContext
  const theme = useContext(ThemeContext)

  // SvgIcons
  const svgIconMinimize = <SvgIconMinimize size='14' />
  const svgIconMaximize = <SvgIconMaximize size='14' />
  const svgIconRestore = <SvgIconRestore size='14' />
  const svgIconClose = <SvgIconClose size='14' />
  const svgIconNotification = <SvgIconNotification size='18' />
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = usePersistedState<string | null>('apiKey', null);

  // Toggle theme
  const toggleTheme = ()=>{
      setTheme(theme.title == 'dark' ? light : dark)
  }

  // Title Bar Buttons - Check OS
  // Title Bar for Windows and Linux only
  var titleBarButtons: any
  if(osType != "Darwin") {
    titleBarButtons = 
      <div className='buttons-box'>
        <div id="titlebar-minimize">
          <IconRoundedButton
            onClick={() => { appWindow.minimize() }}
            title='Minimize'
            size='30px'
            svgIcon={svgIconMinimize}
            colorDefault={theme.colors.background}
            colorHover={theme.colors.buttonBgHover}
            colorPressed={theme.colors.appColorYellow}
            highlightIcon={true}
            radius='8px'
          />
        </div>
        <div id="titlebar-maximize">
          <IconRoundedButton
            onClick={() => { appWindow.toggleMaximize() }}
            title={isAppMaximized ? "Restore" : "Maximize"}
            size='30px'
            svgIcon={isAppMaximized ? svgIconRestore : svgIconMaximize}
            colorDefault={theme.colors.background}
            colorHover={theme.colors.buttonBgHover}
            colorPressed={theme.colors.appColorGreen}
            highlightIcon={true}
            radius='8px'
          />
        </div>
        <div id="titlebar-close">
          <IconRoundedButton
            onClick={() => { appWindow.close() }}
            title='Close'
            size='30px'
            svgIcon={svgIconClose}
            colorDefault={theme.colors.background}
            colorHover={theme.colors.buttonBgHover}
            colorPressed={theme.colors.appColorRed}
            highlightIcon={true}
            radius='8px'
          />
        </div>
      </div>
  }

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const result = await searchGames(inputValue);
      
      if (result) {
        setSearchResults(result);
        handleOpenModal("search");
      }
    }
  };

  const searchGames = async (query: string, next?: string) => {
    if (apiKey) {
      return await gameService.searchGame(apiKey, query);
    }
  }
  
  return(
      <Content
        focus={focus}
        data-tauri-drag-region
        className='header'
      >
        <div className='title-bar'>
          <div data-tauri-drag-region className='icon-title flex items-center w-full'>
            <h1 data-tauri-drag-region>{appName?.toUpperCase()}</h1>
            <Separator orientation="vertical" className='h-6' style={{backgroundColor: theme.colors.color_2}} />
          </div>
          <div className='buttons'>
            <Input
              className='h-7 placeholder:leading-7'
              placeholder='search'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{backgroundColor: theme.colors.background_6}}/>
            <div id="titlebar-notification">
              <IconRoundedButton
                onClick={() => { }}
                title='Notification'
                size='28px'
                svgIcon={svgIconNotification}
                colorDefault={theme.colors.buttonColor}
                colorHover={theme.colors.buttonBgHover}
                colorPressed={theme.colors.buttonBgPressed}
                highlightIcon={true}
                radius='8px'
              />
            </div>
            <div title='Toggle theme' className='switch'>
              <Switch
                onChange={toggleTheme}
                checked={theme.title == 'dark'}
                checkedIcon={false}
                uncheckedIcon={false}
                width={30}
                height={16}
                handleDiameter={12}
                offColor={theme.colors.switchOff}
                onColor={theme.colors.switchOn}
              />
            </div>
            
            {titleBarButtons}
          </div>
        </div>
        <div className='info-bar'>
          <span>{leftInformation}</span>
          <span>| {actualPageName?.toUpperCase()}</span>
        </div>
        <Modals
          setModal={selectedModal}
          closeModal={handleCloseModal}
          modalName={"Search resluts for: " + inputValue}
          data={searchResults}
        />
      </Content>
  )
}

export default Header