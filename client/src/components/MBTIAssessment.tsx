import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Brain, Info, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface MBTIQuestion {
  id: string;
  text: string;
  dimension: "EI" | "SN" | "TF" | "JP";
  direction: "positive" | "negative";
  category: string;
}

interface MBTIResponse {
  questionId: string;
  score: number;
}

interface MBTIResults {
  type: string;
  dimensions: {
    EI: { score: number; preference: "E" | "I"; strength: "strong" | "moderate" | "slight" };
    SN: { score: number; preference: "S" | "N"; strength: "strong" | "moderate" | "slight" };
    TF: { score: number; preference: "T" | "F"; strength: "strong" | "moderate" | "slight" };
    JP: { score: number; preference: "J" | "P"; strength: "strong" | "moderate" | "slight" };
  };
  description: string;
  strengths: string[];
  growthAreas: string[];
  emotionalStyle: string;
  relationshipStyle: string;
  stressResponse: string;
}

const SCALE_LABELS = [
  "Strongly Disagree",
  "Disagree", 
  "Slightly Disagree",
  "Neutral",
  "Slightly Agree",
  "Agree",
  "Strongly Agree"
];

const DIMENSION_INFO = {
  EI: {
    title: "Extraversion vs Introversion",
    description: "How you direct your energy and where you focus your attention"
  },
  SN: {
    title: "Sensing vs Intuition", 
    description: "How you take in and process information"
  },
  TF: {
    title: "Thinking vs Feeling",
    description: "How you make decisions and what you base them on"
  },
  JP: {
    title: "Judging vs Perceiving",
    description: "How you approach the outside world and structure your life"
  }
};

export default function MBTIAssessment({ onComplete }: { onComplete?: (results: MBTIResults) => void }) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showInstructions, setShowInstructions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionsPerPage = 4;

  // Fetch MBTI questions
  const { data: questions, isLoading: isLoadingQuestions, error: questionsError } = useQuery<MBTIQuestion[]>({
    queryKey: ["/api/assessments/mbti/questions"],
    queryFn: async () => {
      const response = await fetch("/api/assessments/mbti/questions", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch MBTI questions");
      return response.json();
    }
  });

  // Submit assessment mutation
  const submitAssessmentMutation = useMutation({
    mutationFn: async (assessmentResponses: MBTIResponse[]) => {
      const response = await apiRequest("POST", "/api/assessments/mbti/submit", {
        responses: assessmentResponses
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/mbti/latest"] });
      toast({
        title: "Assessment Complete!",
        description: `Your MBTI type is ${data.results.type}. View your detailed results below.`,
      });
      if (onComplete) {
        onComplete(data.results);
      }
    },
    onError: (error: any) => {
      console.error("MBTI Assessment submission error:", error);
      
      if (isUnauthorizedError(error)) {
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please log in again to complete your assessment.",
        });
        // Redirect to login after a delay
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
      } else if (error.message?.includes("Invalid MBTI responses")) {
        toast({
          variant: "destructive",
          title: "Invalid responses",
          description: "Please ensure all questions are answered correctly.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Assessment failed",
          description: error.message || "Please check your responses and try again.",
        });
      }
    },
  });

  if (isLoadingQuestions) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card data-testid="card-mbti-loading">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                    <Skeleton key={j} className="h-10 w-10 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert data-testid="alert-mbti-error">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Unable to load MBTI assessment questions. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert data-testid="alert-no-questions">
          <Info className="h-4 w-4" />
          <AlertDescription>
            No assessment questions available at this time.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card data-testid="card-mbti-instructions">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl" data-testid="text-mbti-title">MBTI Personality Assessment</CardTitle>
            </div>
            <CardDescription className="text-lg" data-testid="text-mbti-subtitle">
              Discover your personality type and get personalized journaling insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold" data-testid="text-instructions-title">How it works:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Answer 32 questions about your preferences and behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Each question uses a 7-point scale from "Strongly Disagree" to "Strongly Agree"</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Be honest - there are no right or wrong answers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Takes about 10-15 minutes to complete</span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(DIMENSION_INFO).map(([dimension, info]) => (
                <div key={dimension} className="bg-card border rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-1">{info.title}</h4>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
              ))}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your results will be used to provide personalized guidance from your AI mentors and improve your journaling experience.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowInstructions(false)}
                data-testid="button-start-assessment"
              >
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );
  const progress = (Object.keys(responses).length / questions.length) * 100;
  const answeredOnCurrentPage = currentQuestions.every(q => responses[q.id] !== undefined);
  const canGoNext = answeredOnCurrentPage && currentPage < totalPages - 1;
  const canSubmit = Object.keys(responses).length === questions.length;

  const handleResponse = (questionId: string, score: number) => {
    setResponses(prev => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    const assessmentResponses: MBTIResponse[] = Object.entries(responses).map(([questionId, score]) => ({
      questionId,
      score
    }));
    
    await submitAssessmentMutation.mutateAsync(assessmentResponses);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card data-testid="card-progress">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" data-testid="text-progress-title">
              MBTI Assessment
            </h2>
            <Badge variant="secondary" data-testid="badge-progress">
              {Object.keys(responses).length} / {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-bar" />
          <p className="text-sm text-muted-foreground mt-2" data-testid="text-progress-description">
            Page {currentPage + 1} of {totalPages} • {Math.round(progress)}% complete
          </p>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card data-testid="card-questions">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="text-questions-title">
            <Brain className="w-5 h-5" />
            Questions {currentPage * questionsPerPage + 1}-{Math.min((currentPage + 1) * questionsPerPage, questions.length)}
          </CardTitle>
          <CardDescription data-testid="text-questions-description">
            Rate how much you agree with each statement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="space-y-4" data-testid={`question-${question.id}`}>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="min-w-6 h-6 text-xs flex items-center justify-center mt-0.5">
                    {currentPage * questionsPerPage + index + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium" data-testid={`text-question-${question.id}`}>
                      {question.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Category: {question.category}
                    </p>
                  </div>
                  {responses[question.id] !== undefined && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Strongly Disagree</span>
                  <span>Neutral</span>
                  <span>Strongly Agree</span>
                </div>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleResponse(question.id, score)}
                      className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                        responses[question.id] === score
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-muted-foreground hover:bg-muted/50"
                      }`}
                      data-testid={`button-score-${question.id}-${score}`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        responses[question.id] === score
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}>
                        {responses[question.id] === score ? (
                          <Circle className="w-3 h-3 fill-current" />
                        ) : (
                          <span className="text-xs font-medium">{score}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium">
                        {SCALE_LABELS[score - 1]?.split(" ")[0] || score}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {index < currentQuestions.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card data-testid="card-navigation">
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              data-testid="button-previous"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentPage === totalPages - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  data-testid="button-submit-assessment"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    "Complete Assessment"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={!canGoNext}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {!answeredOnCurrentPage && (
            <p className="text-sm text-muted-foreground text-center mt-4" data-testid="text-answer-prompt">
              Please answer all questions on this page to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}