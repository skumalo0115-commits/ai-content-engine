# API Reference

## Overview
This document provides complete documentation of the API endpoints available in the **AI Content Engine** project.

## Authentication
All API requests require authentication. Use bearer tokens in the headers.

## Endpoints

### 1. Create Content
**POST** `/api/content`
- **Description**: Creates new content based on provided parameters.
- **Request Body**:
  ```json
  {
    "title": "string",
    "body": "string",
    "type": "string"
  }
  ```
- **Response**:
  - **201 Created**: Content created successfully.
  - **400 Bad Request**: If the input data is invalid.

### 2. Get Content
**GET** `/api/content/{id}`
- **Description**: Retrieves content by its ID.
- **Response**:
  - **200 OK**: Returns the content details.
  - **404 Not Found**: If the content does not exist.

### 3. Update Content
**PUT** `/api/content/{id}`
- **Description**: Updates existing content by ID.
- **Request Body**:
  ```json
  {
    "title": "string",
    "body": "string",
    "type": "string"
  }
  ```
- **Response**:
  - **200 OK**: Content updated successfully.
  - **404 Not Found**: If the content does not exist.

### 4. Delete Content
**DELETE** `/api/content/{id}`
- **Description**: Deletes content by ID.
- **Response**:
  - **204 No Content**: Content deleted successfully.
  - **404 Not Found**: If the content does not exist.

## Rate Limiting
Be aware of rate limits on API requests. Please refer to the documentation for details.

## Contact
For further information, please contact the API support team.