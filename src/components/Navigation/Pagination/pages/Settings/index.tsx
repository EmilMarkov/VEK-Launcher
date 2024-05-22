import React from 'react'
import { Container, Props } from './styles'

const SettingsPage: React.FC<Props> = ({pageName, visible})=>{
    return(
        <Container className={`app-container-column ${visible ? "" : "hide-page"}`}>            
            <section className="app-section flex-1">
                
            </section>
        </Container>
    )
}

export default SettingsPage