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
var FIREBASE_URL_PREFIX = "https://pinder-development.firebaseio.com/";
var playersURL = new Firebase(FIREBASE_URL_PREFIX + "players");
var responsesURL = new Firebase(FIREBASE_URL_PREFIX + "responses");
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
      players: playersURL,
      responses: responsesURL,
      request_key: "no push",
      launch_time: new Date().getTime() / 1000,
    }
    this.state.players.on("child_added", this._handleNewPlayer.bind(this));
  }
  onLaunchPressed() {
    this.props.navigator.push({
      title: "Pinder",
      component: PinderCamera,
      passProps: {}
    });
  }
  onButtonPressedJustEmojiModeTheReckoning() {
    if(this.state.request_key != "no push") {
      console.log("You have a request! No push!");
      return;
    }
    items = ['\uD83D\uDCA9', "\uD83D\uDD05", "\uD83D\uDCC3", "\uD83D\uDC27", "\uD83C\uDF61", "\uD83C\uDF62", "\uD83C\uDF63", "\u2614\uFE0F", "\u203C\uFE0F", "\u2049\uFE0F"];
    var item = items[Math.floor(Math.random()*items.length)];
    this.state.request_key = this.state.players.push({player: item, time: new Date().getTime() / 1000}).key();
  }
  _handleNewPlayer(snapshot) {
    if(snapshot.val() == "no push") {
      console.log("No push!");
      return;
    }
    if(snapshot.key() == this.state.request_key) {
      console.log("It's ours! No response!");
      return;
    }
    if(snapshot.child("time").val() < this.state.launch_time) {
      console.log("Too old! Ignoring!");
      return;
    }
    React.AlertIOS.alert(
      "Found a match!",
      snapshot.child("player").val() + ' wants to play ball!',
      [
        {text: '\u2764\uFE0F', onPress: () => this._playBall(snapshot)},
        {text: '\uD83D\uDC94', onPress: () => this._nextPlease(snapshot)}
      ]
    )
  }
  _playBall(snapshot) {
    console.log('Let\'s play ball with ' + snapshot.key());
    this.state.responses.push({player: this.state.request_key, partner: snapshot.key(), time: new Date().getTime() / 1000}).key();
    return;
  }
  _nextPlease(snapshot) {
    console.log(snapshot.child("player").val() + " smells like poop.");
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
