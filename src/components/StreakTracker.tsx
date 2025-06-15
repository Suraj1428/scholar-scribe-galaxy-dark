
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, TrendingUp, Calendar, User } from 'lucide-react';
import { useStreakData } from '@/hooks/useStreakData';

const StreakTracker = () => {
  const { streakData, currentStreak, highestStreak, todayUploaded } = useStreakData();

  // Create staircase steps based on current streak (max 10 visible steps)
  const maxVisibleSteps = 10;
  const visibleSteps = Math.min(currentStreak + 1, maxVisibleSteps);
  const steps = Array.from({ length: visibleSteps }, (_, i) => i + 1);

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

      {/* Staircase Streak Visualization */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="text-white flex items-center gap-2 text-sm sm:text-base">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
            Upload Streak Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          {currentStreak > 0 ? (
            <div className="relative h-[200px] sm:h-[250px] flex items-end justify-center overflow-hidden">
              {/* Staircase Steps */}
              <div className="relative flex items-end space-x-1 sm:space-x-2">
                {steps.map((step, index) => {
                  const isCurrentStep = step === currentStreak;
                  const isNextStep = step === currentStreak + 1;
                  const isCompletedStep = step <= currentStreak;
                  
                  const stepHeight = 20 + (index * 15); // Increasing height for staircase effect
                  
                  return (
                    <div key={step} className="relative flex flex-col items-center">
                      {/* Step Block */}
                      <div
                        className={`relative w-8 sm:w-12 rounded-t-md transition-all duration-500 ${
                          isCompletedStep 
                            ? 'bg-gradient-to-t from-orange-600 to-orange-400 shadow-lg shadow-orange-500/30' 
                            : 'bg-gray-600 border-2 border-dashed border-gray-500'
                        }`}
                        style={{ 
                          height: `${stepHeight}px`,
                          animation: isCurrentStep ? 'pulse 2s infinite' : undefined
                        }}
                      >
                        {/* Step Number */}
                        <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold ${
                          isCompletedStep ? 'text-orange-400' : 'text-gray-500'
                        }`}>
                          {step}
                        </div>
                        
                        {/* Flame icon on completed steps */}
                        {isCompletedStep && (
                          <Flame className="absolute top-1 left-1/2 transform -translate-x-1/2 h-3 w-3 text-white" />
                        )}
                      </div>
                      
                      {/* Character on current step */}
                      {isCurrentStep && (
                        <div 
                          className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-cyan-400 animate-bounce"
                          style={{ animationDuration: '1.5s' }}
                        >
                          <User className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                      )}
                      
                      {/* Next step indicator */}
                      {isNextStep && currentStreak > 0 && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-pulse">
                          <span className="text-lg">⭐</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Show continuation dots if streak is higher than visible steps */}
                {currentStreak >= maxVisibleSteps && (
                  <div className="flex items-end text-gray-400 text-lg ml-2">
                    <span>...</span>
                  </div>
                )}
              </div>
              
              {/* Background decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded"></div>
            </div>
          ) : (
            <div className="h-[200px] sm:h-[250px] flex items-center justify-center bg-gray-750 rounded-lg">
              <div className="text-center">
                <div className="text-6xl mb-4">🏃‍♂️</div>
                <Flame className="h-8 w-8 sm:h-12 sm:w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Start uploading to begin your streak journey!</p>
              </div>
            </div>
          )}
          
          {/* Motivational Message */}
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-750 rounded-lg">
            {currentStreak === 0 ? (
              <p className="text-gray-300 text-xs sm:text-sm text-center">
                🔥 Take your first step! Upload your first note to start climbing.
              </p>
            ) : currentStreak < highestStreak ? (
              <p className="text-gray-300 text-xs sm:text-sm text-center">
                🚀 Keep climbing! You're {highestStreak - currentStreak} steps away from your highest peak!
              </p>
            ) : currentStreak === 1 ? (
              <p className="text-gray-300 text-xs sm:text-sm text-center">
                🎉 Great start! Take another step tomorrow to build momentum!
              </p>
            ) : (
              <p className="text-gray-300 text-xs sm:text-sm text-center">
                🏆 Amazing climb! You've reached step {currentStreak}. Can you reach the next level?
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakTracker;
