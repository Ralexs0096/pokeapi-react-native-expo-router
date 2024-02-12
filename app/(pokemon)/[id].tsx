import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Pokemon, getPokemonDetails } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { storage } from '@/storage/mmkv';
import { useMMKVBoolean } from 'react-native-mmkv';
import Animated, {
  FadeIn,
  FadeInDown,
  FlipInEasyX
} from 'react-native-reanimated';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useMMKVBoolean(`favorite-${id}`, storage);
  const navigation = useNavigation();

  const { data } = useQuery<Pokemon>({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonDetails(+id!),
    // keepPreviousData: removed in favor of `placeholderData` identity function,
    // reference: https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function
    placeholderData: keepPreviousData,
    // onSuccess: is not longer supported, so we will depend of a useEffect below
    // reference: https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
    refetchOnMount: false
  });

  // onSuccess - latest tankStack query implementation
  useEffect(() => {
    if (data) {
      navigation.setOptions({
        title: data.name.charAt(0).toUpperCase() + data.name.slice(1)
      });
    }
  }, [data]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={22}
            color="#fff"
          />
        </Text>
      )
    });
  }, [isFavorite]);

  const toggleFavorite = async () => {
    setIsFavorite(isFavorite ? false : true);
  };

  return (
    <View style={{ padding: 10 }}>
      {data && (
        <>
          {isFavorite}
          <Animated.View
            style={[styles.card, { alignItems: 'center' }]}
            entering={FadeIn.delay(200)}
          >
            <Image
              source={{ uri: data.sprites.front_default }}
              style={{ width: 200, height: 200 }}
            />
            <Animated.Text
              style={styles.name}
              entering={FlipInEasyX.delay(300)}
            >
              #{data.id} {data.name}
            </Animated.Text>
          </Animated.View>
          <Animated.View style={styles.card} entering={FadeInDown.delay(500)}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stats: </Text>
            {data.stats.map((item: any) => (
              <Text key={item.stat.name}>
                {item.stat.name}: {item.base_stat}
              </Text>
            ))}
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    elevation: 1,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    shadowOffset: {
      width: 0,
      height: 1
    }
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  }
});

export default Page;
