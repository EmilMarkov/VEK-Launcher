import styled from 'styled-components';

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    width: 240px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.1s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    }
`;

export const CardOverlay = styled.div`
    width: 100%;
    padding: 10px;
    background-color: ${props => props.theme.colors.background_6};
    color: #fff;
`;

export const CardTitle = styled.h3`
    font-size: 16px;
    margin: 0;
`;

export const CardRating = styled.div`
    font-size: 14px;
    margin: 5px 0 0;
`;

export const Image = styled.img<{ isLoaded: boolean }>`
    display: ${({ isLoaded }) => (isLoaded ? 'block' : 'none')};
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
