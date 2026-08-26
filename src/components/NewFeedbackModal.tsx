import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { Course } from '../types';

interface NewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourseToSurvey: (course: Course) => void;
}

export const NewFeedbackModal: React.FC<NewFeedbackModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourseToSurvey,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl p-6 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pt-2 pb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2.5 border border-indigo-100">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            Start New Evaluation
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Choose an enrolled course to begin your anonymous course evaluation.
          </p>
        </div>

        {/* Course Selection List */}
        <div className="my-5 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                onSelectCourseToSurvey(course);
                onClose();
              }}
              className="w-full text-left p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 flex items-center justify-between group transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {course.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {course.instructor}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h4>
              </div>

              <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0 border border-slate-200 group-hover:border-indigo-600 shadow-xs">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer Privacy Guarantee */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Submissions are strictly anonymous</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
