import express from 'express';
import 'dotenv/config';
import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();

// If file.json doesn't exist, db.data will be null
// Set default data
db.data ||= { users: [] };
const { users } = db.data;

app.get('/', (req, res) => {
  res.render('index', {
    name: 'Da',
  });
});
app.get('/users', (req, res) => {
  res.render('users/index', { users: users });
});

app.get('/users/search', (req, res) => {
  const q = req.query.q;
  const usersMatched = users.filter((user) => {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) > -1;
  });

  res.render('users/index', { users: usersMatched, q: q });
});

app.get('/users/create', (req, res) => {
  res.render('users/create');
});

app.post('/users/create', async (req, res) => {
  users.push(req.body);
  await db.write();
  res.redirect('/users');
});

app.listen(port, () => {
  console.log(`Server is on PORT ${port}`);
});
