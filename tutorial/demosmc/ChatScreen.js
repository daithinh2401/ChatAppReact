import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    Image,
    Platform,
    RefreshControl,
    FlatList
} from 'react-native'
import ChatContentItems from '../item/ChatContentItems'
import firebase from 'react-native-firebase'
import { Notification, NotificationOpen } from 'react-native-firebase';
import { DEFAULT_AVATAR } from '../constvalue/defineValue';
import chatContentListData from '../data/ChatContentListData';

const rootRef = firebase.database().ref();

export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textInp: '',
            hasText: false,
            chatContentListData: [],
            token: '',
            friendPlatForm: '',
            numberMessage: 15,
            refreshing: false,
            newList: [],
            firstStart: true
        }
        this.currentUser = firebase.auth().currentUser,
        this.friendName = this.props.friendName;
        this.friendUid = this.props.friendUid;
        this.chatRoomId = this.props.chatRoomId;
        this.chatRoomRef = rootRef.child('chatrooms/' + this.chatRoomId);
        this.pushTokenRef = rootRef.child('tokens/' + this.friendUid);
        setTimeout(() => {
            this.flatList.scrollToEnd();
        }, 1000)
    }

    textChange = (text) => {
        if (text != '') {
            this.setState({ hasText: true, textInp: text })
        } else {
            this.setState({ hasText: false })
        }
    }
    randomKey = () => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    pushNotificationAndroid(text){
        return fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAyyzewUM:APA91bHUInotJ6mUitbgdhZ6I0gDThWuQ2Yp5l8FS8t2R-lIOtNBRYrrlgNQGZ9Ij6pnyKMZduAgfdo-rDzb3hz2M06bZ2zdshKZTJh45RryqLla4hkqgYWPJ-1Ylt9iMBXKhSxG6ezHa0_t9Ly7rR73k86D0tCTCg'
            },
            body: JSON.stringify({
                'to' : this.state.token,
                'data' : {
                    'title' : ' ' + this.currentUser.email + ' send you a message !',
                    'text' : text,
                    'senderName' : this.currentUser.email,
                    'senderUid': this.currentUser.uid,
                    'icon': firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : DEFAULT_AVATAR
                },
                'content_available': true

            })
        })
        .then((response) => {
            //alert(`${JSON.stringify(response)}`)
        })
        .catch((error) => {
            //alert(`${error}`)
        });
    }

    pushNotificationIOS(text){
        return fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAAyyzewUM:APA91bHUInotJ6mUitbgdhZ6I0gDThWuQ2Yp5l8FS8t2R-lIOtNBRYrrlgNQGZ9Ij6pnyKMZduAgfdo-rDzb3hz2M06bZ2zdshKZTJh45RryqLla4hkqgYWPJ-1Ylt9iMBXKhSxG6ezHa0_t9Ly7rR73k86D0tCTCg'
            },
            body: JSON.stringify({
                'to' : this.state.token,
                'notification' : {
                    'title' : ' ' + this.currentUser.email + ' send you a message !',
                    'body' : text
                },
                'data' : {
                    'title' : ' ' + this.currentUser.email + ' send you a message !',
                    'text' : text,
                    'senderName' : this.currentUser.email,
                    'senderUid': this.currentUser.uid,
                    'icon': firebase.auth().currentUser.photoURL ? firebase.auth().currentUser.photoURL : DEFAULT_AVATAR
                }    

            })
        })
        .then((response) => {
            //alert(`${JSON.stringify(response)}`)
        })
        .catch((error) => {
            //alert(`${error}`)
        });
    }

    sendMessage = (text) => {
        if(this.state.friendPlatForm === 'ios'){
            //this.pushNotificationIOS(text);  
        } else {
            this.pushNotificationAndroid(text);
        }
        var user = this.currentUser;
        var userId = user.uid;
        var milliseconds = (new Date).getTime();
        var ptURL = this.currentUser.photoURL ? this.currentUser.photoURL : DEFAULT_AVATAR;
        if (text.length != 0) {
            // let hasAva = true;
            // if (this.state.chatContentListData.length > 0 && this.state.chatContentListData[this.state.chatContentListData.length - 1].uid === userId) {
            //     hasAva = false;
            // }
            const newContent = {
                key: this.randomKey,
                name: user.name,
                message: text,
                uid: userId,
                photoURL: ptURL /*hasAva ? ptURL : 'https://example.domain.com/no-photo.png'*/,
                time: milliseconds
            }
            this.setState({ textInp: '', hasText: false })
            this.flatList.scrollToEnd();
            this.chatRoomRef.push(newContent);           
        }
    }

    backToMessageScreen = (screen) => {
        this.props.navigateToScreen(screen)
    }

    componentWillUnmount(){
        this.pushTokenRef.off();
        this.chatRoomRef.off();
    }

    componentDidMount() {
        this.pushTokenRef.on('value', (snapshot) => {
            var token = snapshot.toJSON().pushToken;
            var platForm = snapshot.toJSON().platForm;
            this.setState({
                token: token,
                friendPlatForm: platForm
            })
        });
        this.chatRoomRef.on('value', (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
                messages.push({
                    key: doc.key,
                    name: doc.toJSON().name,
                    message: doc.toJSON().message,
                    uid: doc.toJSON().uid,
                    photoURL: doc.toJSON().photoURL,
                    time: doc.toJSON().time,
                });
            });
            this.setState({ chatContentListData: messages })
            this.flatList.scrollToEnd();
        });
    }

    mapToAnotherList(){
        var nl = [];
        const list = this.state.chatContentListData;
        for(var i = list.length - 1; i >= list.length - this.state.numberMessage; i--){
            if(list[i]){
                nl.push(list[i]);
            }
        }
        for(var j = 0; j < nl.length - 1; j++){
            if(nl[j + 1].uid === nl[j].uid){
                nl[j].photoURL = 'https://example.domain.com/no-photo.png';
            }
        }
        nl.reverse();
        return nl;
    }

    appendChatListToNewList(newList){
        const list = this.state.chatContentListData;
        var len = list.length - this.state.numberMessage;
        for(var i = len; i > len - 10; i--){
            if(list[i]){
                newList.unshift(list[i]);
            }
        }
        for(var j = 0; j < newList.length; j++){
            if(newList[j - 1] && newList[j - 1].uid === newList[j].uid){
                newList[j].photoURL = 'https://example.domain.com/no-photo.png';
            }
        }
    }

    addMessageToList = () => {
        this.setState({ numberMessage: this.state.numberMessage + 10})
    }

    render() {
        var LinearGradient = require('react-native-linear-gradient').default;
        var newList = this.mapToAnotherList();
        return (
            <View style={styles.mainView}>
                {/* ----- Header ----- */}
                <LinearGradient
                    style={styles.headerView}
                    colors={['#147fb5', '#15325f']}
                    start={{ x: 1.0, y: 1.0 }} end={{ x: 0.0, y: 1.0 }}>

                    {/* --- Button back view --- */}
                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress = {() => this.backToMessageScreen('MessageScreen')}>
                            <ImageBackground
                                style={{ width: 25, height: 25 }}
                                source={require('../image/back.png')}>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                    {/* --- Buddy name --- */}
                    <View style={{ flex: 5.5, justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{ color: '#ffffff', fontSize: 20 }}>
                            {this.friendName}
                            </Text>
                    </View>

                    {/* --- Button call view --- */}
                    <View style={{ flex: 3, flexDirection: 'row' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity>
                                <ImageBackground
                                    style={{ width: 25, height: 25 }}
                                    source={require('../image/icon_call_white.png')}>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity>
                                <ImageBackground
                                    style={{ width: 25, height: 25 }}
                                    source={require('../image/info_outline.png')}>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>


                </LinearGradient>

                {/* ----- Middle ----- */}
                <View style={styles.middleView}>
                    <FlatList
                        refreshControl={
                            <RefreshControl 
                                refreshing = {this.state.refreshing}
                                onRefresh = {this.addMessageToList.bind(this)}
                            />
                        }
                        keyExtractor={(item, index) => index.toString()}
                        ref={(flatList) => this.flatList = flatList }
                        style={{ flex: 1 }}
                        data={newList}
                        renderItem={({ item, index }) => {
                            return (
                                <ChatContentItems item={item} index={index} parentFlatList={this}>
                                </ChatContentItems>
                            );
                        }}>
                    </FlatList>
                </View>

                {/* ----- Footer ----- */}
                <View style={styles.footerView}>
                    <TextInput
                        value={this.state.textInp}
                        onChangeText={this.textChange}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#e6e9eb"
                        secureTextEntry={false}
                        autoCorrect={false}
                        placeholder="Type a Message here"
                        style={styles.inputText}
                        multiline={true}>
                    </TextInput>
                    <TouchableOpacity
                        disabled={this.state.hasText ? false : true}
                        onPress={() => this.sendMessage(this.state.textInp)}
                        style={{ flex: 2, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                        <ImageBackground
                            style={{justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}>
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={this.state.hasText ? require('../image/ic_action_send_active.png') :  require('../image/ic_action_send.png')}>
                            </Image>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    headerView: {
        flex: 1.5,
        flexDirection: 'row'
    },
    middleView: {
        flex: 8,
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20
    },
    footerView: {
        flex: 1.5,
        flexDirection: 'row',
        borderColor: '#e2e2e3',
        borderTopWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    avatarView: {
        width: 70,
        height: 70,
        borderRadius: Platform.OS === 'android' ? 100 : 35,
        borderWidth: 1,
        borderColor: 'white'
    },
    inputText: {
        flex: 8,
        height: 50,
        fontSize: 20,
        color: '#484a4c',
        marginLeft: 15
    }

})