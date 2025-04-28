import React, { useState, useEffect } from 'react';
import '../App.css';
import './ToDo.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

function Done() {

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskPopup, setShowTaskPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setShowSidebar(!showSidebar);
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Make up data (change after database)
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const userEmail = localStorage.getItem('userEmail');
                const response = await fetch(
                    `http://localhost:5001/api/tasks/done?userEmail=${encodeURIComponent(userEmail)}`
                );
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                // Ensure we have an array, even if empty
                setTasks(Array.isArray(data) ? data : []);

                // Fetch calendar data
                const calendarResponse = await fetch('http://localhost:5001/api/calendar');
                if (!calendarResponse.ok) throw new Error('Calendar fetch failed');
                const calendarData = await calendarResponse.json();
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setTasks([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);


    // Filter tasks and sort them by deadline
    const filteredTasks = tasks
        .filter(task => task.status === 'done')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Generate dates from calendar for the current month(+- a week)
    // Generate dates from calendar for the current month(- 7 days, +14 days)
    const generateCalendarDates = () => {
        const now = new Date();
        const days = [];

        // Add 7 days before today
        for (let i = 7; i > 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            days.push(date);
        }

        // Add today
        days.push(new Date(now));

        // Add 14 days after today
        for (let i = 1; i <= 14; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            days.push(date);
        }

        return days;
    };


    // Generate the calendar dates
    const calendarDates = generateCalendarDates();

    // Group tasks by their deadlines
    const calendarTasks = {};
    calendarDates.forEach(date => {
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
        calendarTasks[dateKey] = tasks.filter(task => {
            if (!task.deadline) return false;
            const taskDate = new Date(task.deadline);
            return (
                taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear()
            );
        });
    });

    /*
    const navigateToSidebar = () => {
        window.location.href = '/Sidebar';
        console.log("Navigate to sidebar, wait for change");
    };
    */

    const navigateToAddTask = () => {
        navigate('/addtask');
        console.log("Navigate to add task, wait for change");
    };

    // Update task status
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
          console.log("Updating task status for ID:", taskId, "to:", newStatus);
          
          // Update the backend
          const userEmail = localStorage.getItem('userEmail'); 
          const response = await fetch(
            `http://localhost:5001/api/tasks/${taskId}/status?userEmail=${encodeURIComponent(userEmail)}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
            }
          );
      
          if (!response.ok) {
            console.error("Server response not OK:", response.status);
            throw new Error('Failed to update task status');
          }

          const updatedTask = await response.json();
          console.log("Task updated successfully:", updatedTask);
      
          // Update local state - using MongoDB _id
          setTasks(prevTasks => prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus} : task
          ));
          
          if (selectedTask && selectedTask._id === taskId) {
            setSelectedTask({ ...selectedTask, status: newStatus });
          }
      
          return true; // Success
        } catch (error) {
          console.error('Error updating task status:', error);
          return false; // Failure
        }
    };

    // Delete a task
    const deleteTask = (taskId) => {
        console.log("Deleting task with ID:", taskId);
        const userEmail = localStorage.getItem('userEmail');
        fetch(`http://localhost:5001/api/tasks/${taskId}?userEmail=${encodeURIComponent(userEmail)}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete task');
                return response.json();
            })
            .then(deletedTask => {
                console.log("Task deleted successfully:", deletedTask);
                // Update local state using MongoDB _id
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
                if (selectedTask && selectedTask._id === taskId) {
                    setSelectedTask(null);
                    setShowTaskPopup(false);
                }
            })
            .catch(err => console.error("Error deleting task:", err));
    };


    return (
        <div className="task-board">
            <div className="board-header">
                <button className="sidebar-button" onClick={toggleSidebar}>☰</button>
                <button className="add-task-button" onClick={navigateToAddTask}>+</button>
            </div>

            {showSidebar && (
                <div className="sidebar-overlay">
                    <Sidebar />
                    <button className="close-sidebar-btn" onClick={toggleSidebar}>
                        ✕
                    </button>
                </div>
            )}

            <div className="status-tabs">
                <div className="tab" onClick={() => navigate('/todo')}>To do</div>
                <div className="tab" onClick={() => navigate('/inprogress')}>In progress</div>
                <div className="tab active">Done</div>
            </div>

            <div className="tasks-list">
                {isLoading ? (
                    <div className="loading-message">Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="empty-message">No tasks found</div>
                ) : (
                    filteredTasks.map(task => (
                        <div
                            key={task._id}
                            className="task-item"
                            onClick={() => {
                                setSelectedTask(task);
                                setShowTaskPopup(true);
                            }}
                        >
                            <div className="task-title">{task.title}</div>
                        </div>
                    ))
                )}
            </div>

            <div className="calendar-section">
                <div className="calendar-scroll-container">
                    {calendarDates.map((date, index) => {
                        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
                        return (
                            <div key={index} className="date-column">
                                <div className="date-header">{dateKey}</div>
                                <div className="date-tasks">
                                    {calendarTasks[dateKey] && calendarTasks[dateKey].map(task => (
                                        <div
                                            key={task._id}
                                            className="grid-task"
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setShowTaskPopup(true);
                                            }}
                                        >
                                            {task.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Popup screen */}
            {showTaskPopup && selectedTask && (
                <div className="task-popup-overlay">
                    <div className="task-detail-popup">
                        <div className="tasks-preview">
                            <div className="task-item selected">
                                <div className="task-title">{selectedTask.title}</div>
                                {selectedTask.deadline && <div className="task-deadline">Deadline: {formatDate(selectedTask.deadline)}</div>}
                            </div>
                        </div>

                        {/* Action Buttons: Edit, Delete, Close 
                         <button
                                className="edit-button"
                                onClick={() => {
                                    navigate('/addtask', { state: { taskData: selectedTask, isEditing: true } });
                                }}
                            >
                                Edit
                            </button>
                        */}
                        <div className="action-buttons">
                           
                            <button className="delete-button" onClick={() => deleteTask(selectedTask._id)}>Delete</button>
                            <button className="close-button" onClick={() => setShowTaskPopup(false)}>Close</button>
                        </div>

                        <div className="task-details">
                            <div className="detail-item">Information of task:</div>
                            <div className="detail-item">Name: {selectedTask.title}</div>
                            <div className="detail-item">Deadline: {formatDate(selectedTask.deadline)}</div>
                            <div className="detail-item">Category: {selectedTask.status}</div>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
}

export default Done;