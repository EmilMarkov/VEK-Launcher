import { AppActionBase } from '@/types/actions';

export interface IGame {
  id: number;
  title: string;
  description: string;
  screenshots: string[];
}

export interface IGamesReducerState {
  games: IGame[];
  loading: boolean;
  error: string | null;
}

export const FETCH_GAMES = 'FETCH_GAMES';

export type FetchGamesRequest = AppActionBase<typeof FETCH_GAMES, 'REQUEST'>;
export type FetchGamesSuccess = AppActionBase<typeof FETCH_GAMES, 'SUCCESS'> & { games: IGame[] };
export type FetchGamesFailure = AppActionBase<typeof FETCH_GAMES, 'FAILURE'> & { message: string };

export type GamesActions = FetchGamesRequest | FetchGamesSuccess | FetchGamesFailure;
export type GamesActionTypes = typeof FETCH_GAMES | '';
