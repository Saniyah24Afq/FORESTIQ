import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, BarChart3, Camera, ChevronDown, Download, Leaf,
  MapPinned, Satellite, TreePine, TrendingDown, TrendingUp, Waves
} from "lucide-react";
import "./Analytics.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const coverage = [71, 72.5, 73.8, 74.9, 75.8, 76.7, 77.6, 78.4];
const loss = [4.2, 3.9, 4.6, 3.5, 2.9, 3.2, 2.4, 2.1];

export default function Analytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Last 8 months");

  const maxCoverage = useMemo(() => Math.max(...coverage), []);
  const maxLoss = useMemo(() => Math.max(...loss), []);

  const exportAnalytics = () => {
    const text = [
      "FORESTIQ ANALYTICS REPORT",
      "Forest coverage trend: 78.4%",
      "Deforested area this period: 12.7 ha",
      "Images analyzed: 10,248",
      "Sources: Satellite 57%, Drone 29%, Ground Camera 14%",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "forestiq-analytics-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-page">
      <header className="analytics-topbar">
        <button className="analytics-back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={17} /> Dashboard
        </button>
        <div className="analytics-title">
          <span>FOREST INTELLIGENCE</span>
          <h1>Analytics</h1>
          <p>Track forest-cover trends, imagery sources and monitored change.</p>
        </div>
        <div className="analytics-actions">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Last 8 months</option>
            <option>Last 30 days</option>
            <option>Year to date</option>
          </select>
          <button onClick={exportAnalytics}><Download size={16} /> Export</button>
        </div>
      </header>

      <main className="analytics-content">
        <section className="analytics-kpis">
          <div className="analytics-kpi green">
            <div><Leaf size={20}/></div>
            <span>FOREST COVERAGE</span>
            <strong>78.4%</strong>
            <small><TrendingUp size={13}/> +2.4% from previous period</small>
          </div>
          <div className="analytics-kpi red">
            <div><TrendingDown size={20}/></div>
            <span>DEFORESTED AREA</span>
            <strong>12.7 ha</strong>
            <small>−1.8% detected change</small>
          </div>
          <div className="analytics-kpi blue">
            <div><BarChart3 size={20}/></div>
            <span>IMAGES ANALYZED</span>
            <strong>10,248</strong>
            <small>Across 3 imagery sources</small>
          </div>
          <div className="analytics-kpi orange">
            <div><MapPinned size={20}/></div>
            <span>MONITORED REGIONS</span>
            <strong>36</strong>
            <small>8 currently need attention</small>
          </div>
        </section>

        <section className="analytics-grid">
          <article className="analytics-card wide">
            <div className="card-heading">
              <div><span>FOREST COVER</span><h2>Coverage trend</h2></div>
              <div className="card-badge"><TrendingUp size={14}/> +2.4%</div>
            </div>
            <div className="line-chart">
              <div className="chart-y"><span>80%</span><span>75%</span><span>70%</span><span>65%</span></div>
              <div className="chart-area">
                <div className="chart-grid-lines"><i/><i/><i/><i/></div>
                <div className="coverage-line">
                  {coverage.map((v, i) => (
                    <span key={months[i]} style={{ left: `${i * (100 / (coverage.length - 1))}%`, bottom: `${((v - 65) / 15) * 100}%` }} title={`${months[i]}: ${v}%`}/>
                  ))}
                </div>
                <div className="coverage-fill" style={{ clipPath: `polygon(0 53%, 14% 50%, 28% 43%, 42% 34%, 57% 28%, 71% 22%, 86% 14%, 100% 8%, 100% 100%, 0 100%)` }}/>
                <div className="chart-labels">{months.map(m => <span key={m}>{m}</span>)}</div>
              </div>
            </div>
          </article>

          <article className="analytics-card">
            <div className="card-heading">
              <div><span>IMAGERY SOURCES</span><h2>Distribution</h2></div>
            </div>
            <div className="source-donut"><div><strong>10.2K</strong><small>images</small></div></div>
            <div className="source-list">
              <p><i className="dot satellite"/><span>Satellite</span><b>57%</b></p>
              <p><i className="dot drone"/><span>Drone</span><b>29%</b></p>
              <p><i className="dot camera"/><span>Ground Camera</span><b>14%</b></p>
            </div>
          </article>

          <article className="analytics-card wide">
            <div className="card-heading">
              <div><span>CHANGE DETECTION</span><h2>Monthly detected loss</h2></div>
              <span className="muted-label">hectares</span>
            </div>
            <div className="bar-chart">
              {loss.map((v, i) => (
                <div className="bar-column" key={months[i]}>
                  <div className="bar-value">{v}</div>
                  <div className="bar-track"><div className="bar-fill" style={{height: `${(v / maxLoss) * 100}%`}}/></div>
                  <span>{months[i]}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="analytics-card">
            <div className="card-heading"><div><span>MODEL PERFORMANCE</span><h2>Evaluation snapshot</h2></div></div>
            <div className="metric-row"><span>Accuracy</span><b>—</b></div>
            <div className="metric-row"><span>Precision</span><b>—</b></div>
            <div className="metric-row"><span>Recall</span><b>—</b></div>
            <div className="metric-row"><span>F1 Score</span><b>—</b></div>
            <div className="model-note">Experimental values will appear here after the trained model evaluation is completed.</div>
          </article>
        </section>

        <section className="analytics-bottom">
          <div><Satellite size={17}/> Satellite analysis</div>
          <div><Waves size={17}/> Drone monitoring</div>
          <div><Camera size={17}/> Ground validation</div>
          <div><TreePine size={17}/> Forest detection</div>
        </section>
      </main>
    </div>
  );
}
