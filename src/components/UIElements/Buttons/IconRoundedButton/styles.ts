import styled from 'styled-components';

export interface Props {
    id?: string
    ref?: any
    type?: 'submit' | 'reset' | 'button' | undefined;
    onClick?(): void
    isActive?: boolean
    svgIcon?: any
    iconSize?: string
    highlightIcon?: boolean
    size?: string
    colorDefault?: string
    colorHover?: string
    colorPressed?: string
    colorActive?: string
    radius?: string
    title?: string
}

export const Button = styled.button<Props>`
    &{
        width: ${props => props.size};
        height: ${props => props.size};
        aspect-ratio: 1/1;
        border-radius: ${props => props.radius};
        background-color: ${
         props => props.isActive ? props => props.colorActive : props => props.colorDefault
        };
        padding: 0;
        margin: 0;
        display: flex;
        align-content: center;
        align-items: center;
    }
    & svg {
        margin: auto;
    }
    &:hover {
        transition: 0.5s;
        background-color: ${props => props.colorHover};
    }
    & svg {
        filter: brightness(5);
    }
    &:hover svg {
        filter: brightness(5);
    }
    &:active {
        background-color: ${props => props.colorPressed};
    }
    &:active svg {
        filter: brightness(1);
    }
`