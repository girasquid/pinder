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
  Component
} = React;

class Pinder extends Component
{
  constructor(props: Object) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Pinder</Text>

        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  header: {
    fontSize: 96,
    textAlign: "center",
    margin: 10,
    fontFamily: "Poetsen One",
    // textTransform: "capitalize",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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
  }
});

AppRegistry.registerComponent('Pinder', () => Pinder);
