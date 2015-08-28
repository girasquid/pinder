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
  ListView,
  Component,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  TextInput
} = React;

var FIREBASE_URL_PREFIX = "https://pinder-development.firebaseio.com/";
var playersURL = new Firebase(FIREBASE_URL_PREFIX + "players");
var responsesURL = new Firebase(FIREBASE_URL_PREFIX + "responses");

var NavButton = React.createClass ({
  render: function() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={{justifyContent: 'center', alignItems: 'center'}}
        underlayColor="#FEFEFE">
        <React.Image
          source={this.props.srcImage}
          style={styles.paddles} />
      </TouchableHighlight>
    );
  }
})

var WaitingForMatch = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.name
    }
  },

  render: function() {
    return (
      <React.View style={styles.container}>
        <Header />
        <React.View style={styles.body}>
          <React.Text style={styles.nameField}>{this.state.name}</React.Text>
          <NavButton
            onPress={this.stopWaitingForMatch}
            srcImage={require('image!paddles-black')} />
          <React.Text style={styles.nameField}>vs.</React.Text>
          <React.Text style={styles.nameField}>Them</React.Text>
        </React.View>
      </React.View>
    );
  },

  stopWaitingForMatch: function() {
    var playersRef = new Firebase(FIREBASE_URL_PREFIX + "players/" + this.props.request_key);
    playersRef.set(null);
    this.props.nav.pop();
  }
});

var PinderWelcome = React.createClass({
  nextPage: function() {
    var key = this.state.request_key;
    this.state.request_key = "no push";
    this.props.nav.push({ id: 'waiting', name: this.state.playerName, request_key: key })
  },

  getInitialState: function() {
    return {
      players: playersURL,
      responses: responsesURL,
      request_key: "no push",
      playerName: defaultNames[Math.floor(Math.random()*defaultNames.length)],
      seen_alerts: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      rows: []
    }
  },

  onButtonPressedJustEmojiModeTheReckoning: function() {
    React.VibrationIOS.vibrate();
    this.state.request_key = this.state.players.push({playerName: this.state.playerName}).key();
    this.state.responses.on("child_added", this._handleRespondingPartner)
  },

  _handleRespondingPartner: function(snapshot) {
    if(snapshot.child("partner").val() == this.state.request_key) {
      React.AlertIOS.alert(
        "\uD83D\uDCA5 \uD83D\uDC65 \uD83D\uDCA5",
        snapshot.child("playerName").val(),
        [{text: '\uD83C\uDF8A'}]
      )
      console.log(snapshot.child("playerName").val() + " wants to play with us!")
    }
  },

  _playBall: function(snapshot) {
    console.log('Let\'s play ball with ' + snapshot.child("playerName").val());
    this.state.responses.push({playerName: this.state.playerName, partner: snapshot.key(), time: new Date().getTime() / 1000}).key();
    return;
  },

  updatePlayerName: function(event) {
    this.setState((state) => {
      return {
        playerName: event.text
      };
    });
  },

  componentDidMount: function() {
    this.state.players.on("child_added", this._updateList);
  },

  _updateList: function(snapshot) {
    this.state.rows.push(snapshot)
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.rows)
    })
  },

  renderPlayer: function(snapshot) {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          onPress={() => this._playBall(snapshot)}>
          <Text>Play!</Text>
        </TouchableHighlight>
        <Text>😡 {snapshot.child("playerName").val()} 😡</Text>
        <TouchableHighlight
          onPress={() => console.log('Declining to play with ' + snapshot.child("playerName").val())}>
          <Text>Get Lost!</Text>
        </TouchableHighlight>
      </View>
    );
  },

  render: function() {
    return (
      <React.View style={styles.container}>
        <React.View>
          <React.Text style={styles.header}>Pinder</React.Text>
          <React.TextInput
            style={styles.nameField}
            onBlur={(e) => this.updatePlayerName(e.nativeEvent)}
            defaultValue={this.state.playerName}
            autoFocus={true} />
          <NavButton
            onPress={this.onButtonPressedJustEmojiModeTheReckoning}
            srcImage={require('image!paddles-red')} />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderPlayer}
            style={styles.listView}
            scrollEnabled={false} />
        </React.View>
      </React.View>
    );
  }
})

var PinderMain = React.createClass({
  renderSceneMethod: function(route, nav) {
    switch (route.id) {
      case 'waiting':
        return <WaitingForMatch nav={nav} name={route.name} request_key={route.request_key} />;
      default:
        return <PinderWelcome nav={nav} />
    }
  },

  render: function() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{component: PinderWelcome}}
        configureScene={(route) => {
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        renderScene={this.renderSceneMethod} />
    );
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
    flex: 1,
    fontSize: 96,
    textAlign: "center",
    // height: 100,
    fontFamily: "Poetsen One",
    // textTransform: "capitalize",
    backgroundColor: "#FFA500",
    color: "#333333"
  },
  paddles: {
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
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  listView: {
    flex: 1,
    alignSelf: "center",
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 200,
    width: 400,
    backgroundColor: '#F5FCFF',
  },
  playerRow: {
    fontFamily: "Poetsen One",
    fontSize: 48,
    width: 400,
    textAlign: "center",
  },
});

AppRegistry.registerComponent('Pinder', () => PinderMain);


    // flex: 20,
    // fontSize: 96,
    // textAlign: "center",
    // height: 100,
    // fontFamily: "Poetsen One",
    // // textTransform: "capitalize",
    // backgroundColor: "#FFA500",
    // color: "#333333"
