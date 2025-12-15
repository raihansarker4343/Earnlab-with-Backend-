import React, { useContext, useMemo } from "react";
import { AppContext } from "../../../App";

const TIMEWALL_OID = "03239923cee7dd3d";

const TimeWallPage: React.FC = () => {
  const { user, isLoggedIn } = useContext(AppContext);

  const iframeSrc = useMemo(() => {
    if (!isLoggedIn || !user?.id) return "";
    return `https://timewall.io/users/login?oid=${TIMEWALL_OID}&uid=${encodeURIComponent(
      String(user.id)
    )}`;
  }, [isLoggedIn, user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">TimeWall</h1>

      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        {!isLoggedIn ? (
          <div className="text-slate-600 dark:text-slate-300">
            Please sign in to view TimeWall.
          </div>
        ) : (
          <iframe
            title="TimeWall"
            src={iframeSrc}
            width="100%"
            height="1000"
            scrolling="auto"
            style={{ border: 0 }}
            className="rounded-xl"
            allow="clipboard-write; fullscreen"
          />
        )}
      </div>
    </div>
  );
};

export default TimeWallPage;
