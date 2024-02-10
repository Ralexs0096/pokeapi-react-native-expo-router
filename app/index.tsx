import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Pokemon, getPokemon } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';

const Page = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])

  useEffect(() => {
    const load = async () => {
      const result = await getPokemon();
      setPokemon(result)
    }
    load();
  }, [])

  return (
    <ScrollView>
      {
        pokemon.map((pokemon) => (
          <Link href={`/(pokemon)/${pokemon.id}`} key={pokemon.id} asChild>
            <TouchableOpacity>
              <View style={styles.item}>
                <Image source={{ uri: pokemon.image }} style={styles.preview} />
                <Text style={styles.itemText}>{pokemon.name}</Text>
                <Ionicons name='chevron-forward' size={24} />
              </View>
            </TouchableOpacity>
          </Link>
        ))
      }
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
})

export default Page;