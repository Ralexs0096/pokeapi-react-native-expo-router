import { Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { storage } from '@/storage/mmkv';
import { getPokemonDetails, Pokemon } from '@/api/pokeapi';

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

  return (
    <ScrollView>
      {pokemonQueries.map((query) => (
        <Text key={`${query?.data?.id}-${query?.data?.name}`}>
          {query?.data?.name ?? 'test'}
        </Text>
      ))}
    </ScrollView>
  );
};

export default Page;
