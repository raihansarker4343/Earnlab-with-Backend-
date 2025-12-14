import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import { OFFER_WALLS } from '../../../constants';

const TimeWallPage: React.FC = () => {
  const provider = OFFER_WALLS.find((p) => p.name === 'Time Wall');
  const { user, isLoggedIn } = useContext(AppContext);

  const iframeSrc = useMemo(() => {
    if (!isLoggedIn || !user) return '';
    // existing site page
    const base = `${window.location.origin}/timewall`;
    return `${base}?userID=${encodeURIComponent(String(user.id))}`;
  }, [isLoggedIn, user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {provider && (
          <img
            src={provider.logo}
            alt={`${provider.name} logo`}
            className="h-10 object-contain bg-slate-200 dark:bg-slate-800 p-1 rounded-md"
          />
        )}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Time Wall</h1>
      </div>

      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)]">
        {!isLoggedIn && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
            Please sign in to launch the TimeWall.
          </div>
        )}

        {isLoggedIn && (
          <div className="rounded-2xl bg-gradient-to-br from-white via-slate-50 to-sky-50 dark:from-slate-900 dark:via-slate-900/70 dark:to-sky-950/60 p-3 border border-white/70 dark:border-slate-800 shadow-inner">
            <div className="relative rounded-xl bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm border border-sky-100/60 dark:border-sky-500/10">
              <iframe
                title="TimeWall"
                src={iframeSrc}
                className="w-full min-h-[640px] rounded-xl"
                style={{ border: 0 }}
                allow="clipboard-write; fullscreen"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeWallPage;
