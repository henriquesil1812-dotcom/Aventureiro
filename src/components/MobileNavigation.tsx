import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  FileCheck2, 
  CalendarClock, 
  Settings,
  FolderTree
} from 'lucide-react';

interface MobileNavigationProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  currentTab: propCurrentTab, 
  onTabChange: propOnTabChange 
}) => {
  const { isInstructor, currentTab: contextCurrentTab, setCurrentTab } = useApp();

  const currentTab = propCurrentTab || contextCurrentTab || 'dashboard';
  const handleTabChange = (tab: string) => {
    if (propOnTabChange) {
      propOnTabChange(tab);
    } else if (setCurrentTab) {
      setCurrentTab(tab);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'adventurers', label: 'Aventureiros', icon: Users },
    { id: 'units', label: 'Unidades', icon: FolderTree },
    { id: 'specialties', label: 'Espec.', icon: Award },
    { id: 'tests', label: 'Provas', icon: FileCheck2 },
    { id: 'schedule', label: 'Avisos', icon: CalendarClock },
    ...(isInstructor ? [{ id: 'admin', label: 'Admin', icon: Settings }] : []),
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1 shadow-lg pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[50px] py-1 px-1.5 rounded-xl transition-all ${
                isActive
                  ? 'text-purple-900 font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${
                isActive ? 'bg-purple-100 text-purple-900 scale-110 shadow-sm' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-900 stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-purple-950' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
