import React, { Component } from 'react'
import { View,Text,StyleSheet,Image,TouchableOpacity,FlatList,ImageBackground,Platform } from 'react-native'
import chatListData from '../data/ChatListData'
import ChatListItem from '../item/ChatListItem'

import firebase from 'react-native-firebase'

const iosConfig = {

};

const androidConfig = {
    clientId: '872631157059-trd2loudf1pmin71sahjfb0gtfhqt78d.apps.googleusercontent.com', 
    appId: '1:872631157059:android:efc516ba21f2d2ce',
    apiKey: 'AIzaSyDIAhqKpQKBSdsaY7xq2zkktuvjZNZQHBU',
    databaseURL: 'https://chatappreacttutorial.firebaseio.com',
    storageBucket: 'chatappreacttutorial.appspot.com',
    messagingSenderId: '872631157059',
    projectId: 'chatappreacttutorial',
    persistence: true
};

const chatApp = !firebase.apps.length ? firebase.initializeApp(
    Platform.OS === 'ios' ? iosConfig : androidConfig
) : null;

const rootRef = firebase.database().ref();
const contactRef = rootRef.child('contacts');

export default class MessageScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            deleteRowKey: null,
            lastMessage: '',
            time: '',
            listContacts: []
        }
        this.currentUser = firebase.auth().currentUser;
    }

    refreshList = (deleteKey) => {
        this.setState({deleteRowKey: deleteKey})
    }

    changeScreen = (screen) => {    
        this.props.navigateToScreen(screen)
    }

    goToChatRoom = (screen,friendName,friendUid) => {
        var currentUid = this.currentUser.uid;
        var chatRoomId = this.generateChatId(currentUid,friendUid)
        this.props.goToChatRoomWithId(screen,friendName,friendUid,chatRoomId)
    }

    generateChatId(firstUid, secondUid){
        if(firstUid > secondUid){
            return `${firstUid}-${secondUid}`
        } else return `${secondUid}-${firstUid}`
    }

    goToDashBoard = () => {
        this.props.navigateToScreen('DashboardScreen');
    }

    componentDidMount(){   
        contactRef.on('value', (childSnapshot) => {
            const contacts = [];
            childSnapshot.forEach((doc) => {
                if(this.currentUser.uid != doc.toJSON().uid){
                    contacts.push({
                        key: doc.toJSON().key,
                        name: doc.toJSON().name,
                        uid: doc.toJSON().uid,
                        photoURL: doc.toJSON().photoURL,
                    });
                }
            });
            this.setState({listContacts: contacts})
        });
    }

    componentWillUnmount(){
        contactRef.off();
    }


    render(){
        var LinearGradient = require('react-native-linear-gradient').default;
        return(
                <View style = {styles.mainView}>   
                    {/* ----- Header ----- */}
                    <LinearGradient
                        style={styles.headerView}
                        colors={['#147fb5', '#15325f']}
                        start={{x: 1.0, y: 1.0 }} end={{x: 0.0, y: 1.0}}>          

                        <View style = {{flex:1, justifyContent: 'center', marginLeft: 30}}>
                            <Text style = {{color: '#ffffff', fontSize: 20}}>
                                Messages
                            </Text>
                        </View>
                        <View style = {{flex:1,flexDirection: 'row'}}>
                            <View style = {{flex:1, justifyContent: 'center',
                                            alignItems: 'center', flexDirection: 'column'}}>
                                <Text style = {{color: '#ffffff', fontSize: 14}}>
                                    Voicemail
                                </Text>
                            </View> 
                            <View style = {{flex:1, justifyContent: 'center',
                                            alignItems: 'center', flexDirection: 'column',
                                            borderBottomWidth: 4, borderBottomColor: '#00a1e0'}}>
                                <Text style = {{color: '#ffffff', fontSize: 14}}>
                                    IM
                                </Text>
                            </View>                           
                        </View>
    
                    </LinearGradient>

                    {/* ----- Middle ----- */}
                    <View style = {styles.middleView}>
                        <FlatList 
                            keyExtractor={(item, index) => index.toString()}
                            style = {{flex: 1}}
                            data = {this.state.listContacts}
                            renderItem = {({item,index}) => {
                                return(
                                    <ChatListItem item = {item} index = {index} parentFlatList = {this}>
                                    </ChatListItem>                                 
                                );
                            }}>
                        </FlatList>
                        <TouchableOpacity 
                            onPress = {() => this.changeScreen('ChatScreen')}
                            style = {styles.composingView}>
                            <ImageBackground 
                                    source = {require('../image/ic_plus_2.png')}
                                    style = {{flex: 1}}>                           
                            </ImageBackground>
                        </TouchableOpacity>
                        
                    </View>

                    {/* ----- Footer ----- */}
                    <View style = {styles.footerView}>
                        <View style = {{flex:8,flexDirection:'row',paddingTop: 5}}>
                            <LinearGradient
                            style = {{flex:1,flexDirection:'row'}}
                            colors={['#ebecf0', '#f5f6f7']}
                            start={{x: 1.0, y: 543.0 }} end={{x: 0.0, y: 534.0}}>
                        
                                <TouchableOpacity style ={{ flex: 2 , flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}> 
                                    <Image style = {styles.iconFooter} source = {require('../image/active_blue_1.png')} />
                                    <Text style = {{fontSize: 10, color: '#00a1f4', marginTop: 5}}> Messages </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style ={{ flex: 2 , alignItems: 'center', justifyContent: 'center'}}> 
                                    <Image style = {styles.iconFooter} source = {require('../image/icon_recent_dash.png')} />
                                    <Text style = {{fontSize: 10, color: '#7e858b', paddingTop: 5}}> Recent </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress = {this.goToDashBoard} style ={{ flex: 2 , alignItems: 'center', justifyContent: 'center',marginBottom: 15}}> 
                                    <Image style = {{width: 50, height: 50}} source = {require('../image/mitel_bowtie.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity style ={{ flex: 2 , alignItems: 'center', justifyContent: 'center'}}> 
                                    <Image style = {styles.iconFooter} source = {require('../image/icon_events_dash.png')} />
                                    <Text style = {{fontSize: 10, color: '#7e858b', paddingTop: 5}}> Events </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style ={{ flex: 2 , alignItems: 'center', justifyContent: 'center'}}> 
                                    <Image style = {styles.iconFooter} source = {require('../image/icon_contacts_dash.png')} />
                                    <Text style = {{fontSize: 10, color: '#7e858b', paddingTop: 5}}> Contacts </Text>
                                </TouchableOpacity>

                            </LinearGradient>
                        </View>                  
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
        flex: 2,
        flexDirection: 'column'
    },
    middleView: {
        flex: 7,
        flexDirection: 'column',
        margin: 20
    },
    footerView: {
        flex: 1.5,
        flexDirection: 'column',
        backgroundColor: '#f5f6f7'
    },
    userInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: 120,
        height: 21,
        marginLeft: 8
    },
    iconFooter: {
        width: 30,
        height: 30
    },
    avatarView:{
        marginLeft: 20,
        width: 70,
        height: 70,
        borderRadius:Platform.OS === 'android' ? 100 : 35,
        borderWidth: 1,
        borderColor: 'black'
    },
    composingView: {
        width: 70,
        height: 70,
        borderRadius:100,
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginBottom: 10,
        marginRight: 10
    },
    messageItem: {
        height: 80,
        flexDirection:'row', 
        alignItems:'center',
        marginBottom: 15
    }

})