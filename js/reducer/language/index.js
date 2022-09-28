import Types from '../../action/types';
import {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

export default function onAction(
  state = {
    languages: [],
    keys: [],
  },
  action,
) {
  switch (action.type) {
    case Types.LANGUAGE_LOAD_SUCCESS:
      if (FLAG_LANGUAGE.flag_key === action.flag) {
        return {
          ...state,
          keys: action.languages,
        };
      } else {
        return {
          ...state,
          languages: action.languages,
        };
      }
    default:
      return state;
  }
}
