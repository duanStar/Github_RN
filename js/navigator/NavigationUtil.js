export default class NavigationUtil {
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.reset({
      index: 1,
      routes: [{name: 'Main'}],
    });
  }
}
