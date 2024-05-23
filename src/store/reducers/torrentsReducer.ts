import {
  TorrentActions,
  ITorrentsReducerState,
  FETCH_TORRENTS,
  HANDLE_TORRENT,
  HANDLE_MAGNET
} from '@/types/torrents';

const initialState: ITorrentsReducerState = {
  torrents: [],
  loading: false,
  error: null
};

export default function torrentsReducer(state = initialState, action: TorrentActions): ITorrentsReducerState {
  switch (action.type) {
    case FETCH_TORRENTS:
      switch (action.status) {
        case 'REQUEST':
          return { ...state, loading: true, error: null };
        case 'SUCCESS':
          return { ...state, loading: false, torrents: action.torrents, error: null };
        case 'FAILURE':
          return { ...state, loading: false, error: action.message };
        default:
          return state;
      }
    case HANDLE_TORRENT:
      switch (action.status) {
        case 'REQUEST':
          return { ...state, loading: true, error: null };
        case 'SUCCESS':
          return { ...state, loading: false, torrents: [...state.torrents, action.torrent], error: null };
        case 'FAILURE':
          return { ...state, loading: false, error: action.message };
        default:
          return state;
      }
    case HANDLE_MAGNET:
      switch (action.status) {
        case 'REQUEST':
          return { ...state, loading: true, error: null };
        case 'SUCCESS':
          return { ...state, loading: false, torrents: [...state.torrents, action.torrent], error: null };
        case 'FAILURE':
          return { ...state, loading: false, error: action.message };
        default:
          return state;
      }
    default:
      return state;
  }
}
