class TaskManager {
    constructor() {
        this.tasks = [];
        this.initializeEventListeners();
        this.loadTasks();
    }

    initializeEventListeners() {
        // Add task button
        document.querySelector('.add-task-btn').addEventListener('click', () => {
            document.getElementById('addTaskModal').style.display = 'flex';
        });

        // Close modal
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            document.getElementById('addTaskModal').style.display = 'none';
        });

        // Add task form submission
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask(e.target);
        });

        // Search functionality
        document.querySelector('.search-bar input').addEventListener('input', (e) => {
            this.searchTasks(e.target.value);
        });

        // Task filter
        document.querySelector('.task-filters select').addEventListener('change', (e) => {
            this.filterTasks(e.target.value);
        });
    }

    async loadTasks() {
        try {
            const response = await fetch('/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            this.tasks = await response.json();
            this.updateTaskList();
            this.updateCounters();
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async createTask(form) {
        const taskData = {
            title: form.querySelector('input[type="text"]').value,
            description: form.querySelector('textarea').value,
            priority: form.querySelector('select').value,
            dueDate: form.querySelector('input[type="date"]').value,
            status: 'pending'
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(taskData)
            });

            const newTask = await response.json();
            this.tasks.push(newTask);
            this.updateTaskList();
            this.updateCounters();
            document.getElementById('addTaskModal').style.display = 'none';
            form.reset();
        } catch (error) {
            console.error('Error creating task:', error);
        }
    }

    updateTaskList() {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = this.tasks.map(task => this.createTaskCard(task)).join('');
    }

    createTaskCard(task) {
        return `
            <div class="task-card priority-${task.priority}">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                    <span class="priority">${task.priority}</span>
                </div>
                <div class="task-actions">
                    <button onclick="taskManager.toggleTaskStatus('${task._id}')">
                        ${task.status === 'completed' ? 'Reopen' : 'Complete'}
                    </button>
                    <button onclick="taskManager.deleteTask('${task._id}')">Delete</button>
                </div>
            </div>
        `;
    }

    updateCounters() {
        document.getElementById('totalTasksCounter').textContent = this.tasks.length;
        document.getElementById('completedCounter').textContent = 
            this.tasks.filter(task => task.status === 'completed').length;
        document.getElementById('pendingCounter').textContent = 
            this.tasks.filter(task => task.status === 'pending').length;
        document.getElementById('inProgressCounter').textContent = 
            this.tasks.filter(task => task.status === 'in-progress').length;
    }

    searchTasks(query) {
        const filteredTasks = this.tasks.filter(task => 
            task.title.toLowerCase().includes(query.toLowerCase()) ||
            task.description.toLowerCase().includes(query.toLowerCase())
        );
        this.renderFilteredTasks(filteredTasks);
    }

    filterTasks(priority) {
        const filteredTasks = priority === 'All Tasks' 
            ? this.tasks 
            : this.tasks.filter(task => task.priority === priority.toLowerCase());
        this.renderFilteredTasks(filteredTasks);
    }

    renderFilteredTasks(tasks) {
        const tasksList = document.getElementById('tasksList');
        tasksList.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
    }
}

// Initialize TaskManager
const taskManager = new TaskManager();
