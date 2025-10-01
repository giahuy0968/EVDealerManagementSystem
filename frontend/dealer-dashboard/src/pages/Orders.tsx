import { useState, useEffect } from 'react'
import { dealerService } from '../services/dealerService'
import type { OrderResponseDTO, OrderCreateDTO } from '../types'

export default function Orders() {
  const [orders, setOrders] = useState<OrderResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await dealerService.getOrders()
      setOrders(data)
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: '#fbbf24',
      CONFIRMED: '#3b82f6',
      PROCESSING: '#8b5cf6',
      DELIVERING: '#f59e0b',
      COMPLETED: '#10b981',
      CANCELLED: '#ef4444'
    }
    return {
      background: colors[status] + '20',
      color: colors[status],
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: 600
    }
  }

  if (loading) {
    return <div className="card"><p>Loading orders...</p></div>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Orders Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">Export</button>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Order</button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 className="card-title">Create New Order</h2>
          <p style={{ color: '#718096' }}>Order creation form will be implemented here.</p>
          <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Recent Orders ({orders.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#a0aec0' }}>
                    No orders found. Create your first order!
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td><strong>{order.orderNumber}</strong></td>
                    <td>{order.customerName}</td>
                    <td>{order.items.length} items</td>
                    <td><strong>${order.totalAmount.toLocaleString()}</strong></td>
                    <td>{order.paymentMethod}</td>
                    <td><span style={getStatusBadge(order.status)}>{order.status}</span></td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
