const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define a schema for session data
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  sessionName: { type: String, required: true },  // Add sessionName to store player name
  gameName: { type: String, required: false },
  imagePaths: [String],  // Array of strings for image paths
  screenshotPaths: [String],  // Array of strings for screenshot paths
  timestamp: { type: [String], default: () => [new Date().toLocaleDateString(), new Date().toLocaleTimeString()] }, // Store date and time as an array
  modelResponse: { type: Array, required: false }
});

// Define a schema for user authentication
const authSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'child'] }
});

// Hash the password before saving
authSchema.pre('save', async function (next) {
   if (this.isModified('password')) {
     this.password = await bcrypt.hash(this.password, 10);
   }
   next();
});

// Main Game Schema
const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  name: { type: String, required: true },
  questions: [
    {
      type: mongoose.Schema.Types.Mixed, // Can hold either questionType1Schema or questionType2Schema
      required: true,
    },
  ],
});

// Create a model for the schema
const Session = mongoose.model('Session', sessionSchema);
const UserAuth = mongoose.model('UserAuth', authSchema);
const Game = mongoose.model('Game', gameSchema); // Main game model

// Export both models
module.exports = {Session,UserAuth,Game};