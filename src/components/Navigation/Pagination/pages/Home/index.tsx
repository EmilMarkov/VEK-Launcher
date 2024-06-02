import React, {useEffect} from 'react';

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
import { providerOnlineFix } from '@/services/torrentProvidersService/torrentProviders/ProviderOnlineFix';

const HomePage: React.FC<Props> = ({ pageName, visible }) => {

    useEffect(() => {
        providerOnlineFix.fetchTorrentInfo("https://online-fix.me/games/officialservers/17514-ghost-of-tsushima-directors-cut-po-seti.html").then((result) => {
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
