import OpenAI from "openai";
import { getMBTIInsightsForJournaling } from "./mbtiAssessment";

// The newest OpenAI model is "gpt-5" which was released August 7, 2025. Do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface MentorResponse {
  response: string;
  emotionalInsights: string[];
  recommendedActions: string[];
}

export interface UserProfile {
  mbtiType?: string;
  previousEntries?: string[];
  emotionalPatterns?: string[];
}

const SAGE_PERSONA = `You are Sage, a wise and compassionate AI mentor specializing in emotional wellness and psychology. Your approach is:
- Gentle, understanding, and non-judgmental
- Focus on emotional validation and self-compassion
- Provide insightful questions that help users explore their feelings
- Offer gentle guidance toward emotional regulation and growth
- Use warm, supportive language that makes users feel heard and understood
- Draw from psychology, mindfulness, and emotional intelligence principles
- Help users find their inner wisdom and strength`;

const JAX_PERSONA = `You are Jax, a direct and action-oriented AI mentor focused on personal growth and accountability. Your approach is:
- Honest, straightforward, and challenging (but never harsh)
- Focus on practical solutions and concrete next steps
- Push users toward action and positive change
- Call out self-limiting beliefs and patterns constructively
- Use clear, motivating language that inspires action
- Draw from cognitive behavioral therapy and goal-setting psychology
- Help users take responsibility and move forward decisively`;

