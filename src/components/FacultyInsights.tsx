import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Star, 
  Quote, 
  ChevronDown,
  Sparkles,
  Filter,
  BarChart3,
  Check
} from 'lucide-react';
import { Course, FeedbackSubmission, StudentQuote } from '../types';

interface FacultyInsightsProps {
  courses: Course[];
  quotes: StudentQuote[];
  submissions: FeedbackSubmission[];
  onNavigateToFeedback: () => void;
  onSelectCourse?: (courseId: string) => void;
}

export const FacultyInsights: React.FC<FacultyInsightsProps> = ({
  courses,
  quotes,
  submissions,
  onNavigateToFeedback,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('monthly');

  // Compute live statistics based on courses & submissions
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const courseTitleDisplay = selectedCourse ? selectedCourse.title : 'All Courses (Fall 2024)';
  
  const satisfactionRate = selectedCourse ? selectedCourse.overallSatisfaction : 87;
  const clarityScore = selectedCourse ? Math.round(selectedCourse.clarityScore * 20) : 92;

  const monthlyBars = [
    { label: 'Jan', height: '40%', value: '72%', bg: 'bg-indigo-100 hover:bg-indigo-200', responses: 38 },
    { label: 'Feb', height: '55%', value: '78%', bg: 'bg-indigo-200 hover:bg-indigo-300', responses: 41 },
    { label: 'Mar', height: '70%', value: '84%', bg: 'bg-indigo-300 hover:bg-indigo-400', responses: 48 },
    { label: 'Apr', height: '90%', value: `${satisfactionRate}%`, bg: 'bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-100', isFinal: true, responses: 52 },
    { label: 'May', height: '45%', value: '76%', bg: 'bg-indigo-200 hover:bg-indigo-300', responses: 36 },
    { label: 'Jun', height: '30%', value: '68%', bg: 'bg-indigo-100 hover:bg-indigo-200', responses: 24 },
  ];

  const weeklyBars = [
    { label: 'W1', height: '45%', value: '74%', bg: 'bg-indigo-100 hover:bg-indigo-200', responses: 22 },
    { label: 'W4', height: '60%', value: '80%', bg: 'bg-indigo-200 hover:bg-indigo-300', responses: 28 },
    { label: 'W8', height: '50%', value: '76%', bg: 'bg-indigo-200 hover:bg-indigo-300', responses: 31 },
    { label: 'W12', height: '75%', value: '85%', bg: 'bg-indigo-300 hover:bg-indigo-400', responses: 35 },
    { label: 'Final', height: '90%', value: `${satisfactionRate}%`, bg: 'bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-100', isFinal: true, responses: 52 },
  ];

  const chartData = timeframe === 'monthly' ? monthlyBars : weeklyBars;

  const ratingDistribution = [
    { stars: 5, percent: 65, color: 'bg-indigo-600', starColor: 'text-amber-500' },
    { stars: 4, percent: 22, color: 'bg-indigo-400', starColor: 'text-amber-500' },
    { stars: 3, percent: 10, color: 'bg-slate-400', starColor: 'text-slate-400' },
    { stars: 2, percent: 2, color: 'bg-amber-400', starColor: 'text-slate-400' },
    { stars: 1, percent: 1, color: 'bg-rose-400', starColor: 'text-slate-400' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Filter & Headline Header */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>Faculty Performance Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            Student Satisfaction is at <span className="text-indigo-600">{satisfactionRate}%</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Up 12% from previous term, with high remarks on assignment clarity and interactive discussions.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Departments (Fall 2024)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Performance Grid (8 cols chart + 4 cols opportunity/clarity) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Bar Chart Container (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-base">Faculty Performance Analytics</h3>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTimeframe('weekly')}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === 'weekly'
                    ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-100'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeframe('monthly')}
                className={`text-xs px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === 'monthly'
                    ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-100'
                    : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-end gap-2">
            <div className="flex items-end gap-3 sm:gap-4 h-48 px-2 sm:px-4 relative">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none z-0">
                <div className="w-full border-t border-slate-100" />
                <div className="w-full border-t border-slate-100" />
                <div className="w-full border-t border-slate-100" />
              </div>

              {chartData.map((bar, index) => {
                const isHovered = hoveredBar === index;
                return (
                  <div
                    key={bar.label}
                    className="flex-1 flex flex-col items-center justify-end h-full relative z-10 group"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-9 bg-slate-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow transition-all pointer-events-none whitespace-nowrap z-20 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      {bar.value} ({bar.responses} reviews)
                    </div>

                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 chart-bar-animate cursor-pointer ${bar.bg}`}
                      style={{
                        height: bar.height,
                        animationDelay: `${index * 0.08}s`,
                      }}
                    />
                    <div className="mt-2 text-xs text-slate-500 font-medium">{bar.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Sub-boxes for Peak / Low Engagement */}
            <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] uppercase text-slate-400 font-bold">Peak Engagement</div>
                <div className="text-sm font-bold text-slate-800">March 2024 (92%)</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-[10px] uppercase text-slate-400 font-bold">Opportunity Area</div>
                <div className="text-sm font-bold text-slate-800">Week 6 Pacing (76%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Highlight Cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">What Improved</div>
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">Clarity of Materials</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assignment guidelines and rubric details rated {clarityScore}% for transparency.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-semibold">
              <span>+15% vs Midterm</span>
              <span>4.8 / 5.0 Avg</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Opportunity</div>
                <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900 mb-1">Lecture Pacing</div>
              <p className="text-xs text-slate-500 leading-relaxed">
                24% of responses suggested adding a 10-minute recap before complex labs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold">
              <span>Recommended: +1 Review</span>
              <span>Week 6 Topic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Student Appreciations & Rating Distribution Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">Rating Distribution</h3>
            <span className="text-xs text-slate-400 font-medium">142 Reviews</span>
          </div>

          <div className="space-y-4">
            {ratingDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <div className="w-12 flex items-center gap-1 text-xs font-bold text-slate-700">
                  <span>{row.stars}</span>
                  <Star className={`w-3.5 h-3.5 fill-current ${row.starColor}`} />
                </div>

                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${row.color} rounded-full transition-all duration-500`}
                    style={{ width: `${row.percent}%` }}
                  />
                </div>

                <div className="w-10 text-right text-xs font-bold text-slate-800">
                  {row.percent}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Commentary (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">Student Comments</h3>
            <button
              onClick={onNavigateToFeedback}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "The way complex algorithmic concepts were broken down made a huge difference. The review sessions gave me the confidence to excel on the midterm."
              </p>
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-800">CS 4091 Student</span>
                <span>2 days ago</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "Office hours were tremendously helpful. The instructor was attentive to each question and provided actionable insights."
              </p>
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-800">PHIL 204 Student</span>
                <span>4 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
