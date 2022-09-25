export default class NavigationUtil {
  static navigation = null;
  static resetToHomePage(params) {
    let {navigation} = params;
    navigation = navigation ? navigation : NavigationUtil.navigation;
    navigation.reset({
      index: 1,
      routes: [{name: 'Main'}],
    });
  }
  static toPage(navigation, key) {
    navigation = navigation ? navigation : NavigationUtil.navigation;
    navigation.navigate(key);
  }
  static goBack(navigation) {
    navigation = navigation ? navigation : NavigationUtil.navigation;
    navigation.goBack();
  }
}
