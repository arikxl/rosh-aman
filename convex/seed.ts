import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const resetAndSeed = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. מחיקת שאלות קיימות (כדי שלא יהיו כפילויות בזמן פיתוח)
        const existingQuestions = await ctx.db.query("questions").collect();
        for (const q of existingQuestions) {
            await ctx.db.delete(q._id);
        }

        // 2. הכנסת 25 השאלות הראשונות (5 נושאים X 5 שאלות)
        const initialQuestions = [
            // לבנון
            { topicId: "lebanon", text: "איזה קו גבול נקבע ע'י האו'ם לאחר נסיגת צה'ל ב-2000?", options: ["הקו הירוק", "הקו הכחול", "קו ה-17 במאי", "קו הפסקת האש"], correctIndex: 1, explanation: "הקו הכחול הוא קו הנסיגה הבינלאומי." },
            { topicId: "lebanon", text: "מי היה נשיא לבנון שחוסל ב-1982?", options: ["רפיק חרירי", "בשיר ג'ומאייל", "מישל עאון", "פואד סניורה"], correctIndex: 1, explanation: "בשיר ג'ומאייל חוסל זמן קצר לאחר שנבחר." },
            // איראן
            { topicId: "iran", text: "באיזו שנה התרחשה המהפכה האסלאמית באיראן?", options: ["1967", "1973", "1979", "1982"], correctIndex: 2, explanation: "ב-1979 הפכה איראן לרפובליקה אסלאמית." },
            { topicId: "iran", text: "מהו המצר הימי האסטרטגי בשליטת איראן?", options: ["מיצרי בוספורוס", "מיצרי הורמוז", "מיצרי בבל מנדב", "תעלת סואץ"], correctIndex: 1, explanation: "מיצרי הורמוז הם עורק נפט עולמי." },
            // מצרים
            { topicId: "egypt", text: "מי המנהיג המצרי שחתם על הסכם השלום עם ישראל?", options: ["נאצר", "סאדאת", "מובארק", "סיסי"], correctIndex: 1, explanation: "אנואר סאדאת חתם על ההסכם ב-1979." },
            // ... אפשר להוסיף כאן את שאר ה-25
        ];

        for (const q of initialQuestions) {
            await ctx.db.insert("questions", q);
        }

        return "הנתונים הוזנו בהצלחה למערכת ראש אמ\"ן!";
    },
});