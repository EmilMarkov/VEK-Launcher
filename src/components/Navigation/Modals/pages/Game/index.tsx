import React, { useContext, useEffect, useState } from 'react';
import {
    Props,
    ModalContent,
    ContentContainer,
    SetupContainer,
    GameDescription,
    GameRating,
    GameDetails,
    GamePlatform,
    GameMeta,
    Screenshot,
    Movie
} from './styles';
import { gameService } from '@/services/gameService/gameService';
import { torrentService } from '@/services/torrentService/torrentService';
import { Torrent, TorrentInfo } from '@/types';
import { fetchTorrentInfo } from '@/services/torrentProvidersService/helpers';
import usePersistedState from '@/utils/userPersistedState';
import { MediaCarousel } from '@/components/UIElements/Carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn-ui/ui/tabs';
import Select, { SingleValue, ActionMeta } from 'react-select';
import { ThemeContext } from 'styled-components';

interface Option {
    value: string;
    label: string;
}

const GameModal: React.FC<Props> = ({ data }) => {
    const theme = useContext(ThemeContext);
    const [gameDetails, setGameDetails] = useState<any>({});
    const [gameScreenshots, setGameScreenshots] = useState([]);
    const [gameMovies, setGameMovies] = useState<any>([]);
    const [torrentInfos, setTorrentInfos] = useState<TorrentInfo[]>([]);
    const [torrentOptions, setTorrentOptions] = useState<Option[]>([]);
    const [apiKey, setApiKey] = usePersistedState<string | null>('apiKey', null);

    const loadGameDetails = async (id: number) => {
        try {
            if (apiKey) {
                const details = await gameService.getGameDetail(apiKey, id) || [];
                const screenshots = await gameService.getGameScreenshots(apiKey, id);
                const movies= await gameService.getGameMovies(apiKey, id);
                if (details.length === 0 || screenshots.length === 0 || movies.length === 0) {
                    await loadGameDetails(id);
                    return;
                }
                else {
                    setGameDetails(details);
                    setGameScreenshots(screenshots.results.map((screenshot: Screenshot) => screenshot.image));
                    setGameMovies([details.clip.clips.full, ...movies.results.map((movie: Movie) => movie.data.max)]);
                    const torrents: Torrent[] = await torrentService.getTorrentsByName(details.name);
                    const torrentInfos = await fetchTorrentInfo(torrents);
                    const options = torrentInfos.map((torrent) => ({
                        value: torrent.magnet,
                        label: torrent.repacker + " | " + torrent.name,
                    }));
                    setTorrentOptions(options);
                    setTorrentInfos(torrentInfos);
                }
            }
        } catch (error) {
            console.error('Error fetching game details:', error);
        }
    };

    useEffect(() => {
        loadGameDetails(data);
    }, [data]);

    return (
        <ModalContent>
            <ContentContainer>
                <Tabs defaultValue="images" className='w-full h-auto'>
                    <TabsList className='grid w-full grid-cols-2 bg-transparent shadow-none border-none'>
                        <TabsTrigger value='images' style={{color: theme.colors.color}}>Images</TabsTrigger>
                        <TabsTrigger value='videos' style={{color: theme.colors.color_1}}>Videos</TabsTrigger>
                    </TabsList>
                    <TabsContent className='w-full' value='videos'>
                        <MediaCarousel videos={gameMovies}/>
                    </TabsContent>
                    <TabsContent value='images'>
                        <MediaCarousel images={gameScreenshots}/>
                    </TabsContent>
                </Tabs>
                <GameDescription dangerouslySetInnerHTML={{ __html: gameDetails.description || '' }} />
                <GameRating>Rating: {gameDetails.rating} / 5</GameRating>
                <GameDetails>
                    <GameMeta>
                        <span>Metacritic:</span> <a href={gameDetails.metacritic_url} target="_blank" rel="noopener noreferrer">{gameDetails.metacritic}</a>
                    </GameMeta>
                    <GameMeta>
                        <span>Release Date:</span> {gameDetails.released}
                    </GameMeta>
                    <GameMeta>
                        <span>Website:</span> <a href={gameDetails.website} target="_blank" rel="noopener noreferrer">{gameDetails.website}</a>
                    </GameMeta>
                </GameDetails>
                {gameDetails.platforms && gameDetails.platforms.map((platform: any) => (
                    <GamePlatform key={platform.platform.id}>
                        <span>{platform.platform.name}</span>
                    </GamePlatform>
                ))}
            </ContentContainer>
            <SetupContainer>
                <Select
                    className='w-full'
                    options={torrentOptions}
                    isDisabled={torrentOptions.length === 0}/>
            </SetupContainer>
        </ModalContent>
    );
};

export default GameModal;
