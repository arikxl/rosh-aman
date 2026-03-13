import { query } from "./_generated/server";
import { v } from "convex/values";

export const getGameRound = query({
    args: {
        seed: v.number() // הוספנו את זה כדי לשבור את הקאש של Convex
    },
    handler: async (ctx, args) => {
        const allQuestions = await ctx.db.query("questions").collect();

        // 1. ערבוב השאלות ובחירת 10
        const shuffledQuestions = [...allQuestions]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);

        // 2. ערבוב התשובות בתוך כל שאלה
        return shuffledQuestions.map((q) => {
            const optionsWithStatus = q.options.map((opt, index) => ({
                text: opt,
                isCorrect: index === q.correctIndex,
            }));

            // ערבוב התשובות
            const shuffledOptions = optionsWithStatus.sort(() => Math.random() - 0.5);

            // מציאת האינדקס החדש של התשובה הנכונה
            const newCorrectIndex = shuffledOptions.findIndex((opt) => opt.isCorrect);

            return {
                ...q,
                options: shuffledOptions.map((opt) => opt.text),
                correctIndex: newCorrectIndex,
            };
        });
    },
});