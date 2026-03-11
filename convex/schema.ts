import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // מאגר השאלות המרכזי
  questions: defineTable({
    topicId: v.string(),     // מזהה נושא (למשל: 'lebanon')
    text: v.string(),        // תוכן השאלה
    imageUrl: v.optional(v.string()), // תמונה (אופציונלי)
    options: v.array(v.string()),     // 4 אפשרויות
    correctIndex: v.number(),          // אינדקס התשובה הנכונה (0-3)
    explanation: v.string(),           // הסבר לימודי לאחר התשובה
  }).index("by_topic", ["topicId"]),

  // תיעוד הצלחות של משתמשים (לצורך מדליות)
  userProgress: defineTable({
    userId: v.string(),      // מזהה ייחודי של המשתמש (מגוגל)
    questionId: v.id("questions"),
    topicId: v.string(),
    earnedAt: v.number(),    // זמן פתרון השאלה
  }).index("by_user_topic", ["userId", "topicId"]),

  // נתוני משתמש ודירוג
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    totalPoints: v.number(), // ניקוד מצטבר לטבלת המובילים
  }).index("by_email", ["email"]),
});