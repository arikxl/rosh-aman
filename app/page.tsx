"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Award, BarChart3, Play } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { api } from "../convex/_generated/api";
import { GENERIC_MEDALS, TOPIC_MEDALS } from "@/constants/medals";
import { Doc } from "../convex/_generated/dataModel";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const userData = useQuery(api.users.getMyData);

  if (!isLoaded) return <div className="min-h-screen bg-slate-950" />;

  const calculateMedals = (user: Doc<"users"> | null | undefined) => {
    if (!user) return 0;
    let count = 0;
    // בדיקת מדליות נושאים
    TOPIC_MEDALS.forEach(m => {
      if ((user.correctAnswersByTopic?.[m.id] || 0) >= m.threshold) count++;
    });
    // בדיקת מדליות כלליות
    GENERIC_MEDALS.forEach(m => {
      if (m.id.startsWith("games") && (user.totalGamesPlayed || 0) >= m.threshold) count++;
      if (m.id.startsWith("correct") && (user.totalCorrectAnswers || 0) >= m.threshold) count++;
      if (m.id.startsWith("perfect") && (user.perfectGames || 0) >= m.threshold) count++;
    });
    return count;
  };

  const medalCount = calculateMedals(userData);


  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-right font-sans relative overflow-hidden">
      {/* רקע עם אפקט גריד מבצעי */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]"></div>
      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* כותרת ראשית */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            חיבור מאובטח: רשת מודיעין פעילה
          </div>

          <h1 className="text-7xl italic font-black tracking-tighter mb-4 bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent">
            ראש אמ&quot;ן
          </h1>
          <p className="text-xl text-slate-400 mx-auto leading-relaxed font-heebo">
            האם יש לך את מה שנדרש כדי לשלוט במידע האסטרטגי בזירה המזרח תיכונית?
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 w-full mb-16">
          {!isSignedIn ? (
            /* מצב: לא מחובר */
            <div className="flex flex-col items-center gap-6">
              <p className="text-slate-500 font-heebo">יש להזדהות כדי להתחיל בצבירת עיטורים</p>
              <SignInButton mode="modal">
                <button className="group relative px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-heebo">
                  כניסה למערכת
                </button>
              </SignInButton>
            </div>
          ) : (
            /* מצב: מחובר */
            <div className="flex flex-col items-center gap-8 w-full">
              {/* כרטיסיית המשתמש - ברוחב מלא ותואמת לגריד */}
                <div className="w-full flex items-center justify-between p-4 bg-slate-900/50 rounded-3xl border border-slate-800 backdrop-blur-sm shadow-xl px-8">

                  {/* ימין: פרטי סוכן */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 shrink-0 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
                      <UserButton
                        appearance={{
                          elements: {
                            rootBox: {
                              width: '3rem', // שווה ל-w-14
                              height: '3rem',
                            },
                            userButtonAvatarBox: {
                              width: '3rem',
                              height: '3rem',
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-mono font-bold">מזהה סוכן פעיל</span>
                      <span className="text-white font-bold text-lg">
                        {userData?.name || "סוכן מורשה"}
                      </span>
                    </div>
                    {/* העיגול של ה-UserButton */}

                  </div>

                  {/* שמאל: נתונים מבצעיים */}
                  <div className="flex items-center gap-8">

                    {/* עיטורים */}
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-mono font-bold mb-1">עיטורי שירות</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-black font-mono ${medalCount > 0 ? "text-amber-500" : "text-slate-700"}`}>
                          {medalCount}
                        </span>
                      </div>
                    </div>

                    {/* קו מפריד דק */}
                    <div className="h-10 w-px bg-slate-800"></div>

                    {/* ניקוד */}
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-mono font-bold mb-1">ניקוד</span>
                      <span className="text-emerald-400 font-black text-3xl font-mono tabular-nums">
                        {userData?.totalPoints?.toLocaleString() || 0}
                      </span>
                    </div>

                  </div>
                </div>

              {/* גריד הכפתורים */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <Link href="/game" className="group relative p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-emerald-500 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <Play className="w-12 h-12 text-emerald-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold mb-2">התחלת מבצע</h2>
                  <p className="text-slate-500 text-sm leading-snug">יציאה למשימת איסוף וניתוח נתונים בזירות השונות</p>
                </Link>

                <Link href="/medals" className="group relative p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-blue-500 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <Award className="w-12 h-12 text-blue-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold mb-2">תיק שירות</h2>
                  <p className="text-slate-500 text-sm leading-snug">צפייה בעיטורים, צל&quot;שים והישגים מבצעיים</p>
                </Link>

                <Link href="/leaderboard" className="group relative p-8 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-yellow-500 transition-all hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <BarChart3 className="w-12 h-12 text-yellow-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold mb-2">סד&quot;כ סוכנים</h2>
                  <p className="text-slate-500 text-sm leading-snug">דירוג המפעילים המובילים בקהיליית המודיעין</p>
                </Link>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-col items-center gap-6 mt-8">
          {/* חותמת סיווג בולטת */}
          <div className="px-6 py-2 border-2 border-red-600/40 bg-red-600/5 rounded-md transform -rotate-2 select-none pointer-events-none">
            <span className="text-red-500 font-black text-xl tracking-[0.2em] shadow-sm">
              סודי ביותר // אגף המודיעין
            </span>
          </div>

          {/* פרטי פיתוח */}
          <div className="flex flex-col items-center opacity-70">
            <div className="h-px w-24 bg-linear-to-r from-transparent via-slate-500 to-transparent my-2"></div>
            <div className="mb-4 flex gap-4 text-[10px] text-slate-600 font-heebo font-medium">
              <Link href="/privacy" className="hover:text-slate-400 transition-colors underline decoration-slate-800 underline-offset-4">
                מדיניות פרטיות
              </Link>
              <span>•</span>
              <Link href="/accessibility" className="hover:text-slate-400 transition-colors underline decoration-slate-800 underline-offset-4">
                הצהרת נגישות
              </Link>
            </div>
           
            <p className="text-slate-500 text-[11px] font-mono tracking-widest uppercase">
              Developed by&nbsp;
              <a
                className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors"
                href="https://www.linkedin.com/in/arik-alexandrov/"
                target="_blank"
                rel="noopener noreferrer"
              >
                arikxl
              </a>
              &nbsp; ISRAEL 2026
            </p>
      
          </div>
        </footer>
      </div>
    </main>
  );
}