import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { Pokemon, getPokemonDetails } from '@/api/pokeapi'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [isFavorite, setIsFavorite] = useState(false)
  const navigation = useNavigation()

  const { data } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemonDetails(+id!),
    // keepPreviousData: removed in favor of `placeholderData` identity function, 
    // reference: https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function
    placeholderData: keepPreviousData
    // onSuccess: is not longer supported, so we will depend of a useEffect below
    // reference: https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-4#onsuccess-is-no-longer-called-from-setquerydata
  })

  useEffect(() => {
    navigation.setOptions({
      title: data.name.charAt(0).toUpperCase() + data.name.slice(1)
    })
  }, [data])


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? 'star' : 'star-outline'} size={22} color="#fff" />
        </Text>
      )
    })
  }, [isFavorite])

  const toggleFavorite = async () => {
    await AsyncStorage.setItem(`favorite-${id}`, isFavorite ? 'false' : 'true')
    setIsFavorite(prev => !prev)
  }

  return (
    <View style={{ padding: 10 }}>
      {
        data && (
          <>
            <View style={[styles.card, { alignItems: 'center' }]}>
              <Image source={{ uri: data.sprites.front_default }} style={{ width: 200, height: 200 }} />
              <Text style={styles.name}>
                #{data.id} {data.name}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stats: </Text>
              {
                data.stats.map((item: any) => (
                  <Text key={item.stat.name}>
                    {item.stat.name}: {item.base_stat}
                  </Text>
                ))
              }
            </View>
          </>
        )
      }
    </View>
  )
}

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
})

export default Page