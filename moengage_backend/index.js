const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());


const JWT_SECRET = 'your_secret_key';


mongoose.connect('mongodb://localhost:27017/brewery_reviews', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
}));

const Review = mongoose.model('Review', new mongoose.Schema({
  breweryId: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}));


app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    const user = new User({ username, password });
    await user.save();
    res.send('User created');
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send('Error creating user');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid username or password');
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET); // Use the directly defined JWT_SECRET
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send(error.message || 'Error logging in');
  }
});


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }
  jwt.verify(token, JWT_SECRET, (err, user) => { 
    if (err) {
      console.error('JWT verification error:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Route to add a review (protected route)
app.post('/reviews', authenticateToken, async (req, res) => {
  try {
    const { breweryId, rating, description } = req.body;
    if (!breweryId || !rating || !description) {
      return res.status(400).send('All fields are required');
    }
    const review = new Review({ breweryId, rating, description, user: req.user.id });
    await review.save();
    res.send('Review added');
  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(500).send('Error adding review');
  }
});

// Route to get reviews for a brewery
app.get('/reviews/:breweryId', async (req, res) => {
  try {
    const reviews = await Review.find({ breweryId: req.params.breweryId }).populate('user', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).send('Error getting reviews');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
