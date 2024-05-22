import styled from 'styled-components';

export interface Props {
    setPage?: string
}

export const Content = styled.section<Props>`
    &{
        width: auto;
        display: flex;
        flex: 1;
        flex-basis: 100px;
        border-radius: 10px;
        margin-top: 5px;
        background-color: ${props => props.theme.colors.background_2};
        overflow: hidden;
    }

    & .scrollable {
        flex: 1;
        display: flex;
        margin: 1px;
        overflow: auto;
        padding: 8px;
    }
    & .hide-page {
        display: none;
    }
`