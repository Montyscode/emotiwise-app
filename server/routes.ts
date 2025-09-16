import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateMentorResponse, analyzeMoodFromContent, generateEmotionalInsights, generateComprehensiveProgress } from "./aiMentors";
import { 
  insertJournalEntrySchema, 
  insertAssessmentSchema,
  getJournalEntriesQuerySchema,
  updateJournalEntrySchema
} from "@shared/schema";
import { 
  MBTI_QUESTIONS, 
  calculateMBTIResults, 
  getMBTIInsightsForJournaling,
  type MBTIResponse 
} from "./mbtiAssessment";
import { ZodError } from "zod";
import { z } from "zod";

// Input sanitization helpers
function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return sanitizeHtml(data.trim());
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return data;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Journal routes
  app.get('/api/journal/entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate query parameters
      const queryValidation = getJournalEntriesQuerySchema.safeParse(req.query);
      if (!queryValidation.success) {
        return res.status(400).json({ 
          message: "Invalid query parameters",
          errors: queryValidation.error.errors
        });
      }
      
      const { limit } = queryValidation.data;
      const entries = await storage.getJournalEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post('/api/journal/entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Sanitize and validate request body
      const sanitizedBody = sanitizeInput(req.body);
      const validation = insertJournalEntrySchema.safeParse(sanitizedBody);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid journal entry data",
          errors: validation.error.errors
        });
      }
      
      const validatedData = validation.data;
      
      // Auto-detect mood if not provided
      const finalMood = validatedData.mood || await analyzeMoodFromContent(validatedData.content);
      
      // Create journal entry
      const entry = await storage.createJournalEntry(userId, {
        ...validatedData,
        mood: finalMood
      });

      // Generate AI mentor response if mentor is selected
      let mentorResponse = null;
      if (validatedData.selectedMentor) {
        // Get user profile for context
        const user = await storage.getUser(userId);
        const recentEntries = await storage.getJournalEntries(userId, 5);
        const assessments = await storage.getAssessments(userId);
        const mbtiAssessment = assessments.find(a => a.assessmentType === "mbti");
        
        const userProfile = {
          mbtiType: mbtiAssessment?.results?.type as string | undefined,
          previousEntries: recentEntries.slice(1).map(e => e.content.slice(0, 100)),
        };

        mentorResponse = await generateMentorResponse(
          validatedData.selectedMentor, 
          validatedData.content, 
          userProfile
        );
        
        // Update entry with mentor response
        const responseField = validatedData.selectedMentor === "sage" ? "sageResponse" : "jaxResponse";
        await storage.updateJournalEntry(entry.id, userId, {
          [responseField]: mentorResponse.response
        });
      }

      res.status(201).json({ 
        ...entry, 
        mood: finalMood,
        mentorResponse 
      });
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  app.put('/api/journal/entries/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryId = parseInt(req.params.id);
      
      if (isNaN(entryId)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }
      
      // Sanitize and validate request body
      const sanitizedBody = sanitizeInput(req.body);
      const validation = updateJournalEntrySchema.safeParse(sanitizedBody);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid update data",
          errors: validation.error.errors
        });
      }
      
      const validatedData = validation.data;
      
      const updatedEntry = await storage.updateJournalEntry(entryId, userId, validatedData);
      
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      if (error instanceof Error && error.message.includes("not found or access denied")) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update journal entry" });
      }
    }
  });

  // Emotional insights endpoint (legacy - keeping for backwards compatibility)
  app.get('/api/insights/emotional', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get recent journal entries for analysis
      const recentEntries = await storage.getJournalEntries(userId, 20);
      
      // Get user profile for context
      const user = await storage.getUser(userId);
      const assessments = await storage.getAssessments(userId);
      const mbtiAssessment = assessments.find(a => a.assessmentType === "mbti");
      
      const userProfile = {
        mbtiType: mbtiAssessment?.results?.type as string | undefined,
        previousEntries: recentEntries.map(e => e.content.slice(0, 100)),
      };
      
      const insights = await generateEmotionalInsights(recentEntries, userProfile);
      
      res.json(insights);
    } catch (error) {
      console.error("Error generating emotional insights:", error);
      res.status(500).json({ message: "Failed to generate emotional insights" });
    }
  });

  // Comprehensive progress tracking endpoint
  app.get('/api/progress/comprehensive', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get all journal entries for comprehensive analysis (limit to last 100 for performance)
      const allEntries = await storage.getJournalEntries(userId, 100);
      
      // Get user profile for context
      const user = await storage.getUser(userId);
      const assessments = await storage.getAssessments(userId);
      const mbtiAssessment = assessments.find(a => a.assessmentType === "mbti");
      
      const userProfile = {
        mbtiType: mbtiAssessment?.results?.type as string | undefined,
        previousEntries: allEntries.slice(0, 10).map(e => e.content.slice(0, 100)),
      };
      
      const progressData = await generateComprehensiveProgress(allEntries, userProfile);
      
      res.json(progressData);
    } catch (error) {
      console.error("Error generating comprehensive progress:", error);
      res.status(500).json({ message: "Failed to generate comprehensive progress data" });
    }
  });

  // Assessment routes
  app.get('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assessments = await storage.getAssessments(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.post('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Sanitize and validate request body
      const sanitizedBody = sanitizeInput(req.body);
      const validation = insertAssessmentSchema.safeParse(sanitizedBody);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid assessment data",
          errors: validation.error.errors
        });
      }
      
      const validatedData = validation.data;
      
      const assessment = await storage.createAssessment(userId, validatedData);
      
      res.status(201).json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  // MBTI Assessment routes
  app.get('/api/assessments/mbti/questions', isAuthenticated, async (req: any, res) => {
    try {
      // Return the MBTI questions for the assessment
      res.json(MBTI_QUESTIONS);
    } catch (error) {
      console.error("Error fetching MBTI questions:", error);
      res.status(500).json({ message: "Failed to fetch MBTI questions" });
    }
  });

  // Validation schema for MBTI responses
  const validQuestionIds = MBTI_QUESTIONS.map(q => q.id);
  const mbtiResponseSchema = z.object({
    responses: z.array(z.object({
      questionId: z.string().refine(
        (id) => validQuestionIds.includes(id),
        "Invalid question ID"
      ),
      score: z.number().min(1).max(7)
    })).length(32, "Exactly 32 responses required") // We have 32 questions (8 per dimension)
      .refine(
        (responses) => {
          const responseIds = responses.map(r => r.questionId);
          const uniqueIds = new Set(responseIds);
          return uniqueIds.size === 32 && validQuestionIds.every(id => uniqueIds.has(id));
        },
        "All question IDs must be answered exactly once"
      )
  });

  app.post('/api/assessments/mbti/submit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Sanitize and validate request body
      const sanitizedBody = sanitizeInput(req.body);
      const validation = mbtiResponseSchema.safeParse(sanitizedBody);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid MBTI responses",
          errors: validation.error.errors
        });
      }
      
      const { responses } = validation.data;
      
      // Calculate MBTI results
      const mbtiResults = calculateMBTIResults(responses);
      
      // Get journaling insights based on MBTI type
      const journalingInsights = getMBTIInsightsForJournaling(mbtiResults.type);
      
      // Store the assessment results
      const assessment = await storage.createAssessment(userId, {
        assessmentType: "mbti",
        results: {
          ...mbtiResults,
          journalingInsights,
          responses // Store raw responses for potential re-scoring
        }
      });
      
      res.status(201).json({
        assessment,
        results: mbtiResults,
        journalingInsights
      });
    } catch (error) {
      console.error("Error processing MBTI assessment:", error);
      res.status(500).json({ message: "Failed to process MBTI assessment" });
    }
  });

  // Get latest MBTI results for a user
  app.get('/api/assessments/mbti/latest', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assessments = await storage.getAssessments(userId);
      
      // Find the most recent MBTI assessment
      const mbtiAssessment = assessments.find(a => a.assessmentType === "mbti");
      
      if (!mbtiAssessment) {
        return res.status(404).json({ message: "No MBTI assessment found" });
      }
      
      res.json(mbtiAssessment);
    } catch (error) {
      console.error("Error fetching latest MBTI assessment:", error);
      res.status(500).json({ message: "Failed to fetch MBTI assessment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
