import type { Assessment } from "@shared/schema";

// MBTI Assessment Questions and Scoring System
export interface MBTIQuestion {
  id: string;
  text: string;
  dimension: "EI" | "SN" | "TF" | "JP"; // Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, Judging/Perceiving
  direction: "positive" | "negative"; // positive means answer aligns with first letter (E, S, T, J)
  category: string;
}

export interface MBTIResponse {
  questionId: string;
  score: number; // 1-7 scale (1 = strongly disagree, 7 = strongly agree)
}

export interface MBTIResults {
  type: string; // e.g., "INFP"
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

export const MBTI_QUESTIONS: MBTIQuestion[] = [
  // Extraversion vs Introversion
  {
    id: "EI_1",
    text: "I feel energized after spending time with a large group of people",
    dimension: "EI",
    direction: "positive",
    category: "Energy Source"
  },
  {
    id: "EI_2",
    text: "I prefer to think things through before speaking in group discussions",
    dimension: "EI",
    direction: "negative",
    category: "Communication Style"
  },
  {
    id: "EI_3",
    text: "I tend to speak my thoughts out loud to help me process them",
    dimension: "EI",
    direction: "positive",
    category: "Processing Style"
  },
  {
    id: "EI_4",
    text: "I need quiet time alone to recharge after social activities",
    dimension: "EI",
    direction: "negative",
    category: "Energy Management"
  },
  {
    id: "EI_5",
    text: "I enjoy being the center of attention in social situations",
    dimension: "EI",
    direction: "positive",
    category: "Social Preference"
  },
  {
    id: "EI_6",
    text: "I prefer to work independently rather than in teams",
    dimension: "EI",
    direction: "negative",
    category: "Work Style"
  },
  {
    id: "EI_7",
    text: "I make friends easily and quickly",
    dimension: "EI",
    direction: "positive",
    category: "Social Connection"
  },
  {
    id: "EI_8",
    text: "I prefer to have a few close friends rather than many acquaintances",
    dimension: "EI",
    direction: "negative",
    category: "Relationship Depth"
  },

  // Sensing vs Intuition
  {
    id: "SN_1",
    text: "I focus on specific facts and details when making decisions",
    dimension: "SN",
    direction: "positive",
    category: "Information Processing"
  },
  {
    id: "SN_2",
    text: "I'm more interested in future possibilities than current realities",
    dimension: "SN",
    direction: "negative",
    category: "Time Orientation"
  },
  {
    id: "SN_3",
    text: "I prefer practical, hands-on learning over theoretical concepts",
    dimension: "SN",
    direction: "positive",
    category: "Learning Style"
  },
  {
    id: "SN_4",
    text: "I often think about abstract ideas and theories",
    dimension: "SN",
    direction: "negative",
    category: "Thinking Patterns"
  },
  {
    id: "SN_5",
    text: "I trust information that comes from direct experience and observation",
    dimension: "SN",
    direction: "positive",
    category: "Information Trust"
  },
  {
    id: "SN_6",
    text: "I enjoy exploring new ideas and creative solutions",
    dimension: "SN",
    direction: "negative",
    category: "Innovation"
  },
  {
    id: "SN_7",
    text: "I prefer step-by-step instructions over figuring things out myself",
    dimension: "SN",
    direction: "positive",
    category: "Problem Solving"
  },
  {
    id: "SN_8",
    text: "I often see patterns and connections that others miss",
    dimension: "SN",
    direction: "negative",
    category: "Pattern Recognition"
  },

  // Thinking vs Feeling
  {
    id: "TF_1",
    text: "I make decisions based on logical analysis rather than personal values",
    dimension: "TF",
    direction: "positive",
    category: "Decision Making"
  },
  {
    id: "TF_2",
    text: "I consider how decisions will affect people's feelings",
    dimension: "TF",
    direction: "negative",
    category: "Impact Consideration"
  },
  {
    id: "TF_3",
    text: "I value objective truth over maintaining harmony",
    dimension: "TF",
    direction: "positive",
    category: "Values Priority"
  },
  {
    id: "TF_4",
    text: "I find it important to understand others' emotional needs",
    dimension: "TF",
    direction: "negative",
    category: "Emotional Awareness"
  },
  {
    id: "TF_5",
    text: "I'm comfortable giving constructive criticism when necessary",
    dimension: "TF",
    direction: "positive",
    category: "Feedback Style"
  },
  {
    id: "TF_6",
    text: "I tend to take criticism personally even when it's constructive",
    dimension: "TF",
    direction: "negative",
    category: "Criticism Response"
  },
  {
    id: "TF_7",
    text: "I believe fairness is more important than mercy",
    dimension: "TF",
    direction: "positive",
    category: "Justice Orientation"
  },
  {
    id: "TF_8",
    text: "I'm naturally empathetic and can easily sense others' emotions",
    dimension: "TF",
    direction: "negative",
    category: "Empathy"
  },

  // Judging vs Perceiving
  {
    id: "JP_1",
    text: "I prefer to have a clear schedule and stick to it",
    dimension: "JP",
    direction: "positive",
    category: "Structure Preference"
  },
  {
    id: "JP_2",
    text: "I like to keep my options open and be spontaneous",
    dimension: "JP",
    direction: "negative",
    category: "Flexibility"
  },
  {
    id: "JP_3",
    text: "I feel comfortable making decisions quickly",
    dimension: "JP",
    direction: "positive",
    category: "Decision Speed"
  },
  {
    id: "JP_4",
    text: "I prefer to gather more information before making decisions",
    dimension: "JP",
    direction: "negative",
    category: "Information Gathering"
  },
  {
    id: "JP_5",
    text: "I like to complete tasks well before deadlines",
    dimension: "JP",
    direction: "positive",
    category: "Time Management"
  },
  {
    id: "JP_6",
    text: "I work better under pressure and close to deadlines",
    dimension: "JP",
    direction: "negative",
    category: "Pressure Response"
  },
  {
    id: "JP_7",
    text: "I prefer organized and structured environments",
    dimension: "JP",
    direction: "positive",
    category: "Environment Preference"
  },
  {
    id: "JP_8",
    text: "I enjoy adapting to changing circumstances as they arise",
    dimension: "JP",
    direction: "negative",
    category: "Change Adaptation"
  }
];

export function calculateMBTIResults(responses: MBTIResponse[]): MBTIResults {
  const dimensionScores = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0
  };

