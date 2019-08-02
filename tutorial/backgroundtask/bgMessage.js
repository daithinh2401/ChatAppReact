// @flow
import firebase from 'react-native-firebase';
import FCM, { FCMEvent } from "react-native-fcm";

export default async (message) => {
    const channel = new firebase.notifications.Android.Channel('channel_id_background', 'Test Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('My apps test channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel);

    // handle your message
    // const showNotif = new firebase.notifications.Notification()
    //     .setNotificationId(new Date().valueOf().toString())
    //     .setTitle(message.data.title)
    //     .setBody(message.data.text)
    //     .android.setChannelId('channel_id_foreground')
    //     .android.setLargeIcon(message.data.icon);


    // firebase.notifications().displayNotification(showNotif);

    FCM.presentLocalNotification({
        channel: 'channel_id_foreground',
        id: new Date().valueOf().toString(), // (optional for instant notification)
        title: message.data.title, // as FCM payload
        body: message.data.text, // as FCM payload (required)
        //sound: "bell.mp3", // "default" or filename
        priority: "high", // as FCM payload
        click_action: message.data.action, // as FCM payload - this is used as category identifier on iOS.
        // badge: 10, // as FCM payload IOS only, set 0 to clear badges
        // number: 10, // Android only
        //ticker: "My Notification Ticker", // Android only
        //auto_cancel: true, // Android only (default true)
        large_icon: message.data.icon, // Android only
        icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap             
        wake_screen: true, // Android only, wake up screen when notification arrives
        show_in_foreground: true, // notification when app is in foreground (local & remote)
        my_data: {
            name: message.data.senderName,
            uid: message.data.senderUid
        }
    });
    
    return Promise.resolve(message);
}