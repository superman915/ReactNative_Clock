/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */


// 0 : circle, 1 : cross


import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity, Image, FlatList,
  Dimensions
} from 'react-native';

import crossImage from './images/cross.png';
import circleImage from './images/circle.png';

import Svg, {
  Circle,
  G,
  Line,
} from 'react-native-svg';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      counter_o: 270,
      counter_x: 270,

      curPlayer: 0,
      startTime: Date.now(),
      log: [[], []],

      array: [
        { id: "0", value: null, is_clicked: false },
        { id: "1", value: null, is_clicked: false },
        { id: "2", value: null, is_clicked: false },
        { id: "3", value: null, is_clicked: false },
        { id: "4", value: null, is_clicked: false },
        { id: '5', value: null, is_clicked: false },
        { id: '6', value: null, is_clicked: false },
        { id: '7', value: null, is_clicked: false },
        { id: '8', value: null, is_clicked: false },
      ],
      is_circle: true,
      is_end: false,
      showWinner: -1  //-1:initial, 0: player O, 1: player X, 2: no one
    };


  }

  componentDidMount() {
    var timer = setInterval(this.tick, 100);
    this.setState({ timer });
  }


  tick = () => {
    if (!this.state.is_end)
      if (this.state.is_circle) {

        this.setState({ counter_o: this.state.counter_o + 0.6 });
      }

      else
        this.setState({ counter_x: this.state.counter_x + 0.6 });
  }



  click_restartBtn() {
    var temp_array = [
      { id: "0", value: null, is_clicked: false },
      { id: "1", value: null, is_clicked: false },
      { id: "2", value: null, is_clicked: false },
      { id: "3", value: null, is_clicked: false },
      { id: "4", value: null, is_clicked: false },
      { id: '5', value: null, is_clicked: false },
      { id: '6', value: null, is_clicked: false },
      { id: '7', value: null, is_clicked: false },
      { id: '8', value: null, is_clicked: false },
    ]
    this.setState({
      is_end: false,
      showWinner: -1,
      curPlayer: 0,
      array: temp_array,
      log: [[], []],
      startTime: Date.now()
    });
  }

  show_clock(player) {
    var { curPlayer, startTime } = this.state;
    var playerLog = this.state.log[player];
    var time = 0;
    playerLog.forEach(log => time += log);
    if (player == curPlayer)
      time += Date.now() - startTime;
    time = time / 100 * 36 / 60;
    time += 270;

    return (
      <Svg
        width="100"
        height="100"
        fill="white"
        stroke="black"
        strokeWidth="1"
        color="green"
        strokeLinecap="round"
        viewBox="-20 -20 40 40">
        <G>
          <Circle cx="0" cy="0" r="19" />

          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(0)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(30)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(60)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(90)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(120)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(150)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(180)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(210)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(240)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(270)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(300)" />
          <Line x1="15" y1="0" x2="16" y2="0" strokeWidth="1" transform="rotate(330)" />

          <Line x1="0" y1="0" x2="12" y2="0" strokeWidth="1" stroke="red" transform={`rotate(${time})`} />
        </G>
      </Svg>
    );
  }

  click_item(item, index) {
    if (item.is_clicked) return;

    if (!this.state.is_end) {
      var { array, curPlayer, log, startTime } = this.state;
      var curTime = Date.now();

      array[index].value = curPlayer;
      array[index].is_clicked = true;

      var duration = curTime - startTime;
      log[curPlayer].push(duration);
      curPlayer = 1 - curPlayer;
      startTime = curTime;

      console.log(JSON.stringify(log));

      this.setState({
        array,
        curPlayer,
        log,
        startTime
      });

      this.checkWinner()
    }
  }

  checkWinner() {
    const { array } = this.state;
    const squares = array;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const sqA = squares[a].value;
      const sqB = squares[b].value;
      const sqC = squares[c].value;

      if (sqA != null && sqA === sqB && sqA === sqC) {
        this.setState({
          is_end: true,
          showWinner: sqA
        });
        return;
      }
    }
  }

  timeFormat(time) {
    time = Math.floor(time / 10);
    return `${time / 100} s`;
  }

  show_durationLog(player) {
    var { log, is_end } = this.state;
    log = log[player];
    var sum = 0;
    log.forEach(value => sum += value);

    var averageLogTime = 0;
    if (log.length)
      averageLogTime = sum / log.length;

    return (
      <View style={{ width: '30%', height: 100, alignSelf:'center'}}>
        {
          log.map((logValue, key) =>
            <Text style={{textAlign:'right'}} key={key}>{this.timeFormat(logValue)}</Text>
          )
        }
        {is_end ?
        <Text style={{textAlign:'right', borderTopWidth: 1, borderTopColor: '#ddd'}}>Average: {this.timeFormat(averageLogTime)}</Text> : null}
      </View>
    );
  }


  render() {
    const width = Dimensions.get('window').width,
      height = Dimensions.get('window').height;

    const safeAreaHeight = width * 0.07;
    const btnHeight = width * 0.15;
    const spacing = height * 0.01;
    const paneMarginHorz = width * 0.08;
    const paneWidth = width - paneMarginHorz * 2;
    const clockHeight = (height - paneWidth - btnHeight - safeAreaHeight) / 2 - spacing;

    return (
      <View style={{ width: "100%", height: "100%", }}>
        <View style={{ width: "100%", height: safeAreaHeight, flexDirection: 'row' }}>
        </View>

        <View style={{ width: paneWidth, height: clockHeight, flexDirection: 'row', marginHorizontal: paneMarginHorz, justifyContent:'space-between' }}>
          <View style={{ justifyContent: 'center' }}>
            {this.show_clock(1)}
          </View>
          <View  style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 25 }}>Player X</Text>
            {this.state.is_end ?
              <View style={{ marginTop: '10%' }}>
                {this.state.showWinner == 1 ?
                  <Text style={{ fontSize: 40, color: 'green' }}> Won</Text>
                  : null}
              </View>
              : null
            }
          </View>
          {this.show_durationLog(1)}
        </View>

        <View style={{ width: paneWidth, height: paneWidth, marginVertical: spacing, marginHorizontal: paneMarginHorz }}>
          <FlatList
            extraData={this.state}
            data={this.state.array}
            numColumns={3}
            scrollEnabled={false}
            renderItem={({ item, index }) =>
              <TouchableOpacity style={{ width: paneWidth / 3, height: paneWidth / 3, alignItems: 'center', justifyContent: 'center', margin: 0.5, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => this.click_item(item, index)}>
                {item.value != null ?
                  <View>
                    {item.value == 0 ?
                      <Image source={circleImage} style={{ width: paneWidth / 4, height: paneWidth / 4 }} />
                      : <Image source={crossImage} style={{ width: paneWidth / 4, height: paneWidth / 4 }} />
                    }
                  </View>
                  : null}
              </TouchableOpacity>}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={{ width: paneWidth, height: clockHeight,  flexDirection: 'row', marginHorizontal: paneMarginHorz, justifyContent:'space-between'}}>
          <View style={{ justifyContent: 'center' }}>
            {this.show_clock(0)}
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 25 }}>Player O</Text>
            {this.state.is_end ?
              <View style={{ marginTop: '10%' }}>
                {this.state.showWinner == 0 ?
                  <Text style={{ fontSize: 40, color: 'green' }}> Won</Text>
                  : null}
              </View>
              : null}
          </View>
          {this.show_durationLog(0)}

        </View>

        <View style={{ width: "100%", height: btnHeight, }}>
          <TouchableOpacity style={{ height: '80%', width: '50%', borderWidth: 1, borderColor: 'black', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor:'rgba(0,0,0,0.1)' }} onPress={() => this.click_restartBtn()}>
            <Text>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>
    )

  }
}

export default App;
