import { query } from "./_generated/server";
import { v } from "convex/values";

// פונקציה לשליפת כל השאלות (בשלב הבא נשכלל אותה לרנדומליות של 10 שאלות)
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("questions").collect();
    },
});