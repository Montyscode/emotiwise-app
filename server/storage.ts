import {
  users,
  journalEntries,
  assessments,
  type User,
  type UpsertUser,
  type JournalEntry,
  type InsertJournalEntry,
  type Assessment,
  type InsertAssessment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Journal operations
  createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  updateJournalEntry(entryId: number, userId: string, update: Partial<JournalEntry>): Promise<JournalEntry>;
  
  // Assessment operations
  createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment>;
  getAssessments(userId: string): Promise<Assessment[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Journal operations
  async createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry> {
    const [journalEntry] = await db
      .insert(journalEntries)
      .values({ ...entry, userId })
      .returning();
    return journalEntry;
  }

  async getJournalEntries(userId: string, limit = 10): Promise<JournalEntry[]> {
    return await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(limit);
  }

  async updateJournalEntry(entryId: number, userId: string, update: Partial<JournalEntry>): Promise<JournalEntry> {
    // First verify the entry exists and belongs to the user
    const [existingEntry] = await db
      .select()
      .from(journalEntries)
      .where(and(
        eq(journalEntries.id, entryId),
        eq(journalEntries.userId, userId)
      ));
    
    if (!existingEntry) {
      throw new Error("Journal entry not found or access denied");
    }

    const [updatedEntry] = await db
      .update(journalEntries)
      .set({ ...update, updatedAt: new Date() })
      .where(and(
        eq(journalEntries.id, entryId),
        eq(journalEntries.userId, userId)
      ))
      .returning();
    
    if (!updatedEntry) {
      throw new Error("Failed to update journal entry");
    }
    
    return updatedEntry;
  }

  // Assessment operations
  async createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db
      .insert(assessments)
      .values({ ...assessment, userId })
      .returning();
    return newAssessment;
  }

  async getAssessments(userId: string): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt));
  }
}

export const storage = new DatabaseStorage();
