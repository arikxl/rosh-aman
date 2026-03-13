import { mutation } from "./_generated/server";
import { data } from "./data"; // מושך את מערך 1,029 השאלות מהקובץ data.js

export const resetAndSeed = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. מחיקת שאלות קיימות (כדי שלא יהיו כפילויות)
        const existingQuestions = await ctx.db.query("questions").collect();
        for (const q of existingQuestions) {
            await ctx.db.delete(q._id);
        }

        console.log(`נמחקו ${existingQuestions.length} שאלות ישנות.`);

        // 2. הכנסת כל השאלות החדשות מהקובץ שלנו
        let count = 0;
        for (const q of data) {
            await ctx.db.insert("questions", {
                topicId: q.topicId,
                text: q.text,
                options: q.options,
                correctIndex: q.correctIndex,
                // אם יש לך שדה explanation ב-schema, כדאי לוודא שהוא מוגדר כ-optional
                // כי בשאלות שייצרנו אין כרגע הסברים.
            });
            count++;
        }

        return `המשימה הושלמה! הועלו בהצלחה ${count} שאלות למאגר הנתונים של אמ"ן.`;
    },
});