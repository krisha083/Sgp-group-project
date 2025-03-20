
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, FileText, BrainCircuit, Clock, PlusCircle, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppNavbar from '@/components/AppNavbar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActivityItem {
  id: string;
  title: string;
  date: string;
  type: 'video' | 'transcript' | 'quiz';
  status: 'completed' | 'in_progress' | 'pending';
}

const Dashboard = () => {
  // Mock recent activity
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      date: '2 hours ago',
      type: 'video',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Advanced React Hooks',
      date: '1 day ago',
      type: 'transcript',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Web Development Fundamentals',
      date: '3 days ago',
      type: 'quiz',
      status: 'completed',
    },
  ]);

  // Mock stats
  const stats = [
    {
      title: 'Videos Processed',
      value: 12,
      icon: Video,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
    },
    {
      title: 'Transcripts Generated',
      value: 18,
      icon: FileText,
      color: 'text-green-500',
      bg: 'bg-green-100',
    },
    {
      title: 'Quizzes Created',
      value: 9,
      icon: BrainCircuit,
      color: 'text-purple-500',
      bg: 'bg-purple-100',
    },
  ];

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'transcript':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'quiz':
        return <BrainCircuit className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Get status indicator
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="flex flex-col gap-6">
          {/* Welcome Section */}
          <section className="mb-6 md:mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground mt-1">
                  Here's an overview of your QuizGen activity
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button asChild size="lg" className="group h-11">
                  <Link to="/upload">
                    <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                    New Upload
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Storage Usage */}
          <section className="mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Videos</span>
                    </div>
                    <span className="text-sm text-muted-foreground">1.2 GB / 5 GB</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Progress value={24} className="h-2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>24% of storage used</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Transcripts</span>
                    </div>
                    <span className="text-sm text-muted-foreground">0.3 GB / 2 GB</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Progress value={15} className="h-2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>15% of storage used</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <Card key={activity.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-secondary">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <h3 className="font-medium leading-tight">{activity.title}</h3>
                          <div className="flex items-center mt-1 space-x-3">
                            {getStatusIndicator(activity.status)}
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                              <span className="text-xs text-muted-foreground">{activity.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/${activity.type}s/${activity.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
