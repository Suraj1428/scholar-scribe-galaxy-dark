
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Flame, TrendingUp, Calendar } from 'lucide-react';

const StreakTracker = () => {
  // Empty data - will be populated when connected to backend
  const streakData: { day: string; streak: number }[] = [];

  // Initial values - will be updated from backend
  const currentStreak: number = 0;
  const highestStreak: number = 0;
  const todayUploaded: boolean = false;

  const chartConfig = {
    streak: {
      label: "Streak Days",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
      {/* Streak Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Current</p>
                <p className="text-orange-400 text-sm sm:text-lg font-bold">{currentStreak}</p>
              </div>
              <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20">
                <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Best</p>
                <p className="text-purple-400 text-sm sm:text-lg font-bold">{highestStreak}</p>
              </div>
              <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/20">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Today</p>
                <p className={`text-sm sm:text-lg font-bold ${todayUploaded ? 'text-green-400' : 'text-red-400'}`}>
                  {todayUploaded ? '✓' : '✗'}
                </p>
              </div>
              <div className={`p-1.5 sm:p-2 rounded-lg ${todayUploaded ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <Calendar className={`h-3 w-3 sm:h-4 sm:w-4 ${todayUploaded ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Graph */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            Upload Streak Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          {streakData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[150px] sm:h-[200px]">
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
          ) : (
            <div className="h-[150px] sm:h-[200px] flex items-center justify-center bg-gray-750 rounded-lg">
              <div className="text-center">
                <Flame className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Start uploading to see your streak!</p>
              </div>
            </div>
          )}
          
          {/* Motivational Message */}
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-750 rounded-lg">
            {currentStreak === 0 ? (
              <p className="text-gray-300 text-xs sm:text-sm text-center">
                🔥 Start your streak today! Upload your first note to begin.
              </p>
            ) : currentStreak < highestStreak ? (
              <p className="text-gray-300 text-xs sm:text-sm text-center">
                🚀 Keep going! You're {highestStreak - currentStreak} days away from your best streak!
              </p>
            ) : (
              <p className="text-gray-300 text-xs sm:text-sm text-center">
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
