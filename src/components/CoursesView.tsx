import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Calendar, 
  Users, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Filter,
  MapPin,
  BookOpen,
  Award
} from 'lucide-react';
import { Course } from '../types';

interface CoursesViewProps {
  courses: Course[];
  onStartCourseSurvey: (course: Course) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  onStartCourseSurvey,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const departments = Array.from(new Set(courses.map((c) => c.department)));

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = filterDepartment === 'all' || course.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 border border-indigo-100">
            <GraduationCap className="w-3.5 h-3.5" />
            Fall Semester 2024
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Course Directory
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Browse registered classes, syllabus modules, enrollment capacities, and submit student evaluations.
          </p>
        </div>
      </header>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course title, code, instructor, or topic..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Departments ({departments.length})</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Evaluation</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">No matching courses found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or clearing selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterDepartment('all');
              setFilterStatus('all');
            }}
            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isCompleted = course.status === 'completed';
            const isInProgress = course.status === 'in_progress';
            const enrollmentPct = Math.round(((course.enrolledCount || course.studentCount) / (course.enrollmentCapacity || 50)) * 100);

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {course.credits} Credits
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : isInProgress ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60 shrink-0">
                        <Clock className="w-3.5 h-3.5" /> In Progress
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0">
                        <Calendar className="w-3.5 h-3.5" /> Due {course.dueDate}
                      </span>
                    )}
                  </div>

                  {/* Course Title & Instructor */}
                  <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    {course.instructor} • <span className="font-medium text-slate-600">{course.department}</span>
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {course.description}
                  </p>

                  {/* Schedule & Location Box */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{course.schedule}</span>
                    </div>
                    {course.location && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{course.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Syllabus Topics Pills */}
                  {course.syllabusTopics && course.syllabusTopics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.syllabusTopics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Satisfaction & Capacity Indicators */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 mb-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                      <span>Satisfaction Index</span>
                      <span className="text-indigo-600 font-bold">{course.overallSatisfaction}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${course.overallSatisfaction}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom CTA & Capacity info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500" title={`Enrollment: ${course.enrolledCount || course.studentCount} of ${course.enrollmentCapacity || 50} (${enrollmentPct}%)`}>
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.enrolledCount || course.studentCount}/{course.enrollmentCapacity || 50} enrolled</span>
                  </div>

                  {isCompleted ? (
                    <button
                      onClick={() => onStartCourseSurvey(course)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded hover:bg-indigo-50 transition-colors"
                    >
                      Update <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onStartCourseSurvey(course)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      {isInProgress ? 'Continue' : 'Evaluate'} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
