import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Link } from 'react-router-dom';

interface PageAnalytics {
  path: string;
  total_sessions: number;
  bounced_sessions: number;
  bounce_rate_percentage: number;
  avg_duration_seconds: number;
}

interface ContentAnalytics {
  content_id: string;
  total_impressions: number;
  engaged_15s_users: number;
  engaged_30s_users: number;
  engaged_60s_users: number;
  conversion_to_15s_pct: number; 
  conversion_to_30s_pct: number;
  conversion_to_60s_pct: number;
  bounce_rate_impression: number; 
  bounce_rate_engaged: number; 
}

const AnalyticsDashboard = () => {
  const [pageStats, setPageStats] = useState<PageAnalytics[]>([]);
  const [contentStats, setContentStats] = useState<ContentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch Page Stats
      const { data: pData, error: pError } = await (supabase
        .from('view_bounce_rate_analytics' as any) as any)
        .select('*');
      
      if (pError) throw pError;
      setPageStats((pData as any) || []);

      // Fetch Content Impact Stats
      const { data: cData, error: cError } = await (supabase
        .from('view_content_bounce_impact' as any) as any)
        .select('*');
      
      if (cError) throw cError;
      setContentStats((cData as any) || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = () => {
    const date = new Date().toLocaleDateString();
    const totalSessions = pageStats.reduce((acc, curr) => acc + curr.total_sessions, 0);

    let summary = `*** ANALYTICS REPORT FOR AI ADVISOR (${date}) ***\n\n`;
    summary += `TYPE: BounceRate Mastery Report\n`;
    summary += `GOAL: Analyze user engagement and identify content that kills or boosts conversions.\n\n`;
    
    summary += `=== SITE OVERVIEW ===\n`;
    summary += `- Total Sessions Tracked: ${totalSessions}\n\n`;

    summary += `=== PAGE PERFORMANCE (Traffic vs Retention) ===\n`;
    pageStats.forEach(p => {
      summary += `PAGE: ${p.path}\n`;
      summary += `  - Traffic: ${p.total_sessions} sessions\n`;
      summary += `  - Avg Time on Page: ${Math.round(p.avg_duration_seconds)}s\n`;
    });
    summary += `\n`;

    summary += `=== CONTENT MASTERY (Deep Engagement Analysis) ===\n`;
    summary += `(Metric Explanation: '15s Conversion' = % of people who stopped to watch. 'Engaged Bounce Rate' = % of people who watched 15s+ BUT still left without buying.)\n\n`;
    
    contentStats.forEach(c => {
      summary += `CONTENT ID: "${c.content_id}"\n`;
      summary += `  - Reach: Saw by ${c.total_impressions} people.\n`;
      summary += `  - Hook Quality: ${c.conversion_to_15s_pct}% watched at least 15s. `;
      if (c.conversion_to_15s_pct < 10) summary += `(WEAK HOOK - Fix thumbnail/headline)\n`;
      else if (c.conversion_to_15s_pct > 40) summary += `(STRONG HOOK)\n`;
      else summary += `(Average Hook)\n`;

      summary += `  - Deep Engagement: ${c.conversion_to_60s_pct}% watched 60s+ (Gold Users).\n`;
      
      summary += `  - Retention Impact: \n`;
      summary += `    * General Bounce Rate: ${c.bounce_rate_impression}%.\n`;
      summary += `    * Engaged Bounce Rate: ${c.bounce_rate_engaged}% (People who watched 15s+ then left).\n`;
      
      if (c.conversion_to_60s_pct > 20) summary += `  - VERDICT: 💎 DIAMOND ASSET. Highly engaging. Clone this style.\n`;
      else if (c.bounce_rate_engaged > 60) summary += `  - VERDICT: ⚠️ SALES LEAK. Users watch but don't buy. Improve the Call to Action (CTA) or offer.\n`;
      else if (c.conversion_to_15s_pct < 10) summary += `  - VERDICT: 💤 BORING. Users scroll past immediately. Make it pop.\n`;
      else summary += `  - VERDICT: PERFORMING NORMALLY.\n`;
      summary += `\n`;
    });

    return summary;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateAISummary());
    alert("Report copied! Paste this to your AI Advisor.");
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', padding: '20px' }}>Maaf Pendaftaran Tutup</div>
      <div style={{ fontFamily: "'Inter', sans-serif", padding: '20px', maxWidth: '1000px', margin: '40px auto', color: '#1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2em', margin: 0 }}>eL Vision Analytics Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={copyToClipboard}
            style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📋 Copy Report for AI
          </button>
          <button 
            onClick={fetchAnalytics}
            style={{ padding: '10px 20px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Refresh Data
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading analytics...</div>
      ) : (
        <>
          {/* AI Summary Preview (Collapsed) */}
          <details style={{ marginBottom: '30px', backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <summary style={{ cursor: 'pointer', color: '#0369a1', fontWeight: 'bold' }}>View AI Report Preview</summary>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '15px', fontSize: '0.85em', color: '#334155', maxHeight: '300px', overflowY: 'auto' }}>
              {generateAISummary()}
            </pre>
          </details>

          {/* Page Performance Section */}
          <section style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '1.5em', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Page Performance</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Path</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Total Sessions</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Avg. Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {pageStats.map((stat, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px' }}>{stat.path}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>{stat.total_sessions}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>{Math.round(stat.avg_duration_seconds)}s</td>
                    </tr>
                  ))}
                  {pageStats.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>No data available yet</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          {/* Content Impact Section */}
          <section>
            <h2 style={{ fontSize: '1.5em', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Content Bounce Mastery (Impact Analysis)</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              <strong>Bounce Rate (Saw):</strong> % of users who left after just seeing this content.<br/>
              <strong>Bounce Rate (Engaged 15s):</strong> % of users who left even after watching for 15s+.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Content ID</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Views</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>15s+</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>30s+</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>60s+</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Bounce (Saw)</th>
                    <th style={{ textAlign: 'center', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Bounce (15s+)</th>
                    <th style={{ textAlign: 'left', padding: '15px', borderBottom: '1px solid #e2e8f0' }}>Insight</th>
                  </tr>
                </thead>
                <tbody>
                  {contentStats.map((stat, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px', fontWeight: '500' }}>{stat.content_id}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>{stat.total_impressions}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {stat.engaged_15s_users} <span style={{fontSize: '0.8em', color: '#64748b'}}>({stat.conversion_to_15s_pct}%)</span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {stat.engaged_30s_users} <span style={{fontSize: '0.8em', color: '#64748b'}}>({stat.conversion_to_30s_pct}%)</span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {stat.engaged_60s_users} <span style={{fontSize: '0.8em', color: '#64748b'}}>({stat.conversion_to_60s_pct}%)</span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', color: stat.bounce_rate_impression > 50 ? '#ef4444' : '#64748b' }}>
                        {stat.bounce_rate_impression}%
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: stat.bounce_rate_engaged > 40 ? '#ef4444' : '#22c55e' }}>
                        {stat.bounce_rate_engaged || '-'}%
                      </td>
                      <td style={{ padding: '15px', fontSize: '0.9em' }}>
                        {stat.conversion_to_60s_pct > 20 ? '💎 Gold Content' : 
                         stat.conversion_to_15s_pct > 50 && stat.bounce_rate_engaged < 30 ? '🔥 Winning' : 
                         stat.conversion_to_15s_pct < 10 ? '💤 Skipped' : 'Neutral'}
                      </td>
                    </tr>
                  ))}
                  {contentStats.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>No content impressions tracked yet</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>← Back to Home</Link>
      </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
