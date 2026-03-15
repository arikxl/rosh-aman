"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield, Award, Crown, ArrowRight, Play, Target, Zap, ListChecks } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { TOPIC_MEDALS, GENERIC_MEDALS, PLATINUM_MEDAL, type Medal } from "@/constants/medals";

// --- רכיבי עזר חיצוניים לרנדר ---

const SectionHeader = ({ title, icon: Icon, count, total }: any) => (
    <h3 className="text-xl font-bold mb-6 text-slate-300 flex items-center gap-3">
        <Icon className="w-5 h-5 text-emerald-500" />
        {title}
        <span className="text-slate-600 text-sm font-normal">({count} מתוך {total})</span>
    </h3>
);

function GenericMedalCard({ medal, unlocked, currentValue, iconPath }: any) {
    const progress = Math.min((currentValue / medal.threshold) * 100, 100);
    return (
        <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 transition-all ${unlocked ? 'bg-slate-900 border-emerald-500/30 shadow-lg' : 'bg-slate-950/40 border-slate-900 opacity-60'}`}>
            <div className="relative w-20 h-20 shrink-0">
                <Image
                    src={unlocked && medal.iconUrl ? medal.iconUrl : iconPath}
                    alt={medal.name}
                    fill
                    className={`object-contain ${!unlocked ? 'grayscale brightness-50' : 'drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]'}`}
                />
            </div>

            <div className="flex-1 text-center sm:text-right w-full">
                <h4 className={`font-bold text-lg mb-1 ${unlocked ? 'text-slate-100' : 'text-slate-600'}`}>{medal.name}</h4>
                <p className="text-xs text-slate-500 mb-4 h-8 sm:h-auto line-clamp-2 sm:line-clamp-none">
                    {medal.description}
                </p>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${unlocked ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500" dir="ltr">
                    <span>{currentValue.toLocaleString()} / {medal.threshold.toLocaleString()}</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
            </div>
        </div>
    );
}

// --- הקומפוננטה הראשית ---

export default function MedalsPage() {
    const { userId } = useAuth();

    // stats יהיה undefined בזמן טעינה, ו-null אם המשתמש לא נמצא ב-DB
    const stats = useQuery(api.users.getUserStats, userId ? {} : "skip");

    // 1. בזמן שהשאילתה רצה (undefined), נציג מסך טעינה
    if (stats === undefined) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-emerald-500 animate-pulse font-mono tracking-widest text-xl">
                    סורק רשתות תקשורת...
                </div>
            </div>
        );
    }

    // 2. טיפול בשחקן חדש: אם stats הוא null, ניצור אובייקט עם ערכי אפס
    // זה מונע את השגיאה "Cannot read properties of null"
    const effectiveStats = stats ?? {
        totalGamesPlayed: 0,
        totalCorrectAnswers: 0,
        perfectGames: 0,
        correctAnswersByTopic: {}
    };

    const isMedalUnlocked = (medal: Medal) => {
        if (medal.type === "topic") {
            const topicScore = effectiveStats.correctAnswersByTopic?.[medal.id] || 0;
            return topicScore >= medal.threshold;
        }
        if (medal.type === "generic") {
            if (medal.id.startsWith("games")) return (effectiveStats.totalGamesPlayed || 0) >= medal.threshold;
            if (medal.id.startsWith("correct")) return (effectiveStats.totalCorrectAnswers || 0) >= medal.threshold;
            if (medal.id.startsWith("perfect")) return (effectiveStats.perfectGames || 0) >= medal.threshold;
        }
        return false;
    };

    const gameRibbons = GENERIC_MEDALS.filter(m => m.id.startsWith("games"));
    const correctCoins = GENERIC_MEDALS.filter(m => m.id.startsWith("correct"));
    const perfectHexagons = GENERIC_MEDALS.filter(m => m.id.startsWith("perfect"));

    const unlockedTopicsCount = TOPIC_MEDALS.filter(isMedalUnlocked).length;
    const unlockedGenericsCount = GENERIC_MEDALS.filter(isMedalUnlocked).length;

    const isPlatinumUnlocked =
        unlockedTopicsCount === TOPIC_MEDALS.length &&
        unlockedGenericsCount === GENERIC_MEDALS.length;

    return (
        <main className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 pb-24" dir="rtl">
            <div className="max-w-6xl mx-auto mt-4 sm:mt-8">

                {/* ניווט עליון רספונסיבי */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 gap-6 text-center sm:text-right">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">ארון העיטורים</h1>
                    <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                        <Link href="/" className="flex-1 sm:flex-none text-center px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-300 rounded-xl transition-all text-sm font-bold">
                            חזרה למפקדה
                        </Link>
                        <Link href="/game" className="flex-1 sm:flex-none text-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold text-sm shadow-lg shadow-emerald-900/20">
                            מבצע חדש
                        </Link>
                    </div>
                </div>

                {/* הודעת ברוך הבא לשחקן חדש */}
                {stats === null && (
                    <div className="mb-12 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-emerald-400/80 text-sm text-center font-mono">
                        מערכת זיהוי סוכנים: משתמש חדש זוהה. התחל בפעילות מבצעית לצבירת עיטורים.
                    </div>
                )}

                {/* מדליית הפלטינום */}
                <div className="mb-16">
                    <div className={`p-6 sm:p-10 rounded-[32px] border-2 text-center transition-all duration-700 ${isPlatinumUnlocked ? 'bg-slate-900 border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.1)]' : 'bg-slate-900/30 border-slate-800 opacity-80'}`}>
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
                            <Crown className={`w-full h-full ${isPlatinumUnlocked ? 'text-yellow-400 drop-shadow-xl' : 'text-slate-700'}`} />
                        </div>
                        <h2 className={`text-2xl sm:text-4xl font-black mb-3 ${isPlatinumUnlocked ? 'text-yellow-400' : 'text-slate-600'}`}>{PLATINUM_MEDAL.name}</h2>
                        <p className={`text-sm sm:text-lg max-w-md mx-auto ${isPlatinumUnlocked ? 'text-yellow-100/70' : 'text-slate-700'}`}>{PLATINUM_MEDAL.description}</p>
                    </div>
                </div>

                {/* התמחויות זירתיות */}
                <div className="mb-20">
                    <h2 className="text-xl sm:text-2xl font-bold mb-8 text-emerald-500 flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
                        התמחויות זירתיות
                        <span className="text-slate-600 text-sm sm:text-lg font-normal mr-auto">({unlockedTopicsCount}/{TOPIC_MEDALS.length})</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                        {TOPIC_MEDALS.map((medal) => {
                            const unlocked = isMedalUnlocked(medal);
                            const currentScore = Math.min(effectiveStats.correctAnswersByTopic?.[medal.id] || 0, medal.threshold);
                            return (
                                <div key={medal.id} className={`p-4 rounded-2xl border flex flex-col items-center text-center transition-all ${unlocked ? 'bg-slate-900 border-emerald-500/40' : 'bg-slate-950/20 border-slate-900'}`}>
                                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 mb-4">
                                        <Image src={unlocked && medal.iconUrl ? medal.iconUrl : "/imgs/locked_medal_generic.png"} alt={medal.name} fill className={`object-contain ${!unlocked ? 'grayscale brightness-50 opacity-40' : 'drop-shadow-md'}`} />
                                    </div>
                                    <h4 className={`font-bold text-[11px] sm:text-xs mb-2 h-8 flex items-center leading-tight ${unlocked ? 'text-slate-100' : 'text-slate-600'}`}>{medal.name}</h4>
                                    <p className={`text-[9px] sm:text-[10px] leading-snug mb-4 h-9 flex items-center justify-center ${unlocked ? 'text-slate-400 font-medium' : 'text-slate-800 italic opacity-50'}`}>
                                        {unlocked ? medal.description : "פרטי העיטור חסויים עד להשלמת היעד"}
                                    </p>
                                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-auto">
                                        <div className={`h-full transition-all duration-1000 ${unlocked ? 'bg-emerald-500' : 'bg-slate-700'}`} style={{ width: `${(currentScore / medal.threshold) * 100}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* אבני דרך מבצעיות */}
                <div className="space-y-16 sm:space-y-20">
                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-500 flex items-center gap-3 border-b border-slate-800 pb-4">
                        <Award className="w-6 h-6 sm:w-7 sm:h-7" />
                        אבני דרך מבצעיות
                    </h2>

                    <section>
                        <SectionHeader title="ותק מבצעי" icon={Zap} count={gameRibbons.filter(isMedalUnlocked).length} total={gameRibbons.length} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {gameRibbons.map(medal => (
                                <GenericMedalCard key={medal.id} medal={medal} unlocked={isMedalUnlocked(medal)} currentValue={effectiveStats.totalGamesPlayed || 0} iconPath="/imgs/locked_ribbon_generic.png" />
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="מאגר ידע מצטבר" icon={ListChecks} count={correctCoins.filter(isMedalUnlocked).length} total={correctCoins.length} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {correctCoins.map(medal => (
                                <GenericMedalCard key={medal.id} medal={medal} unlocked={isMedalUnlocked(medal)} currentValue={effectiveStats.totalCorrectAnswers || 0} iconPath="/imgs/locked_coin_generic.png" />
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="רמת דיוק וביצוע" icon={Target} count={perfectHexagons.filter(isMedalUnlocked).length} total={perfectHexagons.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
                            {perfectHexagons.map(medal => (
                                <GenericMedalCard key={medal.id} medal={medal} unlocked={isMedalUnlocked(medal)} currentValue={effectiveStats.perfectGames || 0} iconPath="/imgs/locked_hex_generic.png" />
                            ))}
                        </div>
                    </section>
                </div>

            </div>
        </main>
    );
}