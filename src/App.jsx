import { useState, useEffect } from 'react'
import supabase from './supabase-client'
import './App.css'

function App() {
  const [todoList, setTodoList] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
 const { data, error } = await supabase.from('Task').select('*')
    if (error) {
      console.error('Error fetching tasks:', error)
    } else {
      setTodoList(data)
    }
  }

  const addTask = async () => {
  if (!newTask) return;

  const { data, error } = await supabase
    .from('Task')   // make sure this matches your exact table name
    .insert([
      { 
        name: newTask,
        isCompleted: false
      }
    ])
    .select();

  if (error) {
    console.error('Error adding task:', error.message);
  } else {
    setNewTask('');
    fetchTasks();
  }
};
const completeTask = async (id, isCompleted) => {
const { data, error } = await supabase.from('Task')
  .update({ isCompleted: !isCompleted })
  .eq('id', id)
  .select();

if (error) {
  console.error('Error updating task:', error.message);
} else {
 const updatedTask = data[0];
 setTodoList((prevList) =>
   prevList.map((task) =>
     task.id === updatedTask.id ? { ...task, isCompleted: updatedTask.isCompleted } : task
   )
 );
}
};
const deleteTask = async (id) => {
const { data, error } = await supabase.from('Task')
  .delete()
  .eq('id', id)
  .select();

if (error) {
  console.error('Error deleting task:', error.message);
} else {

 setTodoList((prevList) =>
        prevList.filter((task) => task.id !== id)
   )
 }
};
  return (
    <div>
      <h1>To Do List</h1>

      <div>
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}> Add Task</button>
      </div>

      <ul>
        {todoList.map((task) => (
          <li key={task.id}>
          <p>{task.name}</p>
          <button onClick={() => completeTask(task.id, task.isCompleted)}>
            {task.isCompleted ? "Undo" : "Complete Task"}</button>
         <button onClick={() => deleteTask(task.id)}>Delete Task</button>
         
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App