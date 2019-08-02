import React, { Component } from 'react'
import { Platform } from 'react-native'

import LoginScreen from './LoginScreen'
import SplashScreen from './SplashScreen'
import DashboardScreen from './DashboardScreen'
import MessageScreen from './MessageScreen'
import ChatScreen from './ChatScreen'
import firebase from 'react-native-firebase'

const rootRef = firebase.database().ref();

import FCM, { FCMEvent } from "react-native-fcm";

export default class RADialer extends Component {
    constructor(props) {
        super(props)
        this.unsubscriber = null;
        this.state = {
            currentScreen: 'SplashScreen',
            username: '',
            friendName: '',
            chatRoomId: '',
            friendUid: ''
        },
        this.pushTokenRef = '';

        const channel = new firebase.notifications.Android.Channel('channel_id_foreground', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
        // Create the channel
        firebase.notifications().android.createChannel(channel);

        firebase.auth().onAuthStateChanged(response => {
            if (response) {
                this.setUserName(firebase.auth().currentUser.email);
                this.navigateToScreen('DashboardScreen');
                this.updataPushToken();
            } else {
                setTimeout(() => {
                    this.setState({ currentScreen: 'LoginScreen' })
                }, 3000)
            }
        })
    }

    updataPushToken() {
        var pushTokenRef = rootRef.child('tokens/' + firebase.auth().currentUser.uid);
        firebase.messaging().hasPermission().then(async (enabled) => {
            if (enabled) {
                // user has permissions
            } else {
                // user doesn't have permission
                try {
                    await firebaseMessaging.requestPermission();
                    // User has authorised
                } catch (error) {
                    // User has rejected permissions
                }
            }
        });
        // gets the device's push token
        firebase.messaging().getToken().then(token => {
            // stores the token in the user's document
            pushTokenRef.update({
                pushToken: token,
                platForm: Platform.OS
            })
        });
    }


    generateChatId(firstUid, secondUid) {
        if (firstUid > secondUid) {
            return `${firstUid}-${secondUid}`
        } else return `${secondUid}-${firstUid}`
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
        if (this.notificationListener) {
            this.notificationListener();
        }
        if (this.onTokenRefreshListener) {
            this.onTokenRefreshListener();
        } 
        if (this.initialNotif){
            this.initialNotif();
        }
        if (this.onNotifiCationShowListener){
            this.onNotifiCationShowListener();
        }
    }

    async componentDidMount() {
        var senName = '';
        var senUid = '';
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            firebase.messaging().hasPermission()
                .then(async (enabled) => {
                    if (enabled) {
                        // user has permissions
                    } else {
                        // user doesn't have permission
                        try {
                            await firebaseMessaging.requestPermission();
                            // User has authorised
                        } catch (error) {
                            // User has rejected permissions
                        }
                    }
                });

            this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
                // Process your token as required
                this.updataPushToken();
            });

