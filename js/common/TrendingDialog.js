import {forwardRef, useImperativeHandle, useState} from 'react';
import { Modal, TouchableOpacity, StyleSheet, View, Text, Platform } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TimeSpan from '../mo/TimeSpan';

const TIME_SPANS = [
  new TimeSpan('今 天', 'daily'),
  new TimeSpan('本 周', 'weekly'),
  new TimeSpan('本 月', 'monthly'),
];

const TrendingDialog = forwardRef(function ({onClose, onSelect}, ref) {
  const [visible, setVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
    },
  }));
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose && onClose()}>
      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={styles.container}>
        <MaterialIcons name={'arrow-drop-up'} size={36} style={styles.arrow} />
        <View style={styles.content}>
          {TIME_SPANS.map((time, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSelect && onSelect(time);
                setVisible(false);
              }}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>{time.showText}</Text>
              </View>
              {index !== TIME_SPANS.length - 1 ? (
                <View style={styles.line} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
  },
  arrow: {
    marginTop: 40,
    color: '#fff',
    padding: 0,
    margin: -15,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 3,
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    padding: 8,
    paddingLeft: 26,
    paddingRight: 26,
  },
  line: {
    height: 1,
    backgroundColor: 'darkgrey',
  },
});

export default TrendingDialog;
