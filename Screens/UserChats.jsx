import React, { useState, useEffect} from 'react';
import { Text, FlatList,TouchableOpacity,View,StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {ListItem, Right,Left, Body, Icon,Thumbnail,Separator } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiUrl, {uplodedPicPath} from '../global';


export default function UserChats({navigation}) {
    const [chats,setChats] = useState([]);
    const [my_id,setMy_Id] = useState("");


    useEffect(() => {
        AsyncStorage.getItem("@id",(err,result)=>{
            return result !== null ? setMy_Id(JSON.parse(result)) : null;
        });
    },[]);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            if(my_id!=="" && isActive){
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

            return () => {
                isActive = false;
            };

        }, [my_id])
    );

    renderItem = ({ item }) => {
        let day = new Date().getDate();
        let month = new Date().getMonth();
        let year = new Date().getFullYear();
        let date = day + "." + (month+1) + "." + year;

        if(date===item.dateStr){
            dateTime = item.timeStr;
        }
        else {
            dateTime = item.dateStr;
        }

        if (item.user_id1===my_id) {
          return (
            <>
                <ListItem thumbnail onPress={go2Chat(item.user_id2,item.chat_num)} >
                    <Left>
                        <Thumbnail source={{ uri: uplodedPicPath+item.user_profile2 }} />
                    </Left>
                    <Body style={{alignItems:'flex-start'}}>
                        <Text style={{fontSize: 15,fontWeight:'bold'}} >{item.user_name2}</Text>
                        <Text note numberOfLines={1}>{item.last_message}</Text>
                    </Body>
                    <Right>
                        <Text note>{dateTime}</Text>
                    </Right>
                </ListItem>
            </>
          );
        } else {
          return (
            <>
                <ListItem thumbnail onPress={go2Chat(item.user_id1,item.chat_num)} >
                    <Left>
                        <Thumbnail source={{ uri: uplodedPicPath+item.user_profile1 }} />
                    </Left>
                    <Body style={{alignItems:'flex-start'}} >
                        <Text style={{fontSize: 15,fontWeight:'bold'}}>{item.user_name1}</Text>
                        <Text note numberOfLines={1}>{item.last_message}</Text>
                    </Body>
                    <Right>
                        <Text note>{dateTime}</Text>
                    </Right>
                </ListItem>
            </>
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

    return (
        <>
            {chats.length>0?
            <FlatList
                data={chats}
                renderItem={this.renderItem}
                keyExtractor={item => item.chat_num.toString()}
            />:null}
        </>
    )
}

