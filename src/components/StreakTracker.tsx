
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Flame, TrendingUp, Calendar } from 'lucide-react';

const StreakTracker = () => {
  // Mock data for the last 30 days
  const streakData = [
    { day: 'Day 1', streak: 1 },
    { day: 'Day 2', streak: 2 },
    { day: 'Day 3', streak: 3 },
    { day: 'Day 4', streak: 4 },
    { day: 'Day 5', streak: 5 },
    { day: 'Day 6', streak: 6 },
    { day: 'Day 7', streak: 7 },
    { day: 'Day 8', streak: 0 }, // streak broken
    { day: 'Day 9', streak: 1 },
    { day: 'Day 10', streak: 2 },
    { day: 'Day 11', streak: 3 },
    { day: 'Day 12', streak: 4 },
    { day: 'Day 13', streak: 5 },
    { day: 'Day 14', streak: 6 },
    { day: 'Day 15', streak: 7 },
    { day: 'Day 16', streak: 8 },
    { day: 'Day 17', streak: 9 },
    { day: 'Day 18', streak: 10 },
    { day: 'Day 19', streak: 11 },
    { day: 'Day 20', streak: 12 }
  ];

  // Dynamic streak values that can change
  const currentStreak: number = 12;
  const highestStreak: number = 15;
  const todayUploaded: boolean = true;

  const chartConfig = {
    streak: {
      label: "Streak Days",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="p-4 space-y-4">
      {/* Streak Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Current</p>
                <p className="text-orange-400 text-lg font-bold">{currentStreak}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Flame className="h-4 w-4 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Best</p>
                <p className="text-purple-400 text-lg font-bold">{highestStreak}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Today</p>
                <p className={`text-lg font-bold ${todayUploaded ? 'text-green-400' : 'text-red-400'}`}>
                  {todayUploaded ? '✓' : '✗'}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${todayUploaded ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <Calendar className={`h-4 w-4 ${todayUploaded ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Graph */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            Upload Streak Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={streakData}>
                <defs>
                  <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  tick={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="streak"
                  stroke="#f97316"
                  fillOpacity={1}
                  fill="url(#streakGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* Motivational Message */}
          <div className="mt-4 p-3 bg-gray-750 rounded-lg">
            {currentStreak === 0 ? (
              <p className="text-gray-300 text-sm text-center">
                🔥 Start your streak today! Upload your first note to begin.
              </p>
            ) : currentStreak < highestStreak ? (
              <p className="text-gray-300 text-sm text-center">
                🚀 Keep going! You're {highestStreak - currentStreak} days away from your best streak!
              </p>
            ) : (
              <p className="text-gray-300 text-sm text-center">
                🎉 Amazing! You've matched your best streak. Can you break your record?
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakTracker;
