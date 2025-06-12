
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Calendar, Clock, Target, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const TaskManager = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const { toast } = useToast();

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        priority: 'medium',
        time: '1 hour'
      };
      setTasks([...tasks, task]);
      setNewTask('');
      toast({
        title: "Task Added",
        description: `"${newTask}" has been added to your tasks.`,
      });
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
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
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white">Task Manager</h2>
        <div className="text-gray-400 text-xs sm:text-sm">
          {completedTasks}/{totalTasks} completed
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 sm:p-4 text-center">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm sm:text-lg">{totalTasks}</p>
            <p className="text-gray-400 text-xs">Total Tasks</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 sm:p-4 text-center">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm sm:text-lg">{completedTasks}</p>
            <p className="text-gray-400 text-xs">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3 sm:p-4 text-center">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm sm:text-lg">{tasks.length > 0 ? `${tasks.length}h` : '0h'}</p>
            <p className="text-gray-400 text-xs">Time Left</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Task */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white text-sm sm:text-lg">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Button 
              onClick={addTask} 
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
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
          <h3 className="text-base sm:text-lg font-semibold text-white">Your Tasks</h3>
          {tasks.map((task) => (
            <Card key={task.id} className={`bg-gray-800 border-gray-700 ${task.completed ? 'opacity-60' : ''}`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-gray-600"
                  />
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-white font-medium text-sm ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-400 text-xs capitalize">{task.priority} priority</span>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Clock className="h-3 w-3" />
                        {task.time}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-red-400 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 sm:p-8 text-center">
            <Target className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">No tasks yet</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Add your first task to get organized!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskManager;
