import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../../App';
import { SURVEY_PROVIDERS } from '../../../constants';

declare global {
    interface Window {
        config?: unknown;
    }
}

const CPX_SCRIPT_SRC = 'https://cdn.cpx-research.com/assets/js/script_tag_v2.0.js';
const CPX_CONFIG_ID = 'cpx-config-script';
const CPX_LIBRARY_ID = 'cpx-library-script';

const CPXResearchPage: React.FC = () => {
    const provider = SURVEY_PROVIDERS.find(p => p.name === 'CPX Research');
    const { user, isLoggedIn } = useContext(AppContext);
    const [statusMessage, setStatusMessage] = useState<string>('');

    const appId = import.meta.env.VITE_CPX_APP_ID;
    const secureHash = import.meta.env.VITE_CPX_SECURE_HASH || '';

    useEffect(() => {
        if (!isLoggedIn) {
            setStatusMessage('');
            return;
        }

        if (!user) {
            setStatusMessage('');
            return;
        }

        const parsedAppId = Number(appId);
        if (!appId || Number.isNaN(parsedAppId)) {
            setStatusMessage('CPX Research is not configured. Please add VITE_CPX_APP_ID to your environment.');
            return;
        }

        setStatusMessage('');
    }, [appId, isLoggedIn, user]);

    const cpxConfig = useMemo(() => {
        if (!isLoggedIn || !user) {
            return null;
        }

        const parsedAppId = Number(appId);
        if (!appId || Number.isNaN(parsedAppId)) {
            return null;
        }

        const script1 = {
            div_id: 'fullscreen',
            theme_style: 1,
            order_by: 2,
            limit_surveys: 12,
        };

        const general_config = {
            app_id: parsedAppId,
            ext_user_id: String(user.id),
            email: user.email || '',
            username: user.username || '',
            secure_hash: secureHash,
            subid_1: 'web',
            subid_2: '',
        };

        const style_config = {
            text_color: '#0f172a',
            survey_box: {
                topbar_background_color: '#a855f7',
                box_background_color: 'white',
                rounded_borders: true,
                stars_filled: '#0f172a',
            },
        };

        const baseConfig = {
            general_config,
            style_config,
            script_config: [script1],
            debug: false,
            useIFrame: true,
            iFramePosition: 1,
        };

        return baseConfig;
    }, [appId, isLoggedIn, secureHash, user]);

    useEffect(() => {
        if (!cpxConfig) {
            return undefined;
        }

        const configScript = document.getElementById(CPX_CONFIG_ID);
        if (configScript) {
            configScript.remove();
        }

        const scriptEl = document.createElement('script');
        scriptEl.id = CPX_CONFIG_ID;
        scriptEl.type = 'text/javascript';
        scriptEl.innerHTML = `
          const script1 = ${JSON.stringify(cpxConfig.script_config[0])};
          const config = ${JSON.stringify({
              ...cpxConfig,
              script_config: ['__placeholder__'],
          })};
          config.script_config = [script1];
          config.functions = {
            no_surveys_available: function () { console.log('CPX: no surveys available'); },
            count_new_surveys: function (countsurveys) { console.log('CPX: surveys available', countsurveys); },
            get_all_surveys: function (surveys) { console.log('CPX: surveys payload', surveys); },
            get_transaction: function (transactions) { console.log('CPX: transactions', transactions); }
          };
          window.config = config;
        `;
        document.body.appendChild(scriptEl);

        let libraryScript = document.getElementById(CPX_LIBRARY_ID) as HTMLScriptElement | null;
        if (!libraryScript) {
            libraryScript = document.createElement('script');
            libraryScript.id = CPX_LIBRARY_ID;
            libraryScript.src = CPX_SCRIPT_SRC;
            libraryScript.type = 'text/javascript';
            libraryScript.async = true;
            document.body.appendChild(libraryScript);
        }

        return () => {
            scriptEl.remove();
        };
    }, [cpxConfig]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                {provider && <img src={provider.logo} alt={`${provider.name} logo`} className="h-10 object-contain bg-slate-200 dark:bg-slate-800 p-1 rounded-md" />}
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">CPX Research</h1>
            </div>

            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-sky-500/10 text-sm font-semibold text-fuchsia-600 dark:text-fuchsia-300 ring-1 ring-fuchsia-500/20">
                            Live CPX offerwall
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">Complete CPX surveys and tasks to earn credited via the CPX postback.</p>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Uses app ID from <code className="font-mono">VITE_CPX_APP_ID</code>
                    </div>
                </div>

                {!isLoggedIn && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
                        Please sign in to launch the CPX Research wall.
                    </div>
                )}

                {isLoggedIn && statusMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 text-red-900 px-4 py-3 text-sm">
                        {statusMessage}
                    </div>
                )}

                {isLoggedIn && !statusMessage && (
                    <div className="rounded-2xl bg-gradient-to-br from-white via-slate-50 to-fuchsia-50 dark:from-slate-900 dark:via-slate-900/70 dark:to-purple-950/60 p-3 border border-white/70 dark:border-slate-800 shadow-inner">
                        <div className="relative rounded-xl bg-white/60 dark:bg-slate-900/70 backdrop-blur-sm border border-fuchsia-100/60 dark:border-fuchsia-500/10 shadow-[0_12px_60px_-28px_rgba(168,85,247,0.5)]">
                            <div style={{ maxWidth: 950, margin: 'auto' }} id="fullscreen" className="min-h-[540px]" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CPXResearchPage;
