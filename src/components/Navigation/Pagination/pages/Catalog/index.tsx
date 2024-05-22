import React from 'react';

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

const CatalogPage: React.FC<Props> = ({ pageName, visible }) => {
    return (
        <Container className={`app-container-column ${visible ? '' : 'hide-page'}`}>
            <section className="app-section flex-1">
                <ul style={{ width: `${100}%`, height: `${100}%` }}>
                    
                </ul>
            </section>
        </Container>
    );
};

export default CatalogPage;