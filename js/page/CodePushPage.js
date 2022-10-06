import React, {Component, useMemo, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CodePush from 'react-native-code-push';
import ViewUtil from '../util/ViewUtil';
import NavigationBar from '../common/NavigationBar';
import {useSelector} from 'react-redux';

function CodePushPage({navigation}) {
  const [restartAllowed, setRestartAllowed] = useState(true);
  const [progress, setProgress] = useState();
  const [syncMessage, setSyncMessage] = useState('');
  const theme = useSelector(state => state.theme.theme);
  const progressView = useMemo(() => {
    return progress ? (
      <Text style={styles.messages}>
        {progress.receivedBytes} of {progress.totalBytes} bytes received
      </Text>
    ) : null;
  }, [progress]);

  const codePushStatusDidChange = syncStatus => {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        setSyncMessage('Checking for update.');
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        setSyncMessage('Downloading package.');
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        setSyncMessage('Awaiting user action.');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        setSyncMessage('Installing update.');
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        setSyncMessage('App up to date.');
        setProgress(false);
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        setSyncMessage('Update cancelled by user.');
        setProgress(false);
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        setSyncMessage('Update installed and will be applied on restart.');
        setProgress(false);
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        setSyncMessage('An unknown error occurred.');
        setProgress(false);
        break;
    }
  };

  const codePushDownloadDidProgress = progress => {
    setProgress(progress);
  };

  const toggleAllowRestart = () => {
    restartAllowed ? CodePush.disallowRestart() : CodePush.allowRestart();

    setRestartAllowed(!restartAllowed);
  };

  const getUpdateMetadata = () => {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then(
      metadata => {
        setSyncMessage(
          metadata ? JSON.stringify(metadata) : 'Running binary version',
        );
        setProgress(false);
      },
      (error: any) => {
        setSyncMessage('Error: ' + error);
        setProgress(false);
      },
    );
  };

  /** Update is downloaded silently, and applied on restart (recommended) */
  const sync = () => {
    CodePush.sync(
      {},
      codePushStatusDidChange,
      codePushDownloadDidProgress,
    ).catch(err => {
      console.log(err);
    });
  };

  /** Update pops a confirmation dialog, and then immediately reboots the app */
  const syncImmediate = () => {
    CodePush.sync(
      {installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true},
      codePushStatusDidChange,
      codePushDownloadDidProgress,
    );
  };

  return (
    <View style={styles.container}>
      <NavigationBar
        title={'CodePush'}
        statusBar={{
          backgroundColor: theme.themeColor,
          barStyle: 'light-content',
        }}
        leftButton={ViewUtil.getLeftBackButton(() => {
          navigation.goBack();
        })}
        style={{
          backgroundColor: theme.themeColor,
        }}
      />
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={styles.welcome}>Welcome to CodePush!</Text>
        <TouchableOpacity onPress={sync}>
          <Text style={styles.syncButton}>Press for background sync</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={syncImmediate}>
          <Text style={styles.syncButton}>Press for dialog-driven sync</Text>
        </TouchableOpacity>
        {progressView}
        <TouchableOpacity onPress={toggleAllowRestart}>
          <Text style={styles.restartToggleButton}>
            Restart {restartAllowed ? 'allowed' : 'forbidden'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={getUpdateMetadata}>
          <Text style={styles.syncButton}>Press for Update Metadata</Text>
        </TouchableOpacity>
        <Text style={styles.messages}>{syncMessage || ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  image: {
    margin: 30,
    width: Dimensions.get('window').width - 100,
    height: (365 * (Dimensions.get('window').width - 100)) / 651,
  },
  messages: {
    marginTop: 30,
    textAlign: 'center',
  },
  restartToggleButton: {
    color: 'blue',
    fontSize: 17,
  },
  syncButton: {
    color: 'green',
    fontSize: 17,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
});

let codePushOptions = {checkFrequency: CodePush.CheckFrequency.MANUAL};

const App = CodePush(codePushOptions)(CodePushPage);

export default App;
