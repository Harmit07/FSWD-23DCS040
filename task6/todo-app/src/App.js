import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // 🎤 Voice Recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) return;

    recognition.continuous = true;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Heard:', transcript);

      // ADD TASK
      if (transcript.startsWith('add ')) {
        const taskToAdd = transcript.replace('add ', '').trim();
        if (taskToAdd) {
          setTasks((prev) => [...prev, { id: Date.now(), text: taskToAdd }]);
        }
      }

      // DELETE TASK
      else if (transcript.startsWith('delete ')) {
        const taskToDelete = transcript.replace('delete ', '').trim();
        setTasks((prev) => prev.filter((t) => t.text.toLowerCase() !== taskToDelete));
      }

      // EDIT TASK
      else if (transcript.includes('edit') && transcript.includes('to')) {
        const parts = transcript.split('edit')[1].split('to');
        const oldTask = parts[0]?.trim();
        const newTask = parts[1]?.trim();
        if (oldTask && newTask) {
          setTasks((prev) =>
            prev.map((t) =>
              t.text.toLowerCase() === oldTask.toLowerCase() ? { ...t, text: newTask } : t
            )
          );
        }
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) recognition.start();
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
  };

  const handleAddTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task }]);
      setTask('');
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText } : t)));
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="container">
      <div className="todo-box">
        <h1>Get Things Done!</h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="What is the task today?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>

        <div className="voice-controls">
          <button onClick={startListening}>🎤 Start Listening</button>
          <button onClick={stopListening}>🛑 Stop</button>
        </div>

        <div className="tasks">
          {tasks.map((t) => (
            <div key={t.id} className="task">
              {editId === t.id ? (
                <>
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(t.id)}>Save</button>
                </>
              ) : (
                <>
                  <span>{t.text}</span>
                  <div className="button-group">
                    <button onClick={() => handleEdit(t.id, t.text)}>Edit</button>
                    <button onClick={() => handleDelete(t.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