  // Calculate raw scores for each dimension
  responses.forEach(response => {
    const question = MBTI_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;

    const { dimension, direction } = question;
    let score = response.score - 4; // Convert 1-7 scale to -3 to +3

    // If direction is negative, flip the score
    if (direction === "negative") {
      score = -score;
    }

    dimensionScores[dimension] += score;
  });

  // Determine preferences and strengths
  const dimensions = {
    EI: {
      score: dimensionScores.EI,
      preference: (dimensionScores.EI >= 0 ? "E" : "I") as "E" | "I",
      strength: getStrength(Math.abs(dimensionScores.EI))
    },
    SN: {
      score: dimensionScores.SN,
      preference: (dimensionScores.SN >= 0 ? "S" : "N") as "S" | "N",
      strength: getStrength(Math.abs(dimensionScores.SN))
    },
    TF: {
      score: dimensionScores.TF,
      preference: (dimensionScores.TF >= 0 ? "T" : "F") as "T" | "F",
      strength: getStrength(Math.abs(dimensionScores.TF))
    },
    JP: {
      score: dimensionScores.JP,
      preference: (dimensionScores.JP >= 0 ? "J" : "P") as "J" | "P",
      strength: getStrength(Math.abs(dimensionScores.JP))
    }
  };

  const type = `${dimensions.EI.preference}${dimensions.SN.preference}${dimensions.TF.preference}${dimensions.JP.preference}`;
  
  return {
    type,
    dimensions,
    ...getTypeDescription(type)
  };
}

function getStrength(score: number): "strong" | "moderate" | "slight" {
  if (score >= 8) return "strong";
  if (score >= 4) return "moderate";
  return "slight";
}

