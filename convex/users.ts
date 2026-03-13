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


// שליפת כל המשתמשים לטבלת האלופים
export const getLeaderboard = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("users")
            .withIndex("by_points") // שימוש באינדקס החדש
            .order("desc")          // מהגבוה לנמוך
            .take(10);
    },
});


export const updateGameStats = mutation({
    args: {
        // במקום topicId אחד, אנחנו מקבלים מערך של כל ה-topicIds שהיו במשחק (לפי סדר השאלות)
        // ומערך של האם השחקן צדק בכל שאלה (למשל [true, false, true...])
        results: v.array(v.object({
            topicId: v.string(),
            isCorrect: v.boolean(),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity || !identity.email) throw new Error("Not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .unique();

        if (!user) throw new Error("User not found");

        const correctCount = args.results.filter(r => r.isCorrect).length;
        const isPerfect = correctCount === args.results.length;

        // עדכון סטטיסטיקות כלליות
        const patchData = { // הסרתי את ה- ": any"
            totalGamesPlayed: (user.totalGamesPlayed || 0) + 1,
            totalCorrectAnswers: (user.totalCorrectAnswers || 0) + correctCount,
            perfectGames: (user.perfectGames || 0) + (isPerfect ? 1 : 0),
            correctAnswersByTopic: {} // נגדיר אותו כאן כברירת מחדל כדי למנוע שגיאות טיפוס בהמשך
        };

        // עדכון סטטיסטיקות לפי נושאים
        const newTopicStats = { ...(user.correctAnswersByTopic || {}) };

        args.results.forEach(res => {
            if (res.isCorrect) {
                newTopicStats[res.topicId] = (newTopicStats[res.topicId] || 0) + 1;
            }
        });

        patchData.correctAnswersByTopic = newTopicStats;

        await ctx.db.patch(user._id, patchData);
    },
});



// שליפת הנתונים של המשתמש עבור דף המדליות
export const getUserStats = query({
    args: {}, // אין צורך לקבל ID מהקצה, השרת יודע מי מחובר!
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity || !identity.email) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .unique();

        if (!user) return null;

        // מחזירים רק את הנתונים הרלוונטיים למדליות
        return {
            totalGamesPlayed: user.totalGamesPlayed || 0,
            totalCorrectAnswers: user.totalCorrectAnswers || 0,
            perfectGames: user.perfectGames || 0,
            correctAnswersByTopic: user.correctAnswersByTopic || {},
        };
    },
});