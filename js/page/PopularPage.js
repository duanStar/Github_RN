import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function PopularPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>PopularPage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
