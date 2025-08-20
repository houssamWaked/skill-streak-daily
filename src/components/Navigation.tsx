import { Home, Archive, Settings, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
  { path: '/archive', icon: Archive, label: 'Archive' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-glass backdrop-blur-xl border-t border-border/20 shadow-glow">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === '/home' && location.pathname === '/');
          
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-spring',
                isActive 
                  ? 'text-primary bg-primary/20 shadow-soft scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/20 hover:scale-105'
              )}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};