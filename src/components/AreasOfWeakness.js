import React from "react";

const AREA_META = {
  numLocations: {
    label: "Locations of Interest",
    description: "Too many locations could be a risk for privacy.",
    icon: "📍",
  },
  numAdvertisers: {
    label: "Advertisers Targeting You",
    description: "A large number of advertisers may indicate broad data sharing.",
    icon: "🧭",
  },
  hasPhoneConfirmed: {
    label: "Phone Linked",
    description: "Having a confirmed phone number can increase account discoverability.",
    icon: "📱",
  },
  locationalDataTrue: {
    label: "Location Sharing",
    description: "Sharing location with friends may expose your whereabouts.",
    icon: "📡",
  },
};

export default function AreasOfWeakness({ areas }) {
  if (!areas || typeof areas !== "object") return null;

  const items = Object.keys(AREA_META)
    .filter((k) => k in areas)
    .map((key) => ({ key, flagged: Number(areas[key]) === 1, ...AREA_META[key] }));

  return (
    <div className="weakness-card glass rounded-2xl shadow-card">
      <div className="weakness-header">
        <span className="weakness-header-icon" aria-hidden>
          ⚠️
        </span>
        <h3 className="weakness-title">Areas of Weakness</h3>
      </div>

      <p className="weakness-subtitle">
        We found potential areas that may affect your privacy and security.
      </p>

      <div className="weakness-grid">
        {items.map(({ key, label, description, icon, flagged }) => (
          <div key={key} className={`weakness-item ${flagged ? "is-flagged" : "is-ok"}`}>
            <div className={`status-pill ${flagged ? "status-danger" : "status-ok"}`}>
              {flagged ? "Flagged" : "OK"}
            </div>
            <div className="weakness-row">
              <div className={`weakness-icon ${flagged ? "danger" : "ok"}`} aria-hidden>
                <span>{icon}</span>
              </div>
              <div className="weakness-content">
                <div className="weakness-name">{label}</div>
                <div className="weakness-desc">{description}</div>
                <div className="weakness-bar">
                  <div className={`weakness-bar-fill ${flagged ? "danger" : "ok"}`} style={{ width: "100%" }} />
                </div>
                {flagged && (
                  <div className="weakness-note">This area may need your attention.</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
