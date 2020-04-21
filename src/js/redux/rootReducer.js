const initialState = {
  currentMagnetLink: '',
  seeds: [],
  downloads: [],
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'DOWNLOAD_MAGNET':
      return {
        ...state,
        currentMagnetLink: action.payload,
      };
    default:
      return state;
  }
}
