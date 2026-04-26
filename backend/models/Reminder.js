const mongoose = require('mongoose')

// This defines what every reminder looks like in the database
const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,       // must be text
      required: true,     // cannot be empty
    },
    time: {
      type: String,       // e.g. "08:30"
      required: true,
    },
    category: {
      type: String,
      enum: ['medicine', 'water', 'exercise', 'meal', 'sleep', 'other'],
      default: 'other',
    },
    repeat: {
      type: String,
      enum: ['daily', 'weekly', 'none'],
      default: 'daily',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
)

const Reminder = mongoose.model('Reminder', reminderSchema)

module.exports = Reminder