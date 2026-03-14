"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { TOPIC_MEDALS, GENERIC_MEDALS } from "@/constants/medals";

export default function LeaderboardPage() {
    const leaders = useQuery(api.users.getLeaderboard);

    // פונקציה לחישוב מספר המדליות של משתמש ספציפי
    const calculateMedalCount = (user: Doc<"users">) => {
        let count = 0;

        // בדיקת מדליות נושאים
        TOPIC_MEDALS.forEach(medal => {
            const userScore = user.correctAnswersByTopic?.[medal.id] || 0;
            if (userScore >= medal.threshold) count++;
        });

        // בדיקת מדליות כלליות
        GENERIC_MEDALS.forEach(medal => {
            if (medal.id.startsWith("games") && (user.totalGamesPlayed || 0) >= medal.threshold) count++;
            if (medal.id.startsWith("correct") && (user.totalCorrectAnswers || 0) >= medal.threshold) count++;
            if (medal.id.startsWith("perfect") && (user.perfectGames || 0) >= medal.threshold) count++;
        });

        return count;
    };

    if (leaders === undefined) return <div className="min-h-screen bg-slate-950 text-emerald-500 p-20 text-center font-mono">סורק רשת...</div>;

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center font-sans rtl" dir="rtl">
            <div className="w-full max-w-3xl">
                <header className="mb-12 flex justify-between items-center">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        חזרה למפקדה
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter bg-linear-to-l from-emerald-400 to-white bg-clip-text text-transparent">
                        טבלת אלופים
                    </h1>
                </header>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-widest">
                                <th className="p-4 font-medium">דירוג</th>
                                <th className="p-4 font-medium">אלוף/ה</th>
                                <th className="p-4 font-medium text-center">מדליות🎖️
                                </th>
                                <th className="p-4 font-medium text-left">ניקוד</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800">
                            {leaders.map((user, index) => {
                                const medalCount = calculateMedalCount(user);

                                return (
                                    <tr key={user._id} className="hover:bg-emerald-500/5 transition-colors group">
                                        <td className="p-4">
                                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]" :
                                                    index === 1 ? "bg-slate-300 text-black" :
                                                        index === 2 ? "bg-amber-700 text-white" : "text-slate-500"
                                                }`}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {user.picture && (
                                                    <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-slate-700" />
                                                )}
                                                <span className="font-bold group-hover:text-emerald-400 transition-colors">{user.name}</span>
                                            </div>
                                        </td>

                                        {/* הצגת מספר המדליות האמיתי */}
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center items-center gap-1">
                                                <span className={`text-sm font-mono ${medalCount > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                                                    {medalCount}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-4 text-left font-mono text-emerald-500 font-bold">
                                            {user.totalPoints.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}