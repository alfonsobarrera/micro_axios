const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Example 1: GET request using axios
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
    res.json({
      success: true,
      data: response.data,
      status: response.status
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message,
      error: error.response?.data
    });
  }
});

// Example 2: POST request using axios
app.post('/posts', async (req, res) => {
  try {
    const postData = {
      title: req.body.title || 'New Post',
      body: req.body.body || 'Post content',
      userId: req.body.userId || 1
    };

    const response = await axios.post('https://jsonplaceholder.typicode.com/posts', postData);
    res.json({
      success: true,
      data: response.data,
      status: response.status
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message
    });
  }
});

// Example 3: Multiple concurrent requests using axios.all()
app.get('/combined-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const [userResponse, postsResponse, todosResponse] = await Promise.all([
      axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`),
      axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`),
      axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
    ]);

    res.json({
      success: true,
      user: userResponse.data,
      posts: postsResponse.data,
      todos: todosResponse.data
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message
    });
  }
});

// Example 4: Custom headers with axios
app.get('/custom-headers', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        'X-Custom-Header': 'CustomValue',
        'Authorization': 'Bearer token123'
      }
    });

    res.json({
      success: true,
      data: response.data,
      headers: response.config.headers
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message
    });
  }
});

// Example 5: Request with timeout using axios
app.get('/with-timeout', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users', {
      timeout: 5000 // 5 second timeout
    });

    res.json({
      success: true,
      count: response.data.length,
      data: response.data
    });
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      res.status(408).json({
        success: false,
        message: 'Request timeout'
      });
    } else {
      res.status(error.response?.status || 500).json({
        success: false,
        message: error.message
      });
    }
  }
});

// Example 6: Interceptors
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response received:', response.status);
    return response;
  },
  error => Promise.reject(error)
);

app.get('/interceptors/users/:id', async (req, res) => {
  try {
    const response = await axiosInstance.get(`/users/${req.params.id}`);
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is running',
    endpoints: [
      'GET /health',
      'GET /users/:id',
      'POST /posts',
      'GET /combined-data/:userId',
      'GET /custom-headers',
      'GET /with-timeout',
      'GET /interceptors/users/:id'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Check health at http://localhost:${PORT}/health`);
});
