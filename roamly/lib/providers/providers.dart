import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/models.dart';
import '../services/api_service.dart';

// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

// ==================== AUTH STATE ====================
class AuthState {
  final User? user;
  final bool isLoading;
  final String? error;

  AuthState({this.user, this.isLoading = false, this.error});

  AuthState copyWith({User? user, bool? isLoading, String? error}) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// ==================== AUTH NOTIFIER ====================
class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    _checkAuth();
    return AuthState();
  }

  Future<void> _checkAuth() async {
    try {
      state = AuthState(isLoading: true);
      final user = await ref.read(apiServiceProvider).getCurrentUser();
      state = AuthState(user: user);
    } catch (e) {
      state = AuthState();
    }
  }

  Future<void> login(String email, String password) async {
    try {
      state = AuthState(isLoading: true);
      final response = await ref.read(apiServiceProvider).login(LoginRequest(email: email, password: password));
      state = AuthState(user: response.user);
    } catch (e) {
      state = AuthState(error: e.toString());
      rethrow;
    }
  }

  Future<void> register(String name, String email, String password, {String? phoneNumber, List<int>? categoryIds}) async {
    try {
      state = AuthState(isLoading: true);
      final response = await ref.read(apiServiceProvider).register(RegisterRequest(
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        categoryIds: categoryIds,
      ));
      state = AuthState(user: response.user);
    } catch (e) {
      state = AuthState(error: e.toString());
      rethrow;
    }
  }

  Future<void> logout() async {
    await ref.read(apiServiceProvider).logout();
    state = AuthState();
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    final user = state.user;
    if (user == null) return;
    
    try {
      final updatedUser = await ref.read(apiServiceProvider).updateUser(user.id!, data);
      state = AuthState(user: updatedUser);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> refreshUser() async {
    try {
      final user = await ref.read(apiServiceProvider).getCurrentUser();
      state = AuthState(user: user);
    } catch (e) {
      // Handle error silently
    }
  }
}

final authProvider = NotifierProvider<AuthNotifier, AuthState>(() => AuthNotifier());

// Helper to get current user
final currentUserProvider = Provider<User?>((ref) {
  return ref.watch(authProvider).user;
});

// ==================== DESTINATIONS PROVIDERS ====================
final destinationsProvider = FutureProvider<List<Destination>>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getDestinations();
});

final destinationByIdProvider = FutureProvider.family<Destination, int>((ref, id) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getDestinationById(id);
});

final destinationsByCityProvider = FutureProvider.family<List<Destination>, int>((ref, cityId) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getDestinationsByCity(cityId);
});

final recommendedDestinationsProvider = FutureProvider<List<Destination>>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  final user = ref.watch(currentUserProvider);
  
  if (user != null && user.preferences.isNotEmpty) {
    final categoryIds = user.preferences.map((c) => c.id!).toList();
    return apiService.getDestinationsByCategories(categoryIds);
  }
  
  return apiService.getTopRatedDestinations();
});

final topRatedDestinationsProvider = FutureProvider<List<Destination>>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getTopRatedDestinations(minRating: 4.0);
});

// ==================== CATEGORIES PROVIDERS ====================
final categoriesProvider = FutureProvider<List<Category>>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getCategories();
});

// ==================== CITIES PROVIDERS ====================
final citiesProvider = FutureProvider<List<City>>((ref) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getCities();
});

// ==================== HOTELS PROVIDERS ====================
final hotelsByDestinationProvider = FutureProvider.family<List<Hotel>, int>((ref, destinationId) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getHotelsByDestination(destinationId);
});

// ==================== ACTIVITIES PROVIDERS ====================
final activitiesByDestinationProvider = FutureProvider.family<List<Activity>, int>((ref, destinationId) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getActivitiesByDestination(destinationId);
});

// ==================== WEATHER PROVIDERS ====================
final weatherByCoordinatesProvider = FutureProvider.family<Weather, Map<String, double>>((ref, coords) async {
  final apiService = ref.watch(apiServiceProvider);
  return apiService.getWeatherByCoordinates(coords['lat']!, coords['lon']!);
});

