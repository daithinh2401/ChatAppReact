import React, { Component } from 'react'
import { View,Text,StyleSheet,Image,TouchableOpacity,YellowBox,Alert,Platform} from 'react-native'
import Swipeout from 'react-native-swipeout';
import chatListData from '../data/ChatListData'
import { DEFAULT_AVATAR } from '../constvalue/defineValue';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class ChatListItem extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            activeRowKey: null
        },
        this.friendName = this.props.item.name,
        this.friendUid = this.props.item.uid
    }

    render(){
        var LinearGradient = require('react-native-linear-gradient').default;
        const swipeSetting = {
            backgroundColor: 'transparent',
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if(this.state.activeRowKey != null){
                    this.setState({activeRowKey: null});
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({activeRowKey: this.props.item.key})
            },
            right: [
                {
                    onPress: () => {
                        const deleteKey = this.state.activeRowKey;
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ?',
                            [
                                {text: 'No', onPress: () => console.log(`Cancel press`), style: 'cancel'},
                                {text: 'Yes', onPress: () => {
                                    
                                }}
                            ],
                            {cancelable: true}
                        )
                    },
                    component:
                    (
                        <LinearGradient
                            style={styles.swipeOutButton}
                            colors={['#147fb5', '#15325f']}
                            start={{x: 1.0, y: 1.0 }} end={{x: 0.0, y: 1.0}}>      
                            <Text style = {{color: '#ffffff'}}> Delete </Text>            
                        </LinearGradient>
                    )
                }

            ],
            rowId: this.props.index,
            sectionId: 1
        };
        return(                
            <Swipeout {...swipeSetting}>
                <View style = {{flex: 1, flexDirection: 'column'}}>
                    <TouchableOpacity onPress = {() => this.props.parentFlatList.goToChatRoom('ChatScreen',this.friendName,this.friendUid)}
                        style = {styles.messageItem}>
                        <View style = {{flex: 2}}>
                            <Image 
                                style = {styles.avatarView} 
                                source = {{uri: this.props.item.photoURL ? this.props.item.photoURL : DEFAULT_AVATAR}}>
                            </Image>
                        </View>
                        <View style = {{borderBottomColor:'#e6e9eb',borderBottomWidth: 2, flex: 5,flexDirection: 'column'}}>
                            <View style = {{flex: 1, justifyContent:'flex-end', marginLeft: 5}}>
                                <Text numberOfLines = {1} style = {{fontSize: 17, fontWeight: 'bold'}}> 
                                    {this.props.item.name}
                                </Text> 
                            </View>
                            <View style = {{flex: 1, marginLeft: 5, justifyContent:'flex-start'}}>
                                <Text numberOfLines = {1} style = {{fontSize: 13}}> 
                                    Hello
                                </Text> 
                            </View>
                        </View>
                        <View style = {{borderBottomColor:'#e6e9eb',borderBottomWidth: 2, flex: 2}}>
                            <View style = {{flex: 1, alignItems: 'center', justifyContent:'flex-end'}}>
                                <Text> 
                                    10h30
                                </Text> 
                            </View>
                            <View style = {{flex: 1}}>
                                            
                            </View>
                        </View>
                    </TouchableOpacity>   
                </View>    
            </Swipeout>
        );
    }
}

const styles = StyleSheet.create({
    avatarView:{
        width: 60,
        height: 60,
        borderRadius:Platform.OS === 'android' ? 100 : 30,
        borderWidth: 1,
        borderColor: 'white'
    },
    messageItem: {
        height: 80,
        flexDirection:'row', 
        alignItems:'center',
        marginTop: 5
    },
    swipeOutButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})