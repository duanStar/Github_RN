import LanguageDao from '../../expand/dao/LanguageDao';
import Types from '../types';

export function onLoadLanguage(flag) {
  return async dispatch => {
    try {
      const languages = await new LanguageDao(flag).fetch();
      dispatch({
        type: Types.LANGUAGE_LOAD_SUCCESS,
        languages,
        flag,
      });
    } catch (err) {
      console.log(err);
    }
  };
}
