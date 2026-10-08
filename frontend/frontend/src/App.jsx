import React, { useState } from 'react';
import './App.css'; // Added to load your custom styling properties

export default function App() {
  const API_URL = 'http://localhost:3000/students';
  
  // Single object state to track all form input fields
  const [form, setForm] = useState({ name: '', age: '', search: '', delete: '' });
  // States to hold array responses and status notifications
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState('');

  // Helper function to update individual properties inside the form state object
  const updateForm = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // Reusable network utility to handle fetch configurations and structural error handling
  const apiRequest = async (url, method, body = null, isJson = false) => {
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : null
      });
      // Parse content conditionally based on expected output (JSON arrays vs plaintext strings)
      const data = isJson && res.ok ? await res.json() : await res.text();
      
      if (!res.ok) throw new Error(data || 'Request failed');
      return { success: true, data };
    } catch (err) {
      setMsg(err.message || 'Connection failed.');
      return { success: false };
    }
  };

  // POST action to insert a new student profile
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age) return setMsg('Fill out all fields.');
    const res = await apiRequest(API_URL, 'POST', { name: form.name, age: parseInt(form.age) });
    if (res.success) { 
      setMsg(res.data); 
      updateForm('name', ''); 
      updateForm('age', ''); 
    }
  };

  // GET action to query and filter students matching a specific name parameter
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.search) return setMsg('Enter search name.');
    const res = await apiRequest(`${API_URL}?name=${encodeURIComponent(form.search)}`, 'GET', null, true);
    if (res.success) { 
      setResults(res.data); 
      setMsg(`Found ${res.data.length} student(s).`); 
    }
  };

  // DELETE action to remove records by target name identifier
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!form.delete) return setMsg('Enter name to delete.');
    const res = await apiRequest(`${API_URL}/${encodeURIComponent(form.delete)}`, 'DELETE');
    if (res.success) {
      setMsg(res.data);
      // Remove deleted item from current UI view state array right away
      setResults(prev => prev.filter(s => s.name !== form.delete));
      updateForm('delete', '');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-xl">
        
        <header>
          <h1>Dashboard</h1>
        </header>

        {/* Global application response tracker banner */}
        {msg && <div className="alert-banner">{msg}</div>}

        {/* Creation form sub-block */}
        <section>
          <h2>Add New Student</h2>
          <form onSubmit={handleAdd}>
            <input placeholder="Name" value={form.name} onChange={e => updateForm('name', e.target.value)} />
            <input placeholder="Age" type="number" value={form.age} onChange={e => updateForm('age', e.target.value)} />
            <button type="submit">Add</button>
          </form>
        </section>

        {/* Read/Search filtering control sub-block */}
        <section>
          <h2>Query Records</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input placeholder="Search Name" value={form.search} onChange={e => updateForm('search', e.target.value)} />
            <button type="submit">Search</button>
          </form>

          {/* Dynamic database data renderer map loop */}
          {results.length > 0 && (
            <div className="results-container">
              <span className="results-label">Results Matrix</span>
              <div className="results-list">
                {results.map((s, i) => (
                  <div key={i} className="result-item">
                    <span className="result-name">{s.name}</span>
                    <span className="result-age">{s.age} yrs</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Deletion control sub-block */}
        <section>
          <h2 className="text-red">Danger Zone</h2>
          <form onSubmit={handleDelete} className="delete-form">
            <input placeholder="Delete Name" value={form.delete} onChange={e => updateForm('delete', e.target.value)} />
            <button type="submit">Delete</button>
          </form>
        </section>

      </div>
    </div>
  );
}
