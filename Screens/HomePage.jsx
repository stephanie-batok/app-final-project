import React, { useState, useEffect } from 'react';
import { Text,TouchableOpacity,View,StyleSheet} from 'react-native';
import {Card, CardItem, Body} from 'native-base';
import {Agenda} from 'react-native-calendars';


export default function HomePage({navigation}) {

    const renderItem = (item)=> {
        return (
          <TouchableOpacity
            onPress={() => alert(item.name)}
          >
              <Card style={styles.item}>
                  <CardItem>
                          <Body>
                            <Text>{item.name}</Text>
                          </Body>
                  </CardItem>
              </Card>
          </TouchableOpacity>
        );
    }
    


    return (
        <View style={styles.container}>
           <Text>home page</Text>
            <Agenda
                items={{
                 '2021-04-07': [{ name: 'item 3 - any js object' },{ name: 'item 4 - any js object' }],
                 '2021-04-08': [{ name: 'item 3 - any js object' },{ name: 'item 4 - any js object' }],
                }}
                hideKnob={true}
                renderItem={(item,firstItemInDay)=> renderItem(item,firstItemInDay)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    }
})

