import Types from '../../action/types';
const defaultState = {
  theme: '#007AFF',
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        theme: action.theme,
      };
    default:
      return state;
  }
}
