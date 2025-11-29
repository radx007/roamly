// User Model
class User {
  final int? id;
  final String name;
  final String email;
  final String? phoneNumber;
  final String? avatarUrl;
  final List<Category> preferences;
  final List<Destination> favoriteDestinations;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  User({
    this.id,
    required this.name,
    required this.email,
    this.phoneNumber,
    this.avatarUrl,
    this.preferences = const [],
    this.favoriteDestinations = const [],
    this.createdAt,
    this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phoneNumber: json['phoneNumber'],
      avatarUrl: json['avatarUrl'],
      preferences: (json['preferences'] as List?)?.map((e) => Category.fromJson(e)).toList() ?? [],
      favoriteDestinations: (json['favoriteDestinations'] as List?)?.map((e) => Destination.fromJson(e)).toList() ?? [],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'phoneNumber': phoneNumber,
    'avatarUrl': avatarUrl,
  };

  User copyWith({
    int? id,
    String? name,
    String? email,
    String? phoneNumber,
    String? avatarUrl,
    List<Category>? preferences,
    List<Destination>? favoriteDestinations,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      preferences: preferences ?? this.preferences,
      favoriteDestinations: favoriteDestinations ?? this.favoriteDestinations,
    );
  }
}

// Category Model
class Category {
  final int? id;
  final String name;
  final String? description;
  final String? icon;

  Category({
    this.id,
    required this.name,
    this.description,
    this.icon,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'],
      icon: json['icon'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'icon': icon,
  };
}

// City Model
class City {
  final int? id;
  final String name;
  final String? description;
  final double latitude;
  final double longitude;

  City({
    this.id,
    required this.name,
    this.description,
    required this.latitude,
    required this.longitude,
  });

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'],
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'latitude': latitude,
    'longitude': longitude,
  };
}

// Destination Model
class Destination {
  final int? id;
  final String name;
  final String description;
  final City? city;
  final double latitude;
  final double longitude;
  final String? address;
  final double rating;
  final int reviewCount;
  final List<String> images;
  final List<Category> categories;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Destination({
    this.id,
    required this.name,
    required this.description,
    this.city,
    required this.latitude,
    required this.longitude,
    this.address,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.images = const [],
    this.categories = const [],
    this.createdAt,
    this.updatedAt,
  });

  factory Destination.fromJson(Map<String, dynamic> json) {
    return Destination(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      city: json['city'] != null ? City.fromJson(json['city']) : null,
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      address: json['address'],
      rating: (json['rating'] ?? 0).toDouble(),
      reviewCount: json['reviewCount'] ?? 0,
      images: (json['images'] as List?)?.map((e) => e.toString()).toList() ?? [],
      categories: (json['categories'] as List?)?.map((e) => Category.fromJson(e)).toList() ?? [],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'city': city?.toJson(),
    'latitude': latitude,
    'longitude': longitude,
    'address': address,
    'rating': rating,
    'reviewCount': reviewCount,
    'images': images,
    'categories': categories.map((e) => e.toJson()).toList(),
  };
}

// Hotel Model
class Hotel {
  final int? id;
  final String name;
  final String address;
  final String? description;
  final double pricePerNight;
  final double rating;
  final int reviewCount;
  final double distanceKm;
  final bool isAvailable;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Hotel({
    this.id,
    required this.name,
    required this.address,
    this.description,
    required this.pricePerNight,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.distanceKm = 0.0,
    this.isAvailable = true,
    this.createdAt,
    this.updatedAt,
  });

  factory Hotel.fromJson(Map<String, dynamic> json) {
    return Hotel(
      id: json['id'],
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      description: json['description'],
      pricePerNight: (json['pricePerNight'] ?? 0).toDouble(),
      rating: (json['rating'] ?? 0).toDouble(),
      reviewCount: json['reviewCount'] ?? 0,
      distanceKm: (json['distanceKm'] ?? 0).toDouble(),
      isAvailable: json['isAvailable'] ?? true,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'address': address,
    'description': description,
    'pricePerNight': pricePerNight,
    'rating': rating,
    'reviewCount': reviewCount,
    'distanceKm': distanceKm,
    'isAvailable': isAvailable,
  };
}

// Activity Model
class Activity {
  final int? id;
  final String name;
  final String description;
  final String? imageUrl;
  final bool isAvailable;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Activity({
    this.id,
    required this.name,
    required this.description,
    this.imageUrl,
    this.isAvailable = true,
    this.createdAt,
    this.updatedAt,
  });

  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      id: json['id'],
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'],
      isAvailable: json['isAvailable'] ?? true,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : null,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'imageUrl': imageUrl,
    'isAvailable': isAvailable,
  };
}

// Weather Model
class Weather {
  final String cityName;
  final double temperature;
  final String description;
  final String icon;
  final double humidity;
  final double windSpeed;
  final double feelsLike;

  Weather({
    required this.cityName,
    required this.temperature,
    required this.description,
    required this.icon,
    required this.humidity,
    required this.windSpeed,
    required this.feelsLike,
  });

  factory Weather.fromJson(Map<String, dynamic> json) {
    return Weather(
      cityName: json['name'] ?? '',
      temperature: (json['main']['temp'] ?? 0).toDouble(),
      description: json['weather'][0]['description'] ?? '',
      icon: json['weather'][0]['icon'] ?? '',
      humidity: (json['main']['humidity'] ?? 0).toDouble(),
      windSpeed: (json['wind']['speed'] ?? 0).toDouble(),
      feelsLike: (json['main']['feels_like'] ?? 0).toDouble(),
    );
  }
}

// Auth Models
class LoginRequest {
  final String email;
  final String password;

  LoginRequest({required this.email, required this.password});

  Map<String, dynamic> toJson() => {
    'email': email,
    'password': password,
  };
}

class RegisterRequest {
  final String name;
  final String email;
  final String password;
  final String? phoneNumber;
  final List<int>? categoryIds;

  RegisterRequest({
    required this.name,
    required this.email,
    required this.password,
    this.phoneNumber,
    this.categoryIds,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'password': password,
    if (phoneNumber != null) 'phoneNumber': phoneNumber,
    if (categoryIds != null) 'categoryIds': categoryIds,
  };
}

class AuthResponse {
  final String accessToken;
  final String refreshToken;
  final User user;

  AuthResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      user: User.fromJson(json['user']),
    );
  }
}