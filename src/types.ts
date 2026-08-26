export type NavigationTab = 'overview' | 'courses' | 'feedback' | 'insights' | 'profile';

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor: string;
  instructorTitle?: string;
  term: string;
  department: string;
  description: string;
  schedule: string;
  location?: string;
  credits: number;
  enrollmentCapacity: number;
  enrolledCount: number;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  estimatedMinutes: number;
  progressPercent?: number;
  studentCount: number;
  overallSatisfaction: number;
  clarityScore: number;
  engagementScore: number;
  materialsScore: number;
  pacingScore: number;
  completedDate?: string;
  receiptId?: string;
  syllabusTopics?: string[];
}

export interface SurveyQuestion {
  id: number;
  category: 'clarity' | 'engagement' | 'materials' | 'pacing' | 'general';
  categoryLabel: string;
  question: string;
  description?: string;
}

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export interface RatingOption {
  value: RatingValue;
  label: string;
  iconName: string;
}

export interface SurveyAnswers {
  ratings: Record<number, RatingValue>;
  questionComments: Record<number, string>;
  wellFeedback: string;
  wellTags: string[];
  improveFeedback: string;
  improveTags: string[];
  isAnonymous: boolean;
}

export interface FeedbackSubmission {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCode: string;
  instructor: string;
  submittedAt: string;
  receiptId: string;
  isAnonymous: boolean;
  ratings: Record<number, RatingValue>;
  scores: {
    clarity: number;
    engagement: number;
    materials: number;
    pacing: number;
    overall: number;
  };
  wellFeedback: string;
  wellTags: string[];
  improveFeedback: string;
  improveTags: string[];
  studentInitials?: string;
  studentName?: string;
}

export interface StudentQuote {
  id: string;
  quote: string;
  author: string;
  course: string;
  initials: string;
  colorClass: string;
  avatarBg: string;
  avatarText: string;
  date: string;
  rating: number;
  tags: string[];
}
