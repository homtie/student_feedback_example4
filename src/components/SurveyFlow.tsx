import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  HelpCircle, 
  MessageSquarePlus, 
  Sparkles, 
  ShieldCheck, 
  Cloud, 
  RefreshCw, 
  Eye, 
  Brain, 
  BookOpen, 
  Send, 
  Check, 
  GraduationCap,
  Loader2,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  Course, 
  SurveyQuestion, 
  RatingValue, 
  SurveyAnswers, 
  FeedbackSubmission 
} from '../types';
import { 
  SURVEY_QUESTIONS, 
  getSurveyDraft, 
  saveSurveyDraft, 
  clearSurveyDraft 
} from '../data/mockData';

interface SurveyFlowProps {
  course: Course;
  onExit: () => void;
  onSubmitSuccess: (submission: FeedbackSubmission) => void;
  onViewReceipt: (submission: FeedbackSubmission) => void;
}

type FlowStage = 'questions' | 'written' | 'review' | 'success';

interface RatingOptionConfig {
  value: RatingValue;
  label: string;
  emoji: string;
  iconBg: string;
}

const RATING_OPTIONS: RatingOptionConfig[] = [
  { value: 1, label: 'Needs Work', emoji: '😫', iconBg: 'hover:text-rose-600' },
  { value: 2, label: 'Fair', emoji: '🙁', iconBg: 'hover:text-rose-600' },
  { value: 3, label: 'Good', emoji: '😐', iconBg: 'hover:text-indigo-600' },
  { value: 4, label: 'Great', emoji: '🙂', iconBg: 'hover:text-indigo-600' },
  { value: 5, label: 'Excellent', emoji: '😁', iconBg: 'hover:text-indigo-600' },
];

