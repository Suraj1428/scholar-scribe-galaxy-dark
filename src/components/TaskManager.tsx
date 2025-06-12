
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Clock, Target } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review Physics Chapter 5', completed: false, priority: 'high', time: '2 hours' },
    { id: 2, title: 'Complete Chemistry Lab Report', completed: true, priority: 'medium', time: '1 hour' },
    { id: 3, title: 'Study for Mathematics Quiz', completed: false, priority: 'high', time: '3 hours' },
    { id: 4, title: 'Read Biology Assignment', completed: false, priority: 'low', time: '1.5 hours' }
  ]);

  const [newTask, setNewTask] = useState('');

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: 'medium',
        time: '1 hour'
      }]);
      setNewTask('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Task Manager</h2>
        <div className="text-gray-400 text-sm">
          {completedTasks}/{totalTasks} completed
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white font-bold text-lg">{totalTasks}</p>
            <p className="text-gray-400 text-xs">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-white font-bold text-lg">{completedTasks}</p>
            <p className="text-gray-400 text-xs">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <p className="text-white font-bold text-lg">7.5h</p>
            <p className="text-gray-400 text-xs">Time Left</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Task */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Button onClick={addTask} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Today's Tasks</h3>
        {tasks.map((task) => (
          <Card key={task.id} className={`bg-gray-800 border-gray-700 ${task.completed ? 'opacity-60' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="border-gray-600"
                />
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <div className="flex-1">
                  <h4 className={`text-white font-medium ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-gray-400 text-sm capitalize">{task.priority} priority</span>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="h-3 w-3" />
                      {task.time}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
