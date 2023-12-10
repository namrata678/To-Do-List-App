document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.sort((a, b) => a.done - b.done);

    const notDoneTitle = document.createElement('li');
    notDoneTitle.innerHTML = `<div class="title">Not Done Tasks</div>`;
    taskList.appendChild(notDoneTitle);

    tasks.forEach(function(task, index) {
        if (!task.done) {
            const li = createTaskElement(task, index);
            taskList.appendChild(li);
        }
    });

/*
 * To-Do List App
 * Coded by: Namrata Ingle
 * Copyright (c) 2023 Namrata Ingle. All rights reserved.
*/

    const doneTitle = document.createElement('li');
    doneTitle.innerHTML = `<div class="title">Done Tasks</div>`;
    taskList.appendChild(doneTitle);

    tasks.forEach(function(task, index) {
        if (task.done) {
            const li = createTaskElement(task, index);
            taskList.appendChild(li);
        }
    });
}

function createTaskElement(task, index) {
    const li = document.createElement('li');
    const formattedDateTime = task.dateTime ? new Date(task.dateTime).toLocaleString() : '';

    li.innerHTML = `
        <input type="checkbox" id="task${index}" onchange="toggleTask(${index})" ${task.done ? 'checked' : ''}>
        <label for="task${index}" class="${task.done ? 'done completed' : ''}">${task.text}</label>
        <span class="datetime">${formattedDateTime}</span>
        <button class="edit-button" onclick="editTask(${index})">Edit</button>
        <button class="delete-button" onclick="deleteTask(${index})">Delete</button>
        <button class="set-alarm-button" onclick="setAlarm(${index})">Set Alarm</button>
    `;
    return li;
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    const taskText = taskInput.value.trim();
    const dateTime = prompt('Enter date and time (YYYY-MM-DD HH:mm):');

    if (taskText !== '' && dateTime !== null) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push({ text: taskText, done: false, dateTime: new Date(dateTime).toISOString() });
        localStorage.setItem('tasks', JSON.stringify(tasks));

        taskInput.value = '';
        loadTasks();
    }
}

function toggleTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks[index].done = !tasks[index].done;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newText = prompt('Edit task:', tasks[index].text);

    if (newText !== null) {
        tasks[index].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function setAlarm(index) {
    const modal = document.getElementById('alarmModal');
    const alarmTimeInput = document.getElementById('alarmTime');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // If an index is provided, set the input value to the existing alarm time
    if (index !== undefined && tasks[index] && tasks[index].dateTime) {
        alarmTimeInput.value = new Date(tasks[index].dateTime).toISOString().slice(0, -8);
    } else {
        alarmTimeInput.value = ''; // Reset the input field
    }

    // Save the selected task index in a data attribute of the modal
    modal.setAttribute('data-task-index', index);

    // Display the modal
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('alarmModal');
    modal.style.display = 'none';
}

function setAlarm() {
    const alarmTimeInput = document.getElementById('alarmTime');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const selectedIndex = document.getElementById('alarmModal').getAttribute('data-task-index');

    if (selectedIndex !== null) {
        tasks[selectedIndex].dateTime = new Date(alarmTimeInput.value).toISOString();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
        closeModal();
    }
}
