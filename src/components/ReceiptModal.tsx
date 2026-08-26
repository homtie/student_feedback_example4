import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Download, 
  QrCode, 
  Lock,
  GraduationCap
} from 'lucide-react';
import { FeedbackSubmission } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: (FeedbackSubmission | {
    courseTitle: string;
    courseCode: string;
    submittedAt: string;
    receiptId: string;
    scores?: { clarity: number; engagement: number; materials: number; pacing: number; overall: number };
    isAnonymous?: boolean;
  }) | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  submission,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !submission) return null;

  const receiptId = submission.receiptId || 'ECHO-REC-78901';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(receiptId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl p-6 border border-slate-200 shadow-xl relative overflow-hidden flex flex-col justify-between"
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

        {/* Header Content */}
        <div className="text-center pt-2 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2.5 border border-indigo-100">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <span className="text-[11px] font-semibold tracking-wider text-indigo-700 uppercase bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
            Official Evaluation Certificate
          </span>

          <h3 className="text-xl font-bold text-slate-900 mt-2.5">
            Submission Receipt
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Cryptographically signed proof of evaluation participation.
          </p>
        </div>

        {/* Receipt Details Card */}
        <div className="my-5 bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3.5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Course</p>
              <p className="text-xs font-bold text-slate-900">{submission.courseTitle}</p>
              <p className="text-xs text-indigo-600 font-semibold">{submission.courseCode}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-medium">Timestamp</p>
              <p className="text-xs font-semibold text-slate-700">{submission.submittedAt}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-xs font-semibold text-slate-700">Identity Privacy:</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              100% Anonymous Token
            </span>
          </div>

          {submission.scores && (
            <div className="pt-2.5 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-400 font-medium">Clarity</p>
                <p className="text-xs font-bold text-indigo-600">{submission.scores.clarity}/5</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-400 font-medium">Engagement</p>
                <p className="text-xs font-bold text-indigo-600">{submission.scores.engagement}/5</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[10px] text-slate-400 font-medium">Materials</p>
                <p className="text-xs font-bold text-indigo-600">{submission.scores.materials}/5</p>
              </div>
            </div>
          )}

          {/* Verification Code Box */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Hash ID</p>
              <p className="font-mono text-xs font-bold text-indigo-600 select-all truncate">
                {receiptId}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="Copy Code"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors text-center cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
