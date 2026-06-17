import React, { useState } from 'react';
import { useCucms } from '../context/CucmsContext';
import { useNavigate } from 'react-router-dom';
import OrderStatusPill from '../components/OrderStatusPill';
import ReceiptModal from '../components/ReceiptModal';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  QrCode, 
  ChevronRight,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';

export const StudentViews = ({ subView }) => {
  const navigate = useNavigate();
  const { 
    menuItems, 
    orders, 
    transactions, 
    currentUser, 
    placeOrder, 
    topUpWallet,
    updateOrderStatus 
  } = useCucms();

  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Cart operations
  const addToCart = (item) => {
    if (!item.available) return;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateCartQty = (itemId, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextQty = item.qty + change;
        return nextQty > 0 ? { ...item, qty: nextQty } : item;
      }
      return item;
    }).filter(i => i.qty > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!checkoutMethod) {
      setCheckoutError('Please select a payment method.');
      return;
    }

    setCheckoutError('');
    const res = placeOrder(cart, checkoutMethod);
    if (res.success) {
      setPlacedOrder(res.order);
      setCart([]);
      setCheckoutSuccess(true);
    } else {
      setCheckoutError(res.message);
    }
  };

  // Views rendering
  if (subView === 'menu-browser') {
    const categories = ['All', 'Rice & Pasta', 'Proteins', 'Sides', 'Drinks'];
    const filteredItems = menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return (
      <div className="animate-fade" style={{ display: 'flex', gap: '24px', position: 'relative' }}>
        {/* Menu Section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Selah & Hebron Menus</span>
              <h1>Order Fresh Meals</h1>
            </div>
            
            {/* Search and Cart trigger */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search cafeteria menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    width: '240px',
                    backgroundColor: 'white'
                  }}
                />
              </div>
              <button 
                onClick={() => setShowCart(!showCart)}
                className="btn btn-secondary" 
                style={{ position: 'relative', display: 'flex', gap: '8px' }}
              >
                <ShoppingCart size={16} />
                <span>Cart</span>
                {cart.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: 'var(--color-gold)',
                    color: 'var(--color-deep-navy)',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cart.reduce((sum, i) => sum + i.qty, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories Filter Tabs */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '500',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--color-covenant-blue)' : 'var(--color-border)',
                  backgroundColor: selectedCategory === cat ? 'var(--color-covenant-blue)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--color-text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {filteredItems.map(item => (
              <div key={item.id} className="card" style={{
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                opacity: item.available ? 1 : 0.65
              }}>
                <div style={{ height: '140px', width: '100%', position: 'relative', backgroundColor: '#e2e8f0' }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {!item.available && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      Sold Out
                    </div>
                  )}
                  <span style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(13, 43, 92, 0.85)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {item.category}
                  </span>
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontSize: '14px', margin: 0, height: '40px', overflow: 'hidden' }}>{item.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-covenant-blue)' }}>
                      ₦{item.price.toLocaleString()}
                    </span>
                    <button
                      disabled={!item.available}
                      onClick={() => addToCart(item)}
                      className="btn btn-secondary"
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: item.available ? 'rgba(24, 95, 165, 0.05)' : 'var(--color-border)',
                        color: item.available ? 'var(--color-covenant-blue)' : 'var(--color-text-secondary)',
                        border: 'none'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide-out Cart Sidebar */}
        {showCart && (
          <div className="card animate-slide" style={{
            width: '360px',
            position: 'sticky',
            top: '90px',
            height: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 20px',
            backgroundColor: 'white',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={18} />
                <span>Your Order Cart</span>
              </h2>
              <button onClick={() => setShowCart(false)} style={{ color: 'var(--color-text-secondary)' }}>Close</button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-secondary)' }}>
                  <ShoppingCart size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px' }}>Your cart is empty.</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>Add items from the menu to start order.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '12px', margin: '0 0 4px 0' }}>{item.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-covenant-blue)' }}>
                          ₦{(item.price * item.qty).toLocaleString()}
                        </span>
                        {/* Qty selectors */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '2px' }}>
                          <button onClick={() => updateCartQty(item.id, -1)} style={{ padding: '2px' }}><Minus size={12} /></button>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', minWidth: '12px', textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => addToCart(item)} style={{ padding: '2px' }}><Plus size={12} /></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--color-error-red)' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer / Checkout Trigger */}
            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span>Total Amount:</span>
                  <strong style={{ fontSize: '16px', color: 'var(--color-deep-navy)' }}>₦{cartTotal.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      setCheckoutMethod('');
                      setCheckoutError('');
                      setCheckoutSuccess(false);
                      setPlacedOrder(null);
                    }}
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Checkout Payment Modal */}
        {cart.length > 0 && checkoutMethod !== undefined && checkoutMethod !== 'done' && placedOrder === null && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 500
          }}>
            <div className="card animate-slide" style={{ maxWidth: '400px', width: '100%', padding: '30px' }}>
              <h2 style={{ fontSize: '16px', marginBottom: '16px' }}>Select Checkout Payment Method</h2>
              
              {checkoutError && (
                <div style={{
                  color: 'var(--color-error-red)', backgroundColor: 'rgba(211,47,47,0.05)',
                  padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px'
                }}>
                  {checkoutError}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: checkoutMethod === 'Prepaid Wallet' ? 'rgba(24,95,165,0.05)' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Prepaid Wallet" 
                    checked={checkoutMethod === 'Prepaid Wallet'}
                    onChange={(e) => setCheckoutMethod(e.target.value)}
                  />
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block' }}>Prepaid Wallet Balance</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Available: ₦{currentUser.walletBalance?.toLocaleString()}
                    </span>
                  </div>
                </label>

                <label style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: checkoutMethod === 'Bank Transfer' ? 'rgba(24,95,165,0.05)' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Bank Transfer"
                    checked={checkoutMethod === 'Bank Transfer'}
                    onChange={(e) => setCheckoutMethod(e.target.value)}
                  />
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block' }}>Bank Transfer</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Pay to Covenant Cafeteria Union Account
                    </span>
                  </div>
                </label>

                <label style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: checkoutMethod === 'POS' ? 'rgba(24,95,165,0.05)' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="POS"
                    checked={checkoutMethod === 'POS'}
                    onChange={(e) => setCheckoutMethod(e.target.value)}
                  />
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block' }}>POS / Card Payment</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Pay at pickup counter card terminal
                    </span>
                  </div>
                </label>

                <label style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer',
                  backgroundColor: checkoutMethod === 'Cash' ? 'rgba(24,95,165,0.05)' : 'white'
                }}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="Cash"
                    checked={checkoutMethod === 'Cash'}
                    onChange={(e) => setCheckoutMethod(e.target.value)}
                  />
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block' }}>Cash Payment</strong>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Pay cash at the ticket desk
                    </span>
                  </div>
                </label>

                {/* Bank transfer instruction details */}
                {checkoutMethod === 'Bank Transfer' && (
                  <div style={{
                    padding: '12px', borderRadius: '6px', backgroundColor: 'var(--color-warm-white)',
                    fontSize: '11px', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '4px'
                  }}>
                    <span><strong>Bank Name:</strong> Access Bank PLC</span>
                    <span><strong>Account Number:</strong> 0019283746</span>
                    <span><strong>Account Name:</strong> CU SELAH CAFETERIA CORP</span>
                    <span style={{ color: 'var(--color-covenant-blue)', marginTop: '4px' }}>
                      Please keep your payment transfer slip ready for verification.
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setCheckoutMethod(undefined)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Confirm & Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {checkoutSuccess && placedOrder && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', zIndex: 500
          }}>
            <div className="card animate-slide" style={{ maxWidth: '400px', width: '100%', padding: '30px', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(29, 158, 117, 0.1)',
                color: 'var(--color-teal-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <QrCode size={32} />
              </div>
              <h2 style={{ fontSize: '18px', color: 'var(--color-deep-navy)', marginBottom: '8px' }}>Order Placed Successfully!</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
                Your order ID is <strong>{placedOrder.id}</strong>. Track your live queue status or view receipt details.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => {
                    setSelectedReceiptOrder(placedOrder);
                    setPlacedOrder(null);
                    setCheckoutSuccess(false);
                  }} 
                  className="btn btn-secondary"
                >
                  View Digital Receipt
                </button>
                <button 
                  onClick={() => {
                    setPlacedOrder(null);
                    setCheckoutSuccess(false);
                    navigate('/student/orders');
                  }} 
                  className="btn btn-primary"
                >
                  Track Order Queue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt modal */}
        {selectedReceiptOrder && (
          <ReceiptModal order={selectedReceiptOrder} onClose={() => setSelectedReceiptOrder(null)} />
        )}
      </div>
    );
  }

  if (subView === 'order-tracker') {
    const studentOrders = orders.filter(o => o.studentMatric === currentUser.username);

    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Queue Operations</span>
          <h1>Live Order Tracker</h1>
        </div>

        {studentOrders.length === 0 ? (
          <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <h3>No Orders Placed Yet</h3>
            <p style={{ marginTop: '8px', fontSize: '13px' }}>Go to the Menu Browser to place your first cafeteria order.</p>
          </div>
        ) : (
          studentOrders.map(order => {
            const steps = ['Placed', 'Preparing', 'Ready for Pickup', 'Served'];
            const currentStepIdx = steps.findIndex(s => s === order.status || (order.status === 'Cancelled' && s === 'Placed'));

            return (
              <div key={order.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Order {order.id}</h3>
                    <span className="metadata">{new Date(order.timestamp).toLocaleTimeString()} · {order.cafeteria}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={() => setSelectedReceiptOrder(order)} 
                      className="btn btn-secondary" 
                      style={{ padding: '8px 12px', fontSize: '12px' }}
                    >
                      <Download size={12} />
                      Receipt
                    </button>
                    <OrderStatusPill status={order.status} />
                  </div>
                </div>

                {/* Queue ETA and Position */}
                {['Placed', 'Preparing'].includes(order.status) && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    backgroundColor: 'var(--color-warm-white)',
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <span className="metadata" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Queue Position</span>
                      <h2 style={{ fontSize: '24px', color: 'var(--color-deep-navy)', margin: '4px 0 0 0' }}>
                        #{order.queueNum}
                      </h2>
                    </div>
                    <div>
                      <span className="metadata" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Estimated Prep Time</span>
                      <h2 style={{ fontSize: '24px', color: 'var(--color-covenant-blue)', margin: '4px 0 0 0' }}>
                        {order.etaMinutes} mins
                      </h2>
                    </div>
                  </div>
                )}

                {/* Live Lifecycle Steps Timeline */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                  marginTop: '20px',
                  paddingBottom: '20px',
                  overflowX: 'auto'
                }}>
                  {/* Background connector line */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '50px',
                    right: '50px',
                    height: '2px',
                    backgroundColor: 'var(--color-border)',
                    zIndex: 1
                  }} />

                  {order.status === 'Cancelled' ? (
                    <div style={{
                      backgroundColor: 'rgba(211,47,47,0.05)', border: '1px solid rgba(211,47,47,0.15)',
                      padding: '12px', borderRadius: '8px', color: 'var(--color-error-red)', width: '100%',
                      textAlign: 'center', fontSize: '13px'
                    }}>
                      This order was cancelled by the Cafeteria staff. Please visit the desk for refunds/clarification.
                    </div>
                  ) : (
                    steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      
                      let stepColor = 'var(--color-border)';
                      if (isCompleted) stepColor = 'var(--color-covenant-blue)';
                      if (order.status === 'Served' && idx === 3) stepColor = 'var(--color-teal-success)';

                      return (
                        <div key={idx} style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          zIndex: 2,
                          minWidth: '100px',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? stepColor : 'white',
                            border: `2px solid ${isCompleted ? stepColor : 'var(--color-border)'}`,
                            color: isCompleted ? 'white' : 'var(--color-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            boxShadow: isCurrent ? '0 0 0 4px rgba(24,95,165,0.2)' : 'none'
                          }} className={isCurrent ? 'animate-pulse' : ''}>
                            {idx + 1}
                          </div>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: isCurrent ? 'bold' : 'normal',
                            color: isCurrent ? 'var(--color-deep-navy)' : 'var(--color-text-secondary)'
                          }}>
                            {step}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Sandbox Mock Progress triggers (FOR TESTING INDEPENDENTLY) */}
                {['Placed', 'Preparing', 'Ready for Pickup'].includes(order.status) && (
                  <div style={{
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <span className="eyebrow" style={{ fontSize: '9px', color: 'var(--color-text-secondary)' }}>
                      Sandbox Admin: Simulate steward state change (for solo testing)
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {order.status === 'Placed' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Preparing')}
                          className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          Simulate "Start Preparing"
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
                          className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          Simulate "Mark Ready"
                        </button>
                      )}
                      {order.status === 'Ready for Pickup' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Served')}
                          className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          Simulate "Mark Served"
                        </button>
                      )}
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '11px', marginLeft: 'auto' }}
                      >
                        Simulate Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {selectedReceiptOrder && (
          <ReceiptModal order={selectedReceiptOrder} onClose={() => setSelectedReceiptOrder(null)} />
        )}
      </div>
    );
  }

  if (subView === 'prepaid-wallet') {
    const studentTxns = transactions.filter(t => t.studentMatric === currentUser.username);

    const handleTopUp = (e) => {
      e.preventDefault();
      const amt = parseFloat(topUpAmount);
      if (isNaN(amt) || amt <= 0) return;

      const res = topUpWallet(amt);
      if (res.success) {
        setTopUpSuccess(true);
        setTopUpAmount('');
        setTimeout(() => setTopUpSuccess(false), 3000);
      }
    };

    return (
      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Financial Hub</span>
          <h1>Student Prepaid Wallet</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {/* Wallet Balance Card */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--color-deep-navy) 0%, #153c7a 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '200px',
            border: '1px solid var(--color-gold)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              opacity: 0.05,
              color: 'white'
            }}>
              <QrCode size={180} />
            </div>

            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--color-gold)' }}>Prepaid Balance card</span>
                <h4 style={{ margin: '4px 0 0 0', color: 'white', opacity: 0.9 }}>{currentUser.name}</h4>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0 0' }}>Matric: {currentUser.username}</p>
              </div>
              <div style={{
                padding: '4px 10px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                fontSize: '11px',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }}>
                CUCMS Pay
              </div>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Total Balance</span>
              <h1 style={{ fontSize: '32px', color: 'white', margin: 0, fontWeight: 'bold' }}>
                ₦{currentUser.walletBalance?.toLocaleString()}
              </h1>
            </div>
          </div>

          {/* Top-up Form Card */}
          <div className="card">
            <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Top Up Wallet Balance</h3>
            
            {topUpSuccess && (
              <div style={{
                color: 'var(--color-teal-success)', backgroundColor: 'rgba(29,158,117,0.05)',
                padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px'
              }}>
                Wallet topped up successfully! Balance updated.
              </div>
            )}

            <form onSubmit={handleTopUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Amount to Top Up (NGN)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>₦</span>
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 5000)"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 28px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
              </div>

              {/* Quick choices */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1000, 2000, 5000, 10000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTopUpAmount(val.toString())}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'white',
                      fontWeight: '500'
                    }}
                  >
                    +₦{val.toLocaleString()}
                  </button>
                ))}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Proceed to Deposit
              </button>
            </form>
          </div>
        </div>

        {/* Transaction History Logs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', margin: 0 }}>Transaction History</h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', textAlign: 'left', fontWeight: 'bold' }}>
                  <th style={{ padding: '10px 0' }}>Transaction ID</th>
                  <th style={{ padding: '10px 0' }}>Description</th>
                  <th style={{ padding: '10px 0' }}>Type</th>
                  <th style={{ padding: '10px 0' }}>Date & Time</th>
                  <th style={{ padding: '10px 0', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {studentTxns.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                      No transactions recorded.
                    </td>
                  </tr>
                ) : (
                  studentTxns.map(txn => {
                    const isCredit = txn.type === 'Credit';
                    return (
                      <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 0', fontWeight: '500' }}>{txn.id}</td>
                        <td style={{ padding: '12px 0' }}>{txn.description}</td>
                        <td style={{ padding: '12px 0' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isCredit ? 'rgba(29, 158, 117, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                            color: isCredit ? 'var(--color-teal-success)' : 'var(--color-error-red)'
                          }}>
                            {txn.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 0', color: 'var(--color-text-secondary)' }}>
                          {new Date(txn.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold', color: isCredit ? 'var(--color-teal-success)' : 'var(--color-text-primary)' }}>
                          {isCredit ? '+' : '-'}₦{txn.amount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
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
