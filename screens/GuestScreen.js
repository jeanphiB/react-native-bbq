import React, { PureComponent } from 'react';
import { Button, View, Text, Image, StyleSheet } from 'react-native';
import { checkin } from '../actions/apicalls';

export default class Guest extends PureComponent {
  state = {
    checkin: "0",
    error: undefined,
  }

  apiCalls(guest, value, onUpdate) {
    checkin.put(guest, { checkin: value }).then(response => {
      if (response.error) {
        this.setState({ response });
      } else {
        onUpdate(guest, value);
        this.props.navigation.goBack();
      }
    });
  }

  render() {
    const { navigation } = this.props;
    const guest = navigation.getParam('guest', {});
    const onUpdate = navigation.getParam('onUpdate', undefined);
    return (
      <View style={styles.container}>
        <Text style={styles.nameOfGuest}>{guest.lastname} {guest.firstname}</Text>
        <View style={styles.buttonContainer}>
          {"0" === guest.checkin ? (
            <Button
              onPress={() => this.apiCalls(guest.id, "1", onUpdate)}
              title="Clique ici pour valider son arrivée"
              color="#0f0"
              accessibilityLabel="Appuyer sur ce bouton pour valider l'entrée d'un collaborateur"
            />
          ) : (
            <Button
              onPress={() => this.apiCalls(guest.id, "0", onUpdate)}
              title="Clique ici pour valider sa sortie"
              color="#f00"
              accessibilityLabel="Appuyer sur ce bouton pour valider la sortie d'un collaborateur"
            />
          )}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
  },
  nameOfGuest: {
    textAlign: 'center',
    fontSize: 20,
  },
  buttonContainer: {
    fontSize: 24,
    margin: 20,
    backgroundColor: '#333',
    padding: 20,
  },
});
