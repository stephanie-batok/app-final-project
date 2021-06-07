import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {db, auth} from '../fireB';
import apiUrl from '../global';


export default function Chat({route,navigation}) {
    const { SendToId, my_id, chat_num } = route.params;
    const [sendToToken,setSendToToken] = useState("");
    const [messages,setMessages] = useState([]);


    useLayoutEffect(() => {
        const unsubscribe = db.collection('chat_'+chat_num)
                            .orderBy('createdAt', 'desc')
                            .onSnapshot(snapshot => setMessages(
                                snapshot.docs.map(doc => ({
                                _id: doc.data()._id,
                                createdAt: doc.data().createdAt.toDate(),
                                text: doc.data().text,
                                user: doc.data().user,
                                }))
                            ));
        return unsubscribe;
    }, []);

    const onSend = useCallback((messages = []) => {
        //שליפת טוקן מהדאטה בייס
        fetch(apiUrl+"AppUser/Token/"+SendToId,
            {
                method: 'GET',
                headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                return res.json();
            })
            .then((result) => {
                setSendToToken(result);
                console.log(result);
                },
                (error) => {
                console.log(error);
            }
        );
        
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const {
            _id,
            createdAt,
            text,
            user,
        } = messages[0];

        console.log(messages[0]);

        db.collection('chat_'+chat_num).add({
            _id,
            createdAt,
            text,
            user
        });

        const chat = {
            chat_num:chat_num,
            dateTime:createdAt,
            last_message:text,
        }

        fetch(apiUrl+"AppUser/Chats/",
            {
                method: 'PUT',
                body: JSON.stringify(chat),
                headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
                })
            })
            .then(res => {
                return res.json();
            })
            .then((result) => {
                console.log(result);
                },
                (error) => {
                alert(error);
            }
        );
    }, []);

    useEffect(() => {
        
        if(sendToToken!==""){
            let pnd = {
                to: sendToToken,
                title: 'מועדון רכיבה רעננה',
                body: "התקבלה הודעה חדשה",
                badge: 4,
                data: { chat_num:chat_num, from_id:my_id ,action:"chat" }
            };

            fetch(apiUrl+"AppUser/PushNotification",
                {
                    method: 'POST',
                    body: JSON.stringify(pnd),
                    headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                    })
                })
                .then(res => {
                    return res.json();
                })
                .then((result) => {
                    console.log(result);
                    },
                    (error) => {
                    console.log(error);
                }
            );
        }
    },[sendToToken]);


    return (
           <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={newMessage => onSend(newMessage)}
                user={{
                    _id: auth?.currentUser?.email,
                    name: auth?.currentUser?.displayName,
                    avatar: auth?.currentUser?.photoURL
                }}
            />
    )
}

