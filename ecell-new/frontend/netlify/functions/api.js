// In-memory database for demo purposes
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "admin"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user"
  }
];

const events = [
  {
    id: 1,
    title: "Startup Summit 2023",
    date: "Oct 15, 2023",
    time: "10:00 AM - 5:00 PM",
    location: "Main Auditorium",
    description: "A day-long summit featuring successful entrepreneurs and investors sharing their insights and experiences.",
    image: "/images/event-1.jpg",
    category: "conference"
  },
  {
    id: 2,
    title: "Ideathon Challenge",
    date: "Nov 5, 2023",
    time: "9:00 AM - 9:00 PM",
    location: "Innovation Hub",
    description: "A 12-hour ideathon where participants brainstorm and pitch innovative solutions to real-world problems.",
    image: "/images/event-2.jpg",
    category: "competition"
  }
];

// Helper to generate tokens
const generateToken = (userId) => {
  return `token-${userId}-${Date.now()}`;
};

// Helper to parse request body
const parseBody = (body) => {
  try {
    return JSON.parse(body);
  } catch (error) {
    return {};
  }
};

// Helper for CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Content-Type': 'application/json'
};

// API Handler
exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const segments = path.split('/').filter(Boolean);
  const [resource, id] = segments;

  // Auth routes
  if (resource === 'auth') {
    if (event.httpMethod === 'POST' && segments[1] === 'login') {
      const { email, password } = parseBody(event.body);
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ message: 'Invalid credentials' })
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          token: generateToken(user.id),
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        })
      };
    }
    
    if (event.httpMethod === 'POST' && segments[1] === 'register') {
      const { name, email, password } = parseBody(event.body);
      
      if (!name || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Missing required fields' })
        };
      }
      
      if (users.some(u => u.email === email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User already exists' })
        };
      }
      
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role: 'user'
      };
      
      users.push(newUser);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          token: generateToken(newUser.id),
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        })
      };
    }
  }
  
  // Events routes
  if (resource === 'events') {
    if (event.httpMethod === 'GET') {
      if (id) {
        const event = events.find(e => e.id === parseInt(id));
        
        if (!event) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ message: 'Event not found' })
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(event)
        };
      }
      
      // Optional query parameter for filtering by category
      const { category } = event.queryStringParameters || {};
      
      let filteredEvents = events;
      if (category) {
        filteredEvents = events.filter(e => e.category === category);
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(filteredEvents)
      };
    }
    
    // Additional CRUD operations for events could be added here
  }
  
  // Contact form submission
  if (resource === 'contact' && event.httpMethod === 'POST') {
    const { name, email, subject, message } = parseBody(event.body);
    
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }
    
    // In a real app, you would save this to a database and/or send an email
    console.log(`Contact form submission from ${name} (${email}): ${subject}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Message received successfully' })
    };
  }
  
  // Default route not found
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ message: 'Not found' })
  };
};
