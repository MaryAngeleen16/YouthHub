const User = require('../models/user');
const jwt = require('jsonwebtoken');
const multer = require('multer');


// Define storage and file filter for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } 
  else {
    cb(new Error('Invalid file type'), false);
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100, // Limit file size to 5 MB
  },
});

// PINAKA THE BEST exports.isAuthenticatedUser = async (req, res, next) => {
//   const token = req.header('Authorization').split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Login first to access this resource' });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = await User.findById(decoded.id);

//   next();
// };

//   const authorizationHeader = req.header('Authorization');
//   if (!authorizationHeader) {
//     return res.status(401).json({ message: 'Login first to access this resource' });
//   }

//   const token = authorizationHeader.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Invalid authorization header' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }



// exports.isAuthenticatedUser = async (req, res, next) => {
//   try {
//     const authorizationHeader = req.header('Authorization');
//     if (!authorizationHeader) {
//       return res.status(401).json({ message: 'Authorization header is missing' });
//     }

//     const tokenParts = authorizationHeader.split(' ');
//     if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
//       return res.status(401).json({ message: 'Invalid Authorization header format' });
//     }
//     const token = tokenParts[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     if (!req.user) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };



// exports.isAuthenticatedUser = async (req, res, next) => {
//   const authHeader = req.header('Authorization');
//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header is missing' });
//   }

//   // Split Authorization header to extract token
//   const tokenParts = authHeader.split(' ');
//   if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
//     return res.status(401).json({ message: 'Invalid Authorization header format' });
//   }
//   const token = tokenParts[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };


exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role (${req.user.role}) is not allowed to access this resource` });
    }
    next()
  }
}

// exports.isAuthenticatedUser = async (req, res, next) => {
//   const authHeader = req.header('Authorization');
//   if (!authHeader) {
//       return res.status(401).json({ message: 'Authorization header is missing' });
//   }

//   const tokenParts = authHeader.split(' ');
//   if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
//       return res.status(401).json({ message: 'Invalid Authorization header format' });
//   }

//   const token = tokenParts[1];

//   try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id);
//       next();
//   } catch (error) {
//       return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// exports.isAuthenticatedUser = async (req, res, next) => {
//   const token = req.header('Authorization').split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Login first to access this resource' });
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = await User.findById(decoded.id);

//   next();
// };

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
      // If there's no token, continue to the next middleware without setting req.user
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next();
  }
};



// authMiddleware.js


exports.getUserInformation = async (req, res, next) => {
    try {
      // Retrieve user information if available in the request
      if (req.user) {
        const user = await User.findById(req.user.id);
        req.userInformation = user;
      }

      // If user is not logged in, fetch the user's name
      if (!req.user) {
        const users = await User.find({}, 'name'); // Fetch only the 'name' field of all users
        req.publicUsers = users;
      }

      next();
    } catch (error) {
      // Handle errors if necessary
      next(error);
    }
};
