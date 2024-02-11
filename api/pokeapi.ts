export interface Pokemon {
  name: string;
  url: string;
  id: number;
  image: string;
  sprites?: any;
  abilities?: any;
  stats?: any;
}

export const getPokemon = async (limit = 150) => {
  await delay(200 + Math.floor(Math.random() * 2000));
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );

  const data = await response.json();
  return data.results.map((pokemon: Pokemon, index: number) => ({
    ...pokemon,
    id: index + 1,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
      index + 1
    }.png`
  }));
};

export const getPokemonDetails = async (id: number) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

  const data = await response.json();
  return data;
};

const delay = (time: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
};
