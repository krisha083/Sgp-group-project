
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AppNavbar from '@/components/AppNavbar';
import { Card, CardContent } from '@/components/ui/card';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QuizTaking = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock quiz questions
  const mockQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Which of the following is NOT a type of machine learning?",
      options: [
        "Supervised Learning",
        "Unsupervised Learning",
        "Reinforcement Learning",
        "Directive Learning"
      ],
      correctAnswer: "Directive Learning",
      explanation: "The three main types of machine learning are supervised learning, unsupervised learning, and reinforcement learning. 'Directive Learning' is a fictional term and not a recognized type of machine learning."
    },
    {
      id: 2,
      question: "In supervised learning, what is the dataset called that contains both input data and expected output values?",
      options: [
        "Training set",
        "Validation set",
        "Test set",
        "Reference set"
      ],
      correctAnswer: "Training set",
      explanation: "In supervised learning, the training set is used to train the model and contains both input features and the corresponding correct outputs (labels)."
    },
    {
      id: 3,
      question: "What is the main goal of unsupervised learning?",
      options: [
        "To predict specific outputs based on inputs",
        "To find patterns or structures in unlabeled data",
        "To maximize rewards in an environment",
        "To minimize the cost function"
      ],
      correctAnswer: "To find patterns or structures in unlabeled data",
      explanation: "Unsupervised learning aims to discover hidden patterns or intrinsic structures within unlabeled data, as the model learns without explicit guidance or correct answers."
    },
    {
      id: 4,
      question: "In reinforcement learning, what does the agent receive to learn from its actions?",
      options: [
        "Labels",
        "Clusters",
        "Rewards or penalties",
        "Dimensions"
      ],
      correctAnswer: "Rewards or penalties",
      explanation: "In reinforcement learning, the agent learns by receiving rewards or penalties for its actions, which guides it to determine the optimal behavior to maximize cumulative rewards."
    },
    {
      id: 5,
      question: "Which of the following is a common application of supervised learning?",
      options: [
        "Customer segmentation",
        "Anomaly detection",
        "Email spam filtering",
        "Topic modeling"
      ],
      correctAnswer: "Email spam filtering",
      explanation: "Email spam filtering is typically implemented using supervised learning, where the model is trained on labeled examples of spam and non-spam emails to classify new emails correctly."
    }
  ];

  // Set up timer
  useEffect(() => {
    if (!isFinished) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isFinished]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  // Handle answer selection
  const handleSelectAnswer = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = async () => {
    // Check if all questions are answered
    const unanswered = selectedAnswers.filter(Boolean).length < mockQuestions.length;
    
    if (unanswered && !isFinished) {
      setShowSubmitDialog(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate score
      const score = selectedAnswers.reduce((acc, answer, index) => {
        return answer === mockQuestions[index].correctAnswer ? acc + 1 : acc;
      }, 0);
      
      // Store results in session storage for results page
      sessionStorage.setItem('quizResults', JSON.stringify({
        score,
        totalQuestions: mockQuestions.length,
        answers: selectedAnswers,
        questions: mockQuestions,
      }));
      
      // Navigate to results page
      navigate('/quiz/results');
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting your quiz.",
      });
      setIsSubmitting(false);
    }
  };

  // Current question
  const currentQuestion = mockQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      
      <main className="flex-1 container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Quiz header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Machine Learning Quiz</h1>
            <div className="flex items-center space-x-1 px-3 py-1 bg-secondary rounded-full">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {mockQuestions.length}</span>
              <span className="font-medium">{progressPercentage.toFixed(0)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
        
        {/* Question card */}
        <Card className="mb-6 overflow-hidden border transition-shadow hover:shadow-md">
          <div className="bg-secondary/50 py-3 px-6 border-b">
            <h2 className="font-medium">Question {currentQuestionIndex + 1}</h2>
          </div>
          <CardContent className="p-6">
            <p className="text-lg mb-6">{currentQuestion.question}</p>
            
            <RadioGroup 
              value={selectedAnswers[currentQuestionIndex] || ""} 
              onValueChange={handleSelectAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50">
                  <RadioGroupItem 
                    value={option} 
                    id={`option-${index}`} 
                    className="transition-colors"
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="h-10"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div>
            {currentQuestionIndex === mockQuestions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                disabled={isSubmitting}
                className="h-10"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>Submit Quiz</>
                )}
              </Button>
            ) : (
              <Button
                onClick={goToNextQuestion}
                className="h-10"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </main>
      
      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAnswers.filter(Boolean).length < mockQuestions.length ? (
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">You have unanswered questions</p>
                    <p className="text-sm text-muted-foreground">
                      {mockQuestions.length - selectedAnswers.filter(Boolean).length} of {mockQuestions.length} questions are unanswered. Unanswered questions will be marked as incorrect.
                    </p>
                  </div>
                </div>
              ) : (
                "Are you sure you want to submit your quiz? You can't change your answers after submission."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitQuiz}>
              Submit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default QuizTaking;
