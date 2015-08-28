/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @flow
 */
'use strict';

import React from 'react-native';
import Firebase from 'firebase';
import AudioPlayer from 'react-native-audioplayer';

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

class NavButton extends Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={{justifyContent: 'center', alignItems: 'center'}}
        underlayColor="#FEFEFE">
        <React.Image
          source={this.props.srcImage}
          style={styles.paddles} />
      </TouchableHighlight>
    )
  }
}

var ChallengeAccepted = React.createClass({

  componentDidMount: function() {
    this.removeFromFirebase(this.props.request_key)
  },

  componentWillUpdate: function() {
    this.removeFromFirebase(this.props.request_key)
  },

  removeFromFirebase: function(request_key) {
    console.log("KEY: " + request_key)
    var playersRef = new Firebase(FIREBASE_URL_PREFIX + "players/" + request_key);
    playersRef.set(null);
  },

  render: function() {
    AudioPlayer.play("PukingOrFighting.mp3");
    React.VibrationIOS.vibrate();
    return (
      <React.View style={styles.container}>
        <React.View>
          <React.Text style={styles.header}>Pinder</React.Text>
          <React.View style={styles.body}>
            <React.Text style={styles.nameField}>{this.props.name}</React.Text>
            <NavButton
              onPress={this.stopChallengeAccepted}
              srcImage={require('image!paddles-black')} />
            <React.Text style={styles.nameField}>vs.</React.Text>
            <React.Text style={styles.nameField}>{this.props.opponent}</React.Text>
          </React.View>
        </React.View>
      </React.View>
    );
  },
  stopChallengeAccepted: function() {
    this.props.nav.pop();
  }
});

var PinderWelcome = React.createClass({

  getInitialState: function() {
    return {
      players: playersURL,
      responses: responsesURL,
      request_key: "no push",
      playerName: defaultNames[Math.floor(Math.random()*defaultNames.length)],
      seen_alerts: [],
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true,
      }),
      rows: [],
      loaded: false
    }
  },

  nextPage: function(playerData) {
    var key = this.state.request_key;
    this.props.nav.push({ id: 'challenge_accepted', name: this.state.playerName, opponent: playerData.playerName, request_key: key })
    this.setState({request_key: 'no push'})
  },

  onButtonPressedJustEmojiModeTheReckoning: function() {
    if(this.state.request_key != "no push") {
      console.log("You have a request! No push!");
      return;
    }
    this.state.request_key = this.state.players.push({playerName: this.state.playerName}).key();
    this.state.responses.on("child_added", this._handleRespondingPartner)
  },

  _handleRespondingPartner: function(snapshot) {
    if(snapshot.child("partner").val() == this.state.request_key) {
      console.log(snapshot.child("playerName").val() + " wants to play with us!")
      this.nextPage({playerName: snapshot.child("playerName").val(), resquestKey: snapshot.key()})
    }
  },

  _playBall: function(rowData) {
    console.log('Let\'s play ball with ' + rowData.playerName);
    this.state.responses.push({playerName: this.state.playerName, partner: rowData.requestKey, time: new Date().getTime() / 1000}).key();
    this.nextPage(rowData)
  },

  updatePlayerName: function(event) {
    this.setState({playerName: event.text})
  },

  componentDidMount: function() {
    this.state.players.on("child_added", this._addToList);
    this.state.players.on("child_removed", this._removeFromList);

    setTimeout(() => {
      this.setState({loaded: true})
      this.render()
    }, 1000) ;
  },

  _addToList: function(snapshot) {
    if(snapshot.key() == this.state.request_key) {
      console.log("Ignoring our own play request")
      return
    }

    var newRows = this.state.rows
    newRows.unshift({
      playerName: snapshot.child("playerName").val(),
      requestKey: snapshot.key()
    })

    this.setState({rows: newRows})
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newRows),
      loaded: true
    })
  },

  _removeFromList: function(rowID) {
    this.state.rows.splice(rowID, 1)
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.rows),
      loaded: true
    })
  },

  renderPlayer: function(rowData: string, rowID: number) {
    return (
      <View style={styles.playerRowContainerView}>
        <TouchableHighlight
          onPress={() => this._playBall(rowData)}>
          <Text style={styles.leftPlayButton}>👍</Text>
        </TouchableHighlight>
        <View style={styles.playerRowContainer}>
          <Text suppressHighlighting={false} style={styles.playerRow}>{rowData.playerName}</Text>
        </View>
        <TouchableHighlight
          onPress={() => this._removeFromList(rowID)}>
          <Text style={styles.rightPlayButton}>👎</Text>
        </TouchableHighlight>
      </View>
    );
  },

  renderLoadingView: function() {
    return(
      <React.View style={styles.container}>
        <React.View>
          <React.Text style={styles.header}>Pinder</React.Text>
          <React.Text style={styles.nameField}>Loading...</React.Text>
        </React.View>
      </React.View>
    )
  },

  render: function() {

    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    if(this.state.dataSource.getRowCount() > 0) {
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
              automaticallyAdjustContentInsets={false}
              dataSource={this.state.dataSource}
              renderRow={this.renderPlayer}
              style={styles.listView}
              scrollEnabled={false} />
          </React.View>
        </React.View>
      );
    } else {
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
          </React.View>
        </React.View>
      );
    }
  }
})

var PinderMain = React.createClass({
  renderSceneMethod: function(route, nav) {
    switch (route.id) {
      case 'challenge_accepted':
        return <ChallengeAccepted nav={nav} name={route.name} request_key={route.request_key} opponent={route.opponent} />;
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
    alignSelf: "stretch",
    paddingTop: 5,
    paddingBottom: 40,
  },
  playerRow: {
    flex: 1,
    fontFamily: "Poetsen One",
    fontSize: 32,
    flexWrap: "wrap",
    textAlign: "center",
    backgroundColor: "white",
    paddingBottom: 20,
    paddingTop: 20
  },
  playerRowContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: 'stretch',
  },
  playButton: {
    flex: 1,
  },
  playerRowContainerView: {
    flex: 1,
    flexDirection: "row",
    alignSelf: 'stretch'
  },
  leftPlayButton: {
    flex: 1,
    fontSize: 48,
    alignItems: 'flex-start'
  },
  rightPlayButton: {
    flex: 1,
    fontSize: 48,
    alignItems: 'flex-end'
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
