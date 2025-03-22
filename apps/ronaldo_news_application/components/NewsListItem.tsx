import { View, Text, Image } from "react-native";
import { Link } from "expo-router";
import {MaterialCommunityIcons} from '@expo/vector-icons';

import { formatDistanceToNow } from "date-fns";

export default function NewsListItem({newsarticle}: {newsarticle: any}) {
    
    
  return (
    
    <View style={{margin: 10, marginTop: 10, backgroundColor: '#FFFF', padding: 10, borderRadius: 10, gap: 10}}>
        <View style={{flexDirection: 'row',}}>
        <View style={{flexShrink: 1, marginRight: 10}}>
        <Image source={require('@assets/images/comets_logo_small.png')} style={{width: 50, height: 50, resizeMode: 'contain'}} />
        {/* this is how you tell react native to show the news article title , you have you use  {}*/}
        <Text style={{fontSize: 18, fontWeight: 'bold',}}>{newsarticle.title}</Text>
        </View>
       
        <Image source={{uri: newsarticle.image}} style={{width: 100, aspectRatio: 1, marginTop: 50, borderRadius: 10, marginLeft: 'auto', }} />
  
        </View>
        
      
      <View style={{flexDirection: 'row', gap: 5}}>
        <Text>{formatDistanceToNow(new Date(newsarticle.created_at), {addSuffix: true})}</Text>
        <Text>- By {newsarticle.author.name}</Text>
        <MaterialCommunityIcons name="dots-horizontal" size={24} color="grey" marginLeft='auto' /> 
      </View>
      {/* This is the link to open the Modal , what is inside the link, is clickable and will open the modal*/}
      <Link href="/App_news/reportagem">
      <Text style={styles.link}>read more...</Text>
      </Link>
    </View>
  );
}

const styles = ({
    
    
    link: {
      paddingTop: 20,
      fontSize: 12,
    },
  });