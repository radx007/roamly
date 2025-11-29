#!/bin/bash

BASE_DIR="lib"
echo "Creating simple project structure..."

create_file() {
    mkdir -p "$(dirname "$1")"
    touch "$1"
    echo "Created: $1"
}

# MAIN
create_file "$BASE_DIR/main.dart"

# MODELS
create_file "$BASE_DIR/models/models.dart"

# SERVICES
create_file "$BASE_DIR/services/api_service.dart"

# PROVIDERS
create_file "$BASE_DIR/providers/providers.dart"

# SCREENS
create_file "$BASE_DIR/screens/main_screens.dart"
create_file "$BASE_DIR/screens/explore_screen.dart"
create_file "$BASE_DIR/screens/destination_detail_screen.dart"
create_file "$BASE_DIR/screens/favorites_and_profile_screens.dart"

echo "🎉 Simple structure generated successfully!"
