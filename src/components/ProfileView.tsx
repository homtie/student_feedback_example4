import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Award, 
  RotateCcw, 
  FileCheck, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';
import { Course, FeedbackSubmission } from '../types';

interface ProfileViewProps {
  courses: Course[];
  submissions: FeedbackSubmission[];
  onViewReceipt: (submission: FeedbackSubmission) => void;
  onResetData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  courses,
  submissions,
  onViewReceipt,
  onResetData,
}) => {
  const completedCount = courses.filter((c) => c.status === 'completed').length;
  const pendingCount = courses.filter((c) => c.status !== 'completed').length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header>
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 border border-indigo-100">
          <User className="w-3.5 h-3.5" />
          Student Account & Privacy
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Student Profile
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Manage student verification status, cryptographic feedback tokens, and completed surveys.
        </p>
      </header>

      {/* Main Profile Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Card (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-xs shrink-0">
              ML
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-900">Maya Lin</h3>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Enrolled
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Cognitive Science & Interaction Design • Class of 2025
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Student ID: 9028-4410 • St. Jude Collegiate Institute
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-600" /> Anonymous Protocol:
              </span>
              <span className="font-mono font-bold text-indigo-600 text-[11px]">Zero-Knowledge Token Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              When you submit an evaluation, faculty only receive aggregated metrics and verified anonymous insights.
            </p>
          </div>
        </div>

        {/* Evaluation Stats (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-900 mb-3">
            Evaluation Progress
          </h3>

          <div className="grid grid-cols-2 gap-3 my-auto">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
              <span className="text-2xl font-bold text-indigo-600">
                {completedCount}
              </span>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Submitted</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
              <span className="text-2xl font-bold text-amber-600">
                {pendingCount}
              </span>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">Pending</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-600" /> 100% On-Time Record
            </span>
            <span className="font-bold text-indigo-600">Honor Roll</span>
          </div>
        </div>
      </div>

      {/* Submission Receipts History */}
      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Evaluation Submission History
        </h3>

        {submissions.length === 0 ? (
          <p className="text-xs text-slate-400">No submissions recorded yet.</p>
        ) : (
          <div className="space-y-2.5">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-100 gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-indigo-600">{sub.courseCode}</span>
                    <span className="text-xs text-slate-400">• {sub.submittedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{sub.courseTitle}</h4>
                </div>

                <button
                  onClick={() => onViewReceipt(sub)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs self-start sm:self-auto cursor-pointer transition-colors"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  View Certificate ({sub.receiptId})
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Demo Controls Section */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900">College Project Demonstration Controls</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Reset all courses and evaluation responses to original sample demonstration state.
          </p>
        </div>
        
        <button
          onClick={onResetData}
          className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
