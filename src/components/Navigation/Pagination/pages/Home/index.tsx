import React from 'react';
import { ITorrentProvider } from '@/services/torrentProvidersService/ITorrentProvider';
import { ProviderGOG } from '@/services/torrentProvidersService/torrentProviders/ProviderGOG';

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
import TextRoundedButton from '@/components/UIElements/Buttons/TextRoundedButton';

const HomePage: React.FC<Props> = ({ pageName, visible }) => {
    const providerGOG: ITorrentProvider = new ProviderGOG();
    console.log(providerGOG.getTorrents());

    return (
        <Container className={`app-container-column ${visible ? '' : 'hide-page'}`}>
            <section className="app-section flex-1">
                <ul style={{ width: `${100}%`, height: `${100}%` }}>
                    
                </ul>
            </section>
        </Container>
    );
};

export default HomePage;