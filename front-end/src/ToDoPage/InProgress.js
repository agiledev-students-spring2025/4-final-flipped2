import React, { useState } from 'react';
import '../App.css';
import './ToDo.css';
import { useNavigate } from 'react-router-dom';

function InProgress() {
    const navigate = useNavigate();
    // Make up data (change after database)
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Learn Java', status: 'in-progress', deadline: '2025-03-18' },
        { id: 2, title: 'Build a timer App', status: 'in-progress', deadline: '2025-03-19' },
        { id: 3, title: 'Develop Project', status: 'in-progress', deadline: '2025-03-19' },
        { id: 4, title: 'Fix js Bugs', status: 'in-progress', deadline: '2025-03-20' },
        { id: 5, title: 'remove Unit Tests', status: 'in-progress', deadline: '2025-03-20' },
        { id: 6, title: 'Update readme', status: 'in-progress', deadline: '2025-03-21' },
        { id: 7, title: 'make ppt', status: 'in-progress', deadline: '2025-03-21' }
    ]);

    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskPopup, setShowTaskPopup] = useState(false);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

    // Filter tasks and sort them by deadline
    const filteredTasks = tasks
        .filter(task => task.status === 'in-progress')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Current task for the overview section
    const currentTask = filteredTasks[currentTaskIndex] || null;

    const navigateToSidebar = () => {
        console.log("Navigate to sidebar, wait for change");
    };

    const navigateToAddTask = () => {
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
    const updateTaskStatus = (taskId, newStatus) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
        if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask({ ...selectedTask, status: newStatus });
        }
    };

    // Delete a task
    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        if (selectedTask && selectedTask.id === taskId) {
            setSelectedTask(null);
            setShowTaskPopup(false);
        }
    };

    return (
        <div className="task-board">
            <div className="board-header">
                <button className="sidebar-button" onClick={navigateToSidebar}>☰</button>
                <button className="add-task-button" onClick={navigateToAddTask}>+</button>
            </div>

            <div className="status-tabs">
                <div className="tab" onClick={() => window.location.href = '/todo'}>To do</div>
                <div className="tab active">In progress</div>
                <div className="tab" onClick={() => window.location.href = '/done'}>Done</div>
            </div>

            <div className="tasks-list">
                {filteredTasks.map((task, index) => (
                    <div
                        key={task.id}
                        className={`task-item ${index === currentTaskIndex ? 'highlighted' : ''}`}
                        onClick={() => {
                            setSelectedTask(task);
                            setShowTaskPopup(true);
                        }}
                    >
                        <div className="task-title">{task.title}</div>
                    </div>
                ))}
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
                            <p>Deadline: {currentTask.deadline}</p>
                            <p>Status: {currentTask.status}</p>
                        </div>

                        {/* Start working button inside the overview section */}
                        <div className="navigate-timer-container">
                            <button
                                className="navigate-timer-button"
                                onClick={() => {
                                    window.location.href = '/pomodoro'; // Navigate to timerwfc.js
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
                                {selectedTask.deadline && <div className="task-deadline">Deadline: {selectedTask.deadline}</div>}
                            </div>
                        </div>

                        {/* Action Buttons: Edit, Delete, Close */}
                        <div className="action-buttons">
                            <button
                                className="edit-button"
                                onClick={() => {
                                    window.location.href = '/addEventwfc'; // Navigate to addEventwfc.js
                                }}
                            >
                                Edit
                            </button>
                            <button className="delete-button" onClick={() => deleteTask(selectedTask.id)}>Delete</button>
                            <button className="close-button" onClick={() => setShowTaskPopup(false)}>Close</button>
                        </div>

                        <div className="task-details">
                            <div className="detail-item">Information of task:</div>
                            <div className="detail-item">Name: {selectedTask.title}</div>
                            <div className="detail-item">Deadline: {selectedTask.deadline}</div>
                            <div className="detail-item">Category: {selectedTask.status}</div>
                        </div>

                        {/* Status Buttons: Work on, Complete */}
                        <div className="status-buttons">
                            <button
                                className={`work-button ${selectedTask.status === 'in-progress' ? 'active' : ''}`}
                                onClick={() => {
                                    window.location.href = '/pomodoro'; // Navigate to timerwfc.js
                                }}
                            >
                                Work on
                            </button>
                            <button
                                className={`complete-button ${selectedTask.status === 'done' ? 'active' : ''}`}
                                onClick={() => {
                                    updateTaskStatus(selectedTask.id, 'done');
                                    window.location.href = '/done'; // Navigate to done.js
                                }}
                            >
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InProgress;