import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LogOut, Send, User, Calendar, AlertCircle, Loader2, Brain } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import MBTIAssessment from "@/components/MBTIAssessment";
import MBTIResults from "@/components/MBTIResults";
import ProgressTracker from "@/components/ProgressTracker";
import sageAvatar from "@assets/generated_images/Sage_AI_mentor_avatar_094407dc.png";
import jaxAvatar from "@assets/generated_images/Jax_AI_mentor_avatar_2101b220.png";
import type { JournalEntry } from "@shared/schema";

// Form schema for journal entry submission
const journalEntrySchema = z.object({
  content: z.string().min(1, "Please write something in your journal").max(10000, "Entry is too long"),
  selectedMentor: z.enum(["sage", "jax"]).optional(),
});

type JournalEntryFormData = z.infer<typeof journalEntrySchema>;

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMentor, setSelectedMentor] = useState<"sage" | "jax" | null>(null);
  const [showMBTIAssessment, setShowMBTIAssessment] = useState(false);
  const [showMBTIResults, setShowMBTIResults] = useState(false);
  const [activeView, setActiveView] = useState<"journal" | "progress">("journal");
  
  // Form setup
  const form = useForm<JournalEntryFormData>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      content: "",
      selectedMentor: undefined,
    },
  });
  
  const watchedContent = form.watch("content");
  
  // Fetch journal entries
  const { data: journalEntries, isLoading: isLoadingEntries, error: entriesError } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
    queryFn: async () => {
      const response = await fetch("/api/journal/entries?limit=10", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch journal entries");
      return response.json();
    }
  });
  
  // Fetch MBTI assessment
  const { data: mbtiAssessment, isLoading: isLoadingMBTI } = useQuery({
    queryKey: ["/api/assessments/mbti/latest"],
    queryFn: async () => {
      const response = await fetch("/api/assessments/mbti/latest", {
        credentials: "include"
      });
      if (response.status === 404) return null; // No assessment found
      if (!response.ok) throw new Error("Failed to fetch MBTI assessment");
      return response.json();
    }
  });

  // Fetch emotional insights
  const { data: insights, isLoading: isLoadingInsights } = useQuery<{
    selfAwareness: number;
    emotionalRegulation: number;
    mindfulness: number;
  }>({
    queryKey: ["/api/insights/emotional"],
    queryFn: async () => {
      const response = await fetch("/api/insights/emotional", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch insights");
      const data = await response.json();
      // Transform AI insights into progress percentages
      return {
        selfAwareness: Math.round((data.selfAwarenessScore || 0.85) * 100),
        emotionalRegulation: Math.round((data.emotionalRegulationScore || 0.72) * 100),
        mindfulness: Math.round((data.mindfulnessScore || 0.90) * 100),
      };
    },
    enabled: !!journalEntries?.length, // Only fetch insights if we have journal entries
  });
  
  // Submit journal entry mutation
  const submitJournalMutation = useMutation({
    mutationFn: async (data: JournalEntryFormData) => {
      const response = await apiRequest("POST", "/api/journal/entries", {
        content: data.content,
        selectedMentor: selectedMentor || undefined,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights/emotional"] });
      form.reset();
      setSelectedMentor(null);
      toast({
        title: "Entry saved!",
        description: selectedMentor 
          ? `Your journal entry and ${selectedMentor === "sage" ? "Sage's" : "Jax's"} response have been saved.`
          : "Your journal entry has been saved.",
      });
    },
    onError: (error: any) => {
      console.error("Journal entry submission error:", error);
      
      if (isUnauthorizedError(error)) {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please log in again to save your journal entry.",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to save entry",
          description: error.message || "Please try again later.",
        });
      }
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleJournalSubmit = (data: JournalEntryFormData) => {
    submitJournalMutation.mutate({
      ...data,
      selectedMentor: selectedMentor || undefined,
    });
  };

  const handleMentorSelect = (mentor: "sage" | "jax") => {
    setSelectedMentor(selectedMentor === mentor ? null : mentor);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get user's display name
  const userName = user ? `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() || (user as any).email : 'User';
  
  // Get MBTI type from assessment
  const mbtiType = mbtiAssessment?.results?.type;
  const mbtiResults = mbtiAssessment?.results;
  const journalingInsights = mbtiAssessment?.results?.journalingInsights;

  // Handle MBTI assessment completion
  const handleMBTIComplete = (results: any) => {
    setShowMBTIAssessment(false);
    setShowMBTIResults(true);
    queryClient.invalidateQueries({ queryKey: ["/api/assessments/mbti/latest"] });
  };

  const handleStartMBTIAssessment = () => {
    setShowMBTIAssessment(true);
    setShowMBTIResults(false);
  };

  const handleViewMBTIResults = () => {
    setShowMBTIResults(true);
    setShowMBTIAssessment(false);
  };

  const handleRetakeAssessment = () => {
    setShowMBTIResults(false);
    setShowMBTIAssessment(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold" data-testid="text-app-title">EmotiWise</h1>
            {mbtiType ? (
              <Badge variant="secondary" data-testid="badge-mbti-type">{mbtiType}</Badge>
            ) : (
              <Badge variant="outline" data-testid="badge-no-mbti">
                <Brain className="w-3 h-3 mr-1" />
                No MBTI
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant={activeView === "journal" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("journal")}
                data-testid="button-journal-tab"
              >
                Journal
              </Button>
              <Button 
                variant={activeView === "progress" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("progress")}
                data-testid="button-progress-tab"
              >
                Progress
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" data-testid="icon-user" />
              <span className="text-sm" data-testid="text-user-name">{userName}</span>
            </div>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Conditional rendering for MBTI Assessment/Results */}
      {showMBTIAssessment ? (
        <MBTIAssessment onComplete={handleMBTIComplete} />
      ) : showMBTIResults && mbtiResults ? (
        <MBTIResults 
          results={mbtiResults} 
          journalingInsights={journalingInsights}
          onRetakeAssessment={handleRetakeAssessment}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Mobile Navigation */}
          <div className="md:hidden mb-6">
            <div className="flex gap-2">
              <Button 
                variant={activeView === "journal" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("journal")}
                data-testid="button-mobile-journal-tab"
                className="flex-1"
              >
                Journal
              </Button>
              <Button 
                variant={activeView === "progress" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView("progress")}
                data-testid="button-mobile-progress-tab"
                className="flex-1"
              >
                Progress
              </Button>
            </div>
          </div>

          {activeView === "progress" ? (
            <ProgressTracker />
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
        {/* Journal Writing Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-journal-entry">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-journal-title">
                <Calendar className="w-5 h-5" />
                Today's Journal Entry
              </CardTitle>
              <CardDescription data-testid="text-journal-description">
                Express your thoughts and emotions. Your AI mentors will provide personalized insights.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleJournalSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="How are you feeling today? What's on your mind?"
                            className="min-h-32 resize-none font-serif"
                            data-testid="input-journal-entry"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {watchedContent && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground" data-testid="text-choose-mentor">
                        Choose your AI mentor for personalized feedback:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          type="button"
                          variant={selectedMentor === "sage" ? "default" : "outline"}
                          onClick={() => handleMentorSelect("sage")}
                          className="flex items-center gap-3 h-auto p-4"
                          data-testid="button-select-sage"
                        >
                          <img 
                            src={sageAvatar} 
                            alt="Sage" 
                            className="w-8 h-8 rounded-full"
                            data-testid="img-sage-avatar-small"
                          />
                          <div className="text-left">
                            <div className="font-medium">Sage</div>
                            <div className="text-xs opacity-70">Gentle guidance</div>
                          </div>
                        </Button>
                        
                        <Button
                          type="button"
                          variant={selectedMentor === "jax" ? "default" : "outline"}
                          onClick={() => handleMentorSelect("jax")}
                          className="flex items-center gap-3 h-auto p-4"
                          data-testid="button-select-jax"
                        >
                          <img 
                            src={jaxAvatar} 
                            alt="Jax" 
                            className="w-8 h-8 rounded-full"
                            data-testid="img-jax-avatar-small"
                          />
                          <div className="text-left">
                            <div className="font-medium">Jax</div>
                            <div className="text-xs opacity-70">Direct feedback</div>
                          </div>
                        </Button>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        data-testid="button-submit-journal"
                        disabled={submitJournalMutation.isPending}
                      >
                        {submitJournalMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {selectedMentor 
                              ? `Get Insights from ${selectedMentor === "sage" ? "Sage" : "Jax"}`
                              : "Save Entry"
                            }
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Previous Entries */}
          <Card data-testid="card-journal-history">
            <CardHeader>
              <CardTitle data-testid="text-history-title">Recent Journal Entries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingEntries ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : entriesError ? (
                <Alert data-testid="alert-entries-error">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load journal entries. Please refresh the page or try again later.
                  </AlertDescription>
                </Alert>
              ) : !journalEntries?.length ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-entries">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No journal entries yet.</p>
                  <p className="text-sm">Start writing above to track your emotional journey.</p>
                </div>
              ) : (
                journalEntries.map((entry, index) => (
                  <div key={entry.id} className="space-y-4" data-testid={`entry-${entry.id}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground" data-testid={`text-entry-date-${entry.id}`}>
                        {formatDate(entry.createdAt!)}
                      </span>
                      {entry.mood && (
                        <Badge variant="outline" data-testid={`badge-mood-${entry.id}`}>
                          {entry.mood}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="font-serif leading-relaxed" data-testid={`text-entry-content-${entry.id}`}>
                      {entry.content}
                    </p>
                    
                    {(entry.sageResponse || entry.jaxResponse) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {entry.sageResponse && (
                          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20" data-testid={`response-sage-${entry.id}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <img src={sageAvatar} alt="Sage" className="w-6 h-6 rounded-full" />
                              <span className="font-medium text-accent-foreground">Sage</span>
                            </div>
                            <p className="text-sm">{entry.sageResponse}</p>
                          </div>
                        )}
                        
                        {entry.jaxResponse && (
                          <div className="p-4 bg-chart-3/10 rounded-lg border border-chart-3/20" data-testid={`response-jax-${entry.id}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <img src={jaxAvatar} alt="Jax" className="w-6 h-6 rounded-full" />
                              <span className="font-medium">Jax</span>
                            </div>
                            <p className="text-sm">{entry.jaxResponse}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {index < journalEntries.length - 1 && <Separator />}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Emotional Progress */}
          <Card data-testid="card-emotional-progress">
            <CardHeader>
              <CardTitle data-testid="text-progress-title">Emotional Progress</CardTitle>
              <CardDescription data-testid="text-progress-description">
                Your growth over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingInsights ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Self-Awareness</span>
                    <span className="text-sm font-medium">{insights?.selfAwareness || 85}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${insights?.selfAwareness || 85}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emotional Regulation</span>
                    <span className="text-sm font-medium">{insights?.emotionalRegulation || 72}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${insights?.emotionalRegulation || 72}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mindfulness</span>
                    <span className="text-sm font-medium">{insights?.mindfulness || 90}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-chart-4 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${insights?.mindfulness || 90}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle data-testid="text-actions-title">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mbtiType ? (
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleViewMBTIResults}
                  data-testid="button-view-mbti-results"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  View MBTI Results ({mbtiType})
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleStartMBTIAssessment}
                  data-testid="button-take-assessment"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Take MBTI Assessment
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" data-testid="button-mood-check">
                Quick Mood Check-in
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-export">
                Export Journal
              </Button>
            </CardContent>
          </Card>
        </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}