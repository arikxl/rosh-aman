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


// פונקציה לעדכון הסטטיסטיקות ומדליות בסיום משחק
export const updateGameStats = mutation({
    args: {
        correctAnswersCount: v.number(), // כמה ענה נכון במשחק הנוכחי
        totalQuestionsInGame: v.number(), // כמה שאלות היו במשחק סך הכל
        topicId: v.string(), // באיזה נושא הוא שיחק הרגע
    },
    handler: async (ctx, args) => {
        // 1. זיהוי אוטומטי של המשתמש דרך Auth
        const identity = await ctx.auth.getUserIdentity();
        if (!identity || !identity.email) {
            throw new Error("משתמש לא מחובר או חסר אימייל");
        }

        // 2. חיפוש המשתמש במסד הנתונים
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email!))
            .unique();

        if (!user) throw new Error("משתמש לא נמצא במסד הנתונים");

        // 3. בודקים האם זה משחק מושלם (100% הצלחה)
        const isPerfect = args.correctAnswersCount === args.totalQuestionsInGame;

        // 4. מחשבים את הנתונים החדשים
        const newTotalGames = (user.totalGamesPlayed || 0) + 1;
        const newTotalCorrect = (user.totalCorrectAnswers || 0) + args.correctAnswersCount;
        const newPerfectGames = (user.perfectGames || 0) + (isPerfect ? 1 : 0);

        // 5. מעדכנים את ספירת התשובות הספציפית לנושא הנוכחי
        const currentTopicStats = user.correctAnswersByTopic || {};
        const newTopicScore = (currentTopicStats[args.topicId] || 0) + args.correctAnswersCount;

        // 6. שומרים הכל
        await ctx.db.patch(user._id, {
            totalGamesPlayed: newTotalGames,
            totalCorrectAnswers: newTotalCorrect,
            perfectGames: newPerfectGames,
            correctAnswersByTopic: {
                ...currentTopicStats,
                [args.topicId]: newTopicScore,
            },
        });
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