class MyToDoApp {
    constructor() {
        this.tasks = [];
        this.currentEditingTask = null;
        this.currentScreen = 'main';
        this.draggedElement = null;
        this.swipeStartX = 0;
        this.swipeStartY = 0;
        this.swipeElement = null;
        
        this.init();
    }

    init() {
        this.showSplashScreen();
        this.loadTasksFromStorage();
        this.bindEvents();
    }

    // Splash Screen Implementation
    showSplashScreen() {
        const splash = document.getElementById('splash');
        const app = document.getElementById('app');
        
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
                app.classList.remove('hidden');
                this.renderTasks();
            }, 250);
        }, 750);
    }

    // Data Management
    loadTasksFromStorage() {
        const stored = localStorage.getItem('mytodo-tasks');
        if (stored) {
            try {
                this.tasks = JSON.parse(stored).map(task => ({
                    ...task,
                    createdAt: new Date(task.createdAt),
                    completedAt: task.completedAt ? new Date(task.completedAt) : null
                }));
            } catch (e) {
                this.tasks = [];
            }
        }
    }

    saveTasksToStorage() {
        localStorage.setItem('mytodo-tasks', JSON.stringify(this.tasks));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Task CRUD Operations
    createTask(title, memo = '') {
        const newTask = {
            id: this.generateId(),
            title: title.trim(),
            memo: memo.trim(),
            createdAt: new Date(),
            completedAt: null,
            isCompleted: false,
            isDeleted: false,
            order: this.getNextOrder(),
            isArchived: false
        };
        
        this.tasks.push(newTask);
        this.saveTasksToStorage();
        return newTask;
    }

    updateTask(id, updates) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };
            this.saveTasksToStorage();
            return this.tasks[taskIndex];
        }
        return null;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasksToStorage();
    }

    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.isCompleted = !task.isCompleted;
            task.completedAt = task.isCompleted ? new Date() : null;
            this.saveTasksToStorage();
            this.renderTasks();
        }
    }

    toggleTaskDeletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.isDeleted = !task.isDeleted;
            this.saveTasksToStorage();
            this.renderTasks();
        }
    }

    archiveTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.isArchived = true;
            this.saveTasksToStorage();
            this.renderTasks();
        }
    }

    getNextOrder() {
        return this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.order || 0)) + 1 : 1;
    }

    // UI Rendering
    renderTasks() {
        const container = document.getElementById('taskList');
        const activeTasks = this.tasks
            .filter(task => !task.isArchived)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        container.innerHTML = '';

        activeTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'flex items-center px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors group task-item';
        div.dataset.taskId = task.id;
        
        div.innerHTML = `
            <!-- Completion Checkbox -->
            <button class="flex-shrink-0 mr-3 completion-checkbox">
                ${task.isCompleted 
                    ? `<div class="w-5 h-5 bg-emerald-600 border border-emerald-600 rounded flex items-center justify-center">
                         ${this.getCheckIcon()}
                       </div>`
                    : `<div class="w-5 h-5 border-2 border-gray-600 rounded hover:border-gray-500 transition-colors"></div>`
                }
            </button>

            <!-- Task Title -->
            <div class="flex-1 min-w-0 mr-3 task-title">
                <span class="block truncate text-sm ${
                    task.isCompleted 
                        ? 'text-gray-400 line-through' 
                        : 'text-gray-200'
                }">
                    ${this.escapeHtml(task.title)}
                </span>
            </div>

            <!-- Delete Checkbox -->
            <button class="flex-shrink-0 deletion-checkbox">
                ${task.isDeleted 
                    ? `<div class="w-5 h-5 bg-red-600 border border-red-600 rounded flex items-center justify-center">
                         ${this.getXIcon()}
                       </div>`
                    : `<div class="w-5 h-5 border-2 border-gray-600 rounded hover:border-gray-500 transition-colors"></div>`
                }
            </button>
        `;

        this.bindTaskEvents(div, task);
        return div;
    }

    renderArchive() {
        const container = document.getElementById('archiveList');
        const archivedTasks = this.tasks
            .filter(task => task.isArchived)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        container.innerHTML = '';

        archivedTasks.forEach(task => {
            const taskElement = this.createArchiveTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    createArchiveTaskElement(task) {
        const div = document.createElement('div');
        div.className = 'px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors archive-item';
        div.dataset.taskId = task.id;
        
        const createdDate = this.formatDate(task.createdAt);
        const completedDate = task.completedAt ? this.formatDate(task.completedAt) : 'XXXX/XX/XX';
        
        div.innerHTML = `
            <div class="flex items-start mb-2">
                ${task.isCompleted 
                    ? `<div class="w-5 h-5 bg-emerald-600 border border-emerald-600 rounded flex items-center justify-center mr-3 mt-0.5">
                         ${this.getCheckIcon()}
                       </div>`
                    : `<div class="w-5 h-5 border-2 border-gray-600 rounded mr-3 mt-0.5"></div>`
                }
                <div class="flex-1">
                    <span class="block text-sm ${
                        task.isCompleted 
                            ? 'text-gray-400 line-through' 
                            : 'text-gray-200'
                    }">
                        ${this.escapeHtml(task.title)}
                    </span>
                </div>
            </div>
            <div class="text-xs text-gray-500 ml-8">
                ${createdDate} 〜 ${completedDate}
            </div>
        `;

        this.bindArchiveTaskEvents(div, task);
        return div;
    }

    // Custom SVG Icons
    getCheckIcon() {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-white">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>`;
    }

    getXIcon() {
        return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-white">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>`;
    }

    // Event Binding
    bindEvents() {
        // Modal events
        document.getElementById('addTaskBtn').addEventListener('click', () => this.showTaskModal());
        document.getElementById('saveTask').addEventListener('click', () => this.saveNewTask());
        document.getElementById('cancelTask').addEventListener('click', () => this.hideTaskModal());
        document.getElementById('saveDetail').addEventListener('click', () => this.saveTaskDetail());
        document.getElementById('cancelDetail').addEventListener('click', () => this.hideDetailModal());

        // Navigation events
        document.getElementById('archiveBtn').addEventListener('click', () => this.showArchiveScreen());
        document.getElementById('backBtn').addEventListener('click', () => this.showMainScreen());
        document.getElementById('backToTasksBtn').addEventListener('click', () => this.showMainScreen());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteMarkedTasks());
        document.getElementById('clearArchiveBtn').addEventListener('click', () => this.clearArchive());

        // Confirmation modal events
        document.getElementById('confirmCancel').addEventListener('click', () => this.hideConfirmModal());
        document.getElementById('confirmExecute').addEventListener('click', () => this.executeConfirmAction());

        // Modal background clicks
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') this.hideTaskModal();
        });
        document.getElementById('detailModal').addEventListener('click', (e) => {
            if (e.target.id === 'detailModal') this.hideDetailModal();
        });
        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') this.hideConfirmModal();
        });

        // Form submissions
        document.getElementById('taskTitle').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.saveNewTask();
            }
        });
    }

    bindTaskEvents(element, task) {
        const completionBtn = element.querySelector('.completion-checkbox');
        const deletionBtn = element.querySelector('.deletion-checkbox');
        const titleElement = element.querySelector('.task-title');

        completionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTaskCompletion(task.id);
        });

        deletionBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleTaskDeletion(task.id);
        });

        // Add touch events to ensure checkbox responsiveness on mobile
        completionBtn.addEventListener('touchend', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Completion checkbox touched:', task.id);
            this.toggleTaskCompletion(task.id);
        });

        deletionBtn.addEventListener('touchend', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('Deletion checkbox touched:', task.id);
            this.toggleTaskDeletion(task.id);
        });

        titleElement.addEventListener('click', () => {
            this.showTaskDetail(task);
        });

        // Swipe functionality - bind only to title area to avoid checkbox interference
        this.bindSwipeEvents(titleElement, task, element);
        
        // Drag and drop functionality
        this.bindDragEvents(element, task);
    }

    bindArchiveTaskEvents(element, task) {
        let longPressTimer;
        
        element.addEventListener('mousedown', (e) => {
            longPressTimer = setTimeout(() => {
                this.showArchiveContextMenu(task, e.clientX, e.clientY);
            }, 500);
        });

        element.addEventListener('mouseup', () => {
            clearTimeout(longPressTimer);
        });

        element.addEventListener('mouseleave', () => {
            clearTimeout(longPressTimer);
        });

        // Touch events for mobile
        element.addEventListener('touchstart', (e) => {
            longPressTimer = setTimeout(() => {
                const touch = e.touches[0];
                this.showArchiveContextMenu(task, touch.clientX, touch.clientY);
            }, 500);
        });

        element.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        });
    }

    bindSwipeEvents(swipeTarget, task, parentElement) {
        let startX, startY, startTime;
        const element = parentElement || swipeTarget;
        
        swipeTarget.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
            this.swipeElement = element;
        });

        swipeTarget.addEventListener('touchmove', (e) => {
            if (!this.swipeElement) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            
            // Only allow horizontal swipes
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                this.swipeElement = null;
                return;
            }
            
            // Apply transform for visual feedback
            if (deltaX < -20) {
                element.style.transform = `translateX(${Math.max(deltaX, -100)}px)`;
                element.style.opacity = 1 + (deltaX / 200);
                e.preventDefault();
            }
        });

        swipeTarget.addEventListener('touchend', (e) => {
            if (!this.swipeElement) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            const deltaTime = Date.now() - startTime;
            const velocity = Math.abs(deltaX) / deltaTime;
            
            // Check if it's a valid left swipe
            if (deltaX < -50 && Math.abs(deltaY) < 100 && velocity > 0.3) {
                // Archive the task
                element.classList.add('slide-left');
                setTimeout(() => {
                    this.archiveTask(task.id);
                }, 300);
            } else {
                // Reset position
                element.style.transform = '';
                element.style.opacity = '';
                element.classList.add('slide-back');
                setTimeout(() => {
                    element.classList.remove('slide-back');
                }, 200);
            }
            
            this.swipeElement = null;
        });
    }

    // Modal Management
    showTaskModal() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskNote').value = '';
        document.getElementById('taskModal').classList.remove('hidden');
        setTimeout(() => document.getElementById('taskTitle').focus(), 100);
    }

    hideTaskModal() {
        document.getElementById('taskModal').classList.add('hidden');
    }

    saveNewTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const note = document.getElementById('taskNote').value.trim();
        
        if (!title) {
            alert('Please enter a task title.');
            return;
        }
        
        this.createTask(title, note);
        this.hideTaskModal();
        this.renderTasks();
    }

    showTaskDetail(task) {
        this.currentEditingTask = task;
        document.getElementById('detailTitle').value = task.title;
        document.getElementById('detailNote').value = task.memo;
        document.getElementById('detailCreated').textContent = this.formatDateTime(task.createdAt);
        document.getElementById('detailCompleted').textContent = task.completedAt 
            ? this.formatDateTime(task.completedAt) 
            : 'Not completed';
        document.getElementById('detailModal').classList.remove('hidden');
        setTimeout(() => document.getElementById('detailTitle').focus(), 100);
    }

    hideDetailModal() {
        document.getElementById('detailModal').classList.add('hidden');
        this.currentEditingTask = null;
    }

    saveTaskDetail() {
        if (!this.currentEditingTask) return;
        
        const title = document.getElementById('detailTitle').value.trim();
        const note = document.getElementById('detailNote').value.trim();
        
        if (!title) {
            alert('Please enter a task title.');
            return;
        }
        
        this.updateTask(this.currentEditingTask.id, {
            title: title,
            memo: note
        });
        
        this.hideDetailModal();
        this.renderTasks();
    }

    // Screen Navigation
    showMainScreen() {
        document.getElementById('archiveScreen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        this.currentScreen = 'main';
        this.renderTasks();
    }

    showArchiveScreen() {
        document.getElementById('app').classList.add('hidden');
        document.getElementById('archiveScreen').classList.remove('hidden');
        this.currentScreen = 'archive';
        this.renderArchive();
    }

    // Delete Operations
    deleteMarkedTasks() {
        const markedTasks = this.tasks.filter(task => task.isDeleted && !task.isArchived);
        if (markedTasks.length === 0) {
            alert('No tasks marked for deletion.');
            return;
        }
        
        this.showConfirmModal(
            'Delete Tasks',
            `Delete ${markedTasks.length} marked task(s)?`,
            () => {
                markedTasks.forEach(task => this.deleteTask(task.id));
                this.renderTasks();
            }
        );
    }

    clearArchive() {
        const archivedTasks = this.tasks.filter(task => task.isArchived);
        if (archivedTasks.length === 0) {
            alert('Archive is already empty.');
            return;
        }
        
        this.showConfirmModal(
            'Clear Archive',
            'Clear all archived tasks?',
            () => {
                archivedTasks.forEach(task => this.deleteTask(task.id));
                this.renderArchive();
            }
        );
    }

    // Confirmation Modal
    showConfirmModal(title, message, action) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        this.confirmAction = action;
        document.getElementById('confirmModal').classList.remove('hidden');
    }

    hideConfirmModal() {
        document.getElementById('confirmModal').classList.add('hidden');
        this.confirmAction = null;
    }

    executeConfirmAction() {
        if (this.confirmAction) {
            this.confirmAction();
        }
        this.hideConfirmModal();
    }

    // Archive Context Menu (simplified for now)
    showArchiveContextMenu(task, x, y) {
        if (confirm('Copy this task to active tasks?')) {
            const newTask = this.createTask(task.title, task.memo);
            alert('Task copied to active tasks.');
            if (this.currentScreen === 'main') {
                this.renderTasks();
            }
        }
    }

    // Drag and Drop Implementation
    bindDragEvents(element, task) {
        let dragStartY = 0;
        let dragTimer = null;
        let isDragging = false;

        // Long press to start drag mode
        element.addEventListener('mousedown', (e) => {
            dragStartY = e.clientY;
            dragTimer = setTimeout(() => {
                this.startDragMode(element, task);
                isDragging = true;
            }, 500);
        });

        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            dragStartY = touch.clientY;
            dragTimer = setTimeout(() => {
                this.startDragMode(element, task);
                isDragging = true;
            }, 500);
        });

        element.addEventListener('mouseup', () => {
            clearTimeout(dragTimer);
            if (isDragging) {
                this.endDragMode();
                isDragging = false;
            }
        });

        element.addEventListener('touchend', () => {
            clearTimeout(dragTimer);
            if (isDragging) {
                this.endDragMode();
                isDragging = false;
            }
        });

        element.addEventListener('mousemove', (e) => {
            if (Math.abs(e.clientY - dragStartY) > 10) {
                clearTimeout(dragTimer);
            }
        });

        element.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (Math.abs(touch.clientY - dragStartY) > 10) {
                clearTimeout(dragTimer);
            }
        });
    }

    startDragMode(element, task) {
        if (this.currentScreen !== 'main') return;
        
        element.style.opacity = '0.7';
        element.style.transform = 'scale(1.02)';
        element.style.zIndex = '1000';
        element.style.backgroundColor = '#374151';
        
        this.draggedElement = element;
        this.draggedTask = task;
        
        // Add drop zones to other tasks
        const allTasks = document.querySelectorAll('.task-item');
        allTasks.forEach((taskEl) => {
            if (taskEl !== element) {
                taskEl.classList.add('drop-zone');
                this.bindDropEvents(taskEl);
            }
        });
    }

    bindDropEvents(element) {
        element.addEventListener('mouseenter', () => {
            if (this.draggedElement) {
                element.style.borderTop = '2px solid #059669';
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.borderTop = '';
        });

        element.addEventListener('mouseup', () => {
            if (this.draggedElement) {
                this.dropTask(element);
            }
        });

        element.addEventListener('touchend', () => {
            if (this.draggedElement) {
                this.dropTask(element);
            }
        });
    }

    dropTask(targetElement) {
        if (!this.draggedTask || !targetElement.dataset.taskId) return;
        
        const targetTaskId = targetElement.dataset.taskId;
        const targetTask = this.tasks.find(t => t.id === targetTaskId);
        
        if (targetTask && this.draggedTask.id !== targetTask.id) {
            // Reorder tasks
            this.reorderTasks(this.draggedTask.id, targetTask.order);
            this.saveTasksToStorage();
            this.renderTasks();
        }
    }

    reorderTasks(draggedTaskId, targetOrder) {
        const draggedTask = this.tasks.find(t => t.id === draggedTaskId);
        if (!draggedTask) return;

        const originalOrder = draggedTask.order;
        
        if (originalOrder < targetOrder) {
            // Moving down
            this.tasks.forEach(task => {
                if (task.order > originalOrder && task.order <= targetOrder) {
                    task.order--;
                }
            });
        } else {
            // Moving up
            this.tasks.forEach(task => {
                if (task.order >= targetOrder && task.order < originalOrder) {
                    task.order++;
                }
            });
        }
        
        draggedTask.order = targetOrder;
    }

    endDragMode() {
        if (this.draggedElement) {
            this.draggedElement.style.opacity = '';
            this.draggedElement.style.transform = '';
            this.draggedElement.style.zIndex = '';
            this.draggedElement.style.backgroundColor = '';
            this.draggedElement = null;
            this.draggedTask = null;
        }
        
        // Remove drop zones
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.classList.remove('drop-zone');
            zone.style.borderTop = '';
        });
    }

    // Utility Functions
    formatDate(date) {
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    }

    formatDateTime(date) {
        return `${this.formatDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MyToDoApp();
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}