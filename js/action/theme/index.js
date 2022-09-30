import Types from '../types';
import ThemeDao from '../../expand/dao/ThemeDao';

export function onThemeChange(theme) {
  return {
    type: Types.THEME_CHANGE,
    theme,
  };
}

export function onThemeInit() {
  return dispatch => {
    new ThemeDao().getTheme().then(theme => {
      dispatch(onThemeChange(theme));
    });
  };
}

export function onShowCustomThemeView(show) {
  return {
    type: Types.SHOW_THEME_VIEW,
    showCustomThemeView: show,
  };
}
