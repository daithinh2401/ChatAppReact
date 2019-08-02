import { AppRegistry, Platform } from 'react-native';
import React, { Component } from 'react'


import RADialer from './demosmc/RADialer'
import LoginScreen from './demosmc/LoginScreen'
import SplashScreen from './demosmc/SplashScreen'
import DashboardScreen from './demosmc/DashboardScreen'
import MessageScreen from './demosmc/MessageScreen'
import ChatScreen from './demosmc/ChatScreen'
import bgMessage from './backgroundtask/bgMessage'

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

AppRegistry.registerComponent('tutorial', () => RADialer);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessage);
 