package com.roamly.util;

public class Constants {

    // API Response Messages
    public static final String SUCCESS = "Operation successful";
    public static final String CREATED = "Resource created successfully";
    public static final String UPDATED = "Resource updated successfully";
    public static final String DELETED = "Resource deleted successfully";

    // Error Messages
    public static final String NOT_FOUND = "Resource not found";
    public static final String UNAUTHORIZED = "Unauthorized access";
    public static final String FORBIDDEN = "Access forbidden";
    public static final String BAD_REQUEST = "Invalid request";

    // Pagination
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    // Rating
    public static final int MIN_RATING = 1;
    public static final int MAX_RATING = 10;
}
