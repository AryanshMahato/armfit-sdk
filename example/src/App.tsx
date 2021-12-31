import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import ArmfitSdkManager from 'react-native-armfit-sdk';

var sdkManager = NativeModules.ArmfitSdk;
const sdkManagerEmitter = new NativeEventEmitter(sdkManager);

export default function App() {
  const [result, setResult] = React.useState<any | undefined>([]);
  const [initialised, setInitialsed] = React.useState<boolean>(false);

  React.useEffect(() => {
    ArmfitSdkManager.startSdk().then(() => {
      setInitialsed(true);
    });
    sdkManagerEmitter.addListener(
      'ArmfitSdkModuleDiscoverPeripheral',
      handleDiscoverPeripheral
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    ArmfitSdkManager.scan({})
      .then((results) => {
        console.log(results);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [initialised]);

  const handleDiscoverPeripheral = (peripheral: any) => {
    // console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    } else if (peripheral.name === 'BP2 1415') {
      console.log('Got ArmFit', peripheral);
      setResult(peripheral);
      ArmfitSdkManager.stopScan();
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>Result: {JSON.stringify(result)}</Text> */}
      <Text>ID: {JSON.stringify(result.id)}</Text>
      <Text>RSSI: {JSON.stringify(result.rssi)}</Text>
      <Text>Result: {JSON.stringify(result.name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
