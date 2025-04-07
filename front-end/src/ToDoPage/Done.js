import React, { useState, useEffect } from 'react';
import '../App.css';
import './ToDo.css';
import { useNavigate } from 'react-router-dom';

function Done() {

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskPopup, setShowTaskPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Make up data (change after database)
    useEffect(() => {
                const fetchTasks = async () => {
                  try {
                    const response = await fetch('http://localhost:5001/api/tasks/done');
                    const data = await response.json();
                    setTasks(data);
                  } catch (error) {
                    console.error('Error fetching tasks:', error);
                  } finally {
                    setIsLoading(false); // Loading complete
                  }
                };
                fetchTasks();
            }, []);


    // Filter tasks and sort them by deadline
    const filteredTasks = tasks
        .filter(task => task.status === 'done')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    // Generate dates from calendar for the current month(+- a week)
    const generateCalendarDates = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // Get the first day of the month and the last day of the month
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Get the day of the week for the first day of the month
        const startDay = firstDayOfMonth.getDay();

        // Get the number of days in the month
        const numDaysInMonth = lastDayOfMonth.getDate();

        // Generate the days of the month
        const days = [];
        for (let i = 1; i <= numDaysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        // Add days from the previous month to fill the first week
        for (let i = 0; i < startDay; i++) {
            days.unshift(new Date(year, month, -i));
        }

        // Add days from the next month to fill the last week
        const endDay = lastDayOfMonth.getDay();
        for (let i = 1; i <= 6 - endDay; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    };

    // Generate the calendar dates
    const calendarDates = generateCalendarDates();

    // Group tasks by their deadlines
    const calendarTasks = {};
    calendarDates.forEach(date => {
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`; // Format: "3/18"
        calendarTasks[dateKey] = tasks.filter(task => {
            const [year, month, day] = task.deadline.split('-').map(Number);
            const taskDate = new Date(year, month - 1, day);
            const taskKey = `${taskDate.getMonth() + 1}/${taskDate.getDate()}`;

            return taskKey === dateKey;
        });
    });

    const navigateToSidebar = () => {
        window.location.href = '/Sidebar'; 
        console.log("Navigate to sidebar, wait for change");
    };

    const navigateToAddTask = () => {
        window.location.href = '/addtask';
        console.log("Navigate to add task, wait for change");
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
                <div className="tab" onClick={() => window.location.href = '/inprogress'}>In progress</div>
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
                        key={task.id}
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
                                            key={task.id}
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
                                {selectedTask.deadline && <div className="task-deadline">Deadline: {selectedTask.deadline}</div>}
                            </div>
                        </div>

                        {/* Action Buttons: Edit, Delete, Close */}
                        <div className="action-buttons">
                            <button
                                className="edit-button"
                                onClick={() => {
                                    navigate('/addtask', { state: { taskData: selectedTask, isEditing: true } });
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
                                className={`uncomplete-button ${selectedTask.status === 'done' ? 'active' : ''}`}
                                onClick={() => {
                                    updateTaskStatus(selectedTask.id, 'done'); // Mark task as done
                                    window.location.href = '/todo'; // Navigate to done.js
                                }}
                            >
                                Uncomplete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Done;