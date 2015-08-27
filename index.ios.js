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
        <React.TouchableHighlight>
          <React.Text style={styles.button}>play ball!</React.Text>
        </React.TouchableHighlight>
      </React.View>
    );
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
