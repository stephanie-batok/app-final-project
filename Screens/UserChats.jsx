import React, { useState, useEffect } from 'react';
import { Text, FlatList,TouchableOpacity,View,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Header, Content, ListItem, Left, Right, Thumbnail,Body,Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiUrl from '../global';


export default function UserChats({navigation}) {
    const [chats,setChats] = useState("");
    const [my_id,setMy_Id] = useState("");


    useEffect(() => {
        AsyncStorage.getItem("@id",(err,result)=>{
            return result !== null ? setMy_Id(JSON.parse(result)) : null;
        });
    },[]);

    useEffect(() => {
        if(my_id!==""){
            fetch(apiUrl+"AppUser/Chats/"+my_id,
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
                    
                    if(result.length!==0){
                        console.log(result);
                        setChats(result);
                    }
                    },
                    (error) => {
                    alert(error);
                }
            );
        }
    }, [my_id]);

    renderItem = ({ item }) => {
        // let dateTime = Date.parse(item.dateTime);
        // let today = new Date();
        // if(dateTime.getDate()===today.getDate()&&dateTime.getMonth()===today.getMonth()&&dateTime.getFullYear()===today.getFullYear()){
        //     dateTime = dateTime.getHours() + ':' + dateTime.getMinutes();
        // }
        // else {
        //     dateTime = new Date(dateTime.getFullYear(),dateTime.getMonth(),dateTime.getDate());
        // }

        if (item.user_id1===my_id) {
          return (
                <ListItem onPress={go2Chat(item.user_id2,item.chat_num)} >
                    <Right>
                        <Icon name="md-person-circle" style={{fontSize: 45}} />
                    </Right>
                        <Body style={{alignItems:'flex-start'}}>
                            <Text style={{fontSize: 15,fontWeight:'bold'}} >{item.user_name2}</Text>
                            <Text note>{item.last_message}</Text>
                        </Body>
                    <Left>
                        <Text>{item.dateTime}</Text>
                        <Text>{"     "}</Text>
                    </Left>
                </ListItem>
          );
        } else {
          return (
                <ListItem onPress={go2Chat(item.user_id1,item.chat_num)} >
                    <Right>
                        <Icon name="md-person-circle" style={{fontSize: 45}} />
                    </Right>
                    <Body style={{alignItems:'flex-start'}} >
                        <Text style={{fontSize: 15,fontWeight:'bold'}}>{item.user_name1}</Text>
                        <Text note>{item.last_message}</Text>
                    </Body>
                    <Left>
                        <Text>{item.dateTime}</Text>
                        <Text>{"     "}</Text>
                    </Left>
                </ListItem>
          );
        }
    };

    const go2Chat = (selectedId,chat_num) => e => {
        navigation.navigate('Chat',{
            SendToId:selectedId,
            my_id:my_id,
            chat_num:chat_num
        });
    }

    const addNewChat = () =>{
        navigation.navigate('ContactList',{
            my_id:my_id,
        });
    }

    return (
        <>
            <FlatList
                data={chats}
                renderItem={this.renderItem}
                keyExtractor={item => item.chat_num.toString()}
            />
            <Ionicons onPress={addNewChat} name="add-circle-outline"/>
        </>
    )
}

