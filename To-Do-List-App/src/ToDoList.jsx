import React, { useState } from 'react';
import './index.css';
import aiStar from './Components/Navbar/images/ai-star.png';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import * as chrono from 'chrono-node';


const API_KEY = 'b4293e8acc52bccac8ed5e8114591955'; // Replace with your OpenWeatherMap API key


function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);

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

      setTasks((t) => [
        ...t,
        {
          text: taskText !== '' ? taskText : '(No Task)',
          dateTime: formattedDateTime,
          weather: weatherEmoji,
        },
      ]);

      setNewTask('');
      setSelectedDateTime(null);
    }
  };

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
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

  return (
    <div className="to-do-list">
      <h1>
        <img className="aiStar" src={aiStar} alt="AI Star" />
        To-Dooo-List
      </h1>
      <div className="input-container">
        <input
          className="textbox"
          type="text"
          name=""
          id=""
          placeholder="Enter a Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-button" onClick={addTask}>
          + Add Task
        </button>
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

      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            <span className="text">
              {task.text}
              <small className='formattedDate' > {task.dateTime}</small>
              <span className="weather"> {task.weather}</span>
            </span>
            <button
              className="delete-button"
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
            <button className="up-button" onClick={() => moveTaskUp(index)}>
              ⬆️
            </button>
            <button
              className="down-button"
              onClick={() => moveTaskDown(index)}
            >
              ⬇️
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;