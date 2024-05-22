import styled, { DefaultTheme } from 'styled-components';

export interface Props {
  setModal?: string | null;
  closeModal: () => void;
}

export const modelStyles = (theme: DefaultTheme) => {
  return {
    overlay: {
      backgroundColor: theme.colors.background_modal,
    },
    content: {
      padding: '10px',
      width: 'auto',
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: '10px',
      flex: '1',
      flexBasis: '100px',
      border: '4px solid ' + theme.colors.background_4,
      borderRadius: '10px',
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
  };
};

export const Header = styled.div`
  & {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    height: 28px;
    align-items: center;
    background-color: ${props => props.theme.colors.background_4};
    border-radius: 6px;
    padding: 0 10px;
  }
`;