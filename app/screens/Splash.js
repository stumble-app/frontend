import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  Platform
} from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';

import { PRIMARY } from '../config/styles.js';
import { SERVER_ADDR } from '../config/settings.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
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

  state = {
    latitude: undefined,
    longitude: undefined
  }

  componentDidMount() {
    this.firebaseListener = firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        console.log(firebase.auth().currentUser.email, 'logged in!');
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
            console.log('uid', responseJson._id);
            this.props.logIn(responseJson._id);
            this.props.setLatitude(this.state.latitude);
            this.props.setLongitude(this.state.longitude);
            this.props.navigation.navigate('Home');
          });
      } else {
        this.props.navigation.navigate('Auth');
      }
    });
  }

  componentWillUnmount() {
    this.firebaseListener && this.firebaseListener();
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
    logIn: (id) => {
      dispatch({type: 'LOG_IN', payload: {
        userId: id,
      }});
    },
    setLatitude: (latitude) => {
      dispatch({type: 'SET_LATITUDE', payload: {
        latitude: latitude,
      }});
    },
    setLongitude: (longitude) => {
      dispatch({type: 'SET_LONGITUDE', payload: {
        longitude: longitude,
      }});
    }
  };
}

export default connect(null, mapDispatchToProps)(SplashScreen);
