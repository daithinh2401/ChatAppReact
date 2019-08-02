import React, { Component } from 'react'
import { View, 
    Text, 
    StyleSheet, 
    Image, 
    ImageBackground,
    StatusBar
} from 'react-native'
import LoginScreen from './LoginScreen'

export default class SplashScreen extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
                <View style = {{flex: 1}}>
                    <ImageBackground 
                        style = {{flex: 1}}
                        source = {require('../image/splash_screen_bg.png')}>

                        {/* ----- Header ----- */}
                        <View style = {styles.header}>
                            <Image 
                                style = {styles.logoMitelConnect}
                                source = {require('../image/logo_mitel_connect.png')}/>
                        
                        </View>

                        {/* ----- Footer ----- */}
                        <View style = {styles.footer}>
                            <Image 
                                style = {styles.logoMitel}
                                source = {require('../image/logo_mitel.png')}/>                
                        </View>
                    </ImageBackground>
                </View>
        );
    }  
}
const styles = StyleSheet.create ({
    mainBackground: {
        flex: 1
    },
    header : {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 50
    },
    footer: {
        flex: 4, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoMitelConnect: {
        width: 120,
        height: 135
    },
    logoMitel: {
        width: 100,
        height: 24
    }
})
