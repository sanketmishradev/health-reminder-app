const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cors())

app.get('/test', (req, res) => {
  res.send('Hello! Server is working!')
})

// ADD THIS LINE — connects all reminder routes
app.use('/api/reminders', require('./routes/reminderRoutes'))

const PORT = 5000

app.listen(PORT, () => {
  console.log('Server is running on port 5000')
})