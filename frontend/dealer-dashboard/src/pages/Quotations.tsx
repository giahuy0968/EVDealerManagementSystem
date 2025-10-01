import { useState, useEffect } from 'react'
import { dealerService } from '../services/dealerService'
import type { QuotationResponseDTO } from '../types'

export default function Quotations() {
  const [quotations, setQuotations] = useState<QuotationResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadQuotations()
  }, [])

  const loadQuotations = async () => {
    try {
      const data = await dealerService.getQuotations()
      setQuotations(data)
    } catch (error) {
      console.error('Failed to load quotations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: '#a0aec0',
      SENT: '#3b82f6',
      ACCEPTED: '#10b981',
      EXPIRED: '#ef4444'
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
    return <div className="card"><p>Loading quotations...</p></div>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quotations</h1>
        <div className="header-actions">
          <button className="btn btn-primary">+ Create Quotation</button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">All Quotations ({quotations.length})</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle Model</th>
                <th>Base Price</th>
                <th>Promotions</th>
                <th>Final Price</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: '#a0aec0' }}>
                    No quotations found.
                  </td>
                </tr>
              ) : (
                quotations.map(quote => (
                  <tr key={quote.id}>
                    <td><strong>{quote.customerName}</strong></td>
                    <td>{quote.carModelName}</td>
                    <td>${quote.basePrice.toLocaleString()}</td>
                    <td>{quote.promotions.length} promotions</td>
                    <td><strong style={{ color: '#10b981' }}>${quote.finalPrice.toLocaleString()}</strong></td>
                    <td>{new Date(quote.validUntil).toLocaleDateString()}</td>
                    <td><span style={getStatusBadge(quote.status)}>{quote.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-secondary">Edit</button>
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
