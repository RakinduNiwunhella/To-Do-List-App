import React from 'react'
import { useState } from 'react';
import './index.css';
import aiStar from './Components/Navbar/images/ai-star.png';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';

function ToDoList() {

    const[tasks, setTasks] = useState([]);
    const[newTask, setNewTask] = useState("");
    const [selectedDateTime, setSelectedDateTime] = useState(null);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }
    function addTask() {
    if (newTask.trim() !== "" || selectedDateTime) { // allow either
        const formattedDateTime = selectedDateTime ? selectedDateTime.format("DD/MM/YYYY hh:mm A") : null;
        setTasks(t => [...t, { 
        text: newTask.trim() !== "" ? newTask : "(No Task)", 
        dateTime: formattedDateTime 
        }]);

        // Reset inputs
        setNewTask("");
        setSelectedDateTime(null);
    }
    }

    function deleteTask(index){

        const updatedTasks = tasks.filter((_,i) => i !== index);
        setTasks(updatedTasks);

    }

    function moveTaskUp(index){
     if(index > 0 ){
        const updatedTasks = [...tasks];
        [updatedTasks[index],updatedTasks[index -1]] = [updatedTasks[index -1], updatedTasks[index]];
        setTasks(updatedTasks);
     }
    }

    function moveTaskDown(index){
     if(index < tasks.length -1 ){
        const updatedTasks = [...tasks];
        [updatedTasks[index],updatedTasks[index +1]] = [updatedTasks[index +1], updatedTasks[index]];
        setTasks(updatedTasks);
     }
    }


  return (<div className='to-do-list'>
<h1>
  <img className='aiStar' src={aiStar} alt="AI Star"  />
  To-Dooo-List
</h1>
    <div className='input-container'>
        <input className='textbox' type="text"
         name="" id=""
          placeholder='Enter a Task...'
           value={newTask} 
           onChange={handleInputChange} />
    
    <button
    className='add-button'
    onClick={addTask}>
        + Add Task
    </button>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='date-time-picker'>
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
        {tasks.map((task, index) => 
        <li key={index}><span className='text'>{task.text}<small> {task.dateTime}</small></span>
        <button
        className='delete-button'
        onClick={() => deleteTask(index)}
        >Delete</button>
        <button
        className='up-button'
        onClick={() => moveTaskUp(index)}
        >⬆️
        </button>
        <button
        className='down-button'
        onClick={() => moveTaskDown(index)}
        >⬇️
        </button>
        </li>
           )}
    </ol>


  </div>  )
}
export default ToDoList