import {onThemeChange} from './theme';
import {onRefreshPopularData, onLoadMorePopular} from './popular';

export default {
  onThemeChange,
  onLoadPopularData: onRefreshPopularData,
  onLoadMorePopular,
};
