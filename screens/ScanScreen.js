import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Constants, Permissions, BarCodeScanner } from 'expo';
import { checkin } from '../actions/apicalls';

export default class ScanScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
    message: '',
    style: styles.alertGreen,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  apiCalls(data) {
    checkin.getWithExternalId(data)
    .then(response => {
      if (response) {
        if ('1' === response.checkin) {
          this.setState({ message: 'Déjà vu !!!', style: styles.alertYellow });
        } else if ('0' === response.checkin) {
          checkin.put(response.id, {checkin: '1'})
          .then(() => {
            this.setState({ message: 'Bienvenu !', style: styles.alertGreen });
          });
        } else {
          this.setState({ message: 'Non inscrit !!!', style: styles.alertRed });
        }
      }
    })
    .catch(err => {
      this.setState({ message: err });
    });
    setTimeout(() => this.setState({ scanned: false, message: '' }), 2000);
  }

  render() {
    const { hasCameraPermission, scanned, message, style } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code39]}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (<Text style={style}>{message}</Text>)}
      </View>
    );
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true, message: 'attend un peu...' });
    this.apiCalls(data);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  alertGreen: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    color: '#0f0',
    backgroundColor: '#888',
    padding: 20,
  },
  alertYellow: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    color: '#222',
    backgroundColor: '#f80',
    padding: 20,
  },
  alertRed: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    color: '#fff',
    backgroundColor: '#f00',
    padding: 20,
  },
});
