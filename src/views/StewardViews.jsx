import React, { useState } from 'react';
import { useCucms } from '../context/CucmsContext';
import OrderStatusPill from '../components/OrderStatusPill';
import { 
  Play, 
  CheckSquare, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  ChefHat, 
  BellRing,
  Coffee,
  AlertTriangle
} from 'lucide-react';

export const StewardViews = ({ subView }) => {
  const { orders, currentUser, updateOrderStatus } = useCucms();
  const [activeTab, setActiveTab] = useState('active'); // 'active' (Placed/Preparing) or 'ready' (Ready) or 'history' (Served/Cancelled)
  
  // Filter orders by steward's cafeteria location
  const cafeteriaOrders = orders.filter(o => o.cafeteria === currentUser.cafeteria);

  const activeOrders = cafeteriaOrders.filter(o => o.status === 'Placed' || o.status === 'Preparing');
  const readyOrders = cafeteriaOrders.filter(o => o.status === 'Ready for Pickup');
  const historyOrders = cafeteriaOrders.filter(o => o.status === 'Served' || o.status === 'Cancelled');

  const getActiveList = () => {
    switch (activeTab) {
      case 'active': return activeOrders;
      case 'ready': return readyOrders;
      case 'history': return historyOrders;
      default: return [];
    }
  };

  const currentList = getActiveList();

  // Helper: Get difference in minutes from order timestamp
  const getElapsedMinutes = (timestamp) => {
    const diffMs = Date.now() - new Date(timestamp);
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins > 0 ? `${diffMins}m ago` : 'just now';
  };

  if (subView === 'steward-queue') {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header Summary Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Kitchen Monitor</span>
            <h1>Steward Queue Dashboard</h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: '8px',
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <ChefHat size={16} style={{ color: 'var(--color-covenant-blue)' }} />
              <div>
                <span className="metadata" style={{ fontSize: '10px', textTransform: 'uppercase', display: 'block' }}>Active prep</span>
                <strong style={{ fontSize: '15px' }}>{activeOrders.length} orders</strong>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: '8px',
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <BellRing size={16} style={{ color: 'var(--color-gold)' }} />
              <div>
                <span className="metadata" style={{ fontSize: '10px', textTransform: 'uppercase', display: 'block' }}>Ready for Pickup</span>
                <strong style={{ fontSize: '15px' }}>{readyOrders.length} orders</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              padding: '10px 18px',
              fontWeight: '600',
              fontSize: '13px',
              color: activeTab === 'active' ? 'var(--color-deep-navy)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'active' ? '2px solid var(--color-covenant-blue)' : '2px solid transparent'
            }}
          >
            Preparation Queue ({activeOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            style={{
              padding: '10px 18px',
              fontWeight: '600',
              fontSize: '13px',
              color: activeTab === 'ready' ? 'var(--color-deep-navy)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'ready' ? '2px solid var(--color-covenant-blue)' : '2px solid transparent'
            }}
          >
            Ready for Pickup ({readyOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '10px 18px',
              fontWeight: '600',
              fontSize: '13px',
              color: activeTab === 'history' ? 'var(--color-deep-navy)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'history' ? '2px solid var(--color-covenant-blue)' : '2px solid transparent'
            }}
          >
            Completed History ({historyOrders.length})
          </button>
        </div>

        {/* Orders List / Cards Grid */}
        {currentList.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <Coffee size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3>No Orders in this Section</h3>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Currently there are no orders matching this filter context.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentList.map(order => (
              <div key={order.id} className="card animate-slide" style={{
                padding: '20px',
                borderLeft: order.status === 'Preparing' ? '4px solid var(--color-covenant-blue)' : '4px solid var(--color-border)',
                borderColor: order.status === 'Placed' ? 'var(--color-gold)' : (order.status === 'Ready for Pickup' ? 'var(--status-ready-text)' : (order.status === 'Served' ? 'var(--color-teal-success)' : undefined))
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  {/* Left Column: Ticket header & items */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{order.id}</h3>
                      <OrderStatusPill status={order.status} />
                      <span className="metadata" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {getElapsedMinutes(order.timestamp)}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                      Student: <strong>{order.studentName}</strong> ({order.studentMatric}) · Pay Method: <strong>{order.paymentMethod}</strong>
                    </p>

                    {/* Order items list */}
                    <div style={{
                      backgroundColor: 'var(--color-warm-white)', borderRadius: '6px',
                      padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px'
                    }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '13px' }}>
                          <span>
                            <strong>{item.qty}x</strong> {item.name}
                          </span>
                          <span style={{ color: 'var(--color-text-secondary)' }}>
                            ₦{(item.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '10px', width: '180px',
                    alignSelf: 'stretch', justifyContent: 'center', paddingLeft: '16px',
                    borderLeft: '1px solid var(--color-border)'
                  }}>
                    {order.status === 'Placed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                      >
                        <Play size={14} />
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
                        className="btn btn-accent"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '13px' }}
                      >
                        <CheckSquare size={14} />
                        Mark as Ready
                      </button>
                    )}

                    {order.status === 'Ready for Pickup' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Served')}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '13px', backgroundColor: 'var(--color-teal-success)' }}
                      >
                        <CheckCircle2 size={14} />
                        Serve Order
                      </button>
                    )}

                    {['Placed', 'Preparing'].includes(order.status) && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel order ${order.id}?`)) {
                            updateOrderStatus(order.id, 'Cancelled');
                          }
                        }}
                        className="btn btn-danger"
                        style={{ width: '100%', padding: '6px 12px', fontSize: '12px' }}
                      >
                        <Trash2 size={12} />
                        Cancel Order
                      </button>
                    )}

                    {/* Meta summary for history/completed items */}
                    {['Served', 'Cancelled'].includes(order.status) && (
                      <div style={{ textAlign: 'center', padding: '12px' }}>
                        <span className="eyebrow" style={{ color: order.status === 'Served' ? 'var(--color-teal-success)' : 'var(--color-error-red)' }}>
                          {order.status}
                        </span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          Total: ₦{order.total.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (subView === 'order-history') {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Archive Log</span>
          <h1>Steward Order History</h1>
        </div>

        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '12px 6px' }}>Order ID</th>
                  <th style={{ padding: '12px 6px' }}>Student Name</th>
                  <th style={{ padding: '12px 6px' }}>Matric No.</th>
                  <th style={{ padding: '12px 6px' }}>Items Summary</th>
                  <th style={{ padding: '12px 6px' }}>Method</th>
                  <th style={{ padding: '12px 6px' }}>Total Amount</th>
                  <th style={{ padding: '12px 6px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      No order history found for {currentUser.cafeteria}.
                    </td>
                  </tr>
                ) : (
                  historyOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 6px', fontWeight: '500' }}>{order.id}</td>
                      <td style={{ padding: '12px 6px' }}>{order.studentName}</td>
                      <td style={{ padding: '12px 6px' }}>{order.studentMatric}</td>
                      <td style={{ padding: '12px 6px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.items.map(i => `${i.name} (${i.qty})`).join(', ')}
                      </td>
                      <td style={{ padding: '12px 6px' }}>{order.paymentMethod}</td>
                      <td style={{ padding: '12px 6px', fontWeight: 'bold' }}>₦{order.total.toLocaleString()}</td>
                      <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                        <OrderStatusPill status={order.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
