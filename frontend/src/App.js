import React, { useState, useEffect } from 'react'
import './App.css'

// Base URL of our backend API
// Changed from localhost to Render deployed URL
const API_URL = 'https://health-reminder-app-4.onrender.com'

function App() {
  const [reminders, setReminders] = useState([])
  
  const [form, setForm] = useState({
    title: '', time: '', category: 'medicine', repeat: 'daily', notes: ''
  })

  const [editingId, setEditingId] = useState(null)

  useEffect(() => { fetchReminders() }, [])

  // GET - fetch all reminders from backend
  const fetchReminders = () => {
    fetch(`${API_URL}/api/reminders`)
      .then(res => res.json())
      .then(data => setReminders(data))
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEdit = (reminder) => {
    setEditingId(reminder._id)
    setForm({
      title:    reminder.title,
      time:     reminder.time,
      category: reminder.category,
      repeat:   reminder.repeat,
      notes:    reminder.notes
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setForm({ title: '', time: '', category: 'medicine', repeat: 'daily', notes: '' })
  }

  const handleSubmit = () => {
    if (!form.title || !form.time) return alert('Please fill title and time!')

    if (editingId) {
      // PUT - update existing reminder
      fetch(`${API_URL}/api/reminders/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(() => {
        fetchReminders()
        handleCancel()
      })
    } else {
      // POST - create new reminder
      fetch(`${API_URL}/api/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(() => {
        fetchReminders()
        setForm({ title: '', time: '', category: 'medicine', repeat: 'daily', notes: '' })
      })
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      // DELETE - remove reminder
      fetch(`${API_URL}/api/reminders/${id}`, {
        method: 'DELETE'
      }).then(() => fetchReminders())
    }
  }

  const categoryEmoji = {
    medicine: '💊', water: '💧', exercise: '🏃',
    meal: '🍽️', sleep: '😴', other: '📌'
  }

  return (
    <div className="app">
      <h1>💊 Health Reminder App</h1>

      {/* FORM CARD */}
      <div className="form-card">
        <h2>{editingId ? '✏️ Edit Reminder' : '➕ Add New Reminder'}</h2>

        <input
          type="text"
          name="title"
          placeholder="Reminder title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
        />
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="medicine">💊 Medicine</option>
          <option value="water">💧 Water</option>
          <option value="exercise">🏃 Exercise</option>
          <option value="meal">🍽️ Meal</option>
          <option value="sleep">😴 Sleep</option>
          <option value="other">📌 Other</option>
        </select>
        <select name="repeat" value={form.repeat} onChange={handleChange}>
          <option value="daily">🔁 Daily</option>
          <option value="weekly">📅 Weekly</option>
          <option value="none">❌ No Repeat</option>
        </select>
        <input
          type="text"
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />

        <button className="btn-add" onClick={handleSubmit}>
          {editingId ? '💾 Update Reminder' : '➕ Add Reminder'}
        </button>

        {editingId && (
          <button className="btn-cancel" onClick={handleCancel}>
            ❌ Cancel
          </button>
        )}
      </div>

      {/* REMINDERS LIST */}
      <h2 className="list-title">My Reminders ({reminders.length})</h2>

      {reminders.length === 0 ? (
        <p className="empty">No reminders yet! Add one above. 👆</p>
      ) : (
        reminders.map(reminder => (
          <div
            key={reminder._id}
            className={`reminder-card ${editingId === reminder._id ? 'editing' : ''}`}
          >
            <h3>{categoryEmoji[reminder.category]} {reminder.title}</h3>
            <p>⏰ Time: {reminder.time}</p>
            <p>📁 Category: {reminder.category}</p>
            <p>🔁 Repeat: {reminder.repeat}</p>
            {reminder.notes && <p>📝 {reminder.notes}</p>}

            <div className="card-buttons">
              <button
                className="btn-edit"
                onClick={() => handleEdit(reminder)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(reminder._id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default App