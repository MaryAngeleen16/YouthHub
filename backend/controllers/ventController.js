const Vent = require('../models/vent');

exports.createVent = async (req, res) => {
  try {
    const { user, title, message } = req.body;
    const newVent = await Vent.create({ user, title, message });
    res.status(201).json(newVent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




// exports.getAllVentsForCounselor = async (req, res) => {
//   try {
//     // Check if the authenticated user is a counselor
//     if (req.user.role !== 'counselor') {
//       return res.status(403).json({ message: 'You are not authorized to perform this action.' });
//     }

//     const vents = await Vent.find({ counselor: req.user._id });
//     res.status(200).json(vents);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };


// exports.getAllVents = async (req, res) => {
//   try {
//     const vents = await Vent.find();
//     res.status(200).json(vents);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.getAllVentsForCounselor = async (req, res) => {
//   try {
//     // Check if the authenticated user is a counselor
//     if (req.user.role !== 'counselor') {
//       return res.status(403).json({ message: 'You are not authorized to perform this action.' });
//     }

//     // Retrieve all vents for the counselor
//     const vents = await Vent.find({ counselor: req.user._id });
//     res.status(200).json(vents);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };




exports.getAllVents = async (req, res) => {
  try {
    if (req.user.role !== 'counselor') {
      return res.status(403).json({ message: 'You are not authorized to access this resource.' });
    }

    const vents = await Vent.find();
    res.status(200).json(vents);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllVentsByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming the user ID is stored in req.user._id
    const vents = await Vent.find({ user: userId }); // Filter vents by user ID
    res.status(200).json(vents);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};