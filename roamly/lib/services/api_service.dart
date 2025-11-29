import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/models.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:9090/api'; // Change this to your backend URL
  final Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  ApiService() : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 30),
    receiveTimeout: const Duration(seconds: 30),
    headers: {
      'Content-Type': 'application/json',
    },
  )) {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Try to refresh token
          final refreshed = await _refreshToken();
          if (refreshed) {
            // Retry the request
            final opts = error.requestOptions;
            final token = await _storage.read(key: 'access_token');
            opts.headers['Authorization'] = 'Bearer $token';
            try {
              final response = await _dio.fetch(opts);
              return handler.resolve(response);
            } catch (e) {
              return handler.next(error);
            }
          }
        }
        return handler.next(error);
      },
    ));
  }

  // ==================== AUTH ====================
  Future<AuthResponse> login(LoginRequest request) async {
    try {
      final response = await _dio.post('/auth/login', data: request.toJson());
      final authResponse = AuthResponse.fromJson(response.data);
      await _storage.write(key: 'access_token', value: authResponse.accessToken);
      await _storage.write(key: 'refresh_token', value: authResponse.refreshToken);
      return authResponse;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<AuthResponse> register(RegisterRequest request) async {
    try {
      final response = await _dio.post('/auth/register', data: request.toJson());
      final authResponse = AuthResponse.fromJson(response.data);
      await _storage.write(key: 'access_token', value: authResponse.accessToken);
      await _storage.write(key: 'refresh_token', value: authResponse.refreshToken);
      return authResponse;
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await _storage.read(key: 'refresh_token');
      if (refreshToken == null) return false;
      
      final response = await _dio.post('/auth/refresh', data: {'refreshToken': refreshToken});
      final accessToken = response.data['accessToken'];
      await _storage.write(key: 'access_token', value: accessToken);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    } finally {
      await _storage.delete(key: 'access_token');
      await _storage.delete(key: 'refresh_token');
    }
  }

  // ==================== USERS ====================
  Future<User> getCurrentUser() async {
    try {
      final response = await _dio.get('/users/me');
      return User.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<User> getUserById(int id) async {
    try {
      final response = await _dio.get('/users/$id');
      return User.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<User> updateUser(int id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/users/$id', data: data);
      return User.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> addFavorite(int userId, int destinationId) async {
    try {
      await _dio.post('/users/$userId/favorites/$destinationId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> removeFavorite(int userId, int destinationId) async {
    try {
      await _dio.delete('/users/$userId/favorites/$destinationId');
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<User>> getAllUsers() async {
    try {
      final response = await _dio.get('/users');
      return (response.data as List).map((e) => User.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteUser(int id) async {
    try {
      await _dio.delete('/users/$id');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ==================== CITIES ====================
  Future<List<City>> getCities() async {
    try {
      final response = await _dio.get('/cities');
      return (response.data as List).map((e) => City.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<City> getCityById(int id) async {
    try {
      final response = await _dio.get('/cities/$id');
      return City.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<City> createCity(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/cities', data: data);
      return City.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<City> updateCity(int id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/cities/$id', data: data);
      return City.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteCity(int id) async {
    try {
      await _dio.delete('/cities/$id');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ==================== DESTINATIONS ====================
  Future<List<Destination>> getDestinations() async {
    try {
      final response = await _dio.get('/destinations');
      return (response.data as List).map((e) => Destination.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Destination> getDestinationById(int id) async {
    try {
      final response = await _dio.get('/destinations/$id');
      return Destination.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Destination>> getDestinationsByCity(int cityId) async {
    try {
      final response = await _dio.get('/destinations/city/$cityId');
      return (response.data as List).map((e) => Destination.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Destination>> getDestinationsByCategories(List<int> categoryIds) async {
    try {
      final response = await _dio.get('/destinations/categories', 
        queryParameters: {'categoryIds': categoryIds.join(',')});
      return (response.data as List).map((e) => Destination.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Destination>> getTopRatedDestinations({double minRating = 4.5}) async {
    try {
      final response = await _dio.get('/destinations/top-rated', 
        queryParameters: {'minRating': minRating});
      return (response.data as List).map((e) => Destination.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Destination> createDestination(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/destinations', data: data);
      return Destination.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Destination> updateDestination(int id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/destinations/$id', data: data);
      return Destination.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteDestination(int id) async {
    try {
      await _dio.delete('/destinations/$id');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ==================== CATEGORIES ====================
  Future<List<Category>> getCategories() async {
    try {
      final response = await _dio.get('/categories');
      return (response.data as List).map((e) => Category.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Category> getCategoryById(int id) async {
    try {
      final response = await _dio.get('/categories/$id');
      return Category.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Category> createCategory(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/categories', data: data);
      return Category.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Category> updateCategory(int id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/categories/$id', data: data);
      return Category.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteCategory(int id) async {
    try {
      await _dio.delete('/categories/$id');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ==================== HOTELS ====================
  Future<List<Hotel>> getHotels() async {
    try {
      final response = await _dio.get('/hotels');
      return (response.data as List).map((e) => Hotel.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Hotel> getHotelById(int id) async {
    try {
      final response = await _dio.get('/hotels/$id');
      return Hotel.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Hotel>> getHotelsByDestination(int destinationId) async {
    try {
      final response = await _dio.get('/hotels/destination/$destinationId');
      return (response.data as List).map((e) => Hotel.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Hotel>> getHotelsByPriceRange(int destinationId, double minPrice, double maxPrice) async {
    try {
      final response = await _dio.get('/hotels/destination/$destinationId/price-range',
        queryParameters: {'minPrice': minPrice, 'maxPrice': maxPrice});
      return (response.data as List).map((e) => Hotel.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Hotel> createHotel(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/hotels', data: data);
      return Hotel.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Hotel> updateHotel(int id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/hotels/$id', data: data);
      return Hotel.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> toggleHotelAvailability(int id) async {
    try {
      await _dio.patch('/hotels/$id/toggle-availability');
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteHotel(int id) async {
    try {
      await _dio.delete('/hotels/$id');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ==================== ACTIVITIES ====================
  Future<List<Activity>> getActivities() async {
    try {
      final response = await _dio.get('/activities');
      return (response.data as List).map((e) => Activity.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Activity> getActivityById(int id) async {
    try {
      final response = await _dio.get('/activities/$id');
      return Activity.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Activity>> getActivitiesByDestination(int destinationId) async {
    try {
      final response = await _dio.get('/activities/destination/$destinationId');
      return (response.data as List).map((e) => Activity.fromJson(e)).toList();
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Activity> createActivity(Map<String, dynamic> data) async {
    try {
      final response = await _dio.post('/activities', data: data);
      return Activity.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Activity> updateActivity(int id, Map<String, dynamic> data) async {
    try {
      final response = await _dio.put('/activities/$id', data: data);
      return Activity.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> toggleActivityAvailability(int id) async {
    try {
      await _dio.patch('/activities/$id/toggle-availability');
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteActivity(int id) async {
    try {
      await _dio.delete('/activities/$id');
    } catch (e) {
      throw _handleError(e);
    }
  }

  // ==================== WEATHER ====================
  Future<Weather> getWeatherByCoordinates(double lat, double lon) async {
    try {
      final response = await _dio.get('/weather/coordinates',
        queryParameters: {'lat': lat, 'lon': lon});
      return Weather.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Weather> getWeatherByCity(String cityName) async {
    try {
      final response = await _dio.get('/weather/city/$cityName');
      return Weather.fromJson(response.data);
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Error Handler
  String _handleError(dynamic error) {
    if (error is DioException) {
      if (error.response != null) {
        return error.response?.data['message'] ?? 'An error occurred';
      } else {
        return 'Network error. Please check your connection.';
      }
    }
    return error.toString();
  }
}