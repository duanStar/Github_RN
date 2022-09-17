import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function TrendingPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>TrendingPage</Text>
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
