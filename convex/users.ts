import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * פונקציה לעדכון ניקוד בסיום משחק
 */
export const updateScore = mutation({
    args: { pointsToAdd: v.number() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            console.log("Auth Identity is null. Check auth.config.js");
            throw new Error("לא מזוהה - חסר זהות משתמש");
        }

        const email = identity.email;
        if (!email) throw new Error("למשתמש אין אימייל תקין");

        // חיפוש המשתמש
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique();

        if (user) {
            // עדכון קיים
            await ctx.db.patch(user._id, {
                totalPoints: user.totalPoints + args.pointsToAdd,
            });
        } else {
            // יצירת חדש
            await ctx.db.insert("users", {
                name: identity.name || "משתמש ללא שם",
                email: email,
                picture: identity.pictureUrl || "",
                totalPoints: args.pointsToAdd,
            });
        }
    },
});

/**
 * פונקציה לשליפת הנתונים של המשתמש המחובר
 */
export const getMyData = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .unique();
    },
});