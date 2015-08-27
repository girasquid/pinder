/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @flow
 */
'use strict';

import React from 'react-native';
import Firebase from 'firebase';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  TouchableOpacity,
  TouchableHighlight,
} = React;

var Button = require('react-native-button');
var firebaseURL = new Firebase("https://pinder-development.firebaseio.com/");

var Pinder = React.createClass({
  getInitialState: function() {
    firebaseURL.on("value", this._handleNewPlayer);
    return {
      firebase: firebaseURL
    }
  },
  render: function() {
    return (
      <React.View style={styles.none}>
        <React.Text style={styles.header}>Pinder</React.Text>

        <React.View style={styles.center}>
          <Button
            style={{borderWidth:0, color: 'orange'}}
            onPress={this._handlePress}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <React.Image
              source={require('image!paddle')}
              style={styles.introImage}
            />
          </Button>
        </React.View>
      </React.View>

    );
  },

  _handlePress(event) {
    // console.log('David Bowie wants to play ball.');
    this.state.firebase.push({player: "new player"});
  },

  _handleNewPlayer(snapshot) {
    alert("DAVID BOWIE wants to play ball!");
  },
})

var styles = StyleSheet.create({
  header: {
    fontSize: 96,
    textAlign: "center",
    fontFamily: "Poetsen One",
    // textTransform: "capitalize",
    backgroundColor: "#FFA500",
    color: "#333333"
  },
  button: {
    fontSize: 48,
    textAlign: "center",
    fontFamily: "Lucida Grande",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  introImage: {
    width: 300,
    height: 300,
    flex: 1
  }
});

AppRegistry.registerComponent('Pinder', () => Pinder);
