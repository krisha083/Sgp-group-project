import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Video, FileText, BrainCircuit, List, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}
const AppNavbar = () => {
  const {
    pathname
  } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();

  // Mock navigation items
  const navItems: NavItem[] = [{
    name: 'Dashboard',
    href: '/dashboard',
    icon: Video
  }, {
    name: 'Transcripts',
    href: '/transcripts',
    icon: FileText
  }, {
    name: 'Quizzes',
    href: '/quizzes',
    icon: BrainCircuit
  }];

  // Close menu when navigating to a new page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Mock logout function
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
    // Navigate to login page after logout
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground" aria-label="QuizGen">
            <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-md overflow-hidden">
              <BrainCircuit className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="hidden md:inline-block">Texitify</span>
          </Link>

          {!isMobile && <nav className="hidden md:flex gap-6">
              {navItems.map(item => {
            const isActive = pathname === item.href;
            return <Link key={item.name} to={item.href} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                    {item.name}
                  </Link>;
          })}
            </nav>}
        </div>

        <div className="flex items-center gap-2">
          {!isMobile ? <>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Link to="/profile">
                <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                  <AvatarImage src="https://i.pravatar.cc/300" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Link>
            </> : <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="md:hidden" aria-label="Toggle menu">
              {isOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
            </Button>}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && isMobile && <nav className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 bg-background animate-fade-in md:hidden">
          <div className="flex flex-col space-y-4 relative">
            {navItems.map(item => {
          const isActive = pathname === item.href;
          return <Link key={item.name} to={item.href} className={`flex items-center gap-2 py-2 text-base ${isActive ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                  {item.name}
                </Link>;
        })}
            <div className="absolute bottom-[-240px] w-full">
              <div className="border-t my-4 pt-4">
                <Link to="/profile" className="flex items-center gap-2 py-2 text-base text-muted-foreground hover:text-foreground">
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 py-2 text-base text-muted-foreground hover:text-foreground w-full text-left">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>}
    </header>;
};
export default AppNavbar;