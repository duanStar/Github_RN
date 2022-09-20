import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function FavoriteButton({onFavorite, item}) {
  return (
    <TouchableOpacity onPress={() => onFavorite && onFavorite(item)}>
      <FontAwesome name={'star-o'} size={26} style={{color: 'red'}} />
    </TouchableOpacity>
  );
}
