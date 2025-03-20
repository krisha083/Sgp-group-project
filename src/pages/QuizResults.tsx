
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, X, AlertCircle, DownloadCloud, RotateCcw, Home, 
  ChevronDown, ChevronUp, BookOpen, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppNavbar from '@/components/AppNavbar';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Cell
} from 'recharts';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizResults {
  score: number;
  totalQuestions: number;
  answers: string[];
  questions: QuizQuestion[];
}

const QuizResults = () => {
  const [results, setResults] = useState<QuizResults | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load results from session storage
  useEffect(() => {
    const storedResults = sessionStorage.getItem('quizResults');
    
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // Redirect to dashboard if no results found
      navigate('/dashboard');
    }
  }, [navigate]);

  // Toggle expanded question
  const toggleQuestion = (id: number) => {
    if (expandedQuestions.includes(id)) {
      setExpandedQuestions(expandedQuestions.filter(q => q !== id));
    } else {
      setExpandedQuestions([...expandedQuestions, id]);
    }
  };

  // Prepare chart data
  const prepareChartData = (results: QuizResults) => {
    const correctCount = results.score;
    const incorrectCount = results.totalQuestions - correctCount;
    
    return [
      { name: 'Correct', value: correctCount, color: '#22c55e' },
      { name: 'Incorrect', value: incorrectCount, color: '#ef4444' },
    ];
  };

  // Handle export results
  const handleExportResults = () => {
    if (!results) return;
    
    // Create text content
    let content = `Quiz Results\n\n`;
    content += `Score: ${results.score}/${results.totalQuestions} (${Math.round((results.score / results.totalQuestions) * 100)}%)\n\n`;
    content += `Questions:\n\n`;
    
    results.questions.forEach((question, index) => {
      content += `${index + 1}. ${question.question}\n`;
      content += `Your answer: ${results.answers[index] || 'Not answered'}\n`;
      content += `Correct answer: ${question.correctAnswer}\n`;
      content += `Explanation: ${question.explanation}\n\n`;
    });
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Results exported",
      description: "Quiz results have been downloaded as a text file.",
    });
  };

  // Handle retry quiz
  const handleRetryQuiz = () => {
    navigate('/quiz/take');
  };

  // If no results found
  if (!results) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">No Quiz Results Found</h1>
            <p className="text-muted-foreground mb-6">
              You haven't completed a quiz yet or the results have expired.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate percentage score
  const percentageScore = Math.round((results.score / results.totalQuestions) * 100);
  const chartData = prepareChartData(results);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
          <p className="text-muted-foreground mt-1">
            Review your quiz performance
          </p>
        </div>
        
        {/* Results summary card */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">
              Machine Learning Quiz
            </CardTitle>
            <CardDescription>
              Completed on {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score section */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Your Score</h3>
                
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">{percentageScore}%</span>
                  <span>{results.score} of {results.totalQuestions} correct</span>
                </div>
                
                <Progress 
                  value={percentageScore} 
                  className="h-3"
                  color={percentageScore >= 70 ? 'bg-green-500' : percentageScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                />
                
                <div className="pt-4">
                  {percentageScore >= 70 ? (
                    <div className="flex items-start space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                      <Check className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Excellent work!</p>
                        <p className="text-sm">You've demonstrated a strong understanding of the material.</p>
                      </div>
                    </div>
                  ) : percentageScore >= 40 ? (
                    <div className="flex items-start space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-md">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Good effort!</p>
                        <p className="text-sm">Review the questions you missed to improve your understanding.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                      <X className="h-5 w-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Keep practicing!</p>
                        <p className="text-sm">Focus on understanding the concepts you missed in this quiz.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Chart section */}
              <div>
                <h3 className="font-medium text-lg mb-4">Performance Breakdown</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" domain={[0, results.totalQuestions]} />
                      <YAxis dataKey="name" type="category" />
                      <RechartsTooltip 
                        formatter={(value: number, name: string) => [
                          `${value} questions (${Math.round((value / results.totalQuestions) * 100)}%)`, 
                          name
                        ]}
                      />
                      <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleExportResults}>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export Results
            </Button>
            <div className="space-x-3">
              <Button variant="outline" onClick={handleRetryQuiz}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry Quiz
              </Button>
              <Button onClick={() => navigate('/dashboard')}>
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Questions review */}
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight mb-4">Question Review</h2>
          
          <div className="space-y-4">
            {results.questions.map((question, index) => {
              const userAnswer = results.answers[index] || 'Not answered';
              const isCorrect = userAnswer === question.correctAnswer;
              const isExpanded = expandedQuestions.includes(question.id);
              
              return (
                <Collapsible 
                  key={question.id}
                  open={isExpanded}
                  onOpenChange={() => toggleQuestion(question.id)}
                  className="border rounded-lg overflow-hidden transition-colors hover:bg-secondary/10"
                >
                  <div className={`flex items-center p-4 ${isExpanded ? 'border-b' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isCorrect ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{question.question}</p>
                    </div>
                    
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="p-4 bg-secondary/20">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Your answer:</p>
                          <div className={`text-sm p-2 rounded ${
                            isCorrect 
                              ? 'bg-green-50 text-green-700 border border-green-100' 
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {userAnswer}
                          </div>
                        </div>
                        
                        {!isCorrect && (
                          <div>
                            <p className="text-sm font-medium mb-1">Correct answer:</p>
                            <div className="text-sm p-2 rounded bg-green-50 text-green-700 border border-green-100">
                              {question.correctAnswer}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-medium mb-1">Explanation:</p>
                          <div className="text-sm p-3 rounded bg-blue-50 text-blue-700 border border-blue-100">
                            <div className="flex items-start">
                              <BookOpen className="h-4 w-4 mr-2 mt-0.5" />
                              <p>{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
        
        {/* Further learning suggestion */}
        <div className="mt-12 rounded-lg p-6 border bg-secondary/20">
          <h3 className="text-lg font-medium mb-3">Recommended Next Steps</h3>
          <p className="text-muted-foreground mb-4">Based on your performance, we recommend the following resources to strengthen your understanding:</p>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Introduction to Machine Learning Concepts</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Supervised vs. Unsupervised Learning</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
