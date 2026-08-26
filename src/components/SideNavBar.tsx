import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  MessageSquareQuote, 
  TrendingUp, 
  User, 
  Plus, 
  Menu,
  X,
  Sparkles,
  Layers
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SideNavBarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenNewFeedback: () => void;
  userRole: 'student' | 'faculty';
  onToggleUserRole: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewFeedback,
  userRole,
  onToggleUserRole,
}) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = [
    {
      id: 'overview' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'insights' as NavigationTab,
      label: 'Faculty Hub',
      icon: TrendingUp,
    },
    {
      id: 'courses' as NavigationTab,
      label: 'My Courses',
      icon: GraduationCap,
    },
    {
      id: 'feedback' as NavigationTab,
      label: 'Feedback Feed',
      icon: MessageSquareQuote,
    },
    {
      id: 'profile' as NavigationTab,
      label: 'Profile & Security',
      icon: User,
    },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-40">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavClick('overview')}
        >
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Echo</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleUserRole}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 text-indigo-400 font-semibold border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            {userRole === 'student' ? 'Student View' : 'Faculty View'}
          </button>
          
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 pt-16"
          onClick={() => setMobileOpen(false)}
        >
          <div 
            className="bg-slate-900 w-72 h-full shadow-2xl p-5 flex flex-col justify-between border-r border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div>
                  <span className="text-white font-bold text-lg tracking-tight">Echo</span>
                  <p className="text-[11px] text-slate-400">Campus Evaluation System</p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white font-medium shadow-sm'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  onOpenNewFeedback();
                  setMobileOpen(false);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 px-4 text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed Side Navigation Bar */}
      <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 hidden md:flex flex-col z-40 select-none border-r border-slate-800">
        {/* Brand Header */}
        <div 
          className="p-6 flex items-center justify-between cursor-pointer"
          onClick={() => onTabChange('overview')}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Echo</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-slate-800 px-2 py-0.5 rounded">
            v2.4
          </span>
        </div>

        {/* View Mode Switcher Pill */}
        <div className="px-4 mb-2">
          <div className="bg-slate-800/90 p-1 rounded-lg flex items-center border border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => {
                if (userRole !== 'student') onToggleUserRole();
              }}
              className={`flex-1 py-1 px-2 rounded text-center transition-all cursor-pointer ${
                userRole === 'student'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => {
                if (userRole !== 'faculty') onToggleUserRole();
              }}
              className={`flex-1 py-1 px-2 rounded text-center transition-all cursor-pointer ${
                userRole === 'faculty'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Faculty
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3 p-3 rounded-lg mb-1 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* Bottom Project Status Box */}
        <div className="p-4 bg-slate-800 m-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase mb-1">
            <span>Evaluation Term</span>
            <span className="text-emerald-400 font-normal">Active</span>
          </div>
          <div className="text-white text-sm font-medium mb-2">Fall 2024 Semester</div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-3/4 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
            <span>75% Completed</span>
            <span>12 Days Left</span>
          </div>
        </div>
      </aside>
    </>
  );
};
