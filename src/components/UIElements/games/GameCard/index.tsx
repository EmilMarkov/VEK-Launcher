import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@components/shadcn-ui/ui/card';
import styled from 'styled-components';
import Modals from '@/components/Navigation/Modals';

interface GameCardProps {
    id: number;
    backgroundImage: string;
    name: string;
    rating: number;
}

const GameCard: React.FC<GameCardProps> = ({ id, backgroundImage, name, rating }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedModal, setSelectedModal] = useState<string | null>(null);

    const handleOpenModal = (modalName: string) => {
        setSelectedModal(modalName);
    };

    const handleCloseModal = () => {
        setSelectedModal(null);
    };

    return (
        <div>
            <StyledCard onClick={() => handleOpenModal("game")}>
                {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
                <BackgroundImage
                    src={backgroundImage}
                    alt={name}
                    onLoad={() => setIsLoaded(true)}
                    isLoaded={isLoaded}
                />
                {isLoaded && (
                    <Overlay>
                        <CardHeader className="p-1">
                            <CardTitle className="text-lg truncate">{name}</CardTitle>
                            <CardDescription className="text-sm">{`Rating: ${rating}`}</CardDescription>
                        </CardHeader>
                    </Overlay>
                )}
            </StyledCard>
            <Modals
                setModal={selectedModal}
                closeModal={handleCloseModal}
                modalName={name}
                data={id}
            />
        </div>
    );
}

export default GameCard;

const StyledCard = styled(Card)`
    width: 180px;
    height: 260px;
    position: relative;
    overflow: hidden;
    border: none;
    border-radius: 8px;
    transition: transform 0.1s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const BackgroundImage = styled.img<{ isLoaded: boolean }>`
    display: ${({ isLoaded }) => (isLoaded ? 'block' : 'none')};
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
`;

const Overlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4));
    color: #fff;
`;
