import styled from 'styled-components'

export interface Props {
    focus?: boolean
    isAppMaximized?: boolean
    setTheme?: any
    appName?: string
    leftInformation?: string
    actualPageName?: string
}

export const Content = styled.header<Props>`
    /* Header */
    & {
        flex: 0;
        width: auto;
        height: 61px;
        flex-basis: 61px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: ${props => props.theme.colors.background};
    }
    & .title-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        height: 34px;
        opacity: ${props => props.focus ? '1' : '0.5' };
    }
    & .title-bar .icon-title {
        display: flex;
        align-items: center;
        flex: 1;
        height: 34px;
        font-size: 16px;
        line-height: 34px;
        gap: 6px;
        padding-left: 6px;
        margin-right: 10px;
        overflow: hidden;
    }
    & .title-bar .icon-title h1 {
        display: flex;
        align-items: center;
        flex: 1;
        padding-top: 2px;
        padding-left: 10px;
        White-space: nowrap;
        overflow: hidden;
    }
    & .title-bar .buttons {
        display: flex;
        align-items: center;
        gap: 5px;
        padding-right: 2px;
        width: calc(100% - 218px);
    }
    & .title-bar .buttons .switch {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        line-height: 34px;
        padding-top: 3px;
        margin-right: 10px;
    }
    & .buttons .buttons-box {
        display: flex;
        flex-direction: row;
        gap: 2;
    }
    & .info-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 28px;
        max-height: 28px;
        border-radius: 10px;
        line-height: 22px;
        color: ${props => props.theme.colors.color_2};
        padding-left: 10px;
        margin-left: 5px;
        padding-right: 10px;
        font-size: 0.8em;
        line-height: 22px;
        background-color: ${props => props.theme.colors.background_3};
        gap: 5px;
    }
    & .info-bar span {
        white-space: nowrap;
        overflow: hidden;
        font-size: 14px;
    }
`