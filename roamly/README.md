```markdown
Roamly App Overview (Touristic Flutter android mobile  App)
Users:
1. Regular User – Explore places, filter, favorite, edit profile.
2. Admin User – Manage users, places, activities, and all app content.
Features:
* User signup & login (with city and hobby preferences)
* Explore page: recommended places based on preferences
* Place details page: weather, hotels, activities, Google Map location
* Favorites page: save preferred destinations
* Chatbot: place-specific info
* Profile edit page
* Admin dashboard: CRUD for users, places, activities
Architecture
* Frontend: Flutter android mobile 
* Backend: Spring Boot REST API mvc model 
* Authentication: Keycloak via Spring Boot (API only, no UI)
Tech Flow:
1. Login / Signup: Flutter → Spring Boot → Keycloak → Spring returns JWT → Flutter stores token.
2. API Requests: Flutter sends JWT → Spring Boot validates → Returns data.
3. Token Refresh: Flutter → Spring Boot → Keycloak → Returns new JWT.
4. Logout: Flutter → Spring Boot → Optionally invalidate token in Keycloak.
Key Idea Flow Table
StepActionFrom → ToResponseNotes1User loginFlutter → Spring BootToken request sent to KeycloakFlutter sends username/password2ValidateSpring Boot → KeycloakJWT tokenSpring calls Keycloak /token endpoint3Return tokenSpring Boot → FlutterAccess + refresh JWTFlutter stores token securely4API requestFlutter → Spring BootDataJWT in header, Spring validates5SignupFlutter → Spring Boot → KeycloakSuccess / FailNew user created via Keycloak Admin API6Refresh tokenFlutter → Spring Boot → KeycloakNew access tokenFor session continuity7LogoutFlutter → Spring BootOptional invalidateInform Keycloak if needed
✅ Summary: Flutter communicates only with Spring Boot, which handles all Keycloak interactions. The backend manages both admin & user flows. Flutter UI is feature-based, reactive, and uses Roverpod Notifier for state management.  and i provided my entitie to use them as they are .  supper greate now can u make me the fully working flutter android mobile application that makes  implements all the feature mentionned and make calls to the spring booot end points  , and make teh ui as beutiful and u can and modeln and web friendly this are the spring boot end points 


API Endpoints
Authentication (`/api/auth`)

```
MethodEndpointDescriptionAuth RequiredPOST/registerRegister new userNoPOST/loginUser loginNoPOST/refreshRefresh access tokenNoPOST/logoutUser logoutNo
```

Users (`/api/users`)

```
MethodEndpointDescriptionRoleGET/meGet current userUSER, ADMINGET/{id}Get user by IDUSER, ADMINPUT/{id}Update userUSER, ADMINPOST/{userId}/favorites/{destinationId}Add favoriteUSER, ADMINDELETE/{userId}/favorites/{destinationId}Remove favoriteUSER, ADMINGET/Get all usersADMINDELETE/{id}Delete userADMIN
```

Cities (`/api/cities`)

```
MethodEndpointDescriptionRoleGET/Get all citiesPublicGET/{id}Get city by IDPublicPOST/Create cityADMINPUT/{id}Update cityADMINDELETE/{id}Delete cityADMIN
```

Destinations (`/api/destinations`)

```
MethodEndpointDescriptionRoleGET/Get all destinationsPublicGET/{id}Get destination by IDPublicGET/city/{cityId}Get destinations by cityPublicGET/categories?categoryIds=1,2Filter by categoriesPublicGET/top-rated?minRating=4.5Get top ratedPublicPOST/Create destinationADMINPUT/{id}Update destinationADMINDELETE/{id}Delete destinationADMIN
```

Categories (`/api/categories`)

```
MethodEndpointDescriptionRoleGET/Get all categoriesPublicGET/{id}Get category by IDPublicPOST/Create categoryADMINPUT/{id}Update categoryADMINDELETE/{id}Delete categoryADMIN
```

Hotels (`/api/hotels`)

```
MethodEndpointDescriptionRoleGET/Get all hotelsPublicGET/{id}Get hotel by IDPublicGET/destination/{destinationId}Get hotels by destinationPublicGET/destination/{destinationId}/price-rangeFilter by pricePublicPOST/Create hotelADMINPUT/{id}Update hotelADMINPATCH/{id}/toggle-availabilityToggle availabilityADMINDELETE/{id}Delete hotelADMIN
```

Activities (`/api/activities`)

```
MethodEndpointDescriptionRoleGET/Get all activitiesPublicGET/{id}Get activity by IDPublicGET/destination/{destinationId}Get activities by destinationPublicPOST/Create activityADMINPUT/{id}Update activityADMINPATCH/{id}/toggle-availabilityToggle availabilityADMINDELETE/{id}Delete activityADMIN
```

Weather (`/api/weather`)

```
MethodEndpointDescriptionRoleGET/coordinates?lat=48.8566&lon=2.3522Get weather by coordinatesPublicGET/city/{cityName}Get weather by city namePublic
```


```
package com.roamlyspring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(length = 500)
    private String imageUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```


```
package com.roamlyspring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(length = 50)
    private String icon;

}
```


```
package com.roamlyspring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Destination> destinations = new ArrayList<>();
}
```


```
package com.roamlyspring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "destinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 500)
    private String address;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;

    @ElementCollection
    @CollectionTable(name = "destination_images", joinColumns = @JoinColumn(name = "destination_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "destination_categories",
            joinColumns = @JoinColumn(name = "destination_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Hotel> hotels = new ArrayList<>();

    @OneToMany(mappedBy = "destination", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Activity> activities = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Helper methods
    public void addCategory(Category category) {
        this.categories.add(category);

    }

    public void removeCategory(Category category) {
        this.categories.remove(category);

    }

    public void addHotel(Hotel hotel) {
        this.hotels.add(hotel);
        hotel.setDestination(this);
    }

    public void removeHotel(Hotel hotel) {
        this.hotels.remove(hotel);
        hotel.setDestination(null);
    }

    public void addActivity(Activity activity) {
        this.activities.add(activity);
        activity.setDestination(this);
    }

    public void removeActivity(Activity activity) {
        this.activities.remove(activity);
        activity.setDestination(null);
    }
}
```


```
package com.roamlyspring.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 500)
    private String address;

    @Column(length = 1000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Column(nullable = false)
    @Builder.Default
    private Double rating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Double distanceKm = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```


```
package com.roamlyspring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    @Email
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 255)
    private String avatarUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_categories",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<Category> preferences = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_favorites",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "destination_id")
    )
    @Builder.Default
    private Set<Destination> favoriteDestinations = new HashSet<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Helper methods
    public void addPreference(Category category) {
        this.preferences.add(category);

    }

    public void removePreference(Category category) {
        this.preferences.remove(category);

    }

    public void addFavorite(Destination destination) {
        this.favoriteDestinations.add(destination);

    }

    public void removeFavorite(Destination destination) {
        this.favoriteDestinations.remove(destination);

    }
}
```

and flollow this file and folder tree