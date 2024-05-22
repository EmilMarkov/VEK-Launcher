import styled from 'styled-components'

export interface Props {
    pageName?: string
    visible?: boolean
}

export const Container = styled.div`
    &{
        display: flex;
        flex: 1;
        overflow-y: auto;
        user-select: none;
        min-width: 400px;
        gap: 10px;
    }
    & .app-image {
        margin-top: 10px !important;
        border-radius: 10px;
        background-color: ${props => props.theme.colors.background_4};
        border-bottom: 0 solid transparent;
    }
    & .app-info-box {
        display: flex;
        flex-direction: row;
        border-radius: 10px;
        flex-wrap: nowrap;
        height: 46px;
        border-bottom: 0 solid transparent;
        background-color: ${props => props.theme.colors.background_4};
        overflow: hidden;
        font-size: 0.8em;
        align-items: center;
    }
    & .app-info-box .left {
        text-transform: uppercase;
        flex-basis: 40%;
        padding: 5px 10px;
        line-height: 40px;
        padding-bottom: 7px;
        text-align: right;
        color: ${props => props.theme.colors.color_1};
        background-color: ${props => props.theme.colors.background_1};
    }
    & .app-info-box .right {
        flex-basis: 60%;
        padding: 5px 10px;
        line-height: 40px;
        padding-bottom: 7px;
        text-align: left;
        color: ${props => props.theme.colors.color_2};
    }
    & .user_selection {
        user-select: text !important;
    }
    & .column {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    & .app-name {
        font-size: 48px;
    }
`