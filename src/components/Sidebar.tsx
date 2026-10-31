import React from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, collapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Панель управления', icon: 'fa-chart-line' },
    { id: 'students', label: 'Студенты', icon: 'fa-user-graduate' },
    { id: 'add-student', label: 'Добавить студента', icon: 'fa-user-plus' },
    { id: 'grades', label: 'Успеваемость', icon: 'fa-book' },
    { id: 'reports', label: 'Отчёты', icon: 'fa-file-alt' },
  ];

  return (
    <aside className={`bg-gradient-to-b from-indigo-900 to-indigo-800 text-white min-h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col shadow-xl`}>
      <div className="p-4 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="fas fa-graduation-cap text-lg"></i>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-sm">АИС</h1>
              <p className="text-xs text-indigo-300">Учёт студентов</p>
            </div>
          )}
        </div>
      </div>
      
      <nav className="flex-1 p-2 mt-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-white/20 text-white shadow-md'
                : 'text-indigo-200 hover:bg-white/10 hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <i className={`fas ${item.icon} w-5 text-center`}></i>
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-700">
        {!collapsed && (
          <div className="text-xs text-indigo-300 text-center">
            <p>Версия 1.0</p>
            <p>© 2024 Университет</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
