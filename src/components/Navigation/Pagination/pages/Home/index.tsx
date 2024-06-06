import React, { useState, useEffect, useMemo } from 'react';
import { gameService } from '@services/gameService/gameService';
import { Container, CardsContainer, LoadMoreButtonContainer, Props } from './styles';
import GameCard from '@/components/UIElements/games/GameCard';
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/shadcn-ui/ui/button";
import { listen } from '@tauri-apps/api/event';
import useTemporaryState from '@/utils/userTemporaryState';
import usePersistedState from '@/utils/userPersistedState';

interface Game {
    id: number;
    background_image: string;
    name: string;
    rating: number;
}

const HomePage: React.FC<Props> = ({ pageName, visible }) => {
    const [apiKey, setApiKey] = usePersistedState<string | null>('apiKey', null);
    const [homePageState, setHomePageState, isInitialized] = useTemporaryState('HomePage', {
        games: new Set<Game>(),
        nextPage: null as string | null,
        loading: false,
        loadingMore: false,
        pagesLoaded: 0
    });

    useEffect(() => {
        if (isInitialized) {
            if (apiKey) {
                if (homePageState.pagesLoaded === 0) {
                    fetchGames();
                }
            } else {
                const unlisten = listen('api_key_updated', (event) => {
                    setApiKey(event.payload as string);
                    if (homePageState.pagesLoaded === 0) {
                        fetchGames();
                    }
                });
    
                return () => {
                    unlisten.then(f => f());
                };
            }
        }
    }, [apiKey, homePageState.pagesLoaded, isInitialized]);

    const fetchGames = async (next?: string, isLoadMore = false) => {
        if (isLoadMore) {
            setHomePageState(prevState => ({ ...prevState, loadingMore: true }));
        } else {
            setHomePageState(prevState => ({ ...prevState, loading: true }));
        }
        try {
            if (apiKey) {
                const data = next ? await gameService.getGameList(apiKey, undefined, next) : await gameService.getGameList(apiKey, 1);
                const newGames = data.results || [];
                const uniqueGames = newGames.filter((newGame: Game) => ![...homePageState.games].some(game => game.id === newGame.id));

                console.log(uniqueGames.length)

                if (uniqueGames.length === 0) {
                    await fetchGames(next, isLoadMore);
                    return;
                }

                setHomePageState(prevState => ({
                    ...prevState,
                    games: new Set([...prevState.games, ...uniqueGames]),
                    nextPage: data.next,
                    pagesLoaded: prevState.pagesLoaded + 1,
                    loading: false,
                    loadingMore: false
                }));
            }
        } catch (error) {
            console.error('Failed to fetch games:', error);
            setHomePageState(prevState => ({ ...prevState, loading: false, loadingMore: false }));
        }
    };

    const handleLoadMore = () => {
        if (homePageState.nextPage) {
            fetchGames(homePageState.nextPage, true);
        }
    };

    const gameCards = useMemo(
        () => Array.from(homePageState.games).map((game: Game) => (
            <GameCard
                key={game.id}
                id={game.id}
                backgroundImage={game.background_image}
                name={game.name}
                rating={game.rating}
            />
        )),
        [homePageState.games]
    );

    return (
        <Container>
            <CardsContainer className={!homePageState.loading ? 'loaded' : ''}>
                {gameCards}
            </CardsContainer>
            {homePageState.nextPage && (
                <LoadMoreButtonContainer>
                    <Button onClick={handleLoadMore} variant="outline" disabled={homePageState.loadingMore}>
                        {homePageState.loadingMore ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <ChevronDown className="h-5 w-5" />
                        )}
                    </Button>
                </LoadMoreButtonContainer>
            )}
        </Container>
    );
};

export default HomePage;
