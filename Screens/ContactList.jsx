import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet,FlatList} from 'react-native';
import { Container, Content, ListItem } from 'native-base';
import apiUrl from '../global';


export default function ContactList({route,navigation}) {
    const {my_id} = route.params;
    const [contacts,setContacts] = useState([]);
    const [chat_num,setChat_num] = useState("");
    const [sendToId,setSendToId] = useState("");


    useEffect(() => {
        fetch(apiUrl+"SystemUser/",
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
                    let temp = result.filter(x=>x.id!==my_id);
                    setContacts(temp);
                },
                (error) => {
                alert(error);
            }
        );
    }, []);

    renderItem = ({ item }) => {
          return (
                <ListItem onPress={go2Chat(item.id)}>
                    <Text>{item.first_name+" "+item.last_name}</Text>
                </ListItem>
          );
    };

    const go2Chat = (selectedId) => e => {
        setSendToId(selectedId);

        let newChat = {
            last_message:"",
            user_id1:my_id,
            user_id2:selectedId
        };

        fetch(apiUrl+"AppUser/Chats",
            {
                method: 'POST',
                body: JSON.stringify(newChat),
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
                setChat_num(result);
            },
            (error) => {
            console.log(error);
            }
        );
    }

    useEffect(() => {

        if(chat_num!==""){
            navigation.navigate('Chat',{
                SendToId:sendToId,
                my_id:my_id,
                chat_num:chat_num
            });
        }
    },[chat_num]);

    return (
        <FlatList
            data={contacts}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
        >
        </FlatList>
    )
}
