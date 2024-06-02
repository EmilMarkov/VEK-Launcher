import React, { useState } from 'react';
import { Card, CardOverlay, CardTitle, CardRating, Image } from './styles';

interface GameCardProps {
    backgroundImage: string;
    name: string;
    rating: number;
}

const GameCard: React.FC<GameCardProps> = ({
    backgroundImage,
    name,
    rating
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Card>
            <Image
                src={backgroundImage}
                alt={name}
                onLoad={() => setIsLoaded(true)}
                isLoaded={isLoaded}
            />
            {isLoaded && (
                <CardOverlay>
                    <CardTitle>{name}</CardTitle>
                    <CardRating>{`Rating: ${rating}`}</CardRating>
                </CardOverlay>
            )}
        </Card>
    );
}

export default GameCard;
