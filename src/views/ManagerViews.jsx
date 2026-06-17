import React, { useState } from 'react';
import { useCucms } from '../context/CucmsContext';
import { 
  BarChart, 
  DollarSign, 
  Utensils, 
  TrendingUp, 
  Plus, 
  Edit, 
  Check, 
  X, 
  FileDown, 
  Calendar,
  Layers,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const ManagerViews = ({ subView }) => {
  const { 
    orders, 
    menuItems, 
    transactions, 
    currentUser, 
    toggleItemAvailability, 
    updateItemDetails, 
    addMenuItem 
  } = useCucms();

  // Menu management states
  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editName, setEditName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Rice & Pasta');
  const [newItemImage, setNewItemImage] = useState('');

  // Analytics computation
  const servedOrders = orders.filter(o => o.status === 'Served');
  
  // Total Revenue
  const totalRevenue = servedOrders.reduce((sum, o) => sum + o.total, 0);
  
  // Average Prep Time (mocked slightly based on count)
  const avgPrepTime = servedOrders.length > 0 ? 12 : 0;

  // Breakdown by Payment Method
  const payBreakdown = servedOrders.reduce((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + order.total;
    return acc;
  }, {});

  // Top Items
  const itemCounts = servedOrders.reduce((acc, order) => {
    order.items.forEach(item => {
      acc[item.name] = (acc[item.name] || 0) + item.qty;
    });
    return acc;
  }, {});

  const topItems = Object.keys(itemCounts)
    .map(name => ({ name, count: itemCounts[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // CSV Report Generator
  const generateCSVReport = () => {
    const csvContent = [
      ["Order ID", "Date", "Student Name", "Matric Number", "Cafeteria", "Payment Method", "Total (NGN)", "Status"],
      ...orders.map(o => [
        o.id,
        new Date(o.timestamp).toLocaleString(),
        o.studentName,
        o.studentMatric,
        o.cafeteria,
        o.paymentMethod,
        o.total,
        o.status
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const element = document.createElement("a");
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `CUCMS_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEditSave = (itemId) => {
    if (!editPrice || isNaN(parseFloat(editPrice))) return;
    updateItemDetails(itemId, { 
      price: parseFloat(editPrice), 
      name: editName 
    });
    setEditingItem(null);
  };

  const handleAddNewItem = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || isNaN(parseFloat(newItemPrice))) return;
    
    addMenuItem({
      name: newItemName,
      price: parseFloat(newItemPrice),
      category: newItemCategory,
      image: newItemImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60'
    });

    setNewItemName('');
    setNewItemPrice('');
    setNewItemImage('');
    setShowAddForm(false);
  };

  if (subView === 'dashboard') {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Analytics Desk</span>
          <h1>Cafeteria Sales Dashboard</h1>
        </div>

        {/* Top summary cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '8px',
              backgroundColor: 'rgba(29, 158, 117, 0.1)', color: 'var(--color-teal-success)',
              display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
            }}>
              <DollarSign size={20} />
            </div>
            <div>
              <span className="metadata" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Total Revenue</span>
              <h2 style={{ fontSize: '20px', margin: '2px 0 0 0', color: 'var(--color-deep-navy)' }}>
                ₦{totalRevenue.toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '8px',
              backgroundColor: 'rgba(24, 95, 165, 0.1)', color: 'var(--color-covenant-blue)',
              display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
            }}>
              <Utensils size={20} />
            </div>
            <div>
              <span className="metadata" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Orders Served</span>
              <h2 style={{ fontSize: '20px', margin: '2px 0 0 0', color: 'var(--color-deep-navy)' }}>
                {servedOrders.length} tickets
              </h2>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '8px',
              backgroundColor: 'rgba(239, 159, 39, 0.1)', color: 'var(--color-gold)',
              display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
            }}>
              <Calendar size={20} />
            </div>
            <div>
              <span className="metadata" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Average Prep</span>
              <h2 style={{ fontSize: '20px', margin: '2px 0 0 0', color: 'var(--color-deep-navy)' }}>
                {avgPrepTime} mins
              </h2>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Payment Method Distribution */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', margin: 0 }}>Payment Method Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Prepaid Wallet', 'Bank Transfer', 'POS', 'Cash'].map(method => {
                const amount = payBreakdown[method] || 0;
                const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                return (
                  <div key={method} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '12px' }}>
                      <strong>{method}</strong>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        ₦{amount.toLocaleString()} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    {/* Bar representation */}
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--color-warm-white)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: method === 'Prepaid Wallet' ? 'var(--color-deep-navy)' : 'var(--color-covenant-blue)',
                        borderRadius: '4px'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '15px', margin: 0 }}>Top Selling Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topItems.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                  No sales data available yet.
                </p>
              ) : (
                topItems.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '8px 12px', backgroundColor: 'var(--color-warm-white)', borderRadius: '6px'
                  }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      backgroundColor: 'var(--color-deep-navy)', color: 'var(--color-gold)',
                      display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 'bold'
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '13px', margin: 0 }}>{item.name}</h4>
                    </div>
                    <strong style={{ fontSize: '13px', color: 'var(--color-covenant-blue)' }}>
                      {item.count} sold
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subView === 'menu-management') {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Kitchen Catalog</span>
            <h1>Menu Management</h1>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Add New Item</span>
          </button>
        </div>

        {/* Add Food Item Form */}
        {showAddForm && (
          <div className="card animate-slide">
            <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>Register New Menu Item</h3>
            <form onSubmit={handleAddNewItem} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              alignItems: 'end'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Food Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fried Yam & Pepper sauce"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Price (NGN)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 600"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Category</label>
                <select 
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'white' }}
                >
                  <option value="Rice & Pasta">Rice & Pasta</option>
                  <option value="Proteins">Proteins</option>
                  <option value="Sides">Sides</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px' }}>Image URL (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Paste URL"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>Save</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Menu Catalog List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '15px', margin: 0 }}>Food Catalog list</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {menuItems.map(item => {
              const isEditing = editingItem === item.id;
              return (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifySelf: 'stretch', justifyContent: 'space-between',
                  padding: '12px 16px', border: '1px solid var(--color-border)', borderRadius: '8px',
                  backgroundColor: item.available ? 'white' : 'var(--color-warm-white)',
                  flexWrap: 'wrap', gap: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '13px' }}
                        />
                      ) : (
                        <strong style={{ fontSize: '13px' }}>{item.name}</strong>
                      )}
                      <span className="metadata" style={{ fontSize: '11px' }}>Category: {item.category}</span>
                    </div>
                  </div>

                  {/* Pricing and Stock Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '100px' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>₦</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            style={{ padding: '4px 8px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '13px', width: '80px' }}
                          />
                        </div>
                      ) : (
                        <strong style={{ color: 'var(--color-covenant-blue)', fontSize: '15px' }}>
                          ₦{item.price.toLocaleString()}
                        </strong>
                      )}
                    </div>

                    {/* Stock Status Indicator Button */}
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className="btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        backgroundColor: item.available ? 'rgba(29, 158, 117, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                        color: item.available ? 'var(--color-teal-success)' : 'var(--color-error-red)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {item.available ? (
                        <>
                          <CheckCircle size={14} />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>

                    {/* Edit controls */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isEditing ? (
                        <>
                          <button 
                            onClick={() => handleEditSave(item.id)}
                            style={{
                              width: '28px', height: '28px', borderRadius: '4px',
                              backgroundColor: 'var(--color-teal-success)', color: 'white',
                              display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
                            }}
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => setEditingItem(null)}
                            style={{
                              width: '28px', height: '28px', borderRadius: '4px',
                              backgroundColor: 'var(--color-text-secondary)', color: 'white',
                              display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center'
                            }}
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingItem(item.id);
                            setEditPrice(item.price.toString());
                            setEditName(item.name);
                          }}
                          style={{
                            width: '28px', height: '28px', borderRadius: '4px',
                            backgroundColor: 'var(--color-warm-white)', border: '1px solid var(--color-border)',
                            display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center',
                            color: 'var(--color-text-secondary)'
                          }}
                        >
                          <Edit size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (subView === 'reports-logs') {
    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Financial Audit</span>
            <h1>Reports & Logs</h1>
          </div>
          <button onClick={generateCSVReport} className="btn btn-secondary">
            <FileDown size={16} />
            <span>Download CSV Report</span>
          </button>
        </div>

        {/* Transaction History Logs */}
        <div className="card">
          <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Complete Transaction Audit Trail</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '12px 6px' }}>Order ID</th>
                  <th style={{ padding: '12px 6px' }}>Timestamp</th>
                  <th style={{ padding: '12px 6px' }}>Customer Name</th>
                  <th style={{ padding: '12px 6px' }}>Cafeteria</th>
                  <th style={{ padding: '12px 6px' }}>Method</th>
                  <th style={{ padding: '12px 6px' }}>Total Amount</th>
                  <th style={{ padding: '12px 6px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 6px', fontWeight: '500' }}>{order.id}</td>
                    <td style={{ padding: '12px 6px', color: 'var(--color-text-secondary)' }}>
                      {new Date(order.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 6px' }}>{order.studentName} ({order.studentMatric})</td>
                    <td style={{ padding: '12px 6px' }}>{order.cafeteria}</td>
                    <td style={{ padding: '12px 6px' }}>{order.paymentMethod}</td>
                    <td style={{ padding: '12px 6px', fontWeight: 'bold' }}>₦{order.total.toLocaleString()}</td>
                    <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', padding: '2px 8px', borderRadius: '4px',
                        backgroundColor: order.status === 'Served' ? 'rgba(29,158,117,0.1)' : (order.status === 'Cancelled' ? 'rgba(211,47,47,0.1)' : 'rgba(239,159,39,0.1)'),
                        color: order.status === 'Served' ? 'var(--color-teal-success)' : (order.status === 'Cancelled' ? 'var(--color-error-red)' : 'var(--color-gold)')
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
