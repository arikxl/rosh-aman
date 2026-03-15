export type MedalType = "topic" | "generic" | "platinum";

export interface Medal {
    id: string;
    name: string;
    description: string;
    type: MedalType;
    threshold: number;
    iconUrl?: string; // הנתיב לתמונה הצבעונית כשההישג פתוח
}

// --- מדליות של נושאים (80% הצלחה) ---
export const TOPIC_MEDALS: Medal[] = [
    // קבוצת ה-50 שאלות (סף: 40)
    { id: "syria", name: "שליט הבשן", description: "ענית נכון על 80% מהשאלות בנושא סוריה", type: "topic", threshold: 40 },
    { id: "iran", name: "שובר הציר", description: "ענית נכון על 80% מהשאלות בנושא איראן", type: "topic", threshold: 40 },
    { id: "lebanon", name: "מנתץ הארזים", description: "ענית נכון על 80% מהשאלות בנושא לבנון", type: "topic", threshold: 40 },
    { id: "egypt", name: "צולח התעלה", description: "ענית נכון על 80% מהשאלות בנושא מצרים", type: "topic", threshold: 40 },
    { id: "jordan", name: "מגן הערבה", description: "ענית נכון על 80% מהשאלות בנושא ירדן", type: "topic", threshold: 40 },
    { id: "turkey", name: "סולטאן מודיעיני", description: "ענית נכון על 80% מהשאלות בנושא טורקיה", type: "topic", threshold: 40 },
    { id: "iraq_central_asia", name: "מומחה דרך המשי", description: "ענית נכון על 80% מהשאלות על עיראק ומרכז אסיה", type: "topic", threshold: 40 },
    { id: "gulf_states", name: "נסיך המפרץ", description: "ענית נכון על 80% מהשאלות בנושא מדינות המפרץ", type: "topic", threshold: 40 },
    { id: "hamas", name: "נקמת העוטף", description: "ענית נכון על 80% מהשאלות בנושא חמאס/עזה", type: "topic", threshold: 40 },
    { id: "hezbollah", name: "צייד רדואן", description: "ענית נכון על 80% מהשאלות בנושא חזבאללה", type: "topic", threshold: 40 },
    { id: "global_terror", name: "שומר העולם החופשי", description: "ענית נכון על 80% מהשאלות בנושא טרור עולמי", type: "topic", threshold: 40 },
    { id: "west_bank", name: "ריבון יהודה", description: "ענית נכון על 80% מהשאלות בנושא הזירה הפלסטינית", type: "topic", threshold: 40 },
    { id: "arab_culture", name: "חכם המזרח", description: "ענית נכון על 80% מהשאלות בנושא תרבות ערבית", type: "topic", threshold: 40 },
    { id: "intel_community", name: "קמ\"ן ראשי", description: "ענית נכון על 80% מהשאלות בנושא קהיליית המודיעין", type: "topic", threshold: 40 },
    { id: "intel_operations", name: "איש הצללים", description: "ענית נכון על 80% מהשאלות בנושא מבצעי מודיעין", type: "topic", threshold: 40 },
    { id: "israel_wars", name: "שר המלחמה", description: "ענית נכון על 80% מהשאלות בנושא מלחמות ישראל", type: "topic", threshold: 40 },
    { id: "superpowers", name: "מר עולם", description: "ענית נכון על 80% מהשאלות בנושא מעצמות על", type: "topic", threshold: 40 },
    { id: "intl_relations", name: "שגריר של כבוד", description: "ענית נכון על 80% מהשאלות בנושא יחסים בינלאומיים", type: "topic", threshold: 32 },

    // קבוצות קטנות יותר
    { id: "pij", name: "אלוף הסיכולים", description: "ענית נכון על 80% מהשאלות בנושא הגא\"פ", type: "topic", threshold: 32 }, // 40 שאלות
    { id: "cyber_tech", name: "לוחם רשת", description: "ענית נכון על 80% מהשאלות בנושא סייבר וטכנולוגיה", type: "topic", threshold: 20 }, // 25 שאלות
    { id: "houthis", name: "שומר הים האדום", description: "ענית נכון על 80% מהשאלות בנושא החות'ים", type: "topic", threshold: 16 }, // 20 שאלות
    { id: "shiite_militias", name: "מפרק המיליציות", description: "ענית נכון על 80% מהשאלות בנושא מיליציות שיעיות", type: "topic", threshold: 16 }, // 20 שאלות
    { id: "defense_economy", name: "נגיד הזהב", description: "ענית נכון על 80% מהשאלות בנושא כלכלה ביטחונית", type: "topic", threshold: 16 }, // 20 שאלות
    { id: "non_conventional", name: "אדון האטום", description: "ענית נכון על 80% מהשאלות בנושא נשק בלתי קונבנציונלי", type: "topic", threshold: 16 }, // 20 שאלות
];

// --- מדליות גנריות (Milestones) ---
export const GENERIC_MEDALS: Medal[] = [
    { id: "games_1", name: "טבילת אש", iconUrl: "/imgs/medal_games_1.png", description: "השלמת משחק מלא אחד", type: "generic", threshold: 1 },
    { id: "games_100", name: "מאתר יעדים", iconUrl: "/imgs/medal_games_100.png", description: "השלמת 100 משחקים", type: "generic", threshold: 100 },
    { id: "games_500", name: "אנליסט עלית", iconUrl: "/imgs/medal_games_500.png", description: "השלמת 500 משחקים", type: "generic", threshold: 500 },
    { id: "games_1000", name: "מעריך לאומי", iconUrl: "/imgs/medal_games_1000.png", description: "השלמת 1,000 משחקים", type: "generic", threshold: 1000 },

    { id: "correct_100", name: "קצין איסוף", description: "ענית נכון על 100 שאלות במצטבר", type: "generic", threshold: 100 },
    { id: "correct_500", name: "צייד הצללים", description: "ענית נכון על 500 שאלות במצטבר", type: "generic", threshold: 500 },
    { id: "correct_1000", name: "אגדת מודיעין", description: "ענית נכון על 1,000 שאלות במצטבר", type: "generic", threshold: 1000 },

    { id: "perfect_1", name: "סיכול ממוקד", description: "סיימת משחק אחד עם 100% הצלחה", type: "generic", threshold: 1 },
    { id: "perfect_10", name: "ג'מיני אנושי", description: "סיימת 10 משחקים עם 100% הצלחה", type: "generic", threshold: 10 },
];

// --- מדליית הפלטינום ---
export const PLATINUM_MEDAL: Medal = {
    id: "platinum_all",
    name: 'ראש אמ"ן',
    description: "השגת את כל המדליות האפשריות במשחק!",
    type: "platinum",
    threshold: TOPIC_MEDALS.length + GENERIC_MEDALS.length
};