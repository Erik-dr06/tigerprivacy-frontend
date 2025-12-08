import { ComposedChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Brush } from 'recharts';

const normalizeToMs = (ts) => (ts && ts > 1e12 ? ts : ts * 1000);

const buildAggregatedSeries = (timestamps = []) => {
  const msList = (Array.isArray(timestamps) ? timestamps : [])
    .filter((t) => typeof t === 'number' && Number.isFinite(t))
    .map(normalizeToMs);

  const dailyCountsMap = new Map();
  msList.forEach((ms) => {
    const key = new Date(ms).toLocaleDateString('en-GB');
    dailyCountsMap.set(key, (dailyCountsMap.get(key) || 0) + 1);
  });

  const sortedDates = Array.from(dailyCountsMap.keys()).sort((a, b) => {
    const [da, ma, ya] = a.split('/').map(Number);
    const [db, mb, yb] = b.split('/').map(Number);
    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
  });

  let running = 0;
  const series = sortedDates.map((date) => {
    const daily = dailyCountsMap.get(date) || 0;
    running += daily;
    return { date, dailyGains: daily, cumulativeFollowers: running };
  });

  return series;
};

const FollowersChart = ({ followerGainTimestamps = [] }) => {
  const data = buildAggregatedSeries(followerGainTimestamps);

  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      margin: 0,
      background: 'var(--card, #fff)',
      borderRadius: 12,
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      padding: 16,
    }}>
      <h3 className="line-chart-title">Followers Over Time</h3>
      <ComposedChart
        style={{ width: '100%', aspectRatio: 1.618 }}
        data={data}
        margin={{ top: 5, right: 30, bottom: 25, left: 10 }}
      >
        <CartesianGrid stroke="#aaa" strokeDasharray="6 6" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} label={{ value: 'Cumulative', position: 'insideLeft', angle: -90 }} />
        <Tooltip contentStyle={{ background: 'var(--tooptip-bg)', color: 'var(--tooptip-text)' }} />
        <Legend align="right" />
        <Line
          type="stepAfter"
          dataKey="cumulativeFollowers"
          stroke="var(--chart-color)"
          strokeWidth={1}
          name="Cumulative Followers"
          dot={false}
        />
        <Brush dataKey="date" height={18} travellerWidth={8} />
      </ComposedChart>
    </div>
  );
};

export default FollowersChart;
