import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * AiPrivacyAdvice
 * - Displays AI-generated privacy advice as nicely formatted Markdown.
 * - Sections: Advertisers, Live Location, Phone Number, General Privacy Tips
 * - Props:
 *    - message?: string (raw AI assistant summary markdown/text)
 *    - metrics?: { advertisers?: any[]; locationalDataTrue?: number; hasPhoneConfirmed?: number; }
 *    - fetchUrl?: string (optional URL to fetch the message from if not provided via props)
 */
export default function AiPrivacyAdvice({ message: messageProp, metrics = {}, fetchUrl }) {
  const [message, setMessage] = useState(messageProp || '');
  const [loading, setLoading] = useState(!messageProp && !!fetchUrl);
  const [error, setError] = useState(null);
  const aiOptIn = metrics?.aiOptIn === true;

  useEffect(() => {
    if (!messageProp && fetchUrl && aiOptIn) {
      let aborted = false;
      setLoading(true);
      fetch(fetchUrl)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          const data = await res.json();
          // Try common shapes: {message}, {output_text}, {assistant, text}, {aggregated: {aiMessage}}
          const maybe = data?.message || data?.output_text || data?.assistant || data?.aggregated?.aiMessage;
          if (!aborted) setMessage(typeof maybe === 'string' ? maybe : JSON.stringify(data, null, 2));
        })
        .catch((e) => !aborted && setError(e.message))
        .finally(() => !aborted && setLoading(false));
      return () => {
        aborted = true;
      };
    }
  }, [messageProp, fetchUrl, aiOptIn]);

  useEffect(() => {
    if (messageProp) setMessage(messageProp);
  }, [messageProp]);

  // Derive statuses from metrics or message text
  const derived = useMemo(() => {
    const advertisersCount = Array.isArray(metrics?.advertisers) ? metrics.advertisers.length : undefined;

    // Live location: prefer metrics; else try to parse from text
    let liveLocationFlag = typeof metrics?.locationalDataTrue === 'number' ? metrics.locationalDataTrue : undefined;
    if (liveLocationFlag === undefined && message) {
      const enabled = /live location\s*:\s*enabled\s*\(\s*1\s*\)/i.test(message);
      const disabled = /live location\s*:\s*disabled\s*\(\s*0\s*\)/i.test(message);
      if (enabled) liveLocationFlag = 1; else if (disabled) liveLocationFlag = 0;
    }

    // Phone confirmed: prefer metrics; else parse
    let phoneConfirmed = typeof metrics?.hasPhoneConfirmed === 'number' ? metrics.hasPhoneConfirmed : undefined;
    if (phoneConfirmed === undefined && message) {
      const confirmed = /phone number\s*:\s*confirmed\s*\(\s*1\s*\)/i.test(message);
      const notConfirmed = /phone number\s*:\s*not\s*confirmed\s*\(\s*0\s*\)/i.test(message);
      if (confirmed) phoneConfirmed = 1; else if (notConfirmed) phoneConfirmed = 0;
    }

    // Risk levels
    const advertisersRisk = typeof advertisersCount === 'number'
      ? advertisersCount > 2000 ? 'danger' : advertisersCount > 1500 ? 'warning' : 'ok'
      : 'unknown';

    const liveLocationRisk = liveLocationFlag === 1 ? 'danger' : liveLocationFlag === 0 ? 'ok' : 'unknown';

    const phoneRisk = phoneConfirmed === 1 ? 'warning' : phoneConfirmed === 0 ? 'ok' : 'unknown';

    return { advertisersCount, liveLocationFlag, phoneConfirmed, advertisersRisk, liveLocationRisk, phoneRisk };
  }, [metrics, message]);

  // Split helper: extract a section by heading keyword
  const extractSection = (src, titleRegex) => {
    if (!src) return '';
    // Try to capture from a markdown heading to next heading
    const pattern = new RegExp(`(^|\n)\s{0,3}#{1,6}.*${titleRegex}.*(?:\n|\r\n)([\s\S]*?)(?=\n\s{0,3}#{1,6}\s|$)`, 'i');
    const m = src.match(pattern);
    return m ? m[0] : '';
  };

  const advertisersSection = useMemo(() => extractSection(message, '(Advertisers|Advertisers with User Data)'), [message]);
  const liveLocationSection = useMemo(() => extractSection(message, '(Live Location|Live Location Sharing)'), [message]);
  const phoneSection = useMemo(() => extractSection(message, '(Phone Number|Phone Number Confirmation)'), [message]);
  const tipsSection = useMemo(() => extractSection(message, '(General Privacy Tips|Privacy Tips|Tips)'), [message]);

  // Fallback snippets if AI message lacks headings
  const fallback = {
    advertisers: derived.advertisersCount != null
      ? `### Advertisers\n- Advertisers with your data: ${derived.advertisersCount}`
      : '',
    liveLocation: derived.liveLocationFlag != null
      ? `### Live Location Sharing\n- Live Location: ${derived.liveLocationFlag === 1 ? 'Enabled (1)' : 'Disabled (0)'}`
      : '',
    phone: derived.phoneConfirmed != null
      ? `### Phone Number Confirmation\n- Phone Number: ${derived.phoneConfirmed === 1 ? 'Confirmed (1)' : 'Not Confirmed (0)'}`
      : '',
    tips: `### General Privacy Tips\n- Review Privacy Settings\n- Check App Permissions\n- Be Mindful of Sharing`,
  };

  const Section = ({ title, icon, badge, content }) => (
    <section className="aiad-section" aria-labelledby={`aiad-${title.replace(/\s+/g, '-').toLowerCase()}-title`}>
      <div className="aiad-section-header">
        <div className="aiad-icon" aria-hidden>{icon}</div>
        <h3 id={`aiad-${title.replace(/\s+/g, '-').toLowerCase()}-title`} className="aiad-section-title">{title}</h3>
        {badge}
      </div>
      <div className="aiad-section-content md-content">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  );

  const Badge = ({ level, text }) => {
    const cls = level === 'danger' ? 'badge badge-danger' : level === 'warning' ? 'badge badge-warning' : level === 'ok' ? 'badge badge-ok' : 'badge';
    return <span className={cls} role="status" aria-live="polite">{text}</span>;
  };
  
  // User did not opt in to AI – don't render any AI advice UI at all
  if (!aiOptIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="aiad-card glass shadow-card rounded-2xl" role="status" aria-busy="true">
        <div className="aiad-header">
          <h2 className="aiad-title">Privacy Advice</h2>
          <p className="aiad-subtitle">AI privacy analyst summary</p>
        </div>
        <div className="aiad-loading">Loading advice…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aiad-card glass shadow-card rounded-2xl" role="alert">
        <div className="aiad-header">
          <h2 className="aiad-title">Privacy Advice</h2>
          <p className="aiad-subtitle">AI privacy analyst summary</p>
        </div>
        <div className="aiad-error">{error}</div>
      </div>
    );
  }

  const advertisersBadgeText =
    derived.advertisersRisk === 'danger' ? 'High risk' : derived.advertisersRisk === 'warning' ? 'Caution' : derived.advertisersRisk === 'ok' ? 'Good' : 'Unknown';
  const liveLocBadgeText = derived.liveLocationRisk === 'danger' ? 'Enabled' : derived.liveLocationRisk === 'ok' ? 'Disabled' : 'Unknown';
  const phoneBadgeText = derived.phoneRisk === 'danger' ? 'High risk' : derived.phoneRisk === 'warning' ? 'Confirmed' : derived.phoneRisk === 'ok' ? 'Not Confirmed' : 'Unknown';

  return (
    <div className="aiad-card glass shadow-card rounded-2xl" aria-labelledby="aiad-title" aria-describedby="aiad-subtitle">
      <div className="aiad-header">
        <div>
          <h2 id="aiad-title" className="aiad-title">Privacy Advice</h2>
          <p id="aiad-subtitle" className="aiad-subtitle">
            {aiOptIn ? "AI privacy analyst summary" : "Privacy hints based on your data (AI disabled)"}
          </p>
        </div>
      </div>

      <div className="aiad-grid">
        <Section
          title="Advertisers"
          icon={<span aria-hidden>🧲</span>}
          badge={<Badge level={derived.advertisersRisk} text={advertisersBadgeText} />}
          content={advertisersSection || fallback.advertisers}
        />

        <Section
          title="Live Location"
          icon={<span aria-hidden>📍</span>}
          badge={<Badge level={derived.liveLocationRisk} text={liveLocBadgeText} />}
          content={liveLocationSection || fallback.liveLocation}
        />

        <Section
          title="Phone Number"
          icon={<span aria-hidden>📱</span>}
          badge={<Badge level={derived.phoneRisk} text={phoneBadgeText} />}
          content={phoneSection || fallback.phone}
        />

        <Section
          title="General Privacy Tips"
          icon={<span aria-hidden>🛡️</span>}
          badge={null}
          content={tipsSection || fallback.tips}
        />
      </div>

      {aiOptIn && message && (
        <details className="aiad-raw">
          <summary>View full AI message</summary>
          <div className="md-content aiad-raw-content">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        </details>
      )}

    </div>
  );
}
