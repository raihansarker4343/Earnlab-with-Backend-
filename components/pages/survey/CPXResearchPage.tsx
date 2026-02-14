import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../../App';
import { SURVEY_PROVIDERS } from '../../../constants';

const CPXResearchPage: React.FC = () => {
  const provider = SURVEY_PROVIDERS.find((p) => p.name === 'CPX Research');
  const { user, isLoggedIn } = useContext(AppContext);

  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // সার্ভে লোড করার ফাংশন
  const fetchSurveys = async () => {
    if (!isLoggedIn || !user?.id) return;

    setLoading(true);
    setError(null);
    try {
      // আপনার ব্যাকএন্ড এন্ডপয়েন্ট কল করা হচ্ছে
      // ✅ এখানে সম্পূর্ণ URL ব্যবহার করুন যাতে এটি আপনার সাবডোমেইনে (Backend) হিট করে
      const response = await axios.get(`https://api.earnello.com/api/surveys/cpx/get-surveys`, {
        params: { user_id: user.id }
      });

      if (response.data.status === 'success') {
        setSurveys(response.data.surveys || []);
      } else {
        setSurveys([]);
      }
    } catch (err: any) {
      console.error("CPX API Error:", err);
      setError("Failed to load surveys. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ অটো-রিফ্রেশ হ্যান্ডেলার
  const handleSurveyClick = (url: string) => {
    // ১. নতুন ট্যাবে সার্ভে ওপেন করুন
    window.open(url, '_blank', 'noopener,noreferrer');

    // ২. ৫ সেকেন্ড পর অটোমেটিক লিস্ট আপডেট করুন
    setTimeout(() => {
      console.log("Auto-refreshing survey list...");
      fetchSurveys();
    }, 5000); 
  };

  useEffect(() => {
    fetchSurveys();
  }, [isLoggedIn, user?.id]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        {provider && (
          <img
            src={provider.logo}
            alt={`${provider.name} logo`}
            className="h-10 object-contain bg-slate-200 dark:bg-slate-800 p-1 rounded-md"
          />
        )}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          CPX Research
        </h1>
      </div>

      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-sky-500/10 text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-300 ring-1 ring-fuchsia-500/20">
            Available Surveys
          </div>
        </div>

        {!isLoggedIn ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm text-center">
            Please sign in to launch the CPX Research wall.
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
             <div className="w-10 h-10 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-slate-500">Searching for surveys matching your profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : surveys.length > 0 ? (
          /* Survey Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <div 
                key={survey.id} 
                className="group relative bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 hover:border-fuchsia-500 dark:hover:border-fuchsia-500 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400">
                    {survey.loi} Mins
                  </div>
                  <div className="text-fuchsia-600 dark:text-fuchsia-400 font-bold">
                    ${survey.payout_publisher_usd}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                   Earn {survey.payout} Points
                </h3>

                {/* ✅ লিঙ্কের বদলে বাটন ব্যবহার করে handleSurveyClick কল করা হচ্ছে */}
                <button
                  onClick={() => handleSurveyClick(survey.href)}
                  className="w-full inline-flex items-center justify-center bg-slate-900 dark:bg-fuchsia-600 text-white py-3 rounded-xl font-bold hover:bg-fuchsia-700 transition-colors shadow-lg"
                >
                  Start Survey
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500">Currently no surveys available. Please check back later!</p>
            <button onClick={fetchSurveys} className="mt-4 text-fuchsia-500 font-semibold underline">Refresh</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CPXResearchPage;
