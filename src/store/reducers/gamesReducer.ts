// src/store/reducers/gamesReducer.ts
import { GamesActions, IGamesReducerState, FETCH_GAMES } from '@/types/games';

const initialState: IGamesReducerState = {
  games: [],
  loading: false,
  error: null
};

export default function gamesReducer(state = initialState, action: GamesActions): IGamesReducerState {
  switch (action.type) {
    case FETCH_GAMES:
      switch (action.status) {
        case 'REQUEST':
          return { ...state, loading: true, error: null };
        case 'SUCCESS':
          return { ...state, loading: false, games: action.games, error: null };
        case 'FAILURE':
          return { ...state, loading: false, error: action.message };
        default:
          return state;
      }
    default:
      return state;
  }
}
