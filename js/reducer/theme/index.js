import Types from '../../action/types';
import ThemeFactory, {ThemeFlags} from '../../res/styles/ThemeFactory';
const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  showCustomThemeView: false,
};

export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      };
    case Types.SHOW_THEME_VIEW:
      return {
        ...state,
        showCustomThemeView: action.showCustomThemeView,
      };
    default:
      return state;
  }
}
