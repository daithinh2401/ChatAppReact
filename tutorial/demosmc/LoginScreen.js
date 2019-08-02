import React, { Component } from 'react'

import { View, 
    Text, 
    StyleSheet, 
    Image, 
    ScrollView, 
    ImageBackground, 
    TextInput, 
    TouchableOpacity,
    Dimensions 
} from 'react-native'
import firebase from 'react-native-firebase'

export default class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.unsubscriber = null,
        this.state = {
            names: [
                {name: 'Username', id: 1},
                {name: 'Password', id: 2},
                {name: 'Mobile Number', id: 3},
                {name: 'clientstart.alpha.shoretel.com', id: 4},
            ],
            showPassword: false,
            username: '',
            password: '',
            visibilityButton: require('../image/visibility.png')
      
        }
    }


    onRegister = () => {
        if(this.state.username && this.state.password){
            firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.username,this.state.password)
            .then((response) => {
               

                
            }).catch((error) => {
                alert(`${error}`)
            });
        } else {
            alert(`Please input your username and password !`)
        }
    }

    onLogin = () => {
        if(this.state.username && this.state.password){
            firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.username,this.state.password)
            .then((response) => {
                this.handleScreen('DashboardScreen');
                this.props.userName(this.state.username);
            }).catch((error) => {
                alert(`${error}`)
            });
        } else {
            alert(`Please input your username and password !`)
        }
    }

    makePasswordShow = () => this.setState({
        showPassword: !this.state.showPassword,
        visibilityButton: this.state.showPassword ? require('../image/visibility.png') : require('../image/visibility_off.png') 
    })

    changeVisibilityButton = () => {
        if(this.showPassword){
            this.setState({visibilityButton: require('../image/visibility_off.png')})
        } else {
            this.setState({visibilityButton: require('../image/visibility_off.png')})
        }
    }

    handleUsername = (text) => {
        this.setState({username: text})
    }

    handlePassword = (text) => {
        this.setState({password: text})
    }

    handleScreen = (screen,username) => {
        this.props.navigateToScreen(screen,username)
    }

    checkUserInfo = (user,pass) => {
        if(user == 'a' && pass == '1'){
            return true
        } else {
            alert("Fail !!!!")
            return false
        }
    }

    render(){
        let screenWidth = Dimensions.get('window').width;
        let screenHeight = Dimensions.get('window').height;
        return(           
            <ImageBackground 
                style = {{flex:1 , width: null, height: null}}
                source = {require('../image/splash_screen_bg.png')} >

                {/* ----- Header ----- */}
                <View 
                    style = {styles.header}>
                    <Image 
                        style = {styles.logoMitelConnect}
                        source = {require('../image/logo_mitel_connect.png')}/>
                
                </View>

                {/* ----- Middle ----- */}
                <View style = {styles.middle}>
                    <ScrollView>
                        <TextInput 
                            keyboardType = 'email-address'
                            autoCapitalize = 'none'
                            underlineColorAndroid = "transparent"
                            borderBottomColor = "#0073d0"
                            borderBottomWidth = {1}
                            placeholderTextColor = "#73FFFFFF"
                            secureTextEntry={false}
                            autoCorrect={false}
                            placeholder = "Username" 
                            style = {styles.item}
                            onChangeText = {this.handleUsername} >
                        </TextInput>

                        <View style = {{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <TextInput 
                                underlineColorAndroid = "transparent"
                                borderBottomColor = "#0073d0"
                                borderBottomWidth = {1}
                                placeholderTextColor = "#73FFFFFF"
                                secureTextEntry={ this.state.showPassword ? false : true}
                                autoCorrect={false}
                                placeholder = "Password" 
                                style = {styles.item}
                                onChangeText = {this.handlePassword} >
                            </TextInput>
                            <TouchableOpacity 
                                activeOpacity = {1}
                                style = {styles.visibilityButton}
                                onPress = {this.makePasswordShow}>
                                <View >
                                    <Image
                                        source = {this.state.visibilityButton}>
                                    </Image>
                                </View>
                            </TouchableOpacity>

                        </View>                      

                        <TextInput 
                            underlineColorAndroid = "transparent"
                            borderBottomColor = "#0073d0"
                            borderBottomWidth = {1}
                            placeholderTextColor = "#73FFFFFF"
                            secureTextEntry={false}
                            autoCorrect={false}
                            placeholder = "Mobile Number" 
                            style = {styles.item}>
                        </TextInput>

                        <TextInput 
                            underlineColorAndroid = "transparent"
                            borderBottomColor = "#0073d0"
                            borderBottomWidth = {1}
                            placeholderTextColor = "#73FFFFFF"
                            secureTextEntry={false}
                            autoCorrect={false}
                            placeholder = "clientstart.alpha.shoretel.com" 
                            style = {styles.item}>
                        </TextInput>

                        <TouchableOpacity 
                            /*activeOpacity = {1}*/
                            style = {styles.button}
                            onPress = {this.onLogin}>
                            <ImageBackground  
                                style = {{flex: 1}}
                                source = {require('../image/btn_sign_in.png')}/>
                        </TouchableOpacity>    

                        <TouchableOpacity
                            onPress = {this.onRegister}
                            style = {styles.registerButon}>
                            <Text style = {{fontSize: 17, color: '#6699FF'}}> Register </Text>
                        </TouchableOpacity>                   
                    </ScrollView> 
                </View>

                {/* ----- Footer ----- */}
                <View style = {styles.footer}>
                    <Image 
                        style = {styles.logoMitel}
                        source = {require('../image/logo_mitel.png')}/>

                    <Text style = {{color: 'white', paddingTop: 12}}>
                        Version 9.0.85 build 106
                    </Text>
                
                </View>
            </ImageBackground>
        );
    }

}
const styles = StyleSheet.create ({
    mainBackground: {
        flex: 1
    },
    header : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 25
    },
    middle: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center', 
        padding: 20
    },
    footer: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    logoMitelConnect: {
        width: 120,
        height: 135
    },
    logoMitel: {
        width: 70,
        height: 20
    }, 
    showPassText: {
        marginTop: 10,
        color: '#ffffff'
    },
    item: {
        flex: 1,
        width: 250,
        flexDirection: 'row',
        marginTop: 5,
        color: '#ffffff'
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        height: 40,
        marginTop: 40,
    },
    registerButon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        marginTop: 10,
        marginLeft: 5,
        borderRadius: 5,
        backgroundColor: '#FFFFFF'
    },
    visibilityButton: {
        position: 'absolute',
        width: 23, 
        height: 23,
        paddingRight: 40,
    }
})