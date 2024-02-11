import React from 'react'
import { Stack } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e'
        },
        headerTintColor: '#fff'
      }}>
        <Stack.Screen name='index' options={{ title: 'Pokedex' }} />
        <Stack.Screen name='(pokemon)/[id]' options={{ title: '' }} />
      </Stack>
    </QueryClientProvider>
  )
}

export default Layout