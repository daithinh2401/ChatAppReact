import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Platform
} from 'react-native'

import firebase from 'react-native-firebase'
import { DEFAULT_AVATAR } from '../constvalue/defineValue';

class FriendChatComponent extends Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 2, alignItems: 'center' }}>
                        <Image
                            style={styles.avatarView}
                            source={{uri: this.props.item.photoURL ? this.props.item.photoURL : 'https://example.domain.com/no-photo.png' }}>
                        </Image>
                    </View>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <View style={{ borderRadius: 10, backgroundColor: 'blue', padding: 10, alignSelf: 'flex-start' }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>{this.props.item.message}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

class SelfChatComponent extends Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={{ flex: 8, justifyContent: 'center' }}>
                        <View style={{ borderRadius: 10, backgroundColor: 'gray', padding: 10, alignSelf: 'flex-end' }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>{this.props.item.message}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 2, alignItems: 'center' }}>
                        <Image
                            style={styles.avatarView}
                            source={{uri: this.props.item.photoURL ? this.props.item.photoURL : 'https://example.domain.com/no-photo.png' }}>
                        </Image>
                    </View>
                </View>

            </View>
        )
    }

}

export default class ChatContentItems extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var selfComp = this.props.item.uid === firebase.auth().currentUser.uid;
        let mainScreen = selfComp ? <SelfChatComponent hasAva = {this.props.hasAva} item = {this.props.item} index ={this.props.index}/> 
                                             : <FriendChatComponent hasAva = {this.props.hasAva} item = {this.props.item} index ={this.props.index}/>
        return mainScreen;
    }

}
const styles = StyleSheet.create({
    avatarView: {
        width: 50,
        height: 50,
        borderRadius: Platform.OS === 'android' ? 100 : 25,
        borderWidth: 1,
        borderColor: 'white', 
        marginLeft: 5
    },

})