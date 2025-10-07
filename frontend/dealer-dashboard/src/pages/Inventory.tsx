import { useState, useEffect } from 'react'
import { dealerService } from '../services/dealerService'
import type { CarResponseDTO } from '../types'

export default function Inventory() {
  const [inventory, setInventory] = useState<CarResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    try {
      const data = await dealerService.getCars()
      setInventory(data)
    } catch (error) {
      console.error('Failed to load inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: '#ef4444' }
    if (stock < 5) return { label: 'Low Stock', color: '#f59e0b' }
    return { label: 'In Stock', color: '#10b981' }
  }

  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0)
  const lowStockItems = inventory.filter(item => item.stock > 0 && item.stock < 5).length
  const outOfStockItems = inventory.filter(item => item.stock === 0).length

  if (loading) {
    return <div className="card"><p>Loading inventory...</p></div>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Inventory Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">📤 Export</button>
          <button className="btn btn-primary">📦 Request Stock</button>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Units</div>
          <div className="stat-value">{totalStock}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-label">Models Available</div>
          <div className="stat-value">{inventory.filter(i => i.stock > 0).length}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{lowStockItems}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value">{outOfStockItems}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Current Stock Levels</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Version</th>
                <th>Year</th>
                <th>Base Price</th>
                <th>Available Colors</th>
                <th>Stock Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => {
                const status = getStockStatus(item.stock)
                return (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.version}</td>
                    <td>{item.year}</td>
                    <td>${item.basePrice.toLocaleString()}</td>
                    <td>{item.colors.length} colors</td>
                    <td><strong>{item.stock}</strong></td>
                    <td>
                      <span style={{
                        background: status.color + '20',
                        color: status.color,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 600
                      }}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary">Adjust</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
