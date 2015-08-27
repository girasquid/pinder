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
  Navigator,
  Component,
  TouchableOpacity,
  TouchableHighlight,
  Image
} = React;

var Button = require('react-native-button');
var firebaseURL = new Firebase("https://pinder-development.firebaseio.com/");
var Camera = require('react-native-camera');

var PinderCamera = React.createClass({
  getInitialState: function() {
    return {
      value: '',
      cameraType: Camera.constants.Type.front
    };
  },
  render: function() {
    return (
      <React.View style={styles.container}>
        <React.View>
          <Camera
            ref="cam"
            aspect="Fill"
            type="Back"
            orientation="Portrait"
            onScanned={this._onScannedResult}
            style={styles.barcode}
          />
        </React.View>
        <React.TouchableHighlight onPress={this._takePicture}>
          <React.Text>Take Picture</React.Text>
        </React.TouchableHighlight>
      </React.View>
    );
  },
  _takePicture() {
    this.refs.cam.capture(function(err, data) {
      this.props.navigator.pop();
      console.log(err, data);
    });
  }
});

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onLaunchPressed() {
    this.props.navigator.push({
      title: "Pinder",
      component: PinderCamera,
      passProps: {}
    });
  }
  render() {
    return (
      <React.View style={styles.container}>
        <React.Text style={styles.header}>Pinder</React.Text>
        <React.View style={styles.center}>
          <Button
            style={{borderWidth:0, color: 'orange'}}
            onPress={this.onLaunchPressed.bind(this)}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <React.Image
              source={require('image!paddles-red')}
              style={styles.introImage}
            />
          </Button>
        </React.View>
      </React.View>
    );
  }
}

var PinderMain = React.createClass({
  render: function() {
    return (
      <React.Navigator
        style={styles.navigator}
        initialRoute={{
          title: 'Pinder!',
          component: Welcome,
        }}
        renderScene={(route, navigator) => {
          if (route.component) {
            return React.createElement(route.component, { navigator });
          }
        }}
      />
    )
  }
});


var styles = StyleSheet.create({
  navigator: {
    flex: 1
  },
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
    width: 250,
    height: 156,
    flex: 1
  },
  barcode:{
    justifyContent: 'center',
    alignSelf: 'center',
    height: 200,
    width: 200,
  }
});

AppRegistry.registerComponent('Pinder', () => PinderMain);
