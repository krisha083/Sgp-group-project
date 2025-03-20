
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlignLeft, BrainCircuit, HelpCircle, Info, Check, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import AppNavbar from '@/components/AppNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuizCreation = () => {
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [types, setTypes] = useState<string[]>(['multiple-choice']);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Toggle question type selection
  const toggleType = (type: string) => {
    if (types.includes(type)) {
      setTypes(types.filter(t => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  // Handle generate quiz
  const handleGenerateQuiz = async () => {
    if (types.length === 0) {
      toast({
        variant: "destructive",
        title: "No question type selected",
        description: "Please select at least one question type.",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Quiz generated",
        description: "Your quiz has been generated successfully.",
      });
      
      // Navigate to quiz
      navigate('/quiz/take');
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "There was an error generating your quiz.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Generate Quiz</h1>
          <p className="text-muted-foreground mt-1">
            Customize your quiz settings
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg font-medium flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2 text-primary" />
              Quiz Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Number of questions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Number of Questions</Label>
                <div className="py-0.5 px-2 rounded-md bg-secondary text-sm font-medium">
                  {questionCount}
                </div>
              </div>
              <Slider
                value={[questionCount]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setQuestionCount(value[0])}
                className="py-1"
              />
            </div>
            
            {/* Difficulty level */}
            <div className="space-y-3">
              <Label className="text-base">Difficulty Level</Label>
              <RadioGroup value={difficulty} onValueChange={setDifficulty} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" className="text-blue-500" />
                  <Label htmlFor="easy" className="text-sm font-normal">
                    Easy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" className="text-yellow-500" />
                  <Label htmlFor="medium" className="text-sm font-normal">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" className="text-red-500" />
                  <Label htmlFor="hard" className="text-sm font-normal">
                    Hard
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Question types */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Label className="text-base">Question Types</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                        <Info className="h-3.5 w-3.5" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Select the types of questions you want in your quiz. You can select multiple types.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="multiple-choice" 
                    checked={types.includes('multiple-choice')}
                    onCheckedChange={() => toggleType('multiple-choice')}
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor="multiple-choice" 
                      className="text-sm font-medium"
                    >
                      Multiple Choice
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Questions with several answer options
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="true-false" 
                    checked={types.includes('true-false')}
                    onCheckedChange={() => toggleType('true-false')}
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor="true-false" 
                      className="text-sm font-medium"
                    >
                      True/False
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Simple true or false statements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="short-answer" 
                    checked={types.includes('short-answer')}
                    onCheckedChange={() => toggleType('short-answer')}
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor="short-answer" 
                      className="text-sm font-medium"
                    >
                      Short Answer
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Brief text responses (1-2 sentences)
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="fill-blank" 
                    checked={types.includes('fill-blank')}
                    onCheckedChange={() => toggleType('fill-blank')}
                  />
                  <div className="grid gap-1.5">
                    <Label 
                      htmlFor="fill-blank" 
                      className="text-sm font-medium"
                    >
                      Fill in the Blank
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Complete sentences with missing words
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced options - could be expanded */}
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7"
              >
                Advanced Options
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/transcripts/new')}
            className="h-11"
          >
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleGenerateQuiz}
            disabled={isGenerating || types.length === 0}
            className="h-11"
          >
            {isGenerating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Generating...
              </>
            ) : (
              <>Generate Quiz</>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default QuizCreation;
