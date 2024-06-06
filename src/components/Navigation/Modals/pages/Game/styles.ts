import styled from 'styled-components';

export interface Props {
  data: number;
}

export interface Screenshot {
  id: number;
  image: string;
  width: number;
  height: number;
  is_deleted: boolean;
}

export interface Movie {
  id: number;
  name: string;
  preview: string;
  data: {
    max?: string;
  };
}

export const ModalContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  max-height: 90vh;
  padding: 20px;
  background-color: ${props => props.theme.colors.background_6};
  border-radius: 10px;
  overflow: hidden;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 10px;
  padding-right: 10px;
  box-sizing: border-box;
`;

export const SetupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

export const GameImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const GameDescription = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  text-align: justify;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.background_6};
  border-radius: 10px;
  background-color: ${props => props.theme.colors.background};
  width: 100%;
`;

export const GameRating = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.background_6};
  border-radius: 10px;
  background-color: ${props => props.theme.colors.background};
  width: 100%;
  text-align: center;
`;

export const GameDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 20px;
`;

export const GameMeta = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.background_6};
  border-radius: 10px;
  background-color: ${props => props.theme.colors.background};

  span {
    font-weight: bold;
  }

  a {
    color: ${props => props.theme.colors.color_1};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
  }
`;

export const GamePlatform = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.background_6};
  border-radius: 10px;
  background-color: ${props => props.theme.colors.background};

  span {
    font-weight: bold;
  }
`;
