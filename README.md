# Short-link

This project is a URL shortening service built with Express.js and TypeScript. It provides functionalities to shorten URLs, decode shortened URLs, retrieve URL statistics, and redirect to original URLs.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Project](#running-the-project)
  - [Locally](#locally)
  - [Using Docker](#using-docker)
- [API Documentation](#api-documentation)
  - [Encode URL](#encode-url)
  - [Decode URL](#decode-url)
  - [Get URL Statistics](#get-url-statistics)
  - [Access Original URL](#access-original-url)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (Node Package Manager)
- Docker (optional, for running the project in a Docker container)

### Installation

# Clone the repository

```sh
    git clone https://github.com/mikkybang/short-link.git

    # Change to the project directory
    cd short-link

    Setup your env variables using the example defined [here](https://github.com/mikkybang/short-link/blob/main/env.example)
    You can create a `.env` file or set your OS environment variables

    # Install the dependencies
    npm install
```

## Running the Project

### Locally

To run the project on your local machine, follow these steps:

1. Transpile TypeScript to JavaScript:
   ```sh
   npm run build
   ```
2. Start the server:
   ```sh
   npm start
   ```

Now, the server should be running at [http://localhost:3003](http://localhost:3003).

### Using Docker

Alternatively, you can run the project inside a Docker container using the following steps:

1. Build the Docker image:
   ```sh
   docker build -t short-link .
   ```
2. Run a Docker container from the image:
   ```sh
   docker run -p 3003:3003 -d short-link
   ```

The application will be accessible at [http://localhost:3003](http://localhost:3003).

## API Documentation

### Encode URL

- **Endpoint**: `POST /encode`
- **Body**:
  ```json
  {
    "url": "http://example.com"
  }
  ```
- **Response**: The shortened URL details.

### Decode URL

- **Endpoint**: `POST /decode`
- **Body**:
  ```json
  {
    "url": "https://shortlink.com/1bf410"
  }
  ```
- **Response**: The original URL.

### Get URL Statistics

- **Endpoint**: `GET /statistic/:url_path`
- **Response**: Statistics for the specified URL path.

### Access Original URL

- **Endpoint**: `GET /:hash`
- **Response**: Redirects to the original URL associated with the hash.

## License

This project is licensed under the ISC License.
