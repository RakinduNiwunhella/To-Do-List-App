import React, { useEffect, useState } from 'react';
import './index.css';
import aiStar from './Components/Navbar/images/ai-star.png';
import deleteIcon from './delete.svg';
import upIcon from './up.svg';
import downIcon from './down.svg';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import * as chrono from 'chrono-node';



const API_KEY = 'b4293e8acc52bccac8ed5e8114591955'; //  OpenWeatherMap API key



function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/tasks/')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const getWeather = async (date) => {
    if (!date) return null;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=Colombo&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    const forecast = data.list.find((item) => {
      const forecastDate = new Date(item.dt_txt);
      return (
        forecastDate.getFullYear() === date.getFullYear() &&
        forecastDate.getMonth() === date.getMonth() &&
        forecastDate.getDate() === date.getDate()
      );
    });

    if (forecast) {
      const weatherId = forecast.weather[0].id;
      if (weatherId >= 200 && weatherId < 300) return '⛈️'; // Thunderstorm
      if (weatherId >= 300 && weatherId < 600) return '🌧️'; // Drizzle/Rain
      if (weatherId >= 600 && weatherId < 700) return '❄️'; // Snow
      if (weatherId >= 700 && weatherId < 800) return '🌫️'; // Atmosphere
      if (weatherId === 800) return '☀️'; // Clear
      if (weatherId > 800) return '☁️'; // Clouds
    }

    return '❓'; // No data
  };



  const addTask = async () => {
    if (newTask.trim() !== '' || selectedDateTime) {
      let taskText = newTask.trim();

      // Parse natural language date/time
      const results = !selectedDateTime ? chrono.parse(taskText) : [];
      let parsedDate = null;

      if (results.length > 0) {
        parsedDate = results[0].start.date();

        // Remove detected date/time text from task string
        const { index, text } = results[0];
        taskText =
          taskText.slice(0, index).trim() +
          ' ' +
          taskText.slice(index + text.length).trim();
        taskText = taskText.trim();
      }

      const dateToUse = selectedDateTime
        ? selectedDateTime.toDate()
        : parsedDate || null;

      const formattedDateTime = dateToUse
        ? new Date(dateToUse).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : null;

      const weatherEmoji = await getWeather(dateToUse);

      const res = await fetch('http://localhost:8000/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: taskText !== '' ? taskText : '(No Task)',
          date_time: formattedDateTime,
          weather: weatherEmoji,
        }),
      });
      const created = await res.json();
      setTasks(prev => [...prev, created]);

      setNewTask('');
      setSelectedDateTime(null);
    }
  };

async function deleteTask(taskId) {
  await fetch(`http://localhost:8000/tasks/${taskId}`,{method:'DELETE'});
  setTasks(prev => prev.filter(t => t.id !== taskId));
}
async function generateSubtasks(taskId){
  const res = await fetch(`http://localhost:8000/tasks/${taskId}/subtasks`,{method: 'POST'});
  const updated = await res.json();
  setTasks(prev => prev.map(t => t.id==taskId ? updated : t));
}

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] = [
        updatedTasks[index - 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] = [
        updatedTasks[index + 1],
        updatedTasks[index],
      ];
      setTasks(updatedTasks);
    }
  }
  const [isListening, setIsListening] = useState(false);
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if(!SpeechRecognition){
      alert('Voice input is not supported in this browser. Try Chrome');
      return;
    }
  

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => setIsListening(true);
  recognition.onend = () => setIsListening(false);
  recognition.onerror = () => setIsListening(false);

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setNewTask(transcript);
  };

  recognition.start();
  }

  return (
    <div className="to-do-list">
      <h1>
        <img className="aiStar" src={aiStar} alt="AI Star" />
        To-Do List
      </h1>
      <p className="subtitle">Your intelligent task companion</p>

      <div className="input-container">
        <div className="input-row">
          <input
            className="textbox"
            type="text"
            placeholder="Enter a task... or try natural language"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />

          <button className={`mic-button ${isListening ? 'mic-listening': ''}`}
                  title={isListening ? 'Listening...' : 'Voice Input'}
                  onClick={startVoiceInput}>

            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>


          <button className="add-button" onClick={addTask}>
            + Add Task
          </button>
        </div>

        <div className="date-time-row">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="date-time-picker">
              <DateTimePicker
                value={selectedDateTime}
                onChange={(newValue) => setSelectedDateTime(newValue)}
              >
                <TextField />
              </DateTimePicker>
            </div>
          </LocalizationProvider>
        </div>

        <p className='example-text'>💡 Try: "Call dentist tomorrow morning" · "Team meeting Friday 2pm" · "Buy groceries urgent"</p>
      </div>

      {tasks.length > 0 && (
        <div className="tasks-header">
          <span className="tasks-title">Tasks</span>
          <span className="tasks-count">{tasks.length}</span>
        </div>
      )}

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✓</div>
            <p>No tasks yet — add one above!</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={index}
              className={index === 0 ? "task-tile-full" : "task-tile"}
            >
              <div className="text">
                <span className="task-main-text">{task.text}</span>
                {(task.date_time || task.weather) && (
                  <div className="task-meta">
                    {task.date_time && <small className="formattedDate">{task.date_time}</small>}
                    {task.weather && <span className="weather">{task.weather}</span>}
                  </div>
                )}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="subtasks">
                    {task.subtasks.map((sub) => {
                      const links = sub.links ? JSON.parse(sub.links) : [];
                      return (
                        <div key={sub.id} className="subtask-item">
                          <span className="subtask-dot">›</span>
                          <span className="subtask-text">{sub.text}</span>
                          {links.length > 0 && (
                            <div className="subtask-links">
                              {links.map((l) => (
                                <span key={l.item} className="subtask-link-group">
                                  <span className="subtask-link-label">{l.item}:</span>
                                  <a href={l.google} target="_blank" rel="noopener noreferrer" className="subtask-link">🛒 Google</a>
                                  <a href={l.amazon} target="_blank" rel="noopener noreferrer" className="subtask-link">📦 Amazon</a>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="buttons-container">
                  <button className="subtask-button" onClick={() => generateSubtasks(task.id)} title="Generate subtasks">
                    ✨
                  </button>
                <button className="delete-button" onClick={() => deleteTask(task.id)}>
                  <img src={deleteIcon} alt="Delete Task" />
                </button>
                <button className="up-button" onClick={() => moveTaskUp(index)}>
                  <img src={upIcon} alt="Task Up" />
                </button>
                <button className="down-button" onClick={() => moveTaskDown(index)}>
                  <img src={downIcon} alt="Task Down" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ToDoList;