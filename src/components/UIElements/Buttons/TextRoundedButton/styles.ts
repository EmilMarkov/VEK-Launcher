import styled from 'styled-components';

export interface Props {
    id?: string
    ref?: any
    type?: 'submit' | 'reset' | 'button' | undefined;
    onClick?(): void
    isActive?: boolean
    text?: string
    iconSize?: string
    highlightIcon?: boolean
    width?: string
    height?: string
    colorDefault?: string
    colorHover?: string
    colorPressed?: string
    colorActive?: string
    radius?: string
    title?: string
}

export const Button = styled.button<Props>`
    &{
        width: ${props => props.width};
        height: ${props => props.height};
        aspect-ratio: 1/1;
        border-radius: ${props => props.radius};
        background-color: ${
         props => props.isActive ? props => props.colorActive : props => props.colorDefault
        };
        color: ${props => props.theme.colors.color};
        font-size: 16px;
        padding: 8px;
        margin: 0;
        display: flex;
        align-content: center;
        align-items: center;
    }
    &:hover {
        transition: 0.3s;
        background-color: ${props => props.theme.colors.background_3};
        color: ${props => props.theme.colors.color_1}
    }
    &:active {
        background-color: ${props => props.theme.colors.background_3};
        color: ${props => props.theme.colors.color_2}
    }
`