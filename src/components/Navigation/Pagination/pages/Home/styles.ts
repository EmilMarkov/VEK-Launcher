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
    padding: 20px;
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
    margin-top: 20px;
    width: 100%;

    button {
        padding: 10px 20px;
        margin: 0 10px;
        font-size: 16px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;

        &:disabled {
            background-color: #ccc;
            cursor: default;
        }

        &:not(:disabled):hover {
            background-color: #0056b3;
        }
    }
`;
