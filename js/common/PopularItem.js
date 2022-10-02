import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import BaseItem from './BaseItem';

export default class PopularItem extends BaseItem {
  render() {
    const {onSelect, projectModel} = this.props;
    const {item} = projectModel;
    if (!item || !item.owner) {
      return null;
    }
    const width = Dimensions.get('window').width;
    return (
      <TouchableOpacity onPress={e => onSelect && onSelect(e)}>
        <View style={styles.cellContainer}>
          <Text style={styles.title}>{item.full_name}</Text>
          <RenderHtml
            contentWidth={width}
            source={{
              html: item.description || '<span></span>',
            }}
          />
          <View style={styles.row}>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={{marginRight: 3}}>Author: </Text>
              <Image
                style={{height: 22, width: 22}}
                source={{uri: item.owner.avatar_url}}
              />
            </View>
            <View
              style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text>Stars: </Text>
              <Text>{item.stargazers_count}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: '#ddd',
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: 'grey',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: '#757575',
  },
});
