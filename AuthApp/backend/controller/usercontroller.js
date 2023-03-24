const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../model/user")

 exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await User.findByIdAndUpdate(user._id, { refreshToken });
     
    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.json({ token,refreshToken });
} catch (err) {
     console.error(err);
     res.status(500).json({ error: 'Internal server error' });
}
};

// const authMiddleware = async (req, res, next) => {
// const authHeader = req.headers.authorization;

// if (!authHeader || !authHeader.startsWith('Bearer ')) {
// return res.status(401).json({ error: 'Authorization header missing or invalid' });
// }

// const token = authHeader.split(' ')[1];

// try {
// const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
// const user = await User.findById(decodedToken.userId);

// if (!user) {
//   return res.status(401).json({ error: 'Invalid token' });
// }

// req.user = user;
// next();
// } catch (err) {
//     console.error(err);
//     res.status(401).json({ error: 'Invalid or expired token' });
//     }
//     };
    
//     app.get('/api/profile', authMiddleware, (req, res) => {
//     res.json({ email: req.user.email });
//     });
