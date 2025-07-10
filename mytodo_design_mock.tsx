import React, { useState } from 'react';
import { Plus, Archive, Trash2 } from 'lucide-react';

const MyToDoDesignMock = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Create project requirements', completed: true, deleted: false },
    { id: 2, title: 'Design UI mockup', completed: false, deleted: false },
    { id: 3, title: 'Start implementation with Claude Code', completed: false, deleted: false },
    { id: 4, title: 'Setup PWA manifest.json configuration', completed: false, deleted: true },
    { id: 5, title: 'Implement Service Worker for offline support', completed: false, deleted: false },
    { id: 6, title: 'Test', completed: true, deleted: false },
  ]);

  const toggleCompleted = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleDeleted = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, deleted: !task.deleted } : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Mobile container */}
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-medium text-white">MyToDo</h1>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Plus size={20} className="text-gray-300" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="pb-20">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-center px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors group"
            >
              {/* Completion Checkbox */}
              <button 
                onClick={() => toggleCompleted(task.id)}
                className="flex-shrink-0 mr-3"
              >
                {task.completed ? (
                  <div className="w-5 h-5 bg-emerald-600 border border-emerald-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-600 rounded hover:border-gray-500 transition-colors"></div>
                )}
              </button>

              {/* Task Title */}
              <div className="flex-1 min-w-0 mr-3">
                <span className={`block truncate text-sm ${
                  task.completed 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-200'
                }`}>
                  {task.title}
                </span>
              </div>

              {/* Delete Checkbox */}
              <button 
                onClick={() => toggleDeleted(task.id)}
                className="flex-shrink-0"
              >
                {task.deleted ? (
                  <div className="w-5 h-5 bg-red-600 border border-red-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">✕</span>
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-600 rounded hover:border-gray-500 transition-colors"></div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Swipe indicator (design hint) */}
        <div className="px-4 py-3 text-center">
          <span className="text-xs text-emerald-500 opacity-80">
            ← Swipe to Archive
          </span>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-gray-800 border-t border-gray-700">
          <div className="flex">
            <button className="flex-1 flex items-center justify-center py-4 hover:bg-gray-700 transition-colors">
              <Archive size={18} className="text-gray-300 mr-2" />
              <span className="text-sm text-gray-300">Archive</span>
            </button>
            <div className="w-px bg-gray-700"></div>
            <button className="flex-1 flex items-center justify-center py-4 hover:bg-gray-700 transition-colors">
              <Trash2 size={18} className="text-red-400 mr-2" />
              <span className="text-sm text-red-400">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyToDoDesignMock;