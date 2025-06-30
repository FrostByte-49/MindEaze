/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format, subDays, startOfDay } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MoodChartProps {
  onBack: () => void;
}

interface MoodEntry {
  mood: string;
  note: string;
  timestamp: string;
  value: number;
}

export const MoodChart: React.FC<MoodChartProps> = ({ onBack }) => {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('mindease_moods') || '[]');
    setMoodData(saved);
  }, []);

  const getDaysInRange = () => {
    const days = timeRange === 'week' ? 7 : 30;
    const today = startOfDay(new Date());
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      return {
        date,
        label: timeRange === 'week' 
          ? format(date, 'EEE') 
          : format(date, 'MMM d')
      };
    });
  };

  const processChartData = () => {
    const days = getDaysInRange();
    
    const chartData = days.map(({ date, label }) => {
      const dayEntries = moodData.filter(entry => {
        const entryDate = startOfDay(new Date(entry.timestamp));
        return entryDate.getTime() === date.getTime();
      });
      
      const averageMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, entry) => sum + entry.value, 0) / dayEntries.length
        : null;
      
      return {
        label,
        value: averageMood,
        entries: dayEntries.length
      };
    });

    return chartData;
  };

  const chartData = processChartData();
  const validData = chartData.filter(d => d.value !== null);

  const lineChartData = {
    labels: chartData.map(d => d.label),
    datasets: [
      {
        label: 'Mood Level',
        data: chartData.map(d => d.value),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: chartData.map(d => d.label),
    datasets: [
      {
        label: 'Mood Level',
        data: chartData.map(d => d.value),
        backgroundColor: chartData.map(d => {
          if (d.value === null) return 'rgba(229, 231, 235, 0.5)';
          if (d.value >= 4.5) return 'rgba(34, 197, 94, 0.8)';
          if (d.value >= 3.5) return 'rgba(163, 230, 53, 0.8)';
          if (d.value >= 2.5) return 'rgba(251, 191, 36, 0.8)';
          if (d.value >= 1.5) return 'rgba(251, 146, 60, 0.8)';
          return 'rgba(239, 68, 68, 0.8)';
        }),
        borderColor: chartData.map(d => {
          if (d.value === null) return 'rgba(229, 231, 235, 1)';
          if (d.value >= 4.5) return 'rgba(34, 197, 94, 1)';
          if (d.value >= 3.5) return 'rgba(163, 230, 53, 1)';
          if (d.value >= 2.5) return 'rgba(251, 191, 36, 1)';
          if (d.value >= 1.5) return 'rgba(251, 146, 60, 1)';
          return 'rgba(239, 68, 68, 1)';
        }),
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            const data = chartData[dataIndex];
            return data.label;
          },
          label: (context: any) => {
            const value = context.parsed.y;
            if (value === null) return 'No mood logged';
            
            const moodLabels = {
              5: 'Amazing 😄',
              4: 'Good 😊',
              3: 'Okay 😐',
              2: 'Not Great 😟',
              1: 'Difficult 😢'
            };
            
            const rounded = Math.round(value);
            return `${moodLabels[rounded as keyof typeof moodLabels]} (${value.toFixed(1)})`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        min: 1,
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            const labels = ['', 'Difficult', 'Not Great', 'Okay', 'Good', 'Amazing'];
            return labels[value] || '';
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const getAverageMood = () => {
    if (validData.length === 0) return null;
    const sum = validData.reduce((acc, d) => acc + d.value!, 0);
    return sum / validData.length;
  };

  const getTrend = () => {
    if (validData.length < 2) return null;
    
    const recent = validData.slice(-3);
    const earlier = validData.slice(0, Math.max(1, validData.length - 3));
    
    const recentAvg = recent.reduce((sum, d) => sum + d.value!, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, d) => sum + d.value!, 0) / earlier.length;
    
    const diff = recentAvg - earlierAvg;
    
    if (diff > 0.2) return 'improving';
    if (diff < -0.2) return 'declining';
    return 'stable';
  };

  const averageMood = getAverageMood();
  const trend = getTrend();

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Mood Trends</h1>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'week' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              timeRange === 'month' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            Month
          </button>
        </div>
        
        <button
          onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {chartType === 'line' ? <BarChart3 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Stats Cards */}
      {validData.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {averageMood?.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Mood</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-center">
              <div className="text-2xl">
                {trend === 'improving' && '📈'}
                {trend === 'declining' && '📉'}
                {trend === 'stable' && '➡️'}
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {trend || 'No trend'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        {validData.length > 0 ? (
          <div className="h-64">
            {chartType === 'line' ? (
              <Line data={lineChartData} options={chartOptions} />
            ) : (
              <Bar data={barChartData} options={chartOptions} />
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Yet</h3>
              <p className="text-gray-600 capitalize">
                Start logging your moods to see trends & insights
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      {validData.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
          <h3 className="font-semibold text-purple-800 mb-2">💡 Insights</h3>
          <div className="space-y-2 text-sm text-purple-700">
            <p>
              You've logged {moodData.length} mood{moodData.length !== 1 ? 's' : ''} in the past {timeRange}.
            </p>
            {trend && (
              <p>
                Your mood trend appears to be{' '}
                <span className="font-medium">
                  {trend === 'improving' && 'improving 🌱'}
                  {trend === 'declining' && 'declining - consider self-care practices 💙'}
                  {trend === 'stable' && 'stable - great consistency! 🌟'}
                </span>
              </p>
            )}
            {averageMood && averageMood >= 4 && (
              <p>You're maintaining great emotional well-being! Keep it up! 🎉</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};