import React, {useState, useEffect, useMemo, useRef} from 'react';
import { gameService } from '@services/gameService/gameService';
import { Container, CardsContainer, NavigationButtons } from './styles';
import GameCard from '@/components/UIElements/games/GameCard';
import { listen } from '@tauri-apps/api/event';

const HomePage: React.FC = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [prevPage, setPrevPage] = useState<string | null>(null);
    const apiKeyUpdated = useRef(false);
    const [cache, setCache] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        const unlisten = listen('api_key_updated', () => {
            apiKeyUpdated.current = true;
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);

    const fetchGames = async (page?: number, next?: string) => {
        setLoading(true);
        const cacheKey = next || `page-${page}`;

        if (cache[cacheKey]) {
            const data = cache[cacheKey];
            setGames(data.results);
            setNextPage(data.next);
            setPrevPage(data.previous);
            setLoading(false);
        } else {
            try {
                const data = next ? await gameService.getGameList(undefined, next) : await gameService.getGameList(page);
                setCache(prevCache => ({ ...prevCache, [cacheKey]: data }));
                setGames(data.results);
                setNextPage(data.next);
                setPrevPage(data.previous);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch games:', error);
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (apiKeyUpdated) {
            fetchGames(1);
        }
    }, [apiKeyUpdated.current]);

    const gameCards = useMemo(
        () => games.map(game => (
            <GameCard
                key={game["id"]}
                backgroundImage={game["background_image"]}
                name={game["name"]}
                rating={game["rating"]}
            />
        )),
        [games]
    );

    return (
        <Container>
            <CardsContainer className={!loading ? 'loaded' : ''}>
                {gameCards}
            </CardsContainer>
            <NavigationButtons>
                <button onClick={() => prevPage && fetchGames(undefined, prevPage)} disabled={!prevPage}>
                    Previous
                </button>
                <button onClick={() => nextPage && fetchGames(undefined, nextPage)} disabled={!nextPage}>
                    Next
                </button>
            </NavigationButtons>
        </Container>
    );
};

export default HomePage;
