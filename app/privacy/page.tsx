"use client";

import Link from "next/link";
import { Shield, ChevronRight, Lock, Database, User, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden font-sans" dir="rtl">
      {/* רקע גריד מבצעי */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-3xl mx-auto mt-10">
        <header className="mb-10 text-right">
          <Link href="/" className="inline-flex items-center text-emerald-500 hover:text-emerald-400 transition-colors mb-6 group font-heebo">
            <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            חזרה למפקדה
          </Link>
          <div className="flex items-center gap-4">
            <Lock className="w-8 h-8 text-emerald-500" />
            <h1 className="text-4xl font-black tracking-tight bg-linear-to-l from-white to-slate-500 bg-clip-text text-transparent italic font-heebo">
              מדיניות שמירת נתונים ופרטיות
            </h1>
          </div>
          <div className="h-1 w-20 bg-emerald-500 mt-4 rounded-full shadow-[0_0_10px_#10b981]"></div>
        </header>

        <section className="space-y-8 text-slate-300 leading-relaxed bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 backdrop-blur-sm shadow-2xl text-right font-heebo">

          {/* הבהרה לגבי אופי הפרויקט */}
          <div className="bg-slate-950/60 border border-slate-800 p-6 rounded-2xl border-r-4 border-r-emerald-500">
            <p className="text-slate-200">
              חשוב לנו שתדעו: פרויקט <strong>&quot;ראש אמ&quot;ן&quot;</strong> הוא מיזם קהילתי-לימודי המופעל <strong>ללא מטרות רווח</strong>. הפרטיות שלכם היא לא מוצר עבורנו, והיא נשמרת ברמה הגבוהה ביותר האפשרית במערכות הדיגיטליות שלנו.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-950/30 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <User className="w-5 h-5" />
                <h2 className="font-bold">מה אנחנו אוספים?</h2>
              </div>
              <p className="text-sm text-slate-400">
                מידע בסיסי בלבד לצורך הזדהות: שם, תמונת פרופיל וכתובת אימייל, כפי שהם מתקבלים מספק הזהות שלכם (Google) דרך מערכת Clerk.
              </p>
            </div>

            <div className="p-5 bg-slate-950/30 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Database className="w-5 h-5" />
                <h2 className="font-bold">איפה המידע נשמר?</h2>
              </div>
              <p className="text-sm text-slate-400">
                הנתונים המבצעיים שלכם (ניקוד, עיטורים והישגים) נשמרים במסד הנתונים המאובטח של Convex. המידע אינו נשמר בשרתים מקומיים שלנו.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              שימוש במידע
            </h2>
            <p>
              הנתונים משמשים אך ורק לצורך תפעול הסימולטור: הצגת שמכם בטבלת האלופים (סד&quot;כ סוכנים), מעקב אחר התקדמות בעיטורים, וניתוח אנונימי של רמת הקושי בשאלות כדי לשפר את המערכת.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-8">
            <h2 className="text-white font-bold text-xl mb-3">הזכות להישכח</h2>
            <p>
              אנחנו מאמינים שלכל סוכן יש שליטה מלאה על המידע שלו. אם תחליטו שאתם רוצים למחוק את החשבון שלכם ואת כל הנתונים שנצברו בו (ניקוד, מדליות והיסטוריית משחקים) - תוכלו לעשות זאת בכל עת.
            </p>
            <div className="mt-4 flex items-center gap-3 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 w-fit">
              <Mail className="w-5 h-5 text-emerald-500" />
              <p className="text-slate-200">
                לבקשת מחיקת נתונים או שאלות על פרטיות:
                <a href="mailto:arikxl@gmail.com" className="mr-2 text-emerald-400 font-bold hover:underline">
                  arikxl@gmail.com
                </a>
              </p>
            </div>
          </div>

        </section>

        <footer className="mt-12 text-center opacity-40">
          <Shield className="w-10 h-10 mx-auto mb-4 text-slate-600" />
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase">
            Data Protocol: Classified // Privacy Level: Restricted
          </p>
        </footer>
      </div>
    </main>
  );
}