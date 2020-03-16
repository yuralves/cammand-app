import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import Constants from 'expo-constants';

import { MonoText } from '../components/StyledText';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default class BarcodeScannerExample extends React.Component {
  constructor(props){
    super(props);
    this.state={
      card_id: 'Número da Comanda',
      full_name: 'Nome do Cliente',
      phone_number: 'Telefone do Cliente',
      balance: 'Saldo em Reais',
      hasCameraPermission: null,
    }
  }

  componentDidMount(){
    this.getPermissionsAsync();
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  clearData = () => {
    this.state.card_id = 'Número da Comanda';
    this.state.full_name = 'Nome do Cliente';
    this.state.phone_number = 'Telefone do Cliente';
    this.state.balance = 'Saldo em Reais';
    this.state.scanned = false;
    this.setState({});
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });

    let collection = {};
    collection.qrCode = data;
    let url = 'http://ec2-54-207-107-89.sa-east-1.compute.amazonaws.com:3000/postgresql/getQRbalance';

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(collection),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => 
      this.setState({
        card_id: response.data.id,
        full_name: response.data.full_name,
        phone_number: response.data.phone_number,
        balance: response.data.balance,
        scanned: true,
      }));
  };

  render() {
    const { hasCameraPermission, scanned } = this.state;
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }
    if (hasCameraPermission === null) {
      return <Text>Permitir acesso à câmera</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>Sem acesso à câmera</Text>;
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.textInput}
            placeholder="Número da Comanda"
            editable={false}
            value={this.state.card_id}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Usuário"
            editable={false}
            value={this.state.full_name}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Telefone"
            editable={false}
            value={this.state.phone_number}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Saldo"
            editable={false}
            value={this.state.balance}
          />
          <Button 
            title={'Limpar'} 
            onPress={() => this.clearData()}
          />
        </View>
        <View style={styles.camera}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <Button title={'Escanear QR Code'} onPress={() => this.setState({ scanned: false })} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'white', 
    flex: 0.3,
    justifyContent: 'center',
  },
  camera: {
    flex: 0.7,
  },
  textInput: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  }
})

BarcodeScannerExample.navigationOptions = {
  title: 'Verificar saldo',
};
