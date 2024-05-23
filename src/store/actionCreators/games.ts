// src/store/actions/gamesActions.ts
import { FETCH_GAMES, FetchGamesRequest, FetchGamesSuccess, FetchGamesFailure, IGame } from '@/types/games';

export const fetchGamesRequest = (): FetchGamesRequest => ({
  type: FETCH_GAMES,
  status: 'REQUEST'
});

export const fetchGamesSuccess = (games: IGame[]): FetchGamesSuccess => ({
  type: FETCH_GAMES,
  status: 'SUCCESS',
  games
});

export const fetchGamesFailure = (message: string): FetchGamesFailure => ({
  type: FETCH_GAMES,
  status: 'FAILURE',
  message
});
