import styled from 'styled-components'

export interface Props {
    pageName?: string
    visible?: boolean
}

export const Container = styled.div`
    & {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow-y: auto;
        user-select: none;
        min-width: 400px;
    }
`