import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Greeting extends Component {
  render() {
    return (
      <Text>Hello {this.props.name}!</Text>
    );
  }
}
export default class LotsOfGreetings extends Component {
  constructor(props){
    super(props);
    this.state = {
      background: false
    }
  }
  changeBackground = () => {
    this.setState({background: !this.state.background})
  }
  render() {
    return (
      <View 
        onTouchStart = {this.changeBackground}
        style={{
          alignItems: 'center', 
          backgroundColor: this.state.background ? 'white' : 'yellow' }}>
        <Greeting name='Rexxar' />
        <Greeting name='Jaina' />
        <Greeting name='Valeera' />
      </View>
    );
  }
}





