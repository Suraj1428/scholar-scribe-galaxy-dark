
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen, Calendar, Crown } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    {
      title: 'Total Notes',
      value: '142',
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Subjects',
      value: '8',
      icon: BookOpen,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Days Active',
      value: '23',
      icon: Calendar,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      title: 'Premium',
      value: 'Pro',
      icon: Crown,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">{stat.title}</p>
                  <p className="text-white text-lg font-bold">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
