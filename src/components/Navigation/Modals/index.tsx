import React, { useContext } from 'react';
import Modal from 'react-modal';
import { Props } from './styles';
import IconRoundedButton from '@components/UIElements/Buttons/IconRoundedButton';
import { ThemeContext } from 'styled-components'

import {
    SvgIconClose
} from '@components/UIElements/Icons/SvgIcon'

import {
    modelStyles,
    Header
} from './styles'

Modal.setAppElement('#root');

const Modals: React.FC<Props> = ({ setModal, closeModal, data }) => {
    const theme = useContext(ThemeContext)
    const svgIconClose = <SvgIconClose size='22px' />

    var modal = null;
    switch (setModal) {
        // case 'name':
        //     modal = <NameModal data={data} />;
        //     break;
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
                    <p>Archive</p>
                    <IconRoundedButton
                        onClick={() => { closeModal() }}
                        title='Close'
                        size='24px'
                        svgIcon={svgIconClose}
                        colorDefault={theme.colors.buttonColor}
                        colorHover={theme.colors.buttonBgHover}
                        colorPressed={theme.colors.buttonBgPressed}
                        highlightIcon={true}
                        radius='8px'
                    />
                </Header>
                {modal}
            </Modal>
        </div>
    );
};

export default Modals;