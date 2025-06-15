
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Clock, Target, X } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

const TaskManager = () => {
  const { tasks, loading, createTask, toggleTask, deleteTask } = useTasks();
  const [newTask, setNewTask] = useState('');

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await createTask(newTask);
      setNewTask('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-orange-100 text-orange-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-800">Loading tasks...</div>;
  }

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Task Manager</h2>
        <div className="text-gray-600 text-xs sm:text-sm">
          {completedTasks}/{totalTasks} completed
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-800 font-bold text-sm sm:text-lg">{totalTasks}</p>
            <p className="text-gray-600 text-xs">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-2" />
            <p className="text-gray-800 font-bold text-sm sm:text-lg">{completedTasks}</p>
            <p className="text-gray-600 text-xs">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-gray-800 font-bold text-sm sm:text-lg">{tasks.length - completedTasks}</p>
            <p className="text-gray-600 text-xs">Remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Task */}
      <Card className="bg-sky-50 border-sky-200">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-gray-800 text-sm sm:text-lg">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="bg-white border-sky-300 text-gray-800 placeholder-gray-500 text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button 
              onClick={handleAddTask} 
              className="bg-sky-500 hover:bg-sky-600 text-white w-full sm:w-auto"
              disabled={!newTask.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Your Tasks</h3>
          {tasks.map((task) => (
            <Card key={task.id} className={`bg-sky-50 border-sky-200 ${task.completed ? 'opacity-60' : ''}`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-sky-400"
                  />
                  <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)}`}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-gray-800 font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs capitalize px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority} priority
                      </span>
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="h-3 w-3" />
                        {task.estimated_time}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-sky-50 border-sky-200">
          <CardContent className="p-6 sm:p-8 text-center">
            <Target className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">No tasks yet</h3>
            <p className="text-gray-600 text-xs sm:text-sm">Add your first task to get organized!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskManager;
