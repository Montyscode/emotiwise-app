import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Brain, 
  Heart, 
  Target,
  Flame,
  BarChart3,
  LineChart as LineChartIcon,
  Activity,
  Award,
  Zap,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ProgressMetrics {
  selfAwareness: number;
  emotionalRegulation: number;
  mindfulness: number;
  consistencyScore: number;
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageMoodScore: number;
  moodDistribution: { positive: number; negative: number; mixed: number; neutral: number };
  weeklyTrend: number;
  monthlyGrowth: number;
}

interface ProgressData {
  metrics: ProgressMetrics;
  patterns: string[];
  growthAreas: string[];
  strengths: string[];
  recommendations: string[];
  moodTrends: Array<{ date: string; mood: string | null; score: number }>;
}

export default function ProgressTracker() {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch comprehensive progress data
  const { data: progressData, isLoading, error } = useQuery<ProgressData>({
    queryKey: ["/api/progress/comprehensive"],
    queryFn: async () => {
      const response = await fetch("/api/progress/comprehensive", {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to fetch progress data");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="progress-loading">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <Alert data-testid="progress-error">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          Failed to load progress data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const { metrics, patterns, growthAreas, strengths, recommendations, moodTrends } = progressData;

  // Prepare mood distribution data for pie chart
  const moodChartData = [
    { name: 'Positive', value: metrics.moodDistribution.positive, fill: 'hsl(var(--chart-4))' },
    { name: 'Mixed', value: metrics.moodDistribution.mixed, fill: 'hsl(var(--chart-3))' },
    { name: 'Neutral', value: metrics.moodDistribution.neutral, fill: 'hsl(var(--chart-1))' },
    { name: 'Negative', value: metrics.moodDistribution.negative, fill: 'hsl(var(--chart-5))' },
  ].filter(item => item.value > 0);

  // Prepare mood trend data for line chart
  const trendChartData = moodTrends.slice(-30).map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: trend.score,
    mood: trend.mood
  }));

  const formatTrendValue = (value: number) => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-muted-foreground" />;
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6" data-testid="progress-tracker">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" data-testid="text-progress-title">Your Emotional Progress</h2>
        <Badge variant="secondary" data-testid="badge-total-entries">
          {metrics.totalEntries} {metrics.totalEntries === 1 ? 'Entry' : 'Entries'}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="trends" data-testid="tab-trends">Trends</TabsTrigger>
          <TabsTrigger value="insights" data-testid="tab-insights">Insights</TabsTrigger>
          <TabsTrigger value="goals" data-testid="tab-goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Current Streak */}
            <Card data-testid="card-current-streak">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="w-4 h-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-current-streak">
                  {metrics.currentStreak} days
                </div>
                <p className="text-xs text-muted-foreground">
                  Longest: {metrics.longestStreak} days
                </p>
              </CardContent>
            </Card>

            {/* Average Mood */}
            <Card data-testid="card-average-mood">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                <Heart className="w-4 h-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getProgressColor(metrics.averageMoodScore)}`} 
                     data-testid="text-average-mood">
                  {metrics.averageMoodScore}/100
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {getTrendIcon(metrics.weeklyTrend)}
                  <span data-testid="text-weekly-trend">
                    {formatTrendValue(metrics.weeklyTrend)} this week
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Consistency Score */}
            <Card data-testid="card-consistency">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consistency</CardTitle>
                <Target className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getProgressColor(metrics.consistencyScore)}`} 
                     data-testid="text-consistency-score">
                  {metrics.consistencyScore}%
                </div>
                <Progress value={metrics.consistencyScore} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Emotional Intelligence Metrics */}
          <Card data-testid="card-emotional-intelligence">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Emotional Intelligence
              </CardTitle>
              <CardDescription>Your progress in key emotional wellness areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span data-testid="text-self-awareness-label">Self-Awareness</span>
                  <span className={getProgressColor(metrics.selfAwareness)} data-testid="text-self-awareness-score">
                    {metrics.selfAwareness}%
                  </span>
                </div>
                <Progress value={metrics.selfAwareness} className="h-2" data-testid="progress-self-awareness" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span data-testid="text-emotional-regulation-label">Emotional Regulation</span>
                  <span className={getProgressColor(metrics.emotionalRegulation)} data-testid="text-emotional-regulation-score">
                    {metrics.emotionalRegulation}%
                  </span>
                </div>
                <Progress value={metrics.emotionalRegulation} className="h-2" data-testid="progress-emotional-regulation" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span data-testid="text-mindfulness-label">Mindfulness</span>
                  <span className={getProgressColor(metrics.mindfulness)} data-testid="text-mindfulness-score">
                    {metrics.mindfulness}%
                  </span>
                </div>
                <Progress value={metrics.mindfulness} className="h-2" data-testid="progress-mindfulness" />
              </div>
            </CardContent>
          </Card>

          {/* Mood Distribution */}
          <Card data-testid="card-mood-distribution">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Mood Distribution
              </CardTitle>
              <CardDescription>How your emotions have been distributed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name} ${value}%`}
                    >
                      {moodChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Mood Trend Chart */}
          <Card data-testid="card-mood-trends">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="w-5 h-5" />
                Mood Trends (Last 30 Days)
              </CardTitle>
              <CardDescription>Track your emotional journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number, name: string, props: any) => [
                        `${value}/100`, 
                        `Mood Score (${props.payload.mood || 'unknown'})`
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card data-testid="card-monthly-growth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Journaling</CardTitle>
                <Calendar className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-monthly-growth">
                  {metrics.monthlyGrowth}%
                </div>
                <p className="text-xs text-muted-foreground">
                  of days this month
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-progress-summary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <Award className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-overall-progress">
                  {Math.round((metrics.selfAwareness + metrics.emotionalRegulation + metrics.mindfulness) / 3)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  average across all areas
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Patterns */}
          <Card data-testid="card-patterns">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Emotional Patterns
              </CardTitle>
              <CardDescription>What we've noticed about your emotional journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {patterns.length > 0 ? (
                  patterns.map((pattern, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md" data-testid={`pattern-${index}`}>
                      <p className="text-sm">{pattern}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No patterns identified yet. Keep journaling to see insights!</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card data-testid="card-strengths">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Your Strengths
              </CardTitle>
              <CardDescription>Positive aspects of your emotional wellness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {strengths.length > 0 ? (
                  strengths.map((strength, index) => (
                    <div key={index} className="p-3 bg-green-50 dark:bg-green-950 rounded-md" data-testid={`strength-${index}`}>
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Keep journaling to discover your emotional strengths!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Growth Areas */}
          <Card data-testid="card-growth-areas">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Growth Opportunities
              </CardTitle>
              <CardDescription>Areas where you can continue to develop</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {growthAreas.length > 0 ? (
                  growthAreas.map((area, index) => (
                    <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md" data-testid={`growth-area-${index}`}>
                      <p className="text-sm">{area}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Keep journaling to identify areas for growth!</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card data-testid="card-recommendations">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Personalized Recommendations
              </CardTitle>
              <CardDescription>AI-powered suggestions for your emotional wellness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-purple-50 dark:bg-purple-950 rounded-md" data-testid={`recommendation-${index}`}>
                      <p className="text-sm">{rec}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Continue journaling to receive personalized recommendations!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}