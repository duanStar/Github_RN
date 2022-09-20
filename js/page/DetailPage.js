import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function DetailPage(props) {
  return (
    <View style={styles.container}>
      <Text>DetailPage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
