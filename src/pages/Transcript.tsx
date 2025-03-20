
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Pencil, CheckCircle, Copy, Video, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import AppNavbar from '@/components/AppNavbar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Transcript = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock transcript data
  const mockTranscript = `Welcome to this comprehensive tutorial on machine learning. In this video, we'll cover the fundamentals of machine learning, including supervised learning, unsupervised learning, and reinforcement learning.

Machine learning is a subset of artificial intelligence that focuses on developing systems that learn from data, identify patterns, and make decisions with minimal human intervention.

Let's start with supervised learning. This approach involves training a model on a labeled dataset, which means we have input data and the corresponding correct outputs. The goal is for the model to learn a mapping function that can predict the output for new, unseen input data. Examples of supervised learning include classification and regression tasks.

In contrast, unsupervised learning deals with unlabeled data. Here, the model tries to find patterns or structures in the data without explicit guidance. Clustering and dimensionality reduction are common applications of unsupervised learning.

Reinforcement learning is a different paradigm altogether. In this approach, an agent learns to make decisions by interacting with an environment. The agent receives rewards or penalties for its actions and learns to maximize the cumulative reward over time.

In the next section of this video, we'll dive deeper into each of these learning paradigms and explore practical applications.`;

  // Simulate transcript generation
  useEffect(() => {
    if (isGenerating) {
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalId);
            setIsGenerating(false);
            setTranscript(mockTranscript);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      
      return () => clearInterval(intervalId);
    }
  }, [isGenerating]);

  // Handle download
  const handleDownload = () => {
    // Create a blob from the transcript text
    const blob = new Blob([transcript], { type: 'text/plain' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    
    // Trigger a click on the anchor element
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your transcript is being downloaded.",
    });
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    
    toast({
      title: "Copied to clipboard",
      description: "Transcript text copied to clipboard.",
    });
  };

  // Handle saving edited transcript
  const handleSaveEdit = () => {
    setIsEditing(false);
    
    toast({
      title: "Changes saved",
      description: "Your transcript has been updated.",
    });
  };

  // Generate quiz from transcript
  const handleGenerateQuiz = () => {
    navigate('/quiz/create');
  };

  // Render loading state
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-20 h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
          style={{ animationDuration: '1.5s' }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">{progress}%</span>
        </div>
      </div>
      <h3 className="text-lg font-medium mb-1">Generating Transcript</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        Our AI is processing your video and generating a transcript. This may take a few minutes.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Video Transcript</h1>
          <p className="text-muted-foreground mt-1">
            Review and edit your generated transcript
          </p>
        </div>
        
        {isGenerating ? (
          <Card>
            <CardContent className="p-8">
              {renderLoadingState()}
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Video className="h-5 w-5 mr-2 text-primary" />
                  Introduction to Machine Learning
                </CardTitle>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>10:28 minutes</span>
                  <span className="mx-2">•</span>
                  <FileText className="h-3 w-3 mr-1" />
                  <span>342 words</span>
                </div>
              </CardHeader>
            </Card>
            
            <div className="flex justify-between items-center mb-3">
              <Label className="text-base font-medium">Transcript</Label>
              <div className="flex space-x-2">
                {isEditing ? (
                  <Button size="sm" onClick={handleSaveEdit} className="h-8">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    className="h-8"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                {isEditing ? (
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full h-72 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                ) : (
                  <div className="prose max-w-none">
                    {transcript.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed text-foreground">{paragraph}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium mb-1">Ready to create a quiz?</h3>
                <p className="text-sm text-muted-foreground">
                  Generate practice questions based on this transcript
                </p>
              </div>
              <Button size="lg" onClick={handleGenerateQuiz} className="h-11">
                Generate Quiz
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Transcript;
