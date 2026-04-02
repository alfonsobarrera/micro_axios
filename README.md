# Micro Axios API

A basic API to exemplify the use of the **axios** npm library with Express.js

## Features

This project demonstrates various axios capabilities:

- **GET requests** - Fetch user data from an external API
- **POST requests** - Create resources on a remote server
- **Concurrent requests** - Use `Promise.all()` to make multiple requests simultaneously
- **Custom headers** - Add authentication and custom headers
- **Request timeout** - Set timeout limits for requests
- **Interceptors** - Handle request/response logging and transformation

## Installation

```bash
npm install
```

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
```
GET /health
```
Returns API status and available endpoints.

### Get User (Single GET Request)
```
GET /users/:id
```
Fetches a user from JSONPlaceholder API by ID.

**Example**:
```bash
curl http://localhost:3000/users/1
```

### Create Post (POST Request)
```
POST /posts
Body:
{
  "title": "My Post",
  "body": "Post content",
  "userId": 1
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Content","userId":1}'
```

### Combined Data (Concurrent Requests)
```
GET /combined-data/:userId
```
Fetches user info, posts, and todos in parallel.

**Example**:
```bash
curl http://localhost:3000/combined-data/1
```

### Custom Headers
```
GET /custom-headers
```
Demonstrates passing custom headers with axios.

### Timeout Example
```
GET /with-timeout
```
Shows how to set request timeouts.

### Interceptors Example
```
GET /interceptors/users/:id
```
Demonstrates request/response interceptors.

## Key Axios Examples

### 1. Basic GET Request
```javascript
const response = await axios.get('https://api.example.com/users/1');
```

### 2. POST Request
```javascript
const response = await axios.post('https://api.example.com/posts', {
  title: 'New Post',
  body: 'Content'
});
```

### 3. Multiple Concurrent Requests
```javascript
const [user, posts, todos] = await Promise.all([
  axios.get('/users/1'),
  axios.get('/posts?userId=1'),
  axios.get('/todos?userId=1')
]);
```

### 4. Custom Configuration
```javascript
const response = await axios.get('/data', {
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000,
  params: { page: 1 }
});
```

### 5. Error Handling
```javascript
try {
  const response = await axios.get('/data');
} catch (error) {
  console.log(error.response.status); // Error status code
  console.log(error.message); // Error message
}
```

### 6. Interceptors
```javascript
const instance = axios.create();

instance.interceptors.request.use(config => {
  console.log('Request:', config.url);
  return config;
});

instance.interceptors.response.use(response => {
  console.log('Response:', response.status);
  return response;
});
```

## Technologies Used

- **Express.js** - Web framework
- **Axios** - HTTP client library
- **Node.js** - Runtime environment

## License

MIT
