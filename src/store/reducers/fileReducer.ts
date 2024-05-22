import { IFileReducerState } from '@/types/file';
import { Actions } from '@/types/store';

const initialState: IFileReducerState = {
  files: {},
};

const reducer = (state: IFileReducerState = initialState, action: Actions): IFileReducerState => {
  if (action.status !== 'SUCCESS') return state;

  switch (action.type) {
    case 'FETCH_FILE':
      return {
        ...state,
        files: {
          ...state.files,
          [action.file.filePath]: action.file,
        },
      };
    default:
      return state;
  }
};

export default reducer;