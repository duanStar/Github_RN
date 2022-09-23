import Types from '../../action/types';

export default function onAction(state = {}, action) {
  switch (action.type) {
    case Types.FAVORITE_LOAD_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          projectModes: action.projectModes,
          isLoading: false,
        },
      };
    case Types.FAVORITE_LOAD_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          isLoading: false,
        },
      };
    case Types.FAVORITE_LOAD_DATA:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          isLoading: true,
        },
      };
    default:
      return state;
  }
}
