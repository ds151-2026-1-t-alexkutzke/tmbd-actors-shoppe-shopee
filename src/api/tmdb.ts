import axios from 'axios';

// A chave deve ser gerada no painel do themoviedb.org
const TMDB_API_KEY = '6dca8eaddeb8c96f6414f786f944b5fd';

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: TMDB_API_KEY,
    language: 'pt-BR',
  },
});
