const initialState = {
  currentMagnetLink: '',
  seeds: [],
  torrents: [],
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
    default:
      return state;
  }
}
