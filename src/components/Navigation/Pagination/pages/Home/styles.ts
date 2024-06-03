import styled from 'styled-components';

export interface Props {
    pageName?: string;
    visible?: boolean;
}

export const Container = styled.div<Props>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    user-select: none;
    width: 100%;
    padding: 10px;
    background-color: ${props => props.theme.colors.background_4};
    border-radius: 10px;
    box-sizing: border-box;
    overflow: hidden;
`;

export const CardsContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    overflow-y: auto;
    padding-bottom: 50px;
    max-height: 80vh;
    opacity: 0;

    &.loaded {
        opacity: 1;
    }
`;

export const NavigationButtons = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    width: 100%;

    button {
        padding: 5px 10px;
        margin: 0 10px;
        font-size: 16px;
        background-color: ${props => props.theme.colors.background_6};
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;

        &:disabled {
            background-color: ${props => props.theme.colors.background_5};
            cursor: default;
        }

        &:not(:disabled):hover {
            background-color: ${props => props.theme.colors.background_5};
        }
    }
`;