function getTypeDescription(type: string): {
  description: string;
  strengths: string[];
  growthAreas: string[];
  emotionalStyle: string;
  relationshipStyle: string;
  stressResponse: string;
} {
  const descriptions: Record<string, any> = {
    "ENFP": {
      description: "The Campaigner - Enthusiastic, creative, and sociable free spirits who can always find a reason to smile.",
      strengths: ["Excellent communication skills", "Natural enthusiasm", "Creative problem-solving", "Empathetic and understanding"],
      growthAreas: ["Following through on commitments", "Managing time and priorities", "Handling routine tasks", "Making difficult decisions"],
      emotionalStyle: "Expressive and empathetic, you feel emotions deeply and aren't afraid to show them. You're naturally optimistic and can inspire others with your enthusiasm.",
      relationshipStyle: "You form deep, meaningful connections quickly and value authentic emotional bonds. You're supportive and encouraging to those you care about.",
      stressResponse: "Under stress, you may become overwhelmed by possibilities and struggle to focus. You might withdraw emotionally or become uncharacteristically critical."
    },
    "INFP": {
      description: "The Mediator - Poetic, kind, and altruistic, always eager to help a good cause.",
      strengths: ["Deep empathy", "Strong values", "Creative expression", "Authentic relationships"],
      growthAreas: ["Asserting needs", "Handling criticism", "Making practical decisions", "Managing perfectionism"],
      emotionalStyle: "You experience emotions intensely and authentically. Your feelings run deep, and you value emotional honesty and integrity above all.",
      relationshipStyle: "You seek deep, meaningful connections and are incredibly loyal. You prefer quality over quantity in relationships and value being truly understood.",
      stressResponse: "When stressed, you may become withdrawn and self-critical. You might struggle with decision-making and feel overwhelmed by external pressures."
    },
    "ENFJ": {
      description: "The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners.",
      strengths: ["Natural leadership", "Excellent interpersonal skills", "Inspiring others", "Understanding people's needs"],
      growthAreas: ["Setting boundaries", "Focusing on own needs", "Handling conflict", "Managing perfectionism"],
      emotionalStyle: "You're emotionally expressive and attuned to others' feelings. You have a gift for understanding and motivating people emotionally.",
      relationshipStyle: "You're nurturing and supportive, often putting others' needs before your own. You excel at bringing out the best in people.",
      stressResponse: "Under stress, you may become overly critical of yourself and others. You might neglect your own needs while trying to help everyone else."
    },
    "INFJ": {
      description: "The Advocate - Creative and insightful, inspired and independent perfectionists.",
      strengths: ["Deep insight", "Visionary thinking", "Empathetic understanding", "Principled decision-making"],
      growthAreas: ["Expressing needs directly", "Managing perfectionism", "Handling criticism", "Maintaining work-life balance"],
      emotionalStyle: "You feel emotions deeply but may keep them private. You're highly intuitive about others' emotional states and value emotional authenticity.",
      relationshipStyle: "You form few but very deep relationships. You value being understood and appreciated for your authentic self.",
      stressResponse: "When stressed, you may become withdrawn and overwhelmed. You might ruminate excessively or become uncharacteristically harsh in your judgments."
    },
    "ENTP": {
      description: "The Debater - Smart and curious thinkers who cannot resist an intellectual challenge.",
      strengths: ["Quick thinking", "Innovative ideas", "Adaptability", "Enthusiasm for learning"],
      growthAreas: ["Following through on projects", "Attention to detail", "Managing routine tasks", "Being sensitive to others' feelings"],
      emotionalStyle: "You're emotionally resilient and optimistic. You tend to intellectualize emotions and may struggle with deep emotional processing.",
      relationshipStyle: "You enjoy stimulating conversations and debates. You're charming and enjoy meeting new people but may struggle with emotional depth.",
      stressResponse: "Under stress, you may become scattered and indecisive. You might avoid dealing with problems by pursuing new distractions."
    },
    "INTP": {
      description: "The Thinker - Innovative inventors with an unquenchable thirst for knowledge.",
      strengths: ["Logical analysis", "Independent thinking", "Theoretical understanding", "Objective decision-making"],
      growthAreas: ["Expressing emotions", "Following schedules", "Completing projects", "Managing practical matters"],
      emotionalStyle: "You tend to keep emotions private and may struggle to express feelings. You prefer logical analysis over emotional processing.",
      relationshipStyle: "You value intellectual compatibility and need space for independence. You show care through sharing ideas and interests.",
      stressResponse: "When stressed, you may withdraw completely or become uncharacteristically emotional. You might procrastinate or avoid dealing with the stressor."
    },
    "ENTJ": {
      description: "The Commander - Bold, imaginative, and strong-willed leaders who always find a way.",
      strengths: ["Natural leadership", "Strategic thinking", "Efficient organization", "Confident decision-making"],
      growthAreas: ["Considering others' feelings", "Patience with slower processes", "Delegating effectively", "Managing work-life balance"],
      emotionalStyle: "You're emotionally controlled and may struggle to express vulnerability. You prefer action over emotional discussion.",
      relationshipStyle: "You're protective and loyal but may struggle with emotional intimacy. You show care through acts of service and problem-solving.",
      stressResponse: "Under stress, you may become more controlling or aggressive. You might ignore your emotional needs and push harder toward goals."
    },
    "INTJ": {
      description: "The Architect - Imaginative and strategic thinkers, with a plan for everything.",
      strengths: ["Strategic planning", "Independent thinking", "High standards", "Long-term vision"],
      growthAreas: ["Expressing emotions", "Being flexible with plans", "Considering others' input", "Managing perfectionism"],
      emotionalStyle: "You keep emotions private and controlled. You may struggle with emotional expression but feel deeply about your values and goals.",
      relationshipStyle: "You're selective in relationships and value intellectual connection. You're loyal but may struggle with emotional expression.",
      stressResponse: "When stressed, you may become more withdrawn and critical. You might overanalyze situations or become rigid in your thinking."
    },
    "ESFP": {
      description: "The Entertainer - Spontaneous, energetic, and enthusiastic people who love life and charm others.",
      strengths: ["Enthusiasm", "People skills", "Adaptability", "Practical problem-solving"],
      growthAreas: ["Long-term planning", "Handling criticism", "Sticking to schedules", "Abstract thinking"],
      emotionalStyle: "You're emotionally expressive and spontaneous. You live in the moment and aren't afraid to show your feelings.",
      relationshipStyle: "You're warm, caring, and fun-loving. You enjoy being around people and making others feel good about themselves.",
      stressResponse: "Under stress, you may become overly emotional or avoid dealing with problems. You might seek immediate gratification or distraction."
    },
    "ISFP": {
      description: "The Adventurer - Flexible and charming artists, always ready to explore new possibilities.",
      strengths: ["Artistic ability", "Adaptability", "Empathy", "Authentic relationships"],
      growthAreas: ["Asserting opinions", "Long-term planning", "Handling conflict", "Making decisions quickly"],
      emotionalStyle: "You feel emotions deeply but may keep them private. You're sensitive to others' emotions and value harmony.",
      relationshipStyle: "You're gentle and caring, preferring harmony in relationships. You show love through actions rather than words.",
      stressResponse: "When stressed, you may withdraw or become overwhelmed by emotions. You might avoid conflict or become indecisive."
    },
    "ESFJ": {
      description: "The Consul - Extraordinarily caring, social, and popular people, always eager to help.",
      strengths: ["Interpersonal skills", "Practical help", "Organization", "Loyalty"],
      growthAreas: ["Handling criticism", "Setting boundaries", "Being flexible", "Focusing on own needs"],
      emotionalStyle: "You're emotionally expressive and attuned to others' needs. You feel responsible for others' emotional well-being.",
      relationshipStyle: "You're nurturing and supportive, often putting others first. You value harmony and work hard to maintain good relationships.",
      stressResponse: "Under stress, you may become overly worried about others or take criticism too personally. You might neglect your own needs."
    },
    "ISFJ": {
      description: "The Protector - Very dedicated and warm protectors, always ready to defend their loved ones.",
      strengths: ["Reliability", "Attention to detail", "Empathy", "Practical support"],
      growthAreas: ["Asserting needs", "Handling change", "Setting boundaries", "Taking risks"],
      emotionalStyle: "You're emotionally supportive but may suppress your own needs. You're sensitive to others' emotions and prefer emotional stability.",
      relationshipStyle: "You're loyal and caring, often putting others' needs before your own. You show love through acts of service and remembering details.",
      stressResponse: "When stressed, you may become overwhelmed by responsibilities or withdraw to avoid conflict. You might bottle up emotions."
    },
    "ESTP": {
      description: "The Entrepreneur - Smart, energetic, and perceptive people who truly enjoy living on the edge.",
      strengths: ["Adaptability", "Practical problem-solving", "People skills", "Crisis management"],
      growthAreas: ["Long-term planning", "Following through", "Considering consequences", "Abstract thinking"],
      emotionalStyle: "You're emotionally resilient and live in the moment. You may struggle with deep emotional processing but are good at moving on.",
      relationshipStyle: "You're fun-loving and spontaneous in relationships. You enjoy shared activities and may struggle with emotional depth.",
      stressResponse: "Under stress, you may become more impulsive or seek immediate relief. You might avoid dealing with emotional issues."
    },
    "ISTP": {
      description: "The Virtuoso - Bold and practical experimenters, masters of all kinds of tools.",
      strengths: ["Practical skills", "Problem-solving", "Adaptability", "Independent thinking"],
      growthAreas: ["Expressing emotions", "Long-term planning", "Considering others' feelings", "Following schedules"],
      emotionalStyle: "You tend to keep emotions private and may struggle with emotional expression. You prefer action over emotional discussion.",
      relationshipStyle: "You value independence and may struggle with emotional intimacy. You show care through practical help and shared activities.",
      stressResponse: "When stressed, you may withdraw completely or act impulsively. You might avoid emotional discussions or become more isolated."
    },
    "ESTJ": {
      description: "The Executive - Excellent administrators, unsurpassed at managing things or people.",
      strengths: ["Leadership", "Organization", "Efficiency", "Practical decision-making"],
      growthAreas: ["Considering others' feelings", "Being flexible", "Expressing emotions", "Delegating"],
      emotionalStyle: "You're emotionally controlled and may struggle with vulnerability. You prefer practical solutions over emotional processing.",
      relationshipStyle: "You're loyal and responsible but may struggle with emotional expression. You show care through providing and organizing.",
      stressResponse: "Under stress, you may become more controlling or critical. You might work harder instead of addressing emotional needs."
    },
    "ISTJ": {
      description: "The Logistician - Practical and fact-minded, reliable and responsible.",
      strengths: ["Reliability", "Attention to detail", "Organization", "Systematic approach"],
      growthAreas: ["Adapting to change", "Expressing emotions", "Being flexible", "Considering new perspectives"],
      emotionalStyle: "You're emotionally steady but may struggle with expression. You prefer emotional stability and may avoid emotional discussions.",
      relationshipStyle: "You're loyal and dependable but may struggle with emotional intimacy. You show love through consistency and reliability.",
      stressResponse: "When stressed, you may become more rigid or withdraw. You might focus excessively on details or become overwhelmed by change."
    }
  };

  return descriptions[type] || {
    description: "A unique personality type with its own strengths and challenges.",
    strengths: ["Individual strengths", "Personal qualities"],
    growthAreas: ["Areas for development", "Growth opportunities"],
    emotionalStyle: "Your unique emotional approach.",
    relationshipStyle: "Your personal relationship style.",
    stressResponse: "Your individual stress response pattern."
  };
}

