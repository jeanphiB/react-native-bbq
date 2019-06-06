import React, { Component } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements'
import SearchInput, { createFilter } from 'react-native-search-filter';
import { checkin } from '../actions/apicalls';

const KEYS_TO_FILTERS = ['lastname', 'firstname'];

export default class SectionListBasics extends React.Component {
  static navigationOptions = {
    title: 'Guests',
  };

  state = {
    error: null,
    guests: [],
    loading: true,
    refreshing: false,
    searchTerm: '',
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  componentDidMount() {
    this.apiCalls();
  }

  apiCalls() {
    this.setState({ loading: true });
    checkin.get().then(response => {
      this.setState({ ...response, loading: false});
    });
  }

  onUpdate(updatedGuestId, checkin) {
    const guests = this.state.guests;
    const id = guests.findIndex(guest => guest.id === updatedGuestId);
    guests[id] = {...guests[id], checkin};
    this.setState({ guests });
  }

  render() {
    const { error, guests, loading } = this.state;
    const { navigation } = this.props;

    if (loading) {
      return <ActivityIndicator />
    } else if (error) {
      return <Text style={styles.guestItem}>Sorry, an error occurs: {error}</Text>
    } else if (guests){
      const filteredGuests = guests.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
      return (
        <View style={styles.container}>
          <SearchInput
            onChangeText={(term) => { this.searchUpdated(term) }}
            style={styles.searchInput}
            placeholder="Type a name to search"
          />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.apiCalls.bind(this)}
              />}
          >
            {filteredGuests.map(guest => {
              return (
                <TouchableOpacity
                  key={guest.id}
                  style={styles.guestItem}
                  onPress={() => navigation.navigate('Guest', {guest, onUpdate: this.onUpdate.bind(this)})}
                >
                  <View>
                    <Text style={"0" === guest.checkin ? styles.guestNameOut : styles.guestNameIn}>
                      {guest.lastname} {guest.firstname}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  guestItem:{
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 8,
  },
  guestNameIn:{
    color: '#0f0',
  },
  guestNameOut:{
    color: '#f00',
  },
  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  }
});
