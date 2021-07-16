import React, { useState, useEffect } from 'react';
import { Text,FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ListItem,Thumbnail,Body,Left,Right} from 'native-base';
import apiUrl,{uplodedPicPath} from '../global';


export default function ContactList({navigation}) {
    const [my_id,setMy_Id] = useState("");
    const [contacts,setContacts] = useState([]);
    const [chat_num,setChat_num] = useState("");
    const [sendToId,setSendToId] = useState("");

    
    useEffect(() => {
        AsyncStorage.getItem("@id",(err,result)=>{
            return result !== null ? setMy_Id(JSON.parse(result)) : null;
        });
    },[]);


    useEffect(() => {
        if(my_id!==""){
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
                    console.log(error);
                }
            );
        }
    }, [my_id]);

    renderItem = ({ item }) => {
        return (
                <ListItem avatar onPress={go2Chat(item.id)}>
                    <Left>
                        <Thumbnail style={{width: 35, height: 35,marginBottom:8}} source={{ uri: uplodedPicPath+item.profileImg }} />
                    </Left>
                    <Body style={{alignItems:'flex-start'}}>
                        <Text>{item.first_name+" "+item.last_name}</Text>
                    </Body>
                    <Right></Right>
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
            keyExtractor={item => item.id.toString()}
        >
        </FlatList>
    )
}
