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
    border-radius: 10px;
    background-color: ${props => props.theme.colors.background_6};
    box-sizing: border-box;
    overflow: hidden;
`;

export const CardsContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    overflow-y: auto;
    padding-bottom: 50px;
    max-height: 80vh;
    transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
    opacity: 0;
    transform: translateY(10px);

    &.loaded {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const LoadMoreButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;

    button {
        margin-top: 10px;
        font-size: 16px;
        background-color: ${props => props.theme.colors.background_2};
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:disabled {
            background-color: ${props => props.theme.colors.background_4};
            cursor: default;
        }

        &:not(:disabled):hover {
            background-color: ${props => props.theme.colors.background_4};
            color: white;
        }
    }
`;

document.documentElement.style.scrollBehavior = 'smooth';
