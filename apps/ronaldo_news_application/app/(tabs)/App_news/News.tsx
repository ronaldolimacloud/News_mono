
import {View , Text, FlatList} from 'react-native';
import NewsListItem from '@/components/NewsListItem';
{/* this is importing the allNews.json file with the news contents we wrote in the json file*/}
import allNews from '@assets/data/allNews.json';



export default function News() {
  
  return (
    <View>
      {/* Flatalist picks up all the articles in the allNews.json file and renders them in the NewsListItem component */}
      <FlatList data={allNews} renderItem={({item}) => <NewsListItem newsarticle={item} />}
      
      />
    </View>
  );
}

