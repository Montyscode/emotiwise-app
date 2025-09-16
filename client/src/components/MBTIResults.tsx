import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Heart, 
  Users, 
  Zap, 
  TrendingUp, 
  Target, 
  Info,
  BookOpen,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

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

interface JournalingInsights {
  journalingStyle: string;
  emotionalProcessing: string;
  stressSignals: string[];
  growthPrompts: string[];
}

const DIMENSION_NAMES = {
  EI: { E: "Extraversion", I: "Introversion" },
  SN: { S: "Sensing", N: "Intuition" },
  TF: { T: "Thinking", F: "Feeling" },
  JP: { J: "Judging", P: "Perceiving" }
};

const DIMENSION_DESCRIPTIONS = {
  E: "You gain energy from social interaction and the external world",
  I: "You gain energy from solitude and your inner world",
  S: "You focus on concrete details and present realities",
  N: "You focus on patterns, possibilities, and future potential",
  T: "You make decisions based on logic and objective analysis",
  F: "You make decisions based on values and personal considerations",
  J: "You prefer structure, closure, and planned approaches",
  P: "You prefer flexibility, openness, and adaptable approaches"
};

function getStrengthColor(strength: string): string {
  switch (strength) {
    case "strong": return "text-green-600 dark:text-green-400";
    case "moderate": return "text-blue-600 dark:text-blue-400";
    case "slight": return "text-yellow-600 dark:text-yellow-400";
    default: return "text-muted-foreground";
  }
}

function getStrengthProgress(strength: string): number {
  switch (strength) {
    case "strong": return 100;
    case "moderate": return 66;
    case "slight": return 33;
    default: return 0;
  }
}

export default function MBTIResults({ 
  results, 
  journalingInsights,
  onRetakeAssessment 
}: { 
  results: MBTIResults;
  journalingInsights?: JournalingInsights;
  onRetakeAssessment?: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Main Results Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10" data-testid="card-mbti-results-header">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="text-4xl font-bold" data-testid="text-mbti-type">
                {results.type}
              </CardTitle>
              <CardDescription className="text-lg mt-2" data-testid="text-mbti-description">
                {results.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your personality type influences how you process emotions and interact with the world. 
              This insight will help personalize your journaling experience.
            </AlertDescription>
          </Alert>
          {onRetakeAssessment && (
            <Button variant="outline" onClick={onRetakeAssessment} data-testid="button-retake-assessment">
              Retake Assessment
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Personality Dimensions */}
      <Card data-testid="card-personality-dimensions">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Personality Dimensions
          </CardTitle>
          <CardDescription>
            Understanding the strength of your preferences in each dimension
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(results.dimensions).map(([dimension, data]) => {
            const dimensionKey = dimension as keyof typeof DIMENSION_NAMES;
            const preferenceKey = data.preference as keyof typeof DIMENSION_NAMES[typeof dimensionKey];
            const preferredName = DIMENSION_NAMES[dimensionKey][preferenceKey];
            const description = DIMENSION_DESCRIPTIONS[data.preference];
            
            return (
              <div key={dimension} className="space-y-3" data-testid={`dimension-${dimension}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="min-w-8 h-8 flex items-center justify-center">
                      {data.preference}
                    </Badge>
                    <div>
                      <h4 className="font-medium" data-testid={`text-preference-${dimension}`}>
                        {preferredName}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-description-${dimension}`}>
                        {description}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getStrengthColor(data.strength)}
                    data-testid={`badge-strength-${dimension}`}
                  >
                    {data.strength} preference
                  </Badge>
                </div>
                <Progress 
                  value={getStrengthProgress(data.strength)} 
                  className="h-2" 
                  data-testid={`progress-${dimension}`}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card data-testid="card-strengths">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Your Strengths
            </CardTitle>
            <CardDescription>
              Natural talents and abilities associated with your personality type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2" data-testid={`strength-${index}`}>
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Growth Areas */}
        <Card data-testid="card-growth-areas">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <TrendingUp className="w-5 h-5" />
              Growth Areas
            </CardTitle>
            <CardDescription>
              Areas for potential development and personal growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {results.growthAreas.map((area, index) => (
                <li key={index} className="flex items-start gap-2" data-testid={`growth-area-${index}`}>
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Emotional Style */}
        <Card data-testid="card-emotional-style">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Emotional Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" data-testid="text-emotional-style">
              {results.emotionalStyle}
            </p>
          </CardContent>
        </Card>

        {/* Relationship Style */}
        <Card data-testid="card-relationship-style">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Relationship Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" data-testid="text-relationship-style">
              {results.relationshipStyle}
            </p>
          </CardContent>
        </Card>

        {/* Stress Response */}
        <Card data-testid="card-stress-response">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Stress Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" data-testid="text-stress-response">
              {results.stressResponse}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Journaling Insights */}
      {journalingInsights && (
        <Card data-testid="card-journaling-insights">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Personalized Journaling Insights
            </CardTitle>
            <CardDescription>
              How your personality type influences your journaling and emotional processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2" data-testid="text-journaling-style-title">Your Journaling Style</h4>
                <p className="text-sm text-muted-foreground" data-testid="text-journaling-style">
                  {journalingInsights.journalingStyle}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2" data-testid="text-emotional-processing-title">Emotional Processing</h4>
                <p className="text-sm text-muted-foreground" data-testid="text-emotional-processing">
                  {journalingInsights.emotionalProcessing}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Stress Signals to Watch For
                </h4>
                <ul className="space-y-2">
                  {journalingInsights.stressSignals.map((signal, index) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`stress-signal-${index}`}>
                      <AlertTriangle className="w-3 h-3 text-orange-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Growth Journal Prompts
                </h4>
                <ul className="space-y-2">
                  {journalingInsights.growthPrompts.map((prompt, index) => (
                    <li key={index} className="flex items-start gap-2" data-testid={`growth-prompt-${index}`}>
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm italic">"{prompt}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Your AI mentors (Sage and Jax) will now provide responses tailored to your {results.type} personality type, 
                offering insights that align with your natural emotional processing style.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}