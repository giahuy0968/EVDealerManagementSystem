export default function Vehicles() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Vehicle Inventory</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">Filter</button>
          <button className="btn btn-primary">+ Add Vehicle</button>
        </div>
      </div>
      
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Year</th>
                <th>Color</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tesla Model 3</strong></td>
                <td>2024</td>
                <td>Pearl White</td>
                <td>$45,000</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Available</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
              <tr>
                <td><strong>Nissan Leaf</strong></td>
                <td>2024</td>
                <td>Electric Blue</td>
                <td>$32,000</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Available</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
              <tr>
                <td><strong>Hyundai Ioniq 5</strong></td>
                <td>2024</td>
                <td>Cyber Grey</td>
                <td>$48,500</td>
                <td><span style={{ background: '#fed7d7', color: '#742a2a', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Sold</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
              <tr>
                <td><strong>Ford Mustang Mach-E</strong></td>
                <td>2024</td>
                <td>Rapid Red</td>
                <td>$52,900</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Available</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
              <tr>
                <td><strong>Chevrolet Bolt EV</strong></td>
                <td>2024</td>
                <td>Summit White</td>
                <td>$28,500</td>
                <td><span style={{ background: '#feebc8', color: '#744210', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Reserved</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
