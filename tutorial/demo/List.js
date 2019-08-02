import React, { Component } from 'react'
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native'

class List extends Component {
  state = {
    names: [
      {'name': 'Ben', 'id': 1},
      {'name': 'Susan', 'id': 2},
      {'name': 'Robert', 'id': 3},
      {'name': 'Mary', 'id': 4},
      {'name': 'Daniel', 'id': 5},
      {'name': 'Laura', 'id': 6},
      {'name': 'John', 'id': 7},
      {'name': 'Debra', 'id': 8},
      {'name': 'Aron', 'id': 9},
      {'name': 'Ann', 'id': 10},
      {'name': 'Steve', 'id': 11},
      {'name': 'Olivia', 'id': 12}
    ]
 }
 alertItem = (item) => {
   alert(item.name)
 }
 render() {
    return (
       <View>
          <ScrollView>
             {
                this.state.names.map((item, index) => (
                   <TouchableOpacity 
                    key = {item.id} 
                    style = {styles.item}
                    onPress = {() => this.alertItem(item)}>
                        <Text>{item.name}</Text>
                   </TouchableOpacity>
                ))
             }
          </ScrollView>
       </View>
    )
 }
}
export default List

const styles = StyleSheet.create ({
 item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    margin: 20,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1'
 }
})
