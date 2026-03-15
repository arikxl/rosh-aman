"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { TOPIC_MEDALS, GENERIC_MEDALS } from "@/constants/medals";
import { Trophy, ArrowRight } from "lucide-react";

export default function LeaderboardPage() {
    const leaders = useQuery(api.users.getLeaderboard);

    const calculateMedalCount = (user: Doc<"users">) => {
        let count = 0;
        TOPIC_MEDALS.forEach(medal => {
            const userScore = user.correctAnswersByTopic?.[medal.id] || 0;
            if (userScore >= medal.threshold) count++;
        });
        GENERIC_MEDALS.forEach(medal => {
            if (medal.id.startsWith("games") && (user.totalGamesPlayed || 0) >= medal.threshold) count++;
            if (medal.id.startsWith("correct") && (user.totalCorrectAnswers || 0) >= medal.threshold) count++;
            if (medal.id.startsWith("perfect") && (user.perfectGames || 0) >= medal.threshold) count++;
        });
        return count;
    };

    if (leaders === undefined) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-emerald-500 animate-pulse font-mono tracking-widest">סורק רשת...</div>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex flex-col items-center" dir="rtl">
            <div className="w-full max-w-3xl mt-4">

                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                        טבלת אלופים
                    </h1>
                    <Link href="/" className="text-xs sm:text-sm bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                        <ArrowRight className="w-4 h-4" />
                        חזרה למפקדה
                    </Link>
                </header>

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                    <table className="w-full text-right border-collapse table-fixed">
                        <thead>
                            <tr className="bg-slate-800/40 text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest">
                                <th className="p-3 sm:p-4 w-12 sm:w-20 font-bold">דירוג</th>
                                <th className="p-3 sm:p-4 font-bold">סוכן/ת</th>
                                <th className="p-3 sm:p-4 w-16 sm:w-24 font-bold text-center">מדליות</th>
                                <th className="p-3 sm:p-4 w-20 sm:w-28 font-bold text-left">ניקוד</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/50">
                            {leaders.map((user, index) => {
                                const medalCount = calculateMedalCount(user);

                                return (
                                    <tr key={user._id} className="hover:bg-emerald-500/5 transition-colors group">
                                        {/* דירוג */}
                                        <td className="p-3 sm:p-4">
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-black ${index === 0 ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" :
                                                    index === 1 ? "bg-slate-300 text-black" :
                                                        index === 2 ? "bg-amber-700 text-white" : "text-slate-500 bg-slate-800/30"
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>

                                        {/* אלוף/ה */}
                                        <td className="p-3 sm:p-4 overflow-hidden">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                {user.picture ? (
                                                    <img src={user.picture} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-slate-700 shrink-0" />
                                                ) : (
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center text-[10px]">
                                                        {user.name?.charAt(0)}
                                                    </div>
                                                )}
                                                <span className="font-bold text-xs sm:text-sm truncate group-hover:text-emerald-400 transition-colors">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* מדליות */}
                                        <td className="p-3 sm:p-4 text-center">
                                            <span className={`text-xs sm:text-sm font-mono font-bold ${medalCount > 0 ? "text-amber-500" : "text-slate-600"}`}>
                                                {medalCount}
                                            </span>
                                        </td>

                                        {/* ניקוד */}
                                        <td className="p-3 sm:p-4 text-left">
                                            <span className="text-xs sm:text-sm font-mono text-emerald-500 font-black tabular-nums">
                                                {user.totalPoints.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <p className="mt-6 text-center text-slate-600 text-[10px] sm:text-xs">
                    הטבלה מתעדכנת בזמן אמת על בסיס ביצועים מבצעיים בשטח
                </p>
            </div>
        </main>
    );
}