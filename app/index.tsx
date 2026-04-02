import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { Link } from 'expo-router';
import { api } from '../src/api/tmdb';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovies = async (query: string = '') => {
    setIsLoading(true);
    try {
      // Alterna entre a rota de busca e a rota de filmes populares
      const endpoint = query.trim() ? '/search/movie' : '/movie/popular';
      const response = await api.get(endpoint, {
        params: query.trim() ? { query } : {},
      });
      setMovies(response.data.results);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega os filmes populares ao montar a tela
  useEffect(() => {
    fetchMovies();
  }, []);

  const handleSearch = () => {
    fetchMovies(searchQuery);
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    // Link do Expo Router passando o ID do filme como parâmetro dinâmico
    <Link href={`/movie/${item.id}`} asChild>
      <Pressable style={styles.card}>
        {item.poster_path ? (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
            style={styles.poster}
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderText}>Sem Imagem</Text>
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.date}>
            {item.release_date ? item.release_date.substring(0, 4) : 'N/A'}
          </Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar filmes..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : (
        <FlatList
          style={{ flexDirection: 'row' }}
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: { padding: 16, backgroundColor: '#1F1F1F' },
  searchInput: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  poster: { width: 100, height: 150 },
  posterPlaceholder: {
    width: 100,
    height: 150,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#9CA3AF', fontSize: 12 },
  cardContent: { flex: 1, padding: 16, justifyContent: 'center' },
  date: { color: '#9CA3AF', fontSize: 14 },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});
