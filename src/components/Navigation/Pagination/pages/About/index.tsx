import React from 'react'
import { Container, Props } from './styles'
import { Settings } from '@/Settings'

import { SvgIconLogo } from '@components/UIElements/Icons/SvgIcon'
import store from '@/store'

const AboutPage: React.FC<Props> = ({pageName, visible})=>{
    const svgIconLogo = <SvgIconLogo size='120px' />

    console.log(store.getState())

    return(
        <Container className={`app-container-column ${visible ? "" : "hide-page"}`}>            
            <section className="app-section flex-1">
                <div className="content box-time flex-column">
                    <div className='column app-image'>
                        {svgIconLogo}
                        <div className='app-name'>{Settings.appName}</div>
                    </div>
                    <div className='row app-info-box'>
                        <div className='left'>name:</div>
                        <div className='right'><b>{Settings.appName}</b></div>
                    </div>
                    <div className='row app-info-box'>
                        <div className='left'>version:</div>
                        <div className='right'>{Settings.appVersion}</div>
                    </div>
                    <div className='row app-info-box'>
                        <div className='left'>development credits:</div>
                        <div className='right'>{Settings.appDeveloperCredits}</div>
                    </div>
                    <div className='row app-info-box'>
                        <div className='left'>email:</div>
                        <div className='right user_selection'>{Settings.appDeveloperEmail}</div>
                    </div>
                    <div className='row app-info-box'>
                        <div className='left'>framework:</div>
                        <div className='right'>Tauri 1.4 with React</div>
                    </div>
                    <div className='row app-info-box'>
                        <div className='left'>languages:</div>
                        <div className='right'>TypeScript (frontend) and Rust (backend)</div>
                    </div>
                </div>
            </section>
        </Container>
    )
}

export default AboutPage