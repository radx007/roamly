#!/bin/bash

# Root folder
mkdir -p src

cd src || exit

# Main files
touch main.jsx App.jsx App.css index.css

# api folder
mkdir -p api
touch api/axios.js api/authApi.js api/movieApi.js api/ratingApi.js api/watchlistApi.js api/chatApi.js api/profileApi.js api/adminApi.js

# context folder
mkdir -p context
touch context/AuthContext.jsx

# hooks folder
mkdir -p hooks
touch hooks/useAuth.js hooks/useMovies.js hooks/useDebounce.js

# components folder
mkdir -p components/common components/movie components/rating components/watchlist components/chat components/admin

# components/common files
touch components/common/Navbar.jsx components/common/Footer.jsx components/common/Loader.jsx components/common/ProtectedRoute.jsx components/common/AdminRoute.jsx

# components/movie files
touch components/movie/MovieCard.jsx components/movie/MovieGrid.jsx components/movie/MovieFilter.jsx components/movie/TrailerModal.jsx

# components/rating files
touch components/rating/RatingForm.jsx components/rating/RatingCard.jsx components/rating/RatingList.jsx

# components/watchlist files
touch components/watchlist/WatchlistCard.jsx components/watchlist/WatchlistDetails.jsx components/watchlist/CreateWatchlistModal.jsx components/watchlist/WatchlistQRCode.jsx

# components/chat files
touch components/chat/ChatWidget.jsx components/chat/ChatMessage.jsx

# components/admin files
touch components/admin/UserTable.jsx components/admin/TMDBImport.jsx components/admin/AnalyticsDashboard.jsx

# pages folder
mkdir -p pages/admin

# pages root files
touch pages/Home.jsx pages/Browse.jsx pages/MovieDetailsPage.jsx pages/Watchlists.jsx pages/Profile.jsx pages/Login.jsx pages/Register.jsx

# pages/admin files
touch pages/admin/AdminDashboard.jsx pages/admin/AdminUsers.jsx pages/admin/AdminMovies.jsx pages/admin/AdminImport.jsx

echo "Folder and file structure created successfully!"
