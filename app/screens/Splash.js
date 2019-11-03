import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { PRIMARY } from '../config/styles.js';
import { SERVER_ADDR } from '../config/settings.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: StatusBar.currentHeight,
    backgroundColor: PRIMARY,
  },
  logo: {
    height: 125,
    marginTop: 100,
    marginBottom: 100,
    resizeMode: 'contain'
  },
});

class SplashScreen extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.log('logged in!');
        // // check if user logged in through facebook
        // console.log('auth provider', firebase.auth().currentUser.providerData[0].providerId);
        // // can use this in Facebook Graph API
        // console.log('facebook uid', firebase.auth().currentUser.providerData[0].uid);

        firebase.auth().currentUser.getIdToken()
          .then(token => {      
            return fetch(`${SERVER_ADDR}/users?firebaseId=${firebase.auth().currentUser.uid}`, {
              headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
              },
            });
          })
          .then(response => response.json())
          .then(responseJson => {
            this.props.logIn(responseJson._id);
            this.props.navigation.navigate('Home');
          });
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {/* don't worry, this is just a temporary logo. */}
        <Image
          style={styles.logo}
          source={require('../assets/logo-white.png')}
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logIn: id => dispatch({type: 'LOG_IN', payload: {
      userId: id
    }}),
  };
}

export default connect(null, mapDispatchToProps)(SplashScreen);