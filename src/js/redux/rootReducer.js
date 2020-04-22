const initialState = {
  currentMagnetLink: '',
  torrents: [],
  dedicatedMemory: +localStorage.getItem('memory'),
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
        freeMemory: state.dedicatedMemory - action.payload,
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