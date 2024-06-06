import React, { useContext } from 'react';
import Modal from 'react-modal';
import { Props } from './styles';
import styled from 'styled-components';
import { ThemeContext } from 'styled-components'
import { X } from 'lucide-react';

import {
    modelStyles,
    Header
} from './styles'
import GameModal from './pages/Game';
import { Button } from '@/components/shadcn-ui/ui/button';
import SearchModal from './pages/Search';

Modal.setAppElement('#root');

const Modals: React.FC<Props> = ({ setModal, closeModal, modalName, data }) => {
    const theme = useContext(ThemeContext)

    var modal = null;
    switch (setModal) {
        case 'game':
            modal = <GameModal data={data}/>;
            break;
        case 'search':
            modal = <SearchModal data={data}/>;
            break;
        default:
            modal = null;
    }

    return (
        <div>
            <Modal
                style={modelStyles(theme)}
                isOpen={modal !== null}
                onRequestClose={closeModal}
            >
                <Header>
                    <p>{modalName}</p>
                    <StyledButton
                        className='h-8 w-8 border-r-2'
                        onClick={() => { closeModal() }}
                        variant="outline"
                        size="icon">
                        <StyledX className="h-4 w-4" />
                    </StyledButton>
                </Header>
                {modal}
            </Modal>
        </div>
    );
};

export default Modals;

const StyledButton = styled(Button)`
    background-color: ${props => props.theme.colors.background_6};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:disabled {
        background-color: #ccc;
        cursor: default;
    }

    &:not(:disabled):hover {
        background-color: ${props => props.theme.colors.background_5};
    }
`;

const StyledX = styled(X)`
    color: ${props => props.theme.colors.color_1};
`;
