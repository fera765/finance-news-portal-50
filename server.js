
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

// Use default middlewares (cors, static, etc)
server.use(middlewares);

// Parse JSON request body
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router
// Login endpoint - simulating authentication
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const users = router.db.get('users').value();
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password &&
    u.status !== "banned"
  );
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Don't send password back
  const { password: _, ...userWithoutPassword } = user;
  
  // In a real API, you would generate a JWT token here
  res.json({
    user: userWithoutPassword,
    token: `demo-token-${user.id}`
  });
});

// Register endpoint
server.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  
  const users = router.db.get('users').value();
  const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
  
  if (emailExists) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  
  const newUser = {
    id: Date.now().toString(),
    name,
    email, 
    password,
    role: 'user',
    status: 'active',
    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  router.db.get('users').push(newUser).write();
  
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword,
    token: `demo-token-${newUser.id}`
  });
});

// Add timestamp to create/update operations
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = req.body.createdAt || new Date().toISOString();
  }
  if (req.method === 'PUT' || req.method === 'PATCH') {
    req.body.updatedAt = new Date().toISOString();
  }
  next();
});

// Use default router
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`JSON Server is running on http://localhost:${port}`);
  console.log(`Available routes:`);
  console.log(`  http://localhost:${port}/articles`);
  console.log(`  http://localhost:${port}/users`);
  console.log(`  http://localhost:${port}/comments`);
  console.log(`  http://localhost:${port}/likes`);
  console.log(`  http://localhost:${port}/bookmarks`);
});
