"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

export default function LeaderboardPage() {
    const leaders = useQuery(api.users.getLeaderboard);

    if (leaders === undefined) return <div className="min-h-screen bg-slate-950 text-emerald-500 p-20 text-center font-mono">סורק רשת...</div>;

    return (
        <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center font-sans rtl">
            <div className="w-full max-w-3xl">
                <header className="mb-12 flex justify-between items-center">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        ← חזרה למפקדה
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-l from-emerald-400 to-white bg-clip-text text-transparent">
                        טבלת אלופים
                    </h1>
                </header>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-widest">
                                <th className="p-4 font-medium">דירוג</th>
                                <th className="p-4 font-medium">סוכן</th>
                                <th className="p-4 font-medium text-center">מדליות</th>
                                <th className="p-4 font-medium text-left">ניקוד</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800">
                            {leaders.map((user, index) => (
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
                                    {/* הצגת 0 מדליות כרגע */}
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <span className="text-xl opacity-20">🎖️</span>
                                            <span className="text-sm text-slate-500 font-mono">0</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-left font-mono text-emerald-500 font-bold">
                                        {user.totalPoints.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
               
                    </table>
                </div>
            </div>
        </main>
    );
}