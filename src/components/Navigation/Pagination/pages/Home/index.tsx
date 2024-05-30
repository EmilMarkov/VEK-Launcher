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
import {IGame} from "@/types";

const HomePage: React.FC<Props> = ({ pageName, visible }) => {

    // useEffect(() => {
    //     const game: IGameInput = {
    //       title: "Impostor Factory",
    //       description: "Безумный, замкнутый во времени, загадочный трагикомедийный триллер про убийства от создателей To the Moon и Finding Paradise, включающий в себя множество случайных совпадений и одного подозрительного кота.",
    //       screenshots: ["screenshots"],
    //       torrents: ["torrents"]
    //     };
    //
    //     gameService.getGameByTitle("hellblade").then((result) => {
    //         console.log(result);
    //     });
    // }, []);

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
