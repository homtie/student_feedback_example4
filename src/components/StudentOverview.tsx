import React from 'react';
import { 
  Timer, 
  Calendar, 
  ArrowRight, 
  Check, 
  Clock, 
  Sparkles,
  Award,
  FileCheck,
  Star,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Course, FeedbackSubmission } from '../types';

interface StudentOverviewProps {
  courses: Course[];
  submissions: FeedbackSubmission[];
  onStartCourseSurvey: (course: Course) => void;
  onViewReceipt: (submission: FeedbackSubmission | { courseTitle: string; courseCode: string; submittedAt: string; receiptId: string }) => void;
  onOpenNewFeedback: () => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  courses,
  submissions,
  onStartCourseSurvey,
  onViewReceipt,
  onOpenNewFeedback,
}) => {
  const pendingCourses = courses.filter((c) => c.status !== 'completed');
  const completedCourses = courses.filter((c) => c.status === 'completed');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* 4 Stat Metric Cards (Professional Polish Section) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Feedback</div>
          <div className="text-2xl font-bold text-slate-900">1,284</div>
          <div className="text-emerald-600 text-xs mt-1 font-medium flex items-center gap-1">
            <span>+12% from last term</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Avg Rating</div>
          <div className="text-2xl font-bold text-slate-900">
            4.64<span className="text-slate-400 text-lg font-normal">/5</span>
          </div>
          <div className="text-emerald-600 text-xs mt-1 font-medium">Highly Positive</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Reviews</div>
          <div className="text-2xl font-bold text-slate-900">{pendingCourses.length}</div>
          <div className="text-amber-600 text-xs mt-1 font-medium">Action required</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Active Courses</div>
          <div className="text-2xl font-bold text-slate-900">{courses.length}</div>
          <div className="text-slate-500 text-xs mt-1 font-medium">Across 6 Departments</div>
        </div>
      </section>

      {/* Main Grid: Pending Evaluations (8 cols) & Recent Activity (4 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Course Evaluations (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Course Evaluations Required</h3>
                <p className="text-xs text-slate-500 mt-0.5">Please complete all assigned end-of-term evaluations</p>
              </div>
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 font-semibold rounded-md border border-amber-200/60">
                {pendingCourses.length} Action{pendingCourses.length !== 1 ? 's' : ''} Needed
              </span>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {pendingCourses.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base mb-1">All Caught Up!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    You have submitted all required feedback for the Fall 2024 academic term.
                  </p>
                  <button
                    onClick={onOpenNewFeedback}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Additional Feedback
                  </button>
                </div>
              ) : (
                pendingCourses.map((course) => (
                  <article 
                    key={course.id}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50/70 p-3 -mx-3 rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-indigo-100">
                          {course.code}
                        </span>
                        <span className="text-slate-500 text-xs">
                          {course.department}
                        </span>
                        <span className="text-amber-600 font-medium text-xs flex items-center gap-1 ml-auto sm:ml-0">
                          <Timer className="w-3.5 h-3.5" />
                          Due {course.dueDate}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Instructor: <span className="font-medium text-slate-700">{course.instructor}</span> • Est. {course.estimatedMinutes} min
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => onStartCourseSurvey(course)}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <span>{course.status === 'in_progress' ? 'Continue' : 'Start Evaluation'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Completed Evaluations Accordion / Card */}
          {completedCourses.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Completed Evaluations ({completedCourses.length})
                </h3>
                <span className="text-xs text-slate-500">Cryptographically Verified</span>
              </div>

              <div className="p-4 divide-y divide-slate-100">
                {completedCourses.map((course) => {
                  const submission = submissions.find((s) => s.courseId === course.id);
                  return (
                    <div 
                      key={course.id}
                      className="py-3 px-2 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{course.title}</div>
                          <div className="text-slate-400 text-[11px]">{course.code} • Submitted {course.completedDate || 'Recently'}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (submission) {
                            onViewReceipt(submission);
                          } else {
                            onViewReceipt({
                              courseTitle: course.title,
                              courseCode: course.code,
                              submittedAt: course.completedDate || 'Aug 2024',
                              receiptId: course.receiptId || 'ECHO-REC-VERIFIED',
                            });
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 px-2.5 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recent Activity Feed (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-base">Recent Activity</h3>
              <span className="text-xs text-indigo-600 font-semibold">Live Feed</span>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex gap-3 items-start pb-4 border-b border-slate-50">
                <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900">New 5-star Rating</div>
                  <div className="text-xs text-slate-500">Dr. Alan Turing • Advanced Algorithms</div>
                  <div className="text-[10px] text-slate-400 mt-1">2 minutes ago</div>
                </div>
              </div>

              <div className="flex gap-3 items-start pb-4 border-b border-slate-50">
                <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900">Course Insight Added</div>
                  <div className="text-xs text-slate-500">Prof. Miller • "Great course content & pacing..."</div>
                  <div className="text-[10px] text-slate-400 mt-1">1 hour ago</div>
                </div>
              </div>

              <div className="flex gap-3 items-start pb-4 border-b border-slate-50 opacity-75">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-900">Deadline Approaching</div>
                  <div className="text-xs text-slate-500">Mid-term Feedback submission window closes in 48h</div>
                  <div className="text-[10px] text-slate-400 mt-1">Yesterday</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Anonymous Encryption:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1 text-[11px]">
                  <Check className="w-3 h-3" /> Enabled (SHA-256)
                </span>
              </div>

              <button
                onClick={onOpenNewFeedback}
                className="w-full text-center py-2 text-indigo-600 text-xs font-bold hover:underline cursor-pointer"
              >
                View All Activity & Insights
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
