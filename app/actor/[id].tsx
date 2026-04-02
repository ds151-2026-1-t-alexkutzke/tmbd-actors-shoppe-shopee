import { Link, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, Pressable, FlatList } from 'react-native';
import { api } from '../../src/api/tmdb';
import { Movie } from '..';

interface ActorDetails {
  gender: number;
  id: number;
  also_known_as: string[]
  name: string;
  biography: string;
  popularity: number;
  profile_path: string;
  character: string;
  birthday: string;
  deathday: string;
}


export default function ActorDetailsScreen() {
  // Captura o parâmetro '[id]' do nome do arquivo
  const { id } = useLocalSearchParams();
  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await api.get(`/person/${id}`);
        setActor(response.data);
        const responseMovies = await api.get(`/person/${id}/movie_credits`);
        setMovies(responseMovies.data.cast);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]); // O hook é re-executado caso o ID mude

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

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
    <ScrollView style={styles.container}>
      {actor.profile_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{actor.name}</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statText}>⭐ {actor.popularity}</Text>
          <Text style={styles.statText}>⏱️ {actor.birthday} -- {actor.deathday ? actor.deathday : "presente"}</Text>
        </View>

        <Text style={styles.sectionTitle}>biografia</Text>
        <Text style={styles.overview}>
          {actor.biography || 'Biografia Indisponível'}
        </Text>
      </View>

      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.listContainer}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: 100, height: 150 },
  content: { padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statText: { color: '#E50914', fontSize: 16, fontWeight: '600' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  overview: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  errorText: { color: '#FFFFFF', fontSize: 18 },
  posterPlaceholder: {
    width: 100,
    height: 150,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#9CA3AF', fontSize: 12 },
  card: {
    flexDirection: 'column',
    maxWidth: 200,
    backgroundColor: '#1F1F1F',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: { flex: 1, padding: 16, justifyContent: 'center' },
  date: { color: '#9CA3AF', fontSize: 14 },
  listContainer: { padding: 16 },
});
