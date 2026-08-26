import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  Course, 
  FeedbackSubmission, 
  StudentQuote 
} from './types';
import { 
  getStoredCourses, 
  saveStoredCourses, 
  getStoredSubmissions, 
  saveStoredSubmissions, 
  getStoredQuotes, 
  saveStoredQuotes,
  getStoredUserRole,
  saveStoredUserRole,
  getStoredActiveTab,
  saveStoredActiveTab,
  resetAllData,
  INITIAL_COURSES,
  INITIAL_SUBMISSIONS,
  INITIAL_STUDENT_QUOTES
} from './data/mockData';
import { SideNavBar } from './components/SideNavBar';
import { StudentOverview } from './components/StudentOverview';
import { FacultyInsights } from './components/FacultyInsights';
import { SurveyFlow } from './components/SurveyFlow';
import { CoursesView } from './components/CoursesView';
import { FeedbackListView } from './components/FeedbackListView';
import { ProfileView } from './components/ProfileView';
import { ReceiptModal } from './components/ReceiptModal';
import { NewFeedbackModal } from './components/NewFeedbackModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => getStoredActiveTab());
  const [userRole, setUserRole] = useState<'student' | 'faculty'>(() => getStoredUserRole());
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [quotes, setQuotes] = useState<StudentQuote[]>([]);
  
  // Active Survey state
  const [activeSurveyCourse, setActiveSurveyCourse] = useState<Course | null>(null);
  
  // Modals state
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [isNewFeedbackModalOpen, setIsNewFeedbackModalOpen] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    setCourses(getStoredCourses());
    setSubmissions(getStoredSubmissions());
    setQuotes(getStoredQuotes());
  }, []);

  const handleTabChange = (tab: NavigationTab) => {
    setActiveTab(tab);
    saveStoredActiveTab(tab);
    if (tab === 'insights') {
      setUserRole('faculty');
      saveStoredUserRole('faculty');
    }
    if (tab === 'overview') {
      setUserRole('student');
      saveStoredUserRole('student');
    }
  };

  const handleToggleUserRole = () => {
    if (userRole === 'student') {
      setUserRole('faculty');
      saveStoredUserRole('faculty');
      setActiveTab('insights');
      saveStoredActiveTab('insights');
    } else {
      setUserRole('student');
      saveStoredUserRole('student');
      setActiveTab('overview');
      saveStoredActiveTab('overview');
    }
  };

  const handleStartSurvey = (course: Course) => {
    setActiveSurveyCourse(course);
  };

  const handleExitSurvey = () => {
    setActiveSurveyCourse(null);
  };

  const handleSurveySuccess = (newSubmission: FeedbackSubmission) => {
    // Update submissions in state & localStorage
    const updatedSubmissions = [newSubmission, ...submissions];
    setSubmissions(updatedSubmissions);
    saveStoredSubmissions(updatedSubmissions);

    // Update course status to completed
    const updatedCourses = courses.map((c) => {
      if (c.id === newSubmission.courseId) {
        return {
          ...c,
          status: 'completed' as const,
          progressPercent: 100,
          completedDate: 'Just now',
          receiptId: newSubmission.receiptId,
          overallSatisfaction: Math.min(99, c.overallSatisfaction + 1),
        };
      }
      return c;
    });
    setCourses(updatedCourses);
    saveStoredCourses(updatedCourses);

    // Also add to quotes if written feedback was provided
    if (newSubmission.wellFeedback || newSubmission.improveFeedback) {
      const newQuote: StudentQuote = {
        id: `q-${Date.now()}`,
        quote: `${newSubmission.wellFeedback} ${newSubmission.improveFeedback}`.trim(),
        author: 'Anonymous Student',
        course: `${newSubmission.courseTitle} (${newSubmission.courseCode})`,
        initials: newSubmission.studentInitials || 'AS',
        colorClass: 'bg-indigo-600 text-white',
        avatarBg: 'bg-indigo-100',
        avatarText: 'text-indigo-700',
        date: 'Just now',
        rating: newSubmission.scores.overall,
        tags: [...newSubmission.wellTags, ...newSubmission.improveTags],
      };
      const updatedQuotes = [newQuote, ...quotes];
      setQuotes(updatedQuotes);
      saveStoredQuotes(updatedQuotes);
    }
  };

  const handleViewReceipt = (sub: any) => {
    setSelectedReceipt(sub);
    setIsReceiptModalOpen(true);
  };

  const handleResetData = () => {
    resetAllData();
    setCourses(INITIAL_COURSES);
    setSubmissions(INITIAL_SUBMISSIONS);
    setQuotes(INITIAL_STUDENT_QUOTES);
    saveStoredCourses(INITIAL_COURSES);
    saveStoredSubmissions(INITIAL_SUBMISSIONS);
    saveStoredQuotes(INITIAL_STUDENT_QUOTES);
    saveStoredUserRole('student');
    saveStoredActiveTab('overview');
    setUserRole('student');
    setActiveTab('overview');
  };

  // If currently engaged in an active evaluation survey, render full-screen SurveyFlow
  if (activeSurveyCourse) {
    return (
      <SurveyFlow
        course={activeSurveyCourse}
        onExit={handleExitSurvey}
        onSubmitSuccess={handleSurveySuccess}
        onViewReceipt={(sub) => {
          setSelectedReceipt(sub);
          setIsReceiptModalOpen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row selection:bg-indigo-600 selection:text-white">
      {/* Side Navigation Bar */}
      <SideNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenNewFeedback={() => setIsNewFeedbackModalOpen(true)}
        userRole={userRole}
        onToggleUserRole={handleToggleUserRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col bg-slate-50 pt-16 md:pt-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 mb-6 sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className="hidden sm:inline">Echo Campus</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="text-slate-900 font-semibold capitalize">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'insights' && 'Faculty Performance Analytics'}
              {activeTab === 'courses' && 'Course Directory & Evaluations'}
              {activeTab === 'feedback' && 'Student Feedback Feed'}
              {activeTab === 'profile' && 'Student Profile & Security'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => setIsNewFeedbackModalOpen(true)}
              className="bg-indigo-50 text-indigo-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>+ New Feedback</span>
            </button>
            <div 
              onClick={() => handleTabChange('profile')}
              className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-indigo-200 transition-colors"
              title="Maya Lin (Profile)"
            >
              ML
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-8 pb-12 flex-1">
          {activeTab === 'overview' && (
            <StudentOverview
              courses={courses}
              submissions={submissions}
              onStartCourseSurvey={handleStartSurvey}
              onViewReceipt={handleViewReceipt}
              onOpenNewFeedback={() => setIsNewFeedbackModalOpen(true)}
            />
          )}

          {activeTab === 'insights' && (
            <FacultyInsights
              courses={courses}
              quotes={quotes}
              submissions={submissions}
              onNavigateToFeedback={() => handleTabChange('feedback')}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              courses={courses}
              onStartCourseSurvey={handleStartSurvey}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackListView
              quotes={quotes}
              submissions={submissions}
              onOpenNewFeedback={() => setIsNewFeedbackModalOpen(true)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              courses={courses}
              submissions={submissions}
              onViewReceipt={handleViewReceipt}
              onResetData={handleResetData}
            />
          )}
        </div>
      </main>

      {/* Global Modals */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        submission={selectedReceipt}
      />

      <NewFeedbackModal
        isOpen={isNewFeedbackModalOpen}
        onClose={() => setIsNewFeedbackModalOpen(false)}
        courses={courses}
        onSelectCourseToSurvey={handleStartSurvey}
      />
    </div>
  );
}