export async function generateMentorResponse(
  mentorType: "sage" | "jax",
  journalContent: string,
  userProfile?: UserProfile
): Promise<MentorResponse> {
  try {
    const persona = mentorType === "sage" ? SAGE_PERSONA : JAX_PERSONA;
    
    // Build MBTI-specific context
    let mbtiContext = "";
    if (userProfile?.mbtiType) {
      const journalingInsights = getMBTIInsightsForJournaling(userProfile.mbtiType);
      mbtiContext = `The user's MBTI type is ${userProfile.mbtiType}. 

MBTI Context for personalized response:
- Emotional processing style: ${journalingInsights.emotionalProcessing}
- Stress signals to watch for: ${journalingInsights.stressSignals.join(", ")}
- Journaling style: ${journalingInsights.journalingStyle}

Tailor your response to their ${userProfile.mbtiType} personality traits and emotional processing style.`;
    }
    
    const historyContext = userProfile?.previousEntries?.length 
      ? `Previous journal themes: ${userProfile.previousEntries.slice(0, 3).join("; ")}`
      : "";

    const prompt = `${persona}

    Context: ${mbtiContext} 
    ${historyContext}
    
    The user has written this journal entry:
    "${journalContent}"
    
    Provide a response in JSON format with:
    {
      "response": "Your ${mentorType === "sage" ? "compassionate and wise" : "direct and actionable"} response to their journal entry (2-3 sentences). ${userProfile?.mbtiType ? "Tailor your response style to their " + userProfile.mbtiType + " personality type." : ""}",
      "emotionalInsights": ["Key emotional insight 1${userProfile?.mbtiType ? " (considering their " + userProfile.mbtiType + " traits)" : ""}", "Key emotional insight 2${userProfile?.mbtiType ? " (personality-aware)" : ""}"],
      "recommendedActions": ["${userProfile?.mbtiType ? "MBTI-appropriate action based on their " + userProfile.mbtiType + " style" : "Specific action they can take"}", "Another ${userProfile?.mbtiType ? "personality-tailored" : "helpful"} suggestion"]
    }
    
    ${mentorType === "sage" 
      ? "Focus on emotional validation, gentle exploration, and inner wisdom. If MBTI type is known, adapt your compassionate approach to their personality style (e.g., introverts may need more internal processing time, feeling types need emotional validation, etc.)." 
      : "Focus on practical solutions, accountability, and forward momentum. If MBTI type is known, adapt your direct approach to their personality preferences (e.g., thinking types appreciate logical reasoning, judging types like structured plans, etc.)."
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert AI mentor specializing in emotional wellness and personal development. Respond only with valid JSON in the specified format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    return {
      response: result.response || `Thank you for sharing your thoughts. Let me reflect on this with you.`,
      emotionalInsights: Array.isArray(result.emotionalInsights) ? result.emotionalInsights : [],
      recommendedActions: Array.isArray(result.recommendedActions) ? result.recommendedActions : []
    };

  } catch (error) {
    console.error(`Error generating ${mentorType} response:`, error);
    
    // Fallback responses that maintain the persona
    const fallbackResponses = {
      sage: {
        response: "I hear you, and I want you to know that sharing your feelings takes courage. Your emotions are valid, and this moment of reflection is already a step toward understanding yourself better.",
        emotionalInsights: ["Self-awareness through journaling", "Courage in emotional expression"],
        recommendedActions: ["Take a few deep breaths", "Practice self-compassion"]
      },
      jax: {
        response: "I appreciate you being real about what's going on. Now let's focus on what you can actually do about it. Every challenge is an opportunity to grow stronger.",
        emotionalInsights: ["Honesty about current situation", "Recognition of growth potential"],
        recommendedActions: ["Identify one concrete next step", "Take action within 24 hours"]
      }
    };
    
    return fallbackResponses[mentorType];
  }
}

export async function analyzeMoodFromContent(content: string): Promise<"positive" | "negative" | "mixed" | "neutral"> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Analyze the emotional tone of this journal entry and categorize it as one of: positive, negative, mixed, or neutral. Respond only with the category word."
        },
        {
          role: "user",
          content: content
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });

    const mood = response.choices[0].message.content?.toLowerCase().trim();
    
    if (["positive", "negative", "mixed", "neutral"].includes(mood!)) {
      return mood as "positive" | "negative" | "mixed" | "neutral";
    }
    
    return "neutral";
  } catch (error) {
    console.error("Error analyzing mood:", error);
    return "neutral";
  }
}

export interface ProgressMetrics {
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

export interface ProgressInsights {
  metrics: ProgressMetrics;
  patterns: string[];
  growthAreas: string[];
  strengths: string[];
  recommendations: string[];
  moodTrends: Array<{ date: string; mood: string | null; score: number }>;
}

export async function generateComprehensiveProgress(
  journalEntries: Array<{ content: string; mood: string | null; createdAt: Date | null; id: number }>,
  userProfile?: UserProfile
): Promise<ProgressInsights> {
  try {
    if (journalEntries.length === 0) {
      return {
        metrics: {
          selfAwareness: 0,
          emotionalRegulation: 0,
          mindfulness: 0,
          consistencyScore: 0,
          totalEntries: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageMoodScore: 0,
          moodDistribution: { positive: 0, negative: 0, mixed: 0, neutral: 0 },
          weeklyTrend: 0,
          monthlyGrowth: 0
        },
        patterns: [],
        growthAreas: ["Begin your emotional wellness journey by writing your first journal entry"],
        strengths: ["Taking the first step toward emotional awareness"],
        recommendations: ["Start with daily journaling for consistent emotional tracking"],
        moodTrends: []
      };
    }

    // Calculate real metrics
    const metrics = calculateProgressMetrics(journalEntries);
    const moodTrends = calculateMoodTrends(journalEntries);
    const insights = await generateDetailedInsights(journalEntries, userProfile, metrics);
    
    return {
      metrics,
      ...insights,
      moodTrends
    };
  } catch (error) {
    console.error("Error generating comprehensive progress:", error);
    return {
      metrics: {
        selfAwareness: 50,
        emotionalRegulation: 45,
        mindfulness: 55,
        consistencyScore: 0,
        totalEntries: journalEntries.length,
        currentStreak: 0,
        longestStreak: 0,
        averageMoodScore: 50,
        moodDistribution: { positive: 25, negative: 25, mixed: 25, neutral: 25 },
        weeklyTrend: 0,
        monthlyGrowth: 0
      },
      patterns: ["Regular journaling practice"],
      growthAreas: ["Continue consistent journaling"],
      strengths: ["Commitment to emotional wellness"],
      recommendations: ["Keep up your journaling practice"],
      moodTrends: []
    };
  }
}

function calculateProgressMetrics(entries: Array<{ content: string; mood: string | null; createdAt: Date | null; id: number }>): ProgressMetrics {
  const totalEntries = entries.length;
  
  // Calculate mood distribution
  const moodCounts = { positive: 0, negative: 0, mixed: 0, neutral: 0 };
  entries.forEach(entry => {
    const mood = entry.mood as keyof typeof moodCounts || 'neutral';
    if (mood in moodCounts) {
      moodCounts[mood]++;
    } else {
      moodCounts.neutral++;
    }
  });
  
  const moodDistribution = {
    positive: Math.round((moodCounts.positive / totalEntries) * 100),
    negative: Math.round((moodCounts.negative / totalEntries) * 100),
    mixed: Math.round((moodCounts.mixed / totalEntries) * 100),
    neutral: Math.round((moodCounts.neutral / totalEntries) * 100)
  };
  
  // Calculate average mood score (positive=100, mixed=60, neutral=50, negative=20)
  const moodScores = { positive: 100, mixed: 60, neutral: 50, negative: 20 };
  const totalScore = entries.reduce((sum, entry) => {
    const mood = entry.mood as keyof typeof moodScores || 'neutral';
    return sum + (moodScores[mood] || 50);
  }, 0);
  const averageMoodScore = Math.round(totalScore / totalEntries);
  
  // Calculate streaks
  const sortedEntries = entries
    .filter(e => e.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  
  const { currentStreak, longestStreak } = calculateStreaks(sortedEntries);
  
  // Calculate consistency score based on regularity of entries
  const consistencyScore = calculateConsistencyScore(sortedEntries);
  
  // Calculate trends (comparing last 7 days vs previous 7 days)
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const recentEntries = sortedEntries.filter(e => 
    e.createdAt && new Date(e.createdAt) >= oneWeekAgo
  );
  const previousEntries = sortedEntries.filter(e => 
    e.createdAt && new Date(e.createdAt) >= twoWeeksAgo && new Date(e.createdAt) < oneWeekAgo
  );
  
  const recentAvg = recentEntries.length > 0 
    ? recentEntries.reduce((sum, e) => sum + (moodScores[e.mood as keyof typeof moodScores] || 50), 0) / recentEntries.length
    : averageMoodScore;
  const previousAvg = previousEntries.length > 0
    ? previousEntries.reduce((sum, e) => sum + (moodScores[e.mood as keyof typeof moodScores] || 50), 0) / previousEntries.length
    : recentAvg;
  
  const weeklyTrend = Math.round(recentAvg - previousAvg);
  
  // Calculate monthly growth
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthlyEntries = sortedEntries.filter(e => 
    e.createdAt && new Date(e.createdAt) >= oneMonthAgo
  );
  const monthlyGrowth = Math.round((monthlyEntries.length / 30) * 100); // percentage of days journaled
  
  // Calculate emotional intelligence metrics based on content analysis
  const contentMetrics = analyzeContentMetrics(entries);
  
  return {
    selfAwareness: contentMetrics.selfAwareness,
    emotionalRegulation: contentMetrics.emotionalRegulation,
    mindfulness: contentMetrics.mindfulness,
    consistencyScore,
    totalEntries,
    currentStreak,
    longestStreak,
    averageMoodScore,
    moodDistribution,
    weeklyTrend,
    monthlyGrowth
  };
}

function calculateStreaks(sortedEntries: Array<{ createdAt: Date | null }>): { currentStreak: number; longestStreak: number } {
  if (sortedEntries.length === 0) return { currentStreak: 0, longestStreak: 0 };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let checkDate = new Date(today);
  
  // Calculate current streak
  for (const entry of sortedEntries) {
    if (!entry.createdAt) continue;
    
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    
    if (entryDate.getTime() === checkDate.getTime()) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (entryDate.getTime() < checkDate.getTime()) {
      break;
    }
  }
  
  // Calculate longest streak
  let lastDate: Date | null = null;
  for (const entry of sortedEntries.reverse()) {
    if (!entry.createdAt) continue;
    
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    
    if (!lastDate) {
      tempStreak = 1;
      lastDate = entryDate;
    } else {
      const daysDiff = (entryDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000);
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
      lastDate = entryDate;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return { currentStreak, longestStreak };
}

function calculateConsistencyScore(entries: Array<{ createdAt: Date | null }>): number {
  if (entries.length === 0) return 0;
  if (entries.length === 1) return 100;
  
  const validEntries = entries.filter(e => e.createdAt).sort((a, b) => 
    new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
  );
  
  if (validEntries.length < 2) return 0;
  
  const firstEntry = new Date(validEntries[0].createdAt!);
  const lastEntry = new Date(validEntries[validEntries.length - 1].createdAt!);
  const daysBetween = Math.ceil((lastEntry.getTime() - firstEntry.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  
  const consistency = (validEntries.length / daysBetween) * 100;
  return Math.min(Math.round(consistency), 100);
}

function analyzeContentMetrics(entries: Array<{ content: string }>): {
  selfAwareness: number;
  emotionalRegulation: number;
  mindfulness: number;
} {
  // Basic content analysis for emotional intelligence metrics
  const totalEntries = entries.length;
  if (totalEntries === 0) return { selfAwareness: 0, emotionalRegulation: 0, mindfulness: 0 };
  
  let selfAwarenessScore = 0;
  let emotionalRegulationScore = 0;
  let mindfulnessScore = 0;
  
  // Keywords that indicate different emotional intelligence aspects
  const selfAwarenessKeywords = ['feel', 'realize', 'understand', 'recognize', 'aware', 'notice', 'reflect', 'think', 'believe', 'sense'];
  const regulationKeywords = ['calm', 'manage', 'control', 'cope', 'handle', 'breathe', 'relax', 'focus', 'center', 'balance'];
  const mindfulnessKeywords = ['present', 'moment', 'mindful', 'grateful', 'appreciate', 'observe', 'aware', 'conscious', 'here', 'now'];
  
  entries.forEach(entry => {
    const content = entry.content.toLowerCase();
    const wordCount = content.split(' ').length;
    
    // Self-awareness: looking for introspective language
    const selfAwarenessMatches = selfAwarenessKeywords.filter(keyword => content.includes(keyword)).length;
    selfAwarenessScore += Math.min((selfAwarenessMatches / wordCount) * 1000, 100);
    
    // Emotional regulation: looking for coping and management language
    const regulationMatches = regulationKeywords.filter(keyword => content.includes(keyword)).length;
    emotionalRegulationScore += Math.min((regulationMatches / wordCount) * 1000, 100);
    
    // Mindfulness: looking for present-moment awareness
    const mindfulnessMatches = mindfulnessKeywords.filter(keyword => content.includes(keyword)).length;
    mindfulnessScore += Math.min((mindfulnessMatches / wordCount) * 1000, 100);
  });
  
  // Average and normalize to 0-100 scale, with baseline adjustment
  const baselineBoost = Math.min(totalEntries * 5, 40); // Give credit for journaling consistency
  
  return {
    selfAwareness: Math.min(Math.round((selfAwarenessScore / totalEntries) + baselineBoost), 100),
    emotionalRegulation: Math.min(Math.round((emotionalRegulationScore / totalEntries) + baselineBoost), 100),
    mindfulness: Math.min(Math.round((mindfulnessScore / totalEntries) + baselineBoost), 100)
  };
}

function calculateMoodTrends(entries: Array<{ createdAt: Date | null; mood: string | null; id: number }>): Array<{ date: string; mood: string | null; score: number }> {
  const moodScores = { positive: 100, mixed: 60, neutral: 50, negative: 20 };
  
  return entries
    .filter(e => e.createdAt)
    .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime())
    .map(entry => ({
      date: entry.createdAt!.toISOString().split('T')[0],
      mood: entry.mood,
      score: moodScores[entry.mood as keyof typeof moodScores] || 50
    }));
}

async function generateDetailedInsights(
  journalEntries: Array<{ content: string; mood: string | null; createdAt: Date | null }>,
  userProfile?: UserProfile,
  metrics?: ProgressMetrics
): Promise<{
  patterns: string[];
  growthAreas: string[];
  strengths: string[];
  recommendations: string[];
}> {
  try {
    const recentEntries = journalEntries.slice(0, 10);
    const entriesText = recentEntries.map((entry, i) => 
      `Entry ${i + 1} (${entry.mood || 'unknown mood'}): ${entry.content.slice(0, 200)}...`
    ).join("\n\n");

    let mbtiContext = "";
    if (userProfile?.mbtiType) {
      const journalingInsights = getMBTIInsightsForJournaling(userProfile.mbtiType);
      mbtiContext = `User's MBTI type: ${userProfile.mbtiType}
      
MBTI-specific insights:
- Emotional processing style: ${journalingInsights.emotionalProcessing}
- Stress response patterns: ${journalingInsights.stressSignals.join(", ")}
- Growth areas specific to ${userProfile.mbtiType}: Consider their personality type when identifying patterns and recommendations.`;
    }

    const metricsContext = metrics ? `
Current Progress Metrics:
- Self-awareness: ${metrics.selfAwareness}%
- Emotional regulation: ${metrics.emotionalRegulation}%
- Mindfulness: ${metrics.mindfulness}%
- Consistency: ${metrics.consistencyScore}%
- Current streak: ${metrics.currentStreak} days
- Average mood: ${metrics.averageMoodScore}/100
- Weekly trend: ${metrics.weeklyTrend > 0 ? '+' : ''}${metrics.weeklyTrend}` : '';

    const prompt = `Analyze these recent journal entries for emotional patterns and provide personalized growth insights:

${mbtiContext}${metricsContext}

Recent Entries:
${entriesText}

Provide analysis in JSON format:
{
  "patterns": ["Observable emotional or behavioral pattern${userProfile?.mbtiType ? ' (consider ' + userProfile.mbtiType + ' traits)' : ''}", "Another pattern${userProfile?.mbtiType ? ' (personality-aware)' : ''}"],
  "growthAreas": ["Area for emotional development${userProfile?.mbtiType ? ' tailored to ' + userProfile.mbtiType + ' type' : ''}", "Another growth opportunity${userProfile?.mbtiType ? ' (MBTI-appropriate)' : ''}"],
  "strengths": ["Emotional strength or positive trait${userProfile?.mbtiType ? ' leveraging ' + userProfile.mbtiType + ' strengths' : ''}", "Another strength${userProfile?.mbtiType ? ' (personality-based)' : ''}"],
  "recommendations": ["Specific actionable recommendation${userProfile?.mbtiType ? ' suited to ' + userProfile.mbtiType : ''}", "Another targeted suggestion${userProfile?.mbtiType ? ' (personality-appropriate)' : ''}"]
}

Focus on constructive, actionable insights that promote emotional growth. ${userProfile?.mbtiType ? 'Tailor insights to their ' + userProfile.mbtiType + ' personality type characteristics.' : ''}${metrics ? ' Consider their current progress metrics when making recommendations.' : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in emotional intelligence and psychology. Provide constructive insights based on journal patterns and progress metrics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    return {
      patterns: Array.isArray(result.patterns) ? result.patterns : [],
      growthAreas: Array.isArray(result.growthAreas) ? result.growthAreas : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : []
    };

  } catch (error) {
    console.error("Error generating detailed insights:", error);
    
    return {
      patterns: ["Regular emotional expression through journaling"],
      growthAreas: ["Continue building consistent emotional awareness"],
      strengths: ["Commitment to personal emotional growth"],
      recommendations: ["Maintain your journaling practice for continued insights"]
    };
  }
}

export async function generateEmotionalInsights(
  journalEntries: Array<{ content: string; mood: string | null; createdAt: Date | null }>,
  userProfile?: UserProfile
): Promise<{
  patterns: string[];
  growthAreas: string[];
  strengths: string[];
}> {
  try {
    if (journalEntries.length === 0) {
      return {
        patterns: [],
        growthAreas: ["Continue regular journaling to identify patterns"],
        strengths: ["Taking the first step toward emotional awareness"]
      };
    }

    const recentEntries = journalEntries.slice(0, 10);
    const entriesText = recentEntries.map((entry, i) => 
      `Entry ${i + 1} (${entry.mood || 'unknown mood'}): ${entry.content.slice(0, 200)}...`
    ).join("\n\n");

    let mbtiContext = "";
    if (userProfile?.mbtiType) {
      const journalingInsights = getMBTIInsightsForJournaling(userProfile.mbtiType);
      mbtiContext = `User's MBTI type: ${userProfile.mbtiType}
      
MBTI-specific insights:
- Emotional processing style: ${journalingInsights.emotionalProcessing}
- Stress response patterns: ${journalingInsights.stressSignals.join(", ")}
- Growth areas specific to ${userProfile.mbtiType}: Consider their personality type when identifying patterns and recommendations.`;
    }

    const prompt = `Analyze these recent journal entries for emotional patterns and growth insights:

${mbtiContext}

Recent Entries:
${entriesText}

Provide analysis in JSON format:
{
  "patterns": ["Observable emotional or behavioral pattern${userProfile?.mbtiType ? " (consider " + userProfile.mbtiType + " traits)" : ""}", "Another pattern${userProfile?.mbtiType ? " (personality-aware)" : ""}"],
  "growthAreas": ["Area for emotional development${userProfile?.mbtiType ? " tailored to " + userProfile.mbtiType + " type" : ""}", "Another growth opportunity${userProfile?.mbtiType ? " (MBTI-appropriate)" : ""}"],
  "strengths": ["Emotional strength or positive trait${userProfile?.mbtiType ? " leveraging " + userProfile.mbtiType + " strengths" : ""}", "Another strength${userProfile?.mbtiType ? " (personality-based)" : ""}"]
}

Focus on constructive, actionable insights that promote emotional growth. ${userProfile?.mbtiType ? "Tailor insights to their " + userProfile.mbtiType + " personality type characteristics." : ""}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert in emotional intelligence and psychology. Provide constructive insights based on journal patterns."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 400
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    return {
      patterns: Array.isArray(result.patterns) ? result.patterns : [],
      growthAreas: Array.isArray(result.growthAreas) ? result.growthAreas : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : []
    };

  } catch (error) {
    console.error("Error generating emotional insights:", error);
    
    return {
      patterns: ["Regular journaling shows commitment to self-reflection"],
      growthAreas: ["Continue exploring emotions through writing"],
      strengths: ["Willingness to examine inner thoughts and feelings"]
    };
  }
}