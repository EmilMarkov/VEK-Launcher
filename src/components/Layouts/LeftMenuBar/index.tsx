import React, { useContext, useRef, useState } from 'react'
import { ThemeContext } from 'styled-components'
import { Content, Props } from './styles'
import { 
    SvgIconHome,
    SvgIconCatalog,
    SvgIconLibrary,
    SvgIconSettings,
    SvgIconInfo,
} from '@components/UIElements/Icons/SvgIcon'
import { Settings } from '@/Settings'

const LeftMenuBar: React.FC<Props> = ({
    setPageName,
    width,
    iconLeftPadding,
    textLeftPadding,
    defaultPage,
    buttonsIconSize
})=>{
    const svgIconHome     = <SvgIconHome size={'20'} />
    const svgIconCatalog  = <SvgIconCatalog size={'20'} />
    const svgIconLibrary  = <SvgIconLibrary size={'20'} />
    const svgIconSettings = <SvgIconSettings size={buttonsIconSize ? buttonsIconSize : '24'} />
    const svgIconAbout    = <SvgIconInfo size={buttonsIconSize ? buttonsIconSize : '24'} />

    const menu = useRef<HTMLElement>(null)
    const logoImg = useRef<HTMLImageElement>(null)

    const theme = useContext(ThemeContext)

    function changePage(event: any){
        
        var page = event.target.getAttribute('page-name')
        var isActivated = event.target.getAttribute('is-ctivated')

        if(menu.current && isActivated === 'true') {
            var btns = menu.current.querySelectorAll('a')
            btns.forEach(btn => {
                btn.classList.remove('menu-active')
            });
        }

        if(isActivated === 'true'){
            event.target.setAttribute('class','menu-active')
        }

        if(page){
            setPageName(page)
        }
    }

    return(
        <Content
            setPageName={setPageName}
            width={width}
            iconLeftPadding={iconLeftPadding}
            textLeftPadding={textLeftPadding}
            ref={menu}
            data-tauri-drag-region>
            <nav  className='nav-menus'>
                <ul className='flex-1'>
                    <li>
                        <a className={defaultPage == 'about' ? 'menu-active' : ''}  is-ctivated='true' href="#" onClick={changePage} title='Home' page-name='home'>
                            {svgIconHome}
                            <span>Home</span>
                        </a> 
                    </li>
                    <li>
                        <a className={defaultPage == 'about' ? 'menu-active' : ''} href="#" onClick={changePage} is-ctivated='true' title='Catalog' page-name='catalog'>
                            {svgIconCatalog}
                            <span>Catalog</span>
                        </a>
                    </li>
                    <li>
                        <a className={defaultPage == 'about' ? 'menu-active' : ''} href="#" onClick={changePage} is-ctivated='true' title='Library' page-name='library'>
                            {svgIconLibrary}
                            <span>Library</span>
                        </a>
                    </li>
                </ul>
                <ul className='bottom-menus'>
                    <li>
                        <a className={defaultPage == 'about' ? 'menu-active' : ''} href="#" onClick={changePage} is-ctivated='true' title='Settings' page-name='settings'>
                            {svgIconSettings}
                            <span>Settings</span>
                        </a>
                    </li>
                    <li>
                        <a className={defaultPage == 'about' ? 'menu-active' : ''} href="#" onClick={changePage} is-ctivated='true' title='About' page-name='about'>
                            {svgIconAbout}
                            <span>About</span>
                        </a>
                    </li>
                </ul>
                <div className='div-line'></div>
            </nav>
        </Content>
    )
}

export default LeftMenuBar