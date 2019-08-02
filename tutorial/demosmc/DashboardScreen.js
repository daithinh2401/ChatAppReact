import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import { DEFAULT_AVATAR } from '../constvalue/defineValue'

import firebase from 'react-native-firebase'
import { deleteUser } from '../database/userSchema'

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

export default class DashboardScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [
                { title: 'Workplace Ethics Seminar', place: '10:00 • Bridge/Sun Valley', active: true, id: 1 },
                { title: 'Q4 Roadmap Working Session', place: '10:00 • Bridge/Wolf Creek', active: true, id: 2 },
                { title: 'Eng/UX Stand-Up', place: '2:00 • Bridge/Alpine Meadows"', active: false, id: 3 }
            ],
            calls: [
                { user: 'Annie Crawford', time: '3:00pm', type: 1, id: 1 },
                { user: '(650) 555-1212', time: '2:41pm', type: 3, id: 2 },
                { user: 'Chuck Bartowski', time: '2:39pm', type: 2, id: 3 }
            ],
            contacts: [],
            loading: false,
        }
        this.currentUser = firebase.auth().currentUser;
        this.avatarURL = this.currentUser.photoURL ? this.currentUser.photoURL : DEFAULT_AVATAR;
    }

    checkContactAlreadyExist(contacts) {
        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].uid === this.currentUser.uid) {
                return true;
            }
        }
        return false;
    }

    logOut = () => {
        firebase.auth().signOut();
    }

    componentDidMount() {
        contactRef.once('value', (childSnapshot) => {
            const contacts = [];
            childSnapshot.forEach((doc) => {
                contacts.push({
                    name: doc.toJSON().name,
                    uid: doc.toJSON().uid,
                    photoURL: doc.toJSON().photoURL
                });
            });
            var check = this.checkContactAlreadyExist(contacts);
            if (!check) {
                const ct = {
                    name: this.currentUser.email,
                    uid: this.currentUser.uid,
                    photoURL: this.currentUser.photoURL ? this.currentUser.photoURL : DEFAULT_AVATAR,
                    platForm: Platform.OS
                }
                contactRef.push(ct);
            }
        });
        contactRef.off();
    }

    componentWillUnmount() {
        contactRef.off();
    }


    getType = (type) => {
        switch (type) {
            case 1:
                return require('../image/icon_incoming_video_call.png')
                break
            case 2:
                return require('../image/icon_outgoing_video_call.png')
                break
            case 3:
                return require('../image/icon_missed_video_call.png')
                break
        }
    }

    changeScreen = (screen) => {
        this.props.navigateToScreen(screen)
    }

    render() {
        var LinearGradient = require('react-native-linear-gradient').default;
        return (
            <View style={styles.mainView}>

                {/* ----- Header ----- */}
                <LinearGradient
                    style={styles.headerView}
                    colors={['#147fb5', '#15325f']}
                    start={{ x: 1.0, y: 1.0 }} end={{ x: 0.0, y: 1.0 }}>

                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Image
                            style={styles.avatarView}
                            source={{ uri: this.avatarURL }}>
                        </Image>
                        <Image
                            style={{ width: 20, height: 20, position: 'absolute' }}
                            source={require('../image/group_9.png')}>
                        </Image>
                    </View>

                    <View style={styles.userInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginBottom: 2, color: '#ffffff', fontSize: 18 }}>
                                {firebase.auth().currentUser.email}
                            </Text>
                            <Image style={{ marginLeft: 10 }} source={require('../image/triangle.png')} />
                        </View>
                        <Text style={{ marginTop: 2, color: '#ffffff', fontSize: 12 }}>
                            Available
                        </Text>
                    </View>
                    <View style={{ flex: 1, height: 22, alignItems: 'flex-end', marginBottom: 25 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 22, height: 22, marginRight: 20 }} source={require('../image/search.png')} />
                            <View style={{ height: 22, backgroundColor: 'white', width: 1, marginLeft: 5, marginRight: 15 }} />
                            <TouchableOpacity onPress = {this.logOut}>
                                <Image style={{ width: 22, height: 22, marginRight: 20 }} source={require('../image/transfer_search_by_name.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </LinearGradient>

                {/* ----- Middle ----- */}
                <View style={styles.middleView}>
                    <View style={{ flex: 5 }}>

                        {/*--- Event detail ---*/}
                        <View style={{ flex: 1, flexDirection: 'column', margin: 15 }}>
                            {/*--- Title ---*/}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                {/*--- Event title ---*/}
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 20 }}> Events </Text>
                                </View>
                                {/*--- View all title ---*/}
                                <View style={{ flex: 3, alignItems: 'flex-end', marginBottom: 3 }}>
                                    <Text style={{ fontSize: 14 }}> View all </Text>
                                </View>

                            </View>

                            {/*--- Content ---*/}
                            <View style={{ flex: 9, flexDirection: 'column', marginTop: 3 }}>
                                {
                                    this.state.events.map((item, index) => (
                                        <View key={item.id} style={{ height: Platform.OS === 'android' ? 50 : 60, borderRadius: 8, backgroundColor: item.active ? '#66bed9ed' : '#c7c9cc', marginBottom: 8 }}>
                                            <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                                                <View style={{ flex: 9, flexDirection: 'column' }}>
                                                    <View style={{ flex: 1, justifyContent: 'center', marginBottom: 5 }}>
                                                        <Text style={{ fontSize: 17, color: '#15325f' }}> {item.title} </Text>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', marginTop: 5  }}>
                                                        <Text style={{ fontSize: 13, color: '#7e858b' }}> {item.place} </Text>
                                                    </View>

                                                </View>
                                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image
                                                        style={{ width: 40, height: 40 }}
                                                        source={item.active ? require('../image/btn_join_active.png') : require('../image/btn_join_inactive.png')}>
                                                    </Image>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>

                        </View>
                    </View>


                    <View style={{ flex: 5 }}>
                        {/*--- Call recent detail ---*/}
                        <View style={{ flex: 1, flexDirection: 'column', margin: 15}}>
                            {/*--- Title ---*/}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                                {/*--- Activity title ---*/}
                                <View style={{ flex: 7 }}>
                                    <Text style={{ fontSize: 20 }}> Activity </Text>
                                </View>
                                {/*--- View all title ---*/}
                                <View style={{ flex: 3, alignItems: 'flex-end', marginBottom: 3 }}>
                                    <Text style={{ fontSize: 14 }}> View all </Text>
                                </View>

                            </View>

                            {/*--- Content ---*/}
                            <View style={{ flex: 9, flexDirection: 'column', marginTop: 10 }}>
                                {
                                    this.state.calls.map((item, index) => (
                                        <View key={item.id} style={{ flex: 1, flexDirection: 'row', marginBottom: 10, borderRadius: 4, borderColor: '#d8d8d8', borderWidth: 1, alignItems: 'center' }}>
                                            <View style={{ flex: 2, flexDirection: 'row', marginLeft: 10 }}>
                                                <Image
                                                    style={{ width: 22, height: 22 }}
                                                    source={this.getType(item.type)}>
                                                </Image>
                                                <Text style={{ fontSize: 17, color: '#4a4a4a', marginLeft: 10 }}>
                                                    {item.user}
                                                </Text>
                                            </View>

                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 15, color: '#7e858b', marginLeft: 10, marginRight: 10 }}>{item.time}</Text>
                                            </View>

                                        </View>
                                    ))
                                }
                            </View>

                        </View>

                    </View>
                </View>


                {/* ----- Footer ----- */}
                <View style={styles.footerView}>
                    <View style={{ flex: 8, flexDirection: 'row' }}>
                        <LinearGradient
                            style={styles.headerView}
                            colors={['#ebecf0', '#f5f6f7']}
                            start={{ x: 1.0, y: 543.0 }} end={{ x: 0.0, y: 534.0 }}>

                            <TouchableOpacity style={styles.navBarItem}
                                onPress={() => this.changeScreen('MessageScreen')}>
                                <Image style={styles.iconFooter} source={require('../image/icon_voicemail_dash.png')} />
                                <Text style={{ fontSize: 12, color: '#323a45', marginTop: 10 }}> Messages </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navBarItem}>
                                <Image style={styles.iconFooter} source={require('../image/icon_recent_dash.png')} />
                                <Text style={{ fontSize: 12, color: '#323a45', marginTop: 10 }}> Recent </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.centerNavBarItem}>
                                <Image style={{ width: 70, height: 70 }} source={require('../image/icon_dialer_dash.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navBarItem}>
                                <Image style={styles.iconFooter} source={require('../image/icon_events_dash.png')} />
                                <Text style={{ fontSize: 12, color: '#323a45', marginTop: 10 }}> Events </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navBarItem}>
                                <Image style={styles.iconFooter} source={require('../image/icon_contacts_dash.png')} />
                                <Text style={{ fontSize: 12, color: '#323a45', marginTop: 10 }}> Contacts </Text>
                            </TouchableOpacity>

                        </LinearGradient>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                        <Image
                            style={{ width: 18, height: 11 }}
                            source={require('../image/expand_less.png')}>
                        </Image>
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
        alignItems: 'center',
        flexDirection: 'row'
    },
    middleView: {
        flex: 8
    },
    footerView: {
        flex: 2,
        flexDirection: 'column',
        backgroundColor: '#f5f6f7'
    },
    avatarView: {
        marginLeft: 20,
        width: 50,
        height: 50,
        borderRadius: Platform.OS === 'android' ? 100 : 25,
        borderWidth: 1,
        borderColor: 'white'
    },
    userInfo: {
        flexDirection: 'column',
        justifyContent: 'center',
        width: 200,
        height: 21,
        marginLeft: 8
    },
    iconFooter: {
        width: 50,
        height: 50
    },
    navBarItem: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15
    },
    centerNavBarItem: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10
    }

})