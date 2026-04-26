const express = require('express')
const router = express.Router()
const Reminder = require('../models/Reminder')

// GET - fetch all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find()
    res.json(reminders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// POST - create a new reminder
router.post('/', async (req, res) => {
  const reminder = new Reminder({
    title:    req.body.title,
    time:     req.body.time,
    category: req.body.category,
    repeat:   req.body.repeat,
    notes:    req.body.notes,
  })
  try {
    const saved = await reminder.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// PUT - update a reminder
router.put('/:id', async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// DELETE - delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id)
    res.json({ message: 'Reminder deleted!' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router