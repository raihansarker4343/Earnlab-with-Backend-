import React, { useEffect } from "react";

const CPXResearchPage: React.FC = () => {

  useEffect(() => {
    // ---- STEP 2: CONFIG ----
    const configScript = document.createElement("script");
    configScript.innerHTML = `
      const script1 = {
        div_id: "fullscreen",
        theme_style: 1,
        order_by: 2,
        limit_surveys: 7
      };

      const config = {
        general_config: {
          app_id: YOUR_APP_ID,
          ext_user_id: "YOUR_USER_ID_OR_STATE",
        },
        style_config: {
          text_color: "#2b2b2b",
          survey_box: {
            topbar_background_color: "#ffaf20",
            box_background_color: "white",
            rounded_borders: true,
            stars_filled: "black",
          },
        },
        script_config: [script1],
        debug: false,
        useIFrame: true
      };

      window.config = config;
    `;
    document.body.appendChild(configScript);

    // ---- STEP 1: LOAD CPX LIBRARY ----
    const cpxScript = document.createElement("script");
    cpxScript.src = "https://cdn.cpx-research.com/assets/js/script_tag_v2.0.js";
    cpxScript.async = true;
    document.body.appendChild(cpxScript);

    return () => {
      // Cleanup on page exit (optional)
      document.body.removeChild(configScript);
      document.body.removeChild(cpxScript);
    };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CPX Research</h1>

      {/* ---- STEP 3: TARGET DIV ---- */}
      <div
        id="fullscreen"
        style={{
          maxWidth: "950px",
          margin: "auto",
          width: "100%",
          minHeight: "600px"
        }}
      />
    </div>
  );
};

export default CPXResearchPage;
