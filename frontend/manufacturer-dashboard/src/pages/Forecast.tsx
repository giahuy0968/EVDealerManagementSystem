export default function Forecast() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔮 AI Forecast</h1>
        <p>Artificial Intelligence powered demand forecasting and market insights</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔮</div>
          <div className="stat-content">
            <h3>Q4 Prediction</h3>
            <p className="stat-number">3,250</p>
            <span className="stat-change positive">units demand</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Accuracy</h3>
            <p className="stat-number">94.2%</p>
            <span className="stat-change positive">model accuracy</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Recommended</h3>
            <p className="stat-number">2,800</p>
            <span className="stat-change neutral">production target</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>🤖 AI Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>Demand Forecast</h4>
              <p>Expected 15% increase in Model Y demand for Q4 2024</p>
              <span className="confidence">Confidence: 92%</span>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Production Recommendation</h4>
              <p>Increase Model 3 production by 8% to meet seasonal demand</p>
              <span className="confidence">Confidence: 89%</span>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🌍</div>
            <div className="insight-content">
              <h4>Regional Trends</h4>
              <p>California market showing 20% growth potential</p>
              <span className="confidence">Confidence: 85%</span>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">⚠️</div>
            <div className="insight-content">
              <h4>Risk Alert</h4>
              <p>Potential supply chain disruption in Q1 2025</p>
              <span className="confidence">Confidence: 76%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>📈 Forecast Charts</h2>
        <div className="chart-placeholder">
          <p>🤖 AI-powered forecast charts will be displayed here</p>
          <p>Including demand prediction, market trends, and optimization recommendations</p>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>🎛️ Model Configuration</h2>
          <button className="btn-primary">⚙️ Retrain Model</button>
        </div>
        
        <div className="model-config">
          <div className="config-item">
            <label>Forecast Period:</label>
            <select>
              <option>3 months</option>
              <option>6 months</option>
              <option>12 months</option>
            </select>
          </div>
          
          <div className="config-item">
            <label>Data Sources:</label>
            <div className="checkbox-group">
              <label><input type="checkbox" checked /> Sales History</label>
              <label><input type="checkbox" checked /> Market Trends</label>
              <label><input type="checkbox" checked /> Economic Indicators</label>
              <label><input type="checkbox" /> Weather Data</label>
            </div>
          </div>
          
          <div className="config-item">
            <label>Model Type:</label>
            <select>
              <option>LSTM Neural Network</option>
              <option>Random Forest</option>
              <option>Linear Regression</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}