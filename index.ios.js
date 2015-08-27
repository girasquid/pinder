/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @flow
 */
'use strict';

import React from 'react-native';

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

class Pinder extends Component
{
  constructor(props: Object) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.View style={styles.container}>
        <React.Text style={styles.header}>Pinder</React.Text>

        <Button
          style={{borderWidth:1, color: 'orange'}}
          onPress={this._handlePress}>
          <React.Image
            source={require('image!paddle')}
            style={{justifyContent: 'center', alignItems: 'center', width:200, height:200}}
          />
        </Button>
      </React.View>
    );
  }

  _handlePress(event) {
    console.log('Dude wants to play ball.');
  }

}

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
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#F5FCFF'
  // },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('Pinder', () => Pinder);
