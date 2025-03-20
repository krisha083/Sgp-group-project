
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Link2, X, File, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import AppNavbar from '@/components/AppNavbar';

interface FileWithPreview extends File {
  preview?: string;
}

const VideoUpload = () => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [videoUrl, setVideoUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // File selection handling
  const handleFileSelect = (file: File) => {
    // Check if the file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a video file.",
      });
      return;
    }
    
    const fileWithPreview = file as FileWithPreview;
    fileWithPreview.preview = URL.createObjectURL(file);
    setSelectedFile(fileWithPreview);
    setUploadError(null);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Upload the file
  const handleUpload = async () => {
    if (uploadMethod === 'file' && !selectedFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a video file to upload.",
      });
      return;
    }
    
    if (uploadMethod === 'url' && !videoUrl) {
      toast({
        variant: "destructive",
        title: "No URL provided",
        description: "Please enter a valid video URL.",
      });
      return;
    }
    
    // Reset states
    setUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    setUploadError(null);
    
    try {
      // Simulating file upload with progress
      const intervalId = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            setTimeout(() => {
              setUploadComplete(true);
              setUploading(false);
              
              toast({
                title: "Upload complete",
                description: "Your video has been uploaded successfully.",
              });
              
              // Navigate to transcript page after a short delay
              setTimeout(() => {
                navigate('/transcripts/new');
              }, 1500);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 150); // Adjust timing for desired speed
      
      // Mock API call would go here
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('An error occurred during upload. Please try again.');
      setUploading(false);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
  };
  
  // Open file dialog
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Render proper upload state
  const renderUploadState = () => {
    if (uploadError) {
      return (
        <div className="text-center p-6 rounded-lg border border-destructive/20 bg-destructive/10">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium">{uploadError}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setUploadError(null)}
          >
            Try Again
          </Button>
        </div>
      );
    }
    
    if (uploadComplete) {
      return (
        <div className="text-center p-6 rounded-lg border border-green-200 bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
          <p className="text-green-600 font-medium">Upload Complete!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Redirecting to transcription...
          </p>
        </div>
      );
    }
    
    if (uploading) {
      return (
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Uploading... {uploadProgress}%
          </p>
          <Progress value={uploadProgress} className="h-2 mb-4" />
          <p className="text-xs text-muted-foreground">Please wait while your video is being uploaded</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNavbar />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Upload Video</h1>
          <p className="text-muted-foreground mt-1">
            Upload a video to generate a transcript and quiz
          </p>
        </div>
        
        <Tabs defaultValue="file" className="mb-8" onValueChange={(value) => setUploadMethod(value as 'file' | 'url')}>
          <TabsList className="grid grid-cols-2 w-full max-w-xs mb-6">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <span>File Upload</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span>Video URL</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mb-6">
            <TabsContent value="file">
              <Card>
                <CardContent className="p-6">
                  {!selectedFile ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 transition-colors text-center ${
                        dragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={openFileDialog}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-3 rounded-full bg-secondary">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium mb-1">
                            {dragActive 
                              ? 'Drop your video here' 
                              : 'Drag and drop your video here'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Or click to browse files
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          Supports MP4, WebM, AVI, MOV (max 500MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-24 h-16 bg-black rounded overflow-hidden">
                            {selectedFile.type.startsWith('video/') && (
                              <video src={selectedFile.preview} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[200px] sm:max-w-xs">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={removeSelectedFile}
                          aria-label="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {renderUploadState()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="url">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="video-url"
                        placeholder="https://example.com/video.mp4"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports YouTube, Vimeo, Google Drive, and direct video URLs
                    </p>
                  </div>

                  {renderUploadState()}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
          
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleUpload}
              disabled={
                (uploadMethod === 'file' && !selectedFile) || 
                (uploadMethod === 'url' && !videoUrl) || 
                uploading
              }
              className="h-11"
            >
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <span>Upload Video</span>
              )}
            </Button>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default VideoUpload;
