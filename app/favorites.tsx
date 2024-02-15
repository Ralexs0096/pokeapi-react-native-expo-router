import {
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { storage } from '@/storage/mmkv';
import { getPokemonDetails, Pokemon } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  LinearTransition,
  SlideOutLeft
} from 'react-native-reanimated';

const Page = () => {
  const [keys, setKeys] = useState(storage.getAllKeys());
  const [data, setData] = useState<Pokemon[]>([]);

  const pokemonQueries = useQueries({
    queries: keys.map((key) => {
      const pokemonId = key.split('-')[1];
      return {
        queryKey: ['pokemon', pokemonId],
        queryFn: () => getPokemonDetails(+pokemonId)
      };
    })
  });

  const allFinished = pokemonQueries.every((query) => query.isSuccess);

  useEffect(() => {
    if (allFinished) {
      setData(pokemonQueries.map((query) => query.data));
    }
  }, [allFinished]);

  const removeFavorite = (id: number) => {
    storage.delete(`favorite-${id}`);
    setData((prev) => {
      return prev.filter((pokemon) => pokemon.id !== id);
    });
  };

  return (
    <ScrollView>
      {data.map(({ name, id, sprites }, index) => (
        <Animated.View
          key={id}
          layout={LinearTransition.delay(200)}
          entering={FadeIn.delay(100 * index)}
          exiting={SlideOutLeft.duration(200)}
          style={styles.item}
        >
          <Image
            source={{ uri: sprites.front_default }}
            style={styles.preview}
          />
          <Text style={styles.itemText}>{name}</Text>
          <TouchableOpacity onPress={() => removeFavorite(id)}>
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  preview: {
    width: 100,
    height: 100
  },
  itemText: {
    fontSize: 18,
    textTransform: 'capitalize',
    flex: 1
  }
});

export default Page;
