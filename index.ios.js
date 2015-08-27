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
            type="Front"
            orientation="Portrait"
            onScanned={this._onScannedResult}
            style={styles.body}
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
    this.state = {
      firebase: firebaseURL
    }
    this.state.firebase.on("child_added", this._handleNewPlayer);
  }
  onLaunchPressed() {
    this.props.navigator.push({
      title: "Pinder",
      component: PinderCamera,
      passProps: {}
    });
  }
  onButtonPressedJustEmojiModeTheReckoning() {
    items = ['\uD83D\uDCA9', "\uD83D\uDD05", "\uD83D\uDCC3", "\uD83D\uDC27", "\uD83C\uDF61", "\uD83C\uDF62", "\uD83C\uDF63", "\u2614\uFE0F", "\u203C\uFE0F", "\u2049\uFE0F"];
    var item = items[Math.floor(Math.random()*items.length)];
    this.state.firebase.push({player: item});
  }
  _handleNewPlayer(snapshot) {
    if(snapshot.val() == null) {
      return;
    }
    alert(snapshot.child("player").val());
    // TODO pop up an alert where you decide to do it or not

  }
  render() {
    return (
      <React.View style={styles.container}>
        <React.Text style={styles.header}>Pinder</React.Text>
        <React.View style={styles.body}>
          <Button
            style={{borderWidth:0, color: 'orange'}}
            // onPress={this.onLaunchPressed.bind(this)}
            onPress={this.onButtonPressedJustEmojiModeTheReckoning.bind(this)}
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
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    flex: 20,
    fontSize: 96,
    textAlign: "center",
    height: 100,
    fontFamily: "Poetsen One",
    // textTransform: "capitalize",
    backgroundColor: "#FFA500",
    color: "#333333"
  },
  body: {
    flex: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100
  },
  introImage: {
    flex: 1,
    width: 250,
    height: 156
  },
  barcode:{
    justifyContent: 'center',
    alignSelf: 'center',
    height: 200,
    width: 200,
  }
});

AppRegistry.registerComponent('Pinder', () => PinderMain);
