import React, {useEffect} from 'react';
import {gameService} from "@services/gameService/gameService";

let sep: string;

if (navigator.appVersion.indexOf('Win') !== -1) {
    sep = '\\';
} else {
    sep = '/';
}

import {
    Container,
    Props,
} from './styles';

const HomePage: React.FC<Props> = ({ pageName, visible }) => {

    useEffect(() => {
        gameService.getGameScreenshots(93650).then((result) => {
            console.log(result);
        });
    }, []);

    return (
        <Container className={`app-container-column ${visible ? '' : 'hide-page'}`}>
            <section className="app-section flex-1">
                <ul style={{ width: '100%', height: '100%' }}>

                </ul>
            </section>
        </Container>
    );
};

export default HomePage;
