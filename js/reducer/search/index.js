import Types from '../../action/types';

export default function onAction(
  state = {
    showText: '搜索',
    items: [],
    isLoading: false,
    projectModes: [],
    hideLoadingMore: true,
    showBottomButton: false,
  },
  action,
) {
  switch (action.type) {
    case Types.SEARCH_REFRESH_SUCCESS:
      return {
        ...state,
        items: action.items,
        projectModes: action.projectModes,
        pageIndex: action.pageIndex,
        isLoading: false,
        hideLoadingMore: false,
        showBottomButton: action.showBottomButton,
        inputKey: action.inputKey,
        showText: '搜索',
      };
    case Types.SEARCH_FAIL:
      return {
        ...state,
        isLoading: false,
        hideLoadingMore: true,
        showBottomButton: false,
        showText: '搜索',
        items: [],
        projectModes: [],
      };
    case Types.SEARCH_CANCEL:
      return {
        ...state,
        isLoading: false,
        hideLoadingMore: true,
        showBottomButton: false,
        showText: '搜索',
        projectModes: [],
        items: [],
      };
    case Types.SEARCH_REFRESH:
      return {
        ...state,
        isLoading: true,
        hideLoadingMore: true,
        showBottomButton: false,
        showText: '取消',
      };
    case Types.SEARCH_LOAD_MORE_SUCCESS:
      return {
        ...state,
        projectModes: action.projectModes,
        hideLoadingMore: false,
        pageIndex: action.pageIndex,
      };
    case Types.SEARCH_LOAD_MORE_FAIL:
      return {
        ...state,
        hideLoadingMore: true,
        pageIndex: action.pageIndex,
      };
    default:
      return state;
  }
}
