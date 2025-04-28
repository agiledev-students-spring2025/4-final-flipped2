import React, { useState, useEffect } from 'react';
import '../App.css';
import './ToDo.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';

function InProgress() {

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskPopup, setShowTaskPopup] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
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

    // Connecting to database
    useEffect(() => {
            const fetchTasks = async () => {
                try {
                    const userEmail = localStorage.getItem('userEmail');
                    const response = await fetch(
                        `${process.env.REACT_APP_API_URL}/api/tasks/in-progress?userEmail=${encodeURIComponent(userEmail)}`
                    );
                    if (!response.ok) throw new Error('Network response was not ok');
    
                    const data = await response.json();
                    // Ensure we have an array, even if empty
                    setTasks(Array.isArray(data) ? data : []);
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
        .filter(task => task.status === 'in-progress')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Current task for the overview section
    const currentTask = filteredTasks[currentTaskIndex] || null;

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

    // Navigate to previous task
    const goToPreviousTask = () => {
        if (currentTaskIndex > 0) {
            setCurrentTaskIndex(currentTaskIndex - 1);
        }
    };

    // Navigate to next task
    const goToNextTask = () => {
        if (currentTaskIndex < filteredTasks.length - 1) {
            setCurrentTaskIndex(currentTaskIndex + 1);
        }
    };

    // Update task status
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
          console.log("Updating task status for ID:", taskId, "to:", newStatus);
          
          // Update the backend
          const userEmail = localStorage.getItem('userEmail'); 
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/status?userEmail=${encodeURIComponent(userEmail)}`,
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
            task._id === taskId ? { ...task, status: newStatus } : task
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
        fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}?userEmail=${encodeURIComponent(userEmail)}`, {
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
                <div className="tab active">In progress</div>
                <div className="tab" onClick={() => navigate('/done')}>Done</div>
            </div>

            <div className="tasks-list">
                {isLoading ? (
                    <div className="loading-message">Loading tasks...</div>
                ) : filteredTasks.length === 0 ? (
                    <div className="empty-message">No tasks found</div>
                ) : (
                    filteredTasks.map((task, index) => (
                    <div
                        key={task._id}
                        className={`task-item ${index === currentTaskIndex ? 'highlighted' : ''}`}
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

            {/* Current Task Overview with integrated button */}
            <div className="current-task-overview">
                <div className="overview-header">
                    <h3>Current Task</h3>
                    <div className="task-navigation">
                        <button
                            className="nav-button"
                            onClick={goToPreviousTask}
                            disabled={currentTaskIndex === 0}
                        >
                            ▲
                        </button>
                        <button
                            className="nav-button"
                            onClick={goToNextTask}
                            disabled={currentTaskIndex === filteredTasks.length - 1}
                        >
                            ▼
                        </button>
                    </div>
                </div>

                {currentTask ? (
                    <>
                        <div className="current-task-details">
                            <h2>{currentTask.title}</h2>
                            <p>Deadline: {formatDate(currentTask.deadline)}</p>
                            <p>Status: {currentTask.status}</p>
                        </div>

                        {/* Start working button inside the overview section */}
                        <div className="navigate-timer-container">
                            <button
                                className="navigate-timer-button"
                                onClick={() => {
                                    navigate('/pomodoro'); // Navigate to timerwfc.js
                                }}
                            >
                                Start working
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="no-tasks-message">
                            <p>No tasks in progress</p>
                        </div>

                        {/* Disabled button for when no tasks are available */}
                        <div className="navigate-timer-container">
                            <button
                                className="navigate-timer-button"
                                disabled
                            >
                                Start working
                            </button>
                        </div>
                    </>
                )}
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

                        {/* Status Buttons: Work on, Complete 
                        <div className="status-buttons">
                            <button
                                className={`work-button ${selectedTask.status === 'in-progress' ? 'active' : ''}`}
                                onClick={() => {
                                    setShowTaskPopup(false);
                                    navigate('/pomodoro'); // Navigate to timerwfc.js
                                }}
                            
                            >
                                Work on
                            </button>
                            <button
                                className={`complete-button ${selectedTask.status === 'done' ? 'active' : ''}`}
                                onClick={async () => {
                                    console.log("Complete button clicked for task ID:", selectedTask._id);
                                    const success = await updateTaskStatus(selectedTask._id, 'done');
                                    if (success) {
                                        setShowTaskPopup(false);
                                        // navigate('/done'); // Navigate to done.js
                                    }
                            
                                }}
                            >
                                Complete
                            </button>
                        </div>
                        */}
                        
                    </div>
                </div>
            )}
        </div>
    );
}

export default InProgress;