            if (Platform.OS === 'android') {
                
                this.initialNotif =  FCM.getInitialNotification().then(notif => {
                    if (notif.my_data) {
                        setTimeout(() => {
                            if (!senName || !senUid) {
                                senName = notif.my_data.name;
                                senUid = notif.my_data.uid;
                            }
    
                            var roomUid = this.generateChatId(firebase.auth().currentUser.uid, senUid);
                            this.navigateToScreen('MessageScreen');
                            this.goToChatRoomWithId('ChatScreen', senName, senUid, roomUid);
                            firebase.notifications().removeAllDeliveredNotifications();
                        }, 500);
                    }
                });
    
                this.onNotifiCationShowListener = FCM.on(FCMEvent.Notification, notif => {
    
                    if (!senName || !senUid) {
                        senName = notif.my_data.name;
                        senUid = notif.my_data.uid;
                    }
    
                    var roomUid = this.generateChatId(firebase.auth().currentUser.uid, senUid);
                    this.navigateToScreen('MessageScreen');
                    this.goToChatRoomWithId('ChatScreen', senName, senUid, roomUid);
                    firebase.notifications().removeAllDeliveredNotifications();
                });

                this.notificationListener = firebase.messaging().onMessage((notification) => {

                    senName = notification.data.senderName;
                    senUid = notification.data.senderUid;

                    // const showNotif = new firebase.notifications.Notification()
                    //     .setNotificationId(new Date().valueOf().toString())
                    //     .setTitle(notification.data.title)
                    //     .setBody(notification.data.text)
                    //     .android.setPriority(1)
                    //     .android.setChannelId('channel_id_foreground')
                    //     .android.setLargeIcon(notification.data.icon);
                    // firebase.notifications().displayNotification(showNotif); 

                    FCM.presentLocalNotification({
                        channel: 'channel_id_foreground',
                        id: new Date().valueOf().toString(), // (optional for instant notification)
                        title: notification.data.title, // as FCM payload
                        body: notification.data.text, // as FCM payload (required)
                        //sound: "bell.mp3", // "default" or filename
                        priority: "high", // as FCM payload
                        click_action: notification.data.action, // as FCM payload - this is used as category identifier on iOS.
                        // badge: 10, // as FCM payload IOS only, set 0 to clear badges
                        // number: 10, // Android only
                        //ticker: "My Notification Ticker", // Android only
                        //auto_cancel: true, // Android only (default true)
                        large_icon: notification.data.icon, // Android only
                        icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap             
                        wake_screen: true, // Android only, wake up screen when notification arrives
                        show_in_foreground: true // notification when app is in foreground (local & remote)
                    });
                });
            } else if (Platform.OS === 'ios') {
                this.notificationListener = firebase.notifications().onNotification((notification) => {

                    senName = notification.data.senderName;
                    senUid = notification.data.senderUid;

                    firebase.notifications().removeDeliveredNotification(notification.notificationId);

                    FCM.presentLocalNotification({
                        channel: 'channel_id_foreground',
                        id: new Date().valueOf().toString(), // (optional for instant notification)
                        title: notification.data.title, // as FCM payload
                        body: notification.data.text, // as FCM payload (required)
                        //sound: "bell.mp3", // "default" or filename
                        priority: "high", // as FCM payload
                        click_action: notification.data.action, // as FCM payload - this is used as category identifier on iOS.
                        // badge: 10, // as FCM payload IOS only, set 0 to clear badges
                        // number: 10, // Android only
                        //ticker: "My Notification Ticker", // Android only
                        //auto_cancel: true, // Android only (default true)
                        large_icon: notification.data.icon, // Android only
                        icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap             
                        wake_screen: true, // Android only, wake up screen when notification arrives
                        show_in_foreground: true // notification when app is in foreground (local & remote)
                    });
                });
            }


            // this.notificationOpenListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            //     // Get the action triggered by the notification being opened
            //     const action = notificationOpen.action;
            //     // Get information about the notification that was opened
            //     const notification = notificationOpen.notification;

            //     if (!senName || !senUid) {
            //         senName = notification.data.senderName;
            //         senUid = notification.data.senderUid;
            //     }

            //     var roomUid = this.generateChatId(firebase.auth().currentUser.uid, senUid);
            //     this.navigateToScreen('MessageScreen');
            //     this.goToChatRoomWithId('ChatScreen', senName, senUid, roomUid);
            //     firebase.notifications().removeDeliveredNotification(notification.notificationId)
            // });

            // firebase.notifications().getInitialNotification()
            //     .then((notificationOpen) => {
            //         if (notificationOpen) {
            //             // App was opened by a notification
            //             // Get the action triggered by the notification being opened
            //             const action = notificationOpen.action;
            //             // Get information about the notification that was opened
            //             const notification = notificationOpen.notification;

            //             senName = notification.data.senderName;
            //             senUid = notification.data.senderUid;

            //             var roomUid = this.generateChatId(firebase.auth().currentUser.uid, senUid);
            //             this.navigateToScreen('MessageScreen');
            //             this.goToChatRoomWithId('ChatScreen', senName, senUid, roomUid);
            //             firebase.notifications().removeDeliveredNotification(notification.notificationId);
            //         }
            //     });
        })
    }

    setUserName = (username) => {
        this.setState({
            username: username,
        })
    }

    navigateToScreen = (screen) => {
        this.setState({
            currentScreen: screen
        })
    }

    goToChatRoomWithId = (screen, friendName, friendUid, chatRoomId) => {
        this.setState({
            friendName: friendName,
            chatRoomId: chatRoomId,
            friendUid: friendUid,
            currentScreen: screen
        })
    }

    getState = (screen) => {
        switch (screen) {
            case 'SplashScreen':
                return <SplashScreen navigateToScreen={this.navigateToScreen} />
                break
            case 'LoginScreen':
                return <LoginScreen userName={this.setUserName} navigateToScreen={this.navigateToScreen} />
                break
            case 'DashboardScreen':
                return <DashboardScreen username={this.state.username} navigateToScreen={this.navigateToScreen} />
                break
            case 'MessageScreen':
                return <MessageScreen goToChatRoomWithId={this.goToChatRoomWithId} navigateToScreen={this.navigateToScreen} />
                break
            case 'ChatScreen':
                return <ChatScreen friendName={this.state.friendName} friendUid={this.state.friendUid} chatRoomId={this.state.chatRoomId} navigateToScreen={this.navigateToScreen} />
                break
            default:
                return null
                break
        }
    }

    render() {
        const { currentScreen } = this.state
        let mainScreen = this.getState(currentScreen)
        return mainScreen
    }

}