export default function Pricing() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💰 Pricing & Promotions</h1>
        <p>Manage pricing policies, discounts, and promotional campaigns</p>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Current Pricing Policies</h2>
          <button className="btn-primary">➕ Create New Policy</button>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>🚗 Model 3 - Standard</h3>
            <div className="price-info">
              <p className="base-price">Base Price: $45,000</p>
              <p className="dealer-price">Dealer Price: $42,000</p>
              <p className="margin">Margin: 6.7%</p>
            </div>
            <div className="price-actions">
              <button className="btn-secondary">✏️ Edit</button>
              <button className="btn-secondary">📊 History</button>
            </div>
          </div>

          <div className="pricing-card">
            <h3>🚙 Model Y - Long Range</h3>
            <div className="price-info">
              <p className="base-price">Base Price: $55,000</p>
              <p className="dealer-price">Dealer Price: $51,500</p>
              <p className="margin">Margin: 6.4%</p>
            </div>
            <div className="price-actions">
              <button className="btn-secondary">✏️ Edit</button>
              <button className="btn-secondary">📊 History</button>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Active Promotions</h2>
          <button className="btn-primary">🎉 Create Promotion</button>
        </div>

        <div className="promotions-list">
          <div className="promotion-item">
            <div className="promotion-info">
              <h4>🎊 October EV Sale</h4>
              <p>5% discount on all electric vehicles</p>
              <span className="promotion-period">Oct 1 - Oct 31, 2024</span>
            </div>
            <div className="promotion-status active">Active</div>
            <div className="promotion-actions">
              <button className="btn-secondary">✏️ Edit</button>
              <button className="btn-secondary">📊 Performance</button>
            </div>
          </div>

          <div className="promotion-item">
            <div className="promotion-info">
              <h4>🏆 First Time Buyer Bonus</h4>
              <p>$2,000 off for first-time EV buyers</p>
              <span className="promotion-period">Sep 15 - Nov 30, 2024</span>
            </div>
            <div className="promotion-status active">Active</div>
            <div className="promotion-actions">
              <button className="btn-secondary">✏️ Edit</button>
              <button className="btn-secondary">📊 Performance</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}