const DEFAULT_MOMRY = 256000000;
const initialState = {
  currentMagnetLink: '',
  torrents: [],
  dedicatedMemory: +localStorage.getItem('memory') > 0 ? localStorage.getItem('memory') : DEFAULT_MOMRY,
  freeMemory: 0,
  downUpLoadSortFlag: true,
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'DOWNLOAD_MAGNET':
      return {
        ...state,
        currentMagnetLink: action.payload,
      };
    case 'UPDATE_TORRENT':
      return {
        ...state,
        torrents: action.payload,
      };
    case 'UPDATE_MEMORY':
      return {
        ...state,
        dedicatedMemory: action.payload,
      };
    case 'CALCULATE_FREE_MEMORY':
      return {
        ...state,
        freeMemory: state.dedicatedMemory - action.payload > 0 ? state.dedicatedMemory - action.payload : 0,
      };
    case 'CHANGE_FLAG':
      return {
        ...state,
        downUpLoadSortFlag: action.payload,
      };
    default:
      return state;
  }
}