export function getMBTIInsightsForJournaling(mbtiType: string): {
  journalingStyle: string;
  emotionalProcessing: string;
  stressSignals: string[];
  growthPrompts: string[];
} {
  const insights: Record<string, any> = {
    "ENFP": {
      journalingStyle: "You likely journal in bursts of inspiration, exploring possibilities and connecting ideas. Your entries may jump between topics as new thoughts emerge.",
      emotionalProcessing: "You process emotions externally and may benefit from voice-to-text journaling or sharing entries with trusted friends for processing.",
      stressSignals: ["Feeling overwhelmed by possibilities", "Difficulty making decisions", "Avoiding routine tasks"],
      growthPrompts: ["What small step can I take toward my goals today?", "How can I turn this idea into action?", "What routine would actually support my creativity?"]
    },
    "INFP": {
      journalingStyle: "Your journaling is deeply personal and reflective. You may write extensively about values, emotions, and the meaning behind experiences.",
      emotionalProcessing: "You process emotions internally and thoroughly. Journaling helps you understand your complex inner world and align actions with values.",
      stressSignals: ["Feeling misunderstood", "Overwhelmed by criticism", "Struggling with perfectionism"],
      growthPrompts: ["How can I honor my needs while meeting obligations?", "What would self-compassion look like here?", "How can I share my authentic self safely?"]
    },
    "ENFJ": {
      journalingStyle: "You may focus on relationships and how to help others. Your entries often explore interpersonal dynamics and ways to support those around you.",
      emotionalProcessing: "You're naturally attuned to emotions but may neglect your own. Journaling helps you process your feelings separate from others' needs.",
      stressSignals: ["Feeling responsible for everyone", "Difficulty saying no", "Burnout from overgiving"],
      growthPrompts: ["What do I need right now?", "How can I set healthy boundaries?", "What would happen if I prioritized my own well-being?"]
    },
    "INFJ": {
      journalingStyle: "Your journaling is introspective and visionary. You explore deep insights, future possibilities, and the underlying meanings of experiences.",
      emotionalProcessing: "You process emotions deeply but privately. Journaling provides a safe space to explore your complex inner world without judgment.",
      stressSignals: ["Feeling overwhelmed by others' emotions", "Perfectionism paralysis", "Withdrawing from social connections"],
      growthPrompts: ["How can I trust my intuition more?", "What boundaries do I need to protect my energy?", "How can I share my insights with others?"]
    },
    "ENTP": {
      journalingStyle: "Your entries may be scattered and idea-focused, jumping between topics as connections form. You might use journaling to brainstorm and explore possibilities.",
      emotionalProcessing: "You may intellectualize emotions rather than feeling them directly. Journaling can help you connect with your emotional experience.",
      stressSignals: ["Feeling bored or restless", "Avoiding emotional conversations", "Starting many projects without finishing"],
      growthPrompts: ["What am I really feeling beneath the thoughts?", "How can I turn these ideas into reality?", "What would emotional vulnerability look like for me?"]
    },
    "INTP": {
      journalingStyle: "Your journaling is analytical and exploratory. You may use it to work through complex ideas and understand patterns in your thinking.",
      emotionalProcessing: "You prefer to understand emotions logically. Journaling helps you analyze feelings and identify patterns without the pressure of immediate response.",
      stressSignals: ["Feeling pressured to make decisions", "Overwhelmed by emotional demands", "Avoiding social obligations"],
      growthPrompts: ["What data am I getting from this emotion?", "How can I communicate my needs clearly?", "What would happen if I acted on this insight?"]
    },
    "ENTJ": {
      journalingStyle: "Your journaling is goal-oriented and strategic. You may use it to plan, review progress, and identify obstacles to overcome.",
      emotionalProcessing: "You may focus on practical solutions rather than emotional processing. Journaling can help you recognize the emotional components of situations.",
      stressSignals: ["Impatience with inefficiency", "Difficulty delegating", "Ignoring personal needs for goals"],
      growthPrompts: ["What emotions am I experiencing about this situation?", "How can I better support my team?", "What would self-care look like while pursuing my goals?"]
    },
    "INTJ": {
      journalingStyle: "Your journaling is systematic and future-focused. You explore long-term visions, analyze patterns, and plan strategic approaches to goals.",
      emotionalProcessing: "You prefer to understand emotions systematically. Journaling helps you process feelings privately and integrate them into your broader understanding.",
      stressSignals: ["Frustration with inefficiency", "Overwhelmed by social demands", "Perfectionism preventing action"],
      growthPrompts: ["How can I share my vision with others?", "What emotions are informing this decision?", "How can I be more flexible while maintaining my standards?"]
    },
    "ESFP": {
      journalingStyle: "Your journaling captures moments and experiences vividly. You may write about daily events, people you've met, and immediate feelings.",
      emotionalProcessing: "You process emotions in the moment and through experience. Journaling helps you reflect on patterns and learn from experiences.",
      stressSignals: ["Feeling trapped by routine", "Overwhelmed by future planning", "Difficulty with conflict"],
      growthPrompts: ["What did I learn from this experience?", "How can I prepare for the future while enjoying today?", "What support do I need to handle this challenge?"]
    },
    "ISFP": {
      journalingStyle: "Your journaling is personal and value-driven. You explore your authentic feelings and how experiences align with your personal values.",
      emotionalProcessing: "You feel emotions deeply but may need time to understand them. Journaling provides space to process feelings at your own pace.",
      stressSignals: ["Feeling pressured to conform", "Overwhelmed by conflict", "Struggling with decisions"],
      growthPrompts: ["What do my values tell me about this situation?", "How can I honor my needs while maintaining harmony?", "What would courage look like here?"]
    },
    "ESFJ": {
      journalingStyle: "Your journaling often focuses on relationships and how to help others. You may write about social interactions and ways to maintain harmony.",
      emotionalProcessing: "You're naturally aware of emotions but may focus more on others' feelings than your own. Journaling helps you attend to your emotional needs.",
      stressSignals: ["Feeling unappreciated", "Overwhelmed by others' needs", "Difficulty with criticism"],
      growthPrompts: ["What appreciation do I need right now?", "How can I set boundaries while still caring for others?", "What would putting my needs first look like?"]
    },
    "ISFJ": {
      journalingStyle: "Your journaling is detailed and caring, often focusing on others' well-being and how to be helpful. You may document daily experiences thoroughly.",
      emotionalProcessing: "You may suppress your own emotions to maintain harmony. Journaling provides a private space to acknowledge and process your feelings.",
      stressSignals: ["Feeling overwhelmed by responsibilities", "Difficulty saying no", "Avoiding conflict at personal cost"],
      growthPrompts: ["What do I need to feel supported?", "How can I express my needs without feeling selfish?", "What changes would improve my well-being?"]
    },
    "ESTP": {
      journalingStyle: "Your journaling captures action and experiences. You may write briefly about daily events, successes, and practical challenges you're facing.",
      emotionalProcessing: "You prefer to process emotions through action and experience. Journaling can help you reflect on patterns and learn from experiences.",
      stressSignals: ["Feeling restless or confined", "Avoiding emotional conversations", "Acting impulsively under pressure"],
      growthPrompts: ["What is this emotion telling me to do?", "How can I channel this energy productively?", "What would slowing down reveal to me?"]
    },
    "ISTP": {
      journalingStyle: "Your journaling is practical and problem-focused. You may write about challenges you're solving and technical or practical interests.",
      emotionalProcessing: "You may struggle with emotional expression but can benefit from exploring feelings through problem-solving frameworks in journaling.",
      stressSignals: ["Feeling trapped by obligations", "Overwhelmed by emotional demands", "Withdrawing from social interactions"],
      growthPrompts: ["What is the problem I'm trying to solve here?", "How can I create more space for myself?", "What would expressing this feeling look like?"]
    },
    "ESTJ": {
      journalingStyle: "Your journaling is organized and goal-oriented. You may use it to plan, track progress, and identify obstacles to achieving objectives.",
      emotionalProcessing: "You may focus on practical solutions over emotional processing. Journaling can help you recognize and address emotional components of situations.",
      stressSignals: ["Frustration with inefficiency", "Difficulty delegating control", "Ignoring personal needs for productivity"],
      growthPrompts: ["What emotions are driving my reactions here?", "How can I better support others while achieving goals?", "What would work-life balance look like for me?"]
    },
    "ISTJ": {
      journalingStyle: "Your journaling is systematic and detailed. You may document experiences thoroughly and reflect on lessons learned and practical applications.",
      emotionalProcessing: "You prefer emotional stability and may need structure to process feelings. Journaling provides a reliable framework for emotional exploration.",
      stressSignals: ["Feeling overwhelmed by change", "Difficulty expressing emotions", "Stress from unexpected disruptions"],
      growthPrompts: ["How can I adapt to this change while honoring my needs?", "What support systems do I have available?", "What would flexibility look like in this situation?"]
    }
  };

  return insights[mbtiType] || {
    journalingStyle: "Your unique journaling style reflects your personality.",
    emotionalProcessing: "You have your own way of processing emotions.",
    stressSignals: ["Individual stress patterns"],
    growthPrompts: ["Personal growth questions"]
  };
}