export const SurveyFlow: React.FC<SurveyFlowProps> = ({
  course,
  onExit,
  onSubmitSuccess,
  onViewReceipt,
}) => {
  const [currentStage, setCurrentStage] = useState<FlowStage>('questions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showQuestionComment, setShowQuestionComment] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [latestSavedTime, setLatestSavedTime] = useState<string>('Autosaved locally');
  const [createdSubmission, setCreatedSubmission] = useState<FeedbackSubmission | null>(null);
  const [hasDraftRestored, setHasDraftRestored] = useState<boolean>(false);

  // Survey responses state
  const [answers, setAnswers] = useState<SurveyAnswers>(() => {
    const savedDraft = getSurveyDraft(course.id);
    if (savedDraft) {
      return {
        ratings: savedDraft.ratings || { 1: 5, 2: 4, 3: 5, 4: 4, 5: 5, 6: 4, 7: 5, 8: 5 },
        questionComments: savedDraft.questionComments || {},
        wellFeedback: savedDraft.wellFeedback !== undefined ? savedDraft.wellFeedback : 'The way complex concepts were broken down into manageable pieces made a huge difference. I particularly appreciated the interactive problem walkthroughs and clear code examples.',
        wellTags: savedDraft.wellTags || ['Communication', 'Course Materials'],
        improveFeedback: savedDraft.improveFeedback !== undefined ? savedDraft.improveFeedback : 'Providing supplementary reading guides and office hour practice problem sets before milestones would be even more helpful.',
        improveTags: savedDraft.improveTags || ['Assignment Clarity', 'Pace'],
        isAnonymous: savedDraft.isAnonymous !== undefined ? savedDraft.isAnonymous : true,
      };
    }
    return {
      ratings: {
        1: 5,
        2: 4,
        3: 5,
        4: 4,
        5: 5,
        6: 4,
        7: 5,
        8: 5,
      },
      questionComments: {},
      wellFeedback: 'The way complex concepts were broken down into manageable pieces made a huge difference. I particularly appreciated the interactive problem walkthroughs and clear code examples.',
      wellTags: ['Communication', 'Course Materials'],
      improveFeedback: 'Providing supplementary reading guides and office hour practice problem sets before milestones would be even more helpful.',
      improveTags: ['Assignment Clarity', 'Pace'],
      isAnonymous: true,
    };
  });

  const totalQuestions = SURVEY_QUESTIONS.length;
  const activeQuestion: SurveyQuestion = SURVEY_QUESTIONS[currentQuestionIndex] || SURVEY_QUESTIONS[0];
  const currentRating = answers.ratings[activeQuestion.id] || 3;

  // Auto-save survey draft into localStorage
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      saveSurveyDraft(course.id, answers);
      setIsSaving(false);
      const now = new Date();
      setLatestSavedTime(`Saved locally at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [answers, course.id]);

  const handleSelectRating = (value: RatingValue) => {
    setAnswers((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [activeQuestion.id]: value,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowQuestionComment(false);
    } else {
      setCurrentStage('written');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowQuestionComment(false);
    }
  };

  // Suggestion chips handler
  const handleToggleWellTag = (tag: string) => {
    setAnswers((prev) => {
      const exists = prev.wellTags.includes(tag);
      const updatedTags = exists
        ? prev.wellTags.filter((t) => t !== tag)
        : [...prev.wellTags, tag];
      
      const newFeedback = exists
        ? prev.wellFeedback
        : prev.wellFeedback 
          ? `${prev.wellFeedback} Especially with regards to ${tag.toLowerCase()}.`
          : `Great work on ${tag.toLowerCase()}.`;

      return {
        ...prev,
        wellTags: updatedTags,
        wellFeedback: newFeedback.slice(0, 1000),
      };
    });
  };

  const handleToggleImproveTag = (tag: string) => {
    setAnswers((prev) => {
      const exists = prev.improveTags.includes(tag);
      const updatedTags = exists
        ? prev.improveTags.filter((t) => t !== tag)
        : [...prev.improveTags, tag];
      
      const newFeedback = exists
        ? prev.improveFeedback
        : prev.improveFeedback 
          ? `${prev.improveFeedback} Could benefit from improved ${tag.toLowerCase()}.`
          : `Recommendation: focus more on ${tag.toLowerCase()}.`;

      return {
        ...prev,
        improveTags: updatedTags,
        improveFeedback: newFeedback.slice(0, 1000),
      };
    });
  };

  // Compute category scores for Review screen
  const calculateCategoryScores = () => {
    const ratingsArray: number[] = Object.values(answers.ratings);
    const avg = ratingsArray.length > 0
      ? (ratingsArray.reduce((acc: number, r: number) => acc + r, 0) / ratingsArray.length).toFixed(1)
      : '4.8';

    const clarity = answers.ratings[1] ? (answers.ratings[1] * 0.96).toFixed(1) : '4.8';
    const engagement = answers.ratings[2] ? (answers.ratings[2] * 0.88).toFixed(1) : '4.4';
    const materials = answers.ratings[3] ? (answers.ratings[3] * 0.98).toFixed(1) : '4.9';

    return {
      clarity: parseFloat(clarity),
      engagement: parseFloat(engagement),
      materials: parseFloat(materials),
      pacing: 4.3,
      overall: parseFloat(avg),
    };
  };

  const handleSubmitFinal = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      const calculatedScores = calculateCategoryScores();
      const randomReceiptNum = Math.floor(10000 + Math.random() * 90000);
      const cleanCode = course.code.replace(/[^a-zA-Z0-9]/g, '');
      const receiptId = `ECHO-REC-${cleanCode}-${randomReceiptNum}`;
      
      const now = new Date();
      const dateStr = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newSubmission: FeedbackSubmission = {
        id: `sub-${Date.now()}`,
        courseId: course.id,
        courseTitle: course.title,
        courseCode: course.code,
        instructor: course.instructor,
        submittedAt: dateStr,
        receiptId,
        isAnonymous: answers.isAnonymous,
        ratings: answers.ratings,
        scores: calculatedScores,
        wellFeedback: answers.wellFeedback,
        wellTags: answers.wellTags,
        improveFeedback: answers.improveFeedback,
        improveTags: answers.improveTags,
        studentInitials: 'AS',
      };

      // Clear the local draft upon completed submission
      clearSurveyDraft(course.id);

      setCreatedSubmission(newSubmission);
      onSubmitSuccess(newSubmission);
      setIsSubmitting(false);
      setCurrentStage('success');
    }, 800);
  };

  const progressPercentage = Math.round(
    currentStage === 'questions'
      ? ((currentQuestionIndex + 1) / (totalQuestions + 2)) * 100
      : currentStage === 'written'
      ? 75
      : 100
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* ========================================================
          STAGE A & B: HEADER & NAVIGATION
          ======================================================== */}
      {currentStage !== 'success' && (
        <header className="w-full px-4 sm:px-8 md:px-12 py-3.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors w-max font-semibold text-xs cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Exit Survey
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 line-clamp-1">
              {course.title}
            </h1>
          </div>

          <div className="w-full md:w-80 flex flex-col gap-1.5">
            <div className="flex justify-between items-center w-full text-xs font-semibold">
              <span className="text-slate-500">
                {currentStage === 'questions' && `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
                {currentStage === 'written' && `Step 3 of 4: Written Feedback`}
                {currentStage === 'review' && `Step 4 of 4: Review & Submit`}
              </span>
              <span className="text-indigo-600 font-bold">{progressPercentage}%</span>
            </div>
            
            {/* Progress Track */}
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </header>
      )}

      {/* ========================================================
          STAGE 1: INTERACTIVE QUESTION RATING (Screen 3)
          ======================================================== */}
      {currentStage === 'questions' && (
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-8 w-full max-w-3xl mx-auto">
          {/* Main Question Card */}
          <div className="bg-white w-full rounded-2xl p-6 sm:p-10 md:p-12 flex flex-col items-center text-center relative overflow-hidden border border-slate-200 shadow-sm">
            {/* Top Brand Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 border border-indigo-100">
              <HelpCircle className="w-6 h-6 stroke-[1.75]" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-0.5 rounded-md mb-3 border border-indigo-100">
              {activeQuestion.categoryLabel}
            </span>

            <h2 className="text-lg sm:text-2xl md:text-3xl text-slate-900 font-bold mb-3 max-w-2xl leading-snug">
              {activeQuestion.question}
            </h2>

            {activeQuestion.description && (
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mb-8">
                {activeQuestion.description}
              </p>
            )}

            {/* 5 Rating Pills */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-4">
              {RATING_OPTIONS.map((opt) => {
                const isSelected = currentRating === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectRating(opt.value)}
                    className={`py-3 sm:py-3.5 px-2.5 sm:px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none active:scale-95 min-h-[54px] ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm font-bold'
                        : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{opt.emoji}</span>
                    <span className="truncate w-full text-center">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Inline Comment Accordion */}
          <div className="mt-5 w-full max-w-2xl text-center">
            {!showQuestionComment ? (
              <button
                onClick={() => setShowQuestionComment(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                Add specific note on this question (optional)
              </button>
            ) : (
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Additional remarks for Question {currentQuestionIndex + 1}:
                </label>
                <textarea
                  value={answers.questionComments[activeQuestion.id] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      questionComments: {
                        ...prev.questionComments,
                        [activeQuestion.id]: e.target.value,
                      },
                    }))
                  }
                  placeholder="Share details or a specific example..."
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-500 resize-none bg-slate-50 text-slate-800"
                />
              </div>
            )}
          </div>
        </main>
      )}

      {/* ========================================================
          STAGE 2: SMART WRITTEN FEEDBACK (Screen 5)
          ======================================================== */}
      {currentStage === 'written' && (
        <main className="flex-1 flex flex-col px-4 sm:px-8 md:px-12 py-8 max-w-4xl mx-auto w-full">
          {/* Header Section */}
          <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-indigo-600 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" /> {course.title} ({course.code})
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Smart Written Feedback
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Submitting Anonymously
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>Saving draft...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{latestSavedTime}</span>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Feedback Form Canvas */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            {/* Question 1: What was done well? */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                What was done particularly well?
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Consider aspects like clarity of lectures, quality of materials, or interactive lab discussions.
              </p>

              {/* Suggested Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {['Communication', 'Course Materials', 'Real-world Examples', 'Office Hours', 'Live Coding', 'Lecture Pacing'].map((tag) => {
                  const isSelected = answers.wellTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleWellTag(tag)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      + {tag}
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <textarea
                  value={answers.wellFeedback}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, wellFeedback: e.target.value.slice(0, 1000) }))
                  }
                  rows={4}
                  placeholder="Start typing your thoughts here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                />
                <div className="text-right text-[11px] font-medium text-slate-400 pt-1">
                  {answers.wellFeedback.length} / 1000
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100" />

            {/* Question 2: What could make this course better? */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                What could make this course better?
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Focus on constructive suggestions regarding pacing, workload, or specific topics.
              </p>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {['Pace', 'Assignment Clarity', 'More Interactive Labs', 'Project Milestones', 'Reading Guides', 'Office Hour Availability'].map((tag) => {
                  const isSelected = answers.improveTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleImproveTag(tag)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      + {tag}
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <textarea
                  value={answers.improveFeedback}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, improveFeedback: e.target.value.slice(0, 1000) }))
                  }
                  rows={4}
                  placeholder="Start typing your constructive feedback here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                />
                <div className="text-right text-[11px] font-medium text-slate-400 pt-1">
                  {answers.improveFeedback.length} / 1000
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          STAGE 3: REVIEW & SUBMIT (Screen 4)
          ======================================================== */}
      {currentStage === 'review' && (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-10 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
              <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded mb-2 border border-indigo-100">
                Step 4 of 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Review & Submit
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Please review your responses before finalizing your feedback for {course.title}.
              </p>
            </div>

            {/* Bento Grid: Category Ratings */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Category Ratings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Clarity */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">
                      {calculateCategoryScores().clarity.toFixed(1)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">
                    Clarity
                  </h4>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (calculateCategoryScores().clarity / 5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Engagement */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <Brain className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">
                      {calculateCategoryScores().engagement.toFixed(1)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">
                    Engagement
                  </h4>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (calculateCategoryScores().engagement / 5) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Materials */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">
                      {calculateCategoryScores().materials.toFixed(1)}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-700 mb-2">
                    Materials
                  </h4>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (calculateCategoryScores().materials / 5) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Written Insights Preview Card */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div>
                <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                  Written Insights
                </h3>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{answers.wellFeedback} {answers.improveFeedback}"
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {answers.wellTags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                      {tag}
                    </span>
                  ))}
                  {answers.improveTags.map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          STAGE 4: SUCCESS / CELEBRATION STATE (Screen 4 Part B)
          ======================================================== */}
      {currentStage === 'success' && (
        <main className="flex-1 w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12">
          <div className="text-center max-w-md mx-auto flex flex-col items-center">
            {/* Big Success Checkmark */}
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Thank you.
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-6">
              Your voice helps improve learning. The instructor has received your anonymous insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              {createdSubmission && (
                <button
                  onClick={() => onViewReceipt(createdSubmission)}
                  className="w-full sm:w-auto bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                  View Submission Receipt
                </button>
              )}

              <button
                onClick={onExit}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================
          STICKY BOTTOM ACTIONS FOOTER (For Stages 1, 2, 3)
          ======================================================== */}
      {currentStage !== 'success' && (
        <footer className="w-full px-4 sm:px-8 md:px-12 py-3.5 flex justify-between items-center bg-white border-t border-slate-200 sticky bottom-0 z-30 shadow-xs">
          {/* Previous Button */}
          {currentStage === 'questions' && currentQuestionIndex > 0 ? (
            <button
              onClick={handlePreviousQuestion}
              className="py-2 px-3 sm:px-4 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : currentStage === 'written' ? (
            <button
              onClick={() => setCurrentStage('questions')}
              className="py-2 px-3 sm:px-4 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Ratings
            </button>
          ) : currentStage === 'review' ? (
            <button
              onClick={() => setCurrentStage('written')}
              className="py-2 px-3 sm:px-4 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Edit Feedback
            </button>
          ) : (
            <div className="w-16" />
          )}

          {/* Forward / Submit Button */}
          {currentStage === 'questions' ? (
            <button
              onClick={handleNextQuestion}
              className="py-2 px-4 sm:px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              Next Question
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : currentStage === 'written' ? (
            <button
              onClick={() => setCurrentStage('review')}
              className="py-2 px-4 sm:px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            >
              Review Responses
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFinal}
              disabled={isSubmitting}
              className="py-2 px-5 sm:px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-75 min-h-[40px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Submitting Feedback...
                </>
              ) : (
                <>
                  Submit Feedback
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </footer>
      )}
    </div>
  );
};
