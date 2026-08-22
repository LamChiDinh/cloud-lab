import { useState, useEffect } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ studentId: '', name: '', email: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students')
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      console.error('Loi lay danh sach sinh vien:', err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingId) {
      await fetch(`/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setEditingId(null)
    } else {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setForm({ studentId: '', name: '', email: '' })
    fetchStudents()
  }

  const handleEdit = (st) => {
    setEditingId(st._id)
    setForm({ studentId: st.studentId, name: st.name, email: st.email })
  }

  const handleDelete = async (id) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' })
    fetchStudents()
  }

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quan ly Sinh vien (MERN Stack)</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          placeholder="MSSV" 
          value={form.studentId} 
          onChange={e => setForm({...form, studentId: e.target.value})} 
          required 
          style={{ padding: '8px', flex: 1 }}
        />
        <input 
          placeholder="Ho ten" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
          style={{ padding: '8px', flex: 2 }}
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
          style={{ padding: '8px', flex: 2 }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {editingId ? 'Cap nhat' : 'Them sinh vien'}
        </button>
      </form>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th>MSSV</th>
            <th>Ho ten</th>
            <th>Email</th>
            <th style={{ width: '150px' }}>Hanh dong</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(st => (
              <tr key={st._id}>
                <td>{st.studentId}</td>
                <td>{st.name}</td>
                <td>{st.email}</td>
                <td>
                  <button onClick={() => handleEdit(st)} style={{ marginRight: '5px', padding: '4px 8px' }}>Sua</button>
                  <button onClick={() => handleDelete(st._id)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>Xoa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>Chua co du lieu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App
