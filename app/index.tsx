import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Pokemon, getPokemon } from '@/api/pokeapi';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';


const Page = () => {
  const pokemonQuery = useQuery<Pokemon[]>({
    queryKey: ['pokemon'],
    queryFn: () => getPokemon(),
    refetchOnMount: false
  })

  return (
    <ScrollView>
      {pokemonQuery.isLoading && <ActivityIndicator style={{ marginTop: 3 }} />}
      {
        pokemonQuery.data && pokemonQuery.data.map((pokemon) => (
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