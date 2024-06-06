import styled from 'styled-components';
import { GameSearchResults } from '@/types';

export interface Props {
  data: GameSearchResults;
}

export const ModalContent = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    gap: 10px;
  }
`;

export const ContentContainer = styled.div`
  & {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.colors.background_4};
    border-radius: 6px;
    border: '2px solid #343B48',
  }
`;