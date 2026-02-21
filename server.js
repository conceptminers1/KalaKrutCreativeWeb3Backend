import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3001;
const DB_FILE = './db.json';

app.use(cors());
app.use(bodyParser.json());

// Helper function to read the database
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ joinRequests: [], users: [] }));
  }
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write to the database
const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Endpoint to submit a join request
app.post('/api/join-requests', (req, res) => {
  const db = readDB();
  const newRequest = { id: Date.now(), ...req.body, status: 'pending' };
  db.joinRequests.push(newRequest);
  writeDB(db);
  res.status(201).json(newRequest);
});

// Endpoint to get all join requests
app.get('/api/join-requests', (req, res) => {
  const db = readDB();
  res.json(db.joinRequests);
});

// Endpoint for user login
app.post('/api/login', (req, res) => {
  const db = readDB();
  const { email, password } = req.body;

  const user = db.users.find(u => u.email === email && u.password === password);

  if (user) {
    // In a real app, you would return a JWT here!
    res.json({ 
      message: 'Login successful', 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || 'KalaKrut Member', // Add a default name
        avatar: user.avatar || 'https://picsum.photos/seed/default/200/200', // Add a default avatar
        location: user.location || 'Community',
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


// Endpoint to approve a join request
app.post('/api/join-requests/approve/:id', (req, res) => {
  const db = readDB();
  const requestId = parseInt(req.params.id, 10);
  const request = db.joinRequests.find(r => r.id === requestId);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  request.status = 'approved';

  const temporaryPassword = Math.random().toString(36).slice(-8);
  const newUser = {
    id: Date.now(),
    email: request.email,
    name: request.name, // Pass the name from the join request
    password: temporaryPassword, // This is insecure, for demo only!
    role: 'user',
  };
  db.users.push(newUser);
  writeDB(db);

  // Simulate sending an email
  console.log('--- SIMULATED EMAIL ---');
  console.log(`TO: ${newUser.email}`);
  console.log('SUBJECT: Your request to join has been approved!');
  console.log(`BODY: Welcome! You can now log in with your email and the following temporary password: ${temporaryPassword}`);
  console.log('-----------------------');

  res.json({ message: 'User approved and "email" sent.' });
});

// Endpoint to deny a join request
app.post('/api/join-requests/deny/:id', (req, res) => {
  const db = readDB();
  const requestId = parseInt(req.params.id, 10);
  const request = db.joinRequests.find(r => r.id === requestId);

  if (!request) {
    return res.status(404).json({ message: 'Request not found' });
  }

  request.status = 'denied';
  writeDB(db);

  res.json({ message: 'Request denied.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Triggering nodemon restart