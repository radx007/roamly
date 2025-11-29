import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../api/movieApi';

export const useMovies = (params) => {
  return useQuery({
    queryKey: ['movies', params],
    queryFn: () => movieApi.browseMovies(params),
  });
};

export const useMovieDetails = (id) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieApi.getMovieById(id),
    enabled: !!id,
  });
};

export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: ['featuredMovies'],
    queryFn: movieApi.getFeaturedMovies,
  });
};

export const useRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: movieApi.getRecommendations,
  });
};
