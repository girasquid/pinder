/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @flow
 */
'use strict';

import React from 'react-native';
import Firebase from 'firebase';

var defaultNames = ["Agaro", "Arnan", "Auxlan", "Avamir", "Baelnar", "Balfam", "Bariken", "Borkûl", "Darkûl", "Dolmen", "Dyrnar", "Erag", "Ezegan", "Ferrek", "Garmûl", "Glint", "Ghorvas", "Grimmalk", "Haeltar", "Halagmar", "Halzar", "Hlant", "Korlag", "Krag", "Krim", "Kurman", "Lurtrum", "Malagar", "Mardam", "Maulnar", "Melgar", "Morak", "Orobok", "Rogath", "Roken", "Rozag", "Sabakzar", "Sharak", "Smethykk", "Swargar", "Thorbalt", "Thorin", "Tredigar", "Vabûl", "Vistrum", "Wolvar", "Beyla", "Fenryl", "Grenenzel", "Krystolari", "Lokara", "Lurka", "Marnia", "Praxana", "Rokel", "Roksana", "Thurlfara", "Vauldra", "Veklani", "Vronwe", "Zebel", "Ambershard", "Barrelhelm", "Copperhearth", "Deepmiddens", "Drakantal", "Evermead", "Garkalan", "Grimtor", "Hackshield", "Irongull", "Markolak", "Ramcrown", "Rockharvest", "Silvertarn", "Skandalor", "Zarkanan"]

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Component,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  TextInput
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

class PinderWelcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: playersURL,
      responses: responsesURL,
      request_key: "no push",
      launch_time: new Date().getTime() / 1000,
      playerName: defaultNames[Math.floor(Math.random()*defaultNames.length)],
      seen_alerts: []
    }
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
    this.state.request_key = this.state.players.push({playerName: this.state.playerName, time: new Date().getTime() / 1000}).key();
    this.state.players.on("child_added", this._handleNewPlayer.bind(this));
  }
  _handleNewPlayer(snapshot) {
    if(snapshot.val() == "no push") {
      console.log("No push!");
      return;
    }

    if(snapshot.key() == this.state.request_key) {
      console.log("It's ours! No response!")
      return
    }

    if(snapshot.child("time").val() < this.state.launch_time) {
      console.log("Too old! Ignoring!");
      return;
    }

    if(this.state.seen_alerts.indexOf(snapshot.key()) != -1) {
      console.log("Already seen this one!");
      return;
    }

    this.state.seen_alerts.push(snapshot.key());
    React.AlertIOS.alert(
      "\uD83D\uDCA5 \uD83D\uDC65 \uD83D\uDCA5",
      snapshot.child("playerName").val(),
      [
        {text: '\u2764\uFE0F', onPress: () => this._playBall(snapshot)},
        {text: '\uD83D\uDC94', onPress: () => console.log('Declining to play with ' + snapshot.child("playerName").val())}
      ]
    )
  }
  _playBall(snapshot) {
    console.log("Let's play ball with " + snapshot.child("playerName").val());
    this.state.responses.push({player: this.state.request_key, partner: snapshot.key(), time: new Date().getTime() / 1000}).key();
    return;
  }
  updatePlayerName(event) {
    console.log(event.text)
    this.setState((state) => {
      return {
        playerName: event.text
      };
    });
  }

  render() {
    return (
      <React.View style={styles.container}>
        <React.Text style={styles.header}>Pinder</React.Text>
        <React.View style={styles.body}>
          <React.TextInput
            style={styles.nameField}
            onBlur={(e) => this.updatePlayerName(e.nativeEvent)}
            defaultValue={this.state.playerName}
            autoFocus={true} />
          <Button
            style={{borderWidth:0, color: 'orange'}}
            onPress={this.onButtonPressedJustEmojiModeTheReckoning.bind(this)}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <React.Image
              source={require('image!paddles-red')}
              style={styles.introImage} />
          </Button>
          </React.View>
      </React.View>
    );
  }
}

var PinderMain = React.createClass({
  render: function() {
    return (
      <PinderWelcome />
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
  },
  nameField: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: "Poetsen One",
    fontSize: 30,
    width: 400,
    height: 60
  }
});

AppRegistry.registerComponent('Pinder', () => PinderMain);