// ==================== FAVORITES NOTIFIER ====================
class FavoritesNotifier extends Notifier<Set<int>> {
  @override
  Set<int> build() {
    _loadFavorites();
    return {};
  }

  void _loadFavorites() {
    final user = ref.read(currentUserProvider);
    if (user != null) {
      state = user.favoriteDestinations.map((d) => d.id!).toSet();
    }
  }

  Future<void> toggleFavorite(int destinationId) async {
    final user = ref.read(currentUserProvider);
    if (user == null) return;

    final isFavorite = state.contains(destinationId);
    
    try {
      if (isFavorite) {
        await ref.read(apiServiceProvider).removeFavorite(user.id!, destinationId);
        state = {...state}..remove(destinationId);
      } else {
        await ref.read(apiServiceProvider).addFavorite(user.id!, destinationId);
        state = {...state, destinationId};
      }
      
      // Refresh user data
      await ref.read(authProvider.notifier).refreshUser();
    } catch (e) {
      // Revert on error
      if (isFavorite) {
        state = {...state, destinationId};
      } else {
        state = {...state}..remove(destinationId);
      }
      rethrow;
    }
  }

  bool isFavorite(int destinationId) {
    return state.contains(destinationId);
  }
}

final favoritesProvider = NotifierProvider<FavoritesNotifier, Set<int>>(() => FavoritesNotifier());

// ==================== SEARCH NOTIFIER ====================
class SearchNotifier extends Notifier<String> {
  @override
  String build() => '';

  void updateQuery(String query) {
    state = query;
  }

  void clear() {
    state = '';
  }
}

final searchQueryProvider = NotifierProvider<SearchNotifier, String>(() => SearchNotifier());

final filteredDestinationsProvider = Provider<AsyncValue<List<Destination>>>((ref) {
  final destinationsAsync = ref.watch(destinationsProvider);
  final query = ref.watch(searchQueryProvider).toLowerCase();

  return destinationsAsync.whenData((destinations) {
    if (query.isEmpty) return destinations;
    return destinations.where((d) {
      return d.name.toLowerCase().contains(query) ||
             d.description.toLowerCase().contains(query) ||
             d.city?.name.toLowerCase().contains(query) == true;
    }).toList();
  });
});

// ==================== FILTER STATE ====================
class FilterState {
  final List<int> selectedCategories;
  final double? minRating;
  final int? cityId;

  FilterState({
    this.selectedCategories = const [],
    this.minRating,
    this.cityId,
  });

  FilterState copyWith({
    List<int>? selectedCategories,
    double? minRating,
    int? cityId,
  }) {
    return FilterState(
      selectedCategories: selectedCategories ?? this.selectedCategories,
      minRating: minRating ?? this.minRating,
      cityId: cityId ?? this.cityId,
    );
  }
}

class FilterNotifier extends Notifier<FilterState> {
  @override
  FilterState build() => FilterState();

  void toggleCategory(int categoryId) {
    final categories = List<int>.from(state.selectedCategories);
    if (categories.contains(categoryId)) {
      categories.remove(categoryId);
    } else {
      categories.add(categoryId);
    }
    state = state.copyWith(selectedCategories: categories);
  }

  void setMinRating(double? rating) {
    state = state.copyWith(minRating: rating);
  }

  void setCity(int? cityId) {
    state = state.copyWith(cityId: cityId);
  }

  void reset() {
    state = FilterState();
  }
}

final filterProvider = NotifierProvider<FilterNotifier, FilterState>(() => FilterNotifier());

final filteredAndSearchedDestinationsProvider = Provider<AsyncValue<List<Destination>>>((ref) {
  final destinationsAsync = ref.watch(filteredDestinationsProvider);
  final filter = ref.watch(filterProvider);

  return destinationsAsync.whenData((destinations) {
    var filtered = destinations;

    if (filter.selectedCategories.isNotEmpty) {
      filtered = filtered.where((d) {
        return d.categories.any((c) => filter.selectedCategories.contains(c.id));
      }).toList();
    }

    if (filter.minRating != null) {
      filtered = filtered.where((d) => d.rating >= filter.minRating!).toList();
    }

    if (filter.cityId != null) {
      filtered = filtered.where((d) => d.city?.id == filter.cityId).toList();
    }

    return filtered;
  });
});