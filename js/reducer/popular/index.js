import Types from '../../action/types';

export default function onAction(state = {hideLoadingMore: true}, action) {
  switch (action.type) {
    case Types.POPULAR_REFRESH_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          items: action.items,
          projectModes: action.projectModes,
          pageIndex: action.pageIndex,
          isLoading: false,
          hideMoreLoading: false,
        },
      };
    case Types.POPULAR_REFRESH_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          isLoading: false,
          hideMoreLoading: true,
        },
      };
    case Types.POPULAR_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          isLoading: true,
          hideMoreLoading: true,
        },
      };
    case Types.LOAD_POPULAR_MORE_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          projectModes: action.projectModes,
          hideMoreLoading: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.LOAD_POPULAR_MORE_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...(state[action.storeName] || {}),
          hideMoreLoading: true,
          pageIndex: action.pageIndex,
        },
      };
    default:
      return state;
  }
}
