import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { Link } from 'expo-router';
import { Pokemon, getPokemon } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

const Page = () => {
  const pokemonQuery = useQuery<Pokemon[]>({
    queryKey: ['pokemon'],
    queryFn: () => getPokemon(),
    refetchOnMount: false
  });

  const renderItem: ListRenderItem<Pokemon> = ({ item }) => (
    <Link href={`/(pokemon)/${item.id}`} key={item.id} asChild>
      <TouchableOpacity>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.preview} />
          <Text style={styles.itemText}>{item.name}</Text>
          <Ionicons name="chevron-forward" size={24} />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={{ flex: 1 }}>
      {pokemonQuery.isLoading && <ActivityIndicator style={{ marginTop: 3 }} />}

      <FlashList
        data={pokemonQuery.data}
        renderItem={renderItem}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, width: '100%', backgroundColor: '#dfdfdf' }}
          />
        )}
      />
    </View>
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
