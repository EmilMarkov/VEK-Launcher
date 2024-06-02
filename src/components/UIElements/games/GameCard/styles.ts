import styled from 'styled-components';

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end; // Выравнивание содержимого к низу
    position: relative; // Для позиционирования элементов внутри карточки
    width: 240px;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    background-size: cover; // Фоновое изображение на всю карточку
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
    padding: 10px; // Уменьшенные отступы
    background-color: rgba(0, 0, 0, 0.5); // Полупрозрачный черный фон
    color: #fff; // Белый цвет текста
`;

export const CardTitle = styled.h3`
    font-size: 16px;
    margin: 0; // Убраны отступы вокруг заголовка
`;

export const CardRating = styled.div`
    font-size: 14px;
    margin: 5px 0 0; // Отступ только сверху
`;

export const Image = styled.img<{ isLoaded: boolean }>`
    display: ${({ isLoaded }) => (isLoaded ? 'block' : 'none')};
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
