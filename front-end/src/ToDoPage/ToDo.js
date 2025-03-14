import React, { useState } from 'react';
import '../App.css';
import './ToDo.css';
import { useNavigate } from 'react-router-dom';

function ToDo() {
    const navigate = useNavigate();
    // Make up data (change after database)
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Learn React', status: 'todo', deadline: '2025-03-18' },
        { id: 2, title: 'Build a ToDo App', status: 'todo', deadline: '2025-03-19' },
        { id: 3, title: 'Develop Project', status: 'todo', deadline: '2025-03-19' },
        { id: 4, title: 'Fix UI Bugs', status: 'todo', deadline: '2025-03-20' },
        { id: 5, title: 'Add Unit Tests', status: 'todo', deadline: '2025-03-20' },
        { id: 6, title: 'Update Documentation', status: 'todo', deadline: '2025-03-21' },
        { id: 7, title: 'Present to Team', status: 'todo', deadline: '2025-03-21' }
    ]);

    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskPopup, setShowTaskPopup] = useState(false);

    // Sort tasks by deadline
    const filteredTasks = tasks
        .filter(task => task.status === 'todo')
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

    // Insert tasks by their deadlines
    const calendarTasks = {};
    calendarDates.forEach(date => {
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`; // Format: "3/18"
        calendarTasks[dateKey] = tasks.filter(task => {
            const [year, month, day] = task.deadline.split('-').map(Number);
            const taskDate = new Date(year, month - 1, day);
            const taskKey = `${taskDate.getMonth() + 1}/${taskDate.getDate()}`;

            // console.log("date key is ", dateKey, "\n taskDate is ", taskDate, "\n taskKey is ", taskKey)

            // if (taskKey === dateKey) {
            //    console.log("succees \n task key is ", taskKey, "\n date key is ", dateKey)
            //}
            return taskKey === dateKey;
        });
    });

    const navigateToSidebar = () => {
        // window.location.href = '/sideBar'; 
        console.log("Navigate to sidebar, wait for change");
    };

    const navigateToAddTask = () => {
        navigate('/addtask');
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
                <div className="tab active">To do</div>
                <div className="tab" onClick={() => window.location.href = '/inprogress'}>In progress</div>
                <div className="tab" onClick={() => window.location.href = '/done'}>Done</div>
            </div>

            <div className="tasks-list">
                {filteredTasks.map(task => (
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
                ))}
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

            {/* Popup window */}
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
                                    updateTaskStatus(selectedTask.id, 'done'); // Mark task as done
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

export default ToDo;