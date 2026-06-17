import React, { createContext, useState, useEffect, useContext } from 'react';

const CucmsContext = createContext();

// Predefined mock data
const INITIAL_MENU = [
  { id: 'm1', name: 'Jollof Rice (Standard Portion)', price: 700, category: 'Rice & Pasta', available: true, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200&auto=format&fit=crop&q=60' },
  { id: 'm2', name: 'Fried Rice (Standard Portion)', price: 750, category: 'Rice & Pasta', available: true, image: 'https://images.unsplash.com/photo-1603133872878-6967b68230de?w=200&auto=format&fit=crop&q=60' },
  { id: 'm3', name: 'White Rice & Beans', price: 650, category: 'Rice & Pasta', available: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60' },
  { id: 'm4', name: 'Spaghetti Stir-fry', price: 800, category: 'Rice & Pasta', available: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop&q=60' },
  { id: 'm5', name: 'Grilled Chicken Quarter', price: 1200, category: 'Proteins', available: true, image: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=200&auto=format&fit=crop&q=60' },
  { id: 'm6', name: 'Fried Beef Chunk', price: 500, category: 'Proteins', available: true, image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200&auto=format&fit=crop&q=60' },
  { id: 'm7', name: 'Fried Fish (Titus)', price: 800, category: 'Proteins', available: true, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&auto=format&fit=crop&q=60' },
  { id: 'm8', name: 'Fried Sweet Plantain (Dodo - 5pcs)', price: 300, category: 'Sides', available: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=60' },
  { id: 'm9', name: 'Moin-Moin', price: 400, category: 'Sides', available: true, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60' },
  { id: 'm10', name: 'Chilled Coca-Cola (50cl)', price: 350, category: 'Drinks', available: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop&q=60' },
  { id: 'm11', name: 'Eva Bottled Water (75cl)', price: 250, category: 'Drinks', available: true, image: 'https://images.unsplash.com/photo-1608885898957-a599fb1b4641?w=200&auto=format&fit=crop&q=60' },
  { id: 'm12', name: 'Fresh Hollandia Yoghurt (31.5cl)', price: 600, category: 'Drinks', available: true, image: 'https://images.unsplash.com/photo-1571244856341-4f3dd95db36e?w=200&auto=format&fit=crop&q=60' }
];

const INITIAL_USERS = [
  { id: 'u1', username: '21/1042', email: 'student@stu.cu.edu.ng', password: 'password', name: 'Samuel Adebayo', role: 'student', walletBalance: 8500, cafeteria: 'Cafeteria 1' },
  { id: 'u2', username: 'CU0123', email: 'steward@cu.edu.ng', password: 'password', name: 'Brother John', role: 'steward', cafeteria: 'Cafeteria 1' },
  { id: 'u3', username: 'MGR001', email: 'manager@cu.edu.ng', password: 'password', name: 'Mrs. Elizabeth Adeoke', role: 'manager', cafeteria: 'Cafeteria 1' },
  { id: 'u4', username: 'ADM001', email: 'admin@cu.edu.ng', password: 'password', name: 'Dr. Olumide Johnson', role: 'admin', cafeteria: 'Both' }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-8291',
    studentName: 'Samuel Adebayo',
    studentMatric: '21/1042',
    studentEmail: 'student@stu.cu.edu.ng',
    items: [
      { id: 'm1', name: 'Jollof Rice (Standard Portion)', price: 700, qty: 1 },
      { id: 'm5', name: 'Grilled Chicken Quarter', price: 1200, qty: 1 },
      { id: 'm8', name: 'Fried Sweet Plantain (Dodo - 5pcs)', price: 300, qty: 1 },
      { id: 'm10', name: 'Chilled Coca-Cola (50cl)', price: 350, qty: 1 }
    ],
    total: 2550,
    status: 'Served',
    queueNum: 4,
    etaMinutes: 0,
    cafeteria: 'Cafeteria 1',
    paymentMethod: 'Prepaid Wallet',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString() // 3 hours ago
  },
  {
    id: 'ORD-9104',
    studentName: 'Tobi Daniels',
    studentMatric: '22/3920',
    studentEmail: 'tobi.daniels@stu.cu.edu.ng',
    items: [
      { id: 'm2', name: 'Fried Rice (Standard Portion)', price: 750, qty: 2 },
      { id: 'm6', name: 'Fried Beef Chunk', price: 500, qty: 2 },
      { id: 'm11', name: 'Eva Bottled Water (75cl)', price: 250, qty: 1 }
    ],
    total: 2750,
    status: 'Ready for Pickup',
    queueNum: 1,
    etaMinutes: 2,
    cafeteria: 'Cafeteria 1',
    paymentMethod: 'Bank Transfer',
    timestamp: new Date(Date.now() - 1200000).toISOString() // 20 mins ago
  },
  {
    id: 'ORD-1048',
    studentName: 'Chidi Nnamdi',
    studentMatric: '21/8874',
    studentEmail: 'chidi.nnamdi@stu.cu.edu.ng',
    items: [
      { id: 'm4', name: 'Spaghetti Stir-fry', price: 800, qty: 1 },
      { id: 'm7', name: 'Fried Fish (Titus)', price: 800, qty: 1 }
    ],
    total: 1600,
    status: 'Preparing',
    queueNum: 2,
    etaMinutes: 7,
    cafeteria: 'Cafeteria 1',
    paymentMethod: 'Prepaid Wallet',
    timestamp: new Date(Date.now() - 600000).toISOString() // 10 mins ago
  }
];

const INITIAL_TRANSACTIONS = [
  { id: 'TXN-001', studentMatric: '21/1042', type: 'Debit', amount: 2550, description: 'Order ORD-8291 Payment', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'TXN-002', studentMatric: '21/1042', type: 'Credit', amount: 10000, description: 'Prepaid Wallet Deposit (Bank Transfer)', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 'TXN-003', studentMatric: '21/1042', type: 'Credit', amount: 1050, description: 'Prepaid Wallet Activation Promo', timestamp: new Date(Date.now() - 3600000 * 48).toISOString() }
];

export const CucmsProvider = ({ children }) => {
  // Read state from localStorage or load initial defaults
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('cucms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('cucms_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('cucms_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cucms_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('cucms_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [systemConfig, setSystemConfig] = useState(() => {
    const saved = localStorage.getItem('cucms_config');
    return saved ? JSON.parse(saved) : {
      cafeterias: ['Cafeteria 1', 'Cafeteria 2'],
      maxQueueCapacity: 50,
      activeHoursStart: '07:00',
      activeHoursEnd: '21:00',
      posEnabled: true,
      bankTransferEnabled: true,
      prepaidWalletEnabled: true,
      cashEnabled: true
    };
  });

  // Save states to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cucms_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('cucms_users', JSON.stringify(users));
    // Also keep logged in user's profile fresh if users list updates
    if (currentUser) {
      const freshUser = users.find(u => u.id === currentUser.id);
      if (freshUser) {
        const mergedUser = {
          ...freshUser,
          cafeteria: currentUser.cafeteria // Preserve selected cafeteria context
        };
        if (JSON.stringify(mergedUser) !== JSON.stringify(currentUser)) {
          setCurrentUser(mergedUser);
          localStorage.setItem('cucms_user', JSON.stringify(mergedUser));
        }
      }
    }
  }, [users, currentUser]);

  useEffect(() => {
    localStorage.setItem('cucms_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cucms_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cucms_config', JSON.stringify(systemConfig));
  }, [systemConfig]);

  // Sync state between tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cucms_orders') {
        setOrders(JSON.parse(e.newValue));
      } else if (e.key === 'cucms_users') {
        const updatedUsers = JSON.parse(e.newValue);
        setUsers(updatedUsers);
      } else if (e.key === 'cucms_menu') {
        setMenuItems(JSON.parse(e.newValue));
      } else if (e.key === 'cucms_transactions') {
        setTransactions(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Audio Alerts helper
  const playAlert = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'new_order') {
        // High double beep
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(880, ctx.currentTime);
          gain2.gain.setValueAtTime(0.1, ctx.currentTime);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.1);
        }, 150);
      } else if (type === 'ready') {
        // Friendly chime
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
          gain2.gain.setValueAtTime(0.1, ctx.currentTime);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.15);
        }, 150);
      }
    } catch (err) {
      console.warn("Audio Context blocked or unsupported:", err);
    }
  };

  // Auth actions
  const login = (usernameOrEmail, password, selectedCafeteria) => {
    const normalized = usernameOrEmail.trim().toLowerCase();
    const user = users.find(u => 
      (u.username.toLowerCase() === normalized || u.email.toLowerCase() === normalized) && 
      u.password === password
    );

    if (user) {
      const loggedUser = {
        ...user,
        cafeteria: user.role === 'student' ? selectedCafeteria : (user.cafeteria === 'Both' ? selectedCafeteria : user.cafeteria)
      };
      setCurrentUser(loggedUser);
      localStorage.setItem('cucms_user', JSON.stringify(loggedUser));
      return { success: true, user: loggedUser };
    }
    return { success: false, message: 'Invalid credentials. Check matric/ID/email and password.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cucms_user');
  };

  // Student placing order
  const placeOrder = (items, paymentMethod) => {
    if (!currentUser || currentUser.role !== 'student') return { success: false, message: 'Only students can place orders.' };
    
    // Check if cafeteria queue exceeds maximum capacity
    const activeOrders = orders.filter(o => o.cafeteria === currentUser.cafeteria && (o.status === 'Placed' || o.status === 'Preparing'));
    if (activeOrders.length >= systemConfig.maxQueueCapacity) {
      return { success: false, message: `Order failed. Cafeteria queue is currently full (limit: ${systemConfig.maxQueueCapacity} active orders).` };
    }
    
    // Check active hours (operating window check)
    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (currentHourMin < systemConfig.activeHoursStart || currentHourMin > systemConfig.activeHoursEnd) {
      return { success: false, message: `Order failed. Cafeteria is currently closed. Operating hours: ${systemConfig.activeHoursStart} to ${systemConfig.activeHoursEnd}.` };
    }

    // Calculate total cost
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Check wallet balance if payment method is prepaid wallet
    if (paymentMethod === 'Prepaid Wallet') {
      if (currentUser.walletBalance < total) {
        return { success: false, message: 'Insufficient prepaid wallet balance.' };
      }
      
      // Deduct wallet balance
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
          const newBalance = u.walletBalance - total;
          return { ...u, walletBalance: newBalance };
        }
        return u;
      });
      setUsers(updatedUsers);

      // Create transaction log
      const newTxn = {
        id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        studentMatric: currentUser.username,
        type: 'Debit',
        amount: total,
        description: `Order Payment (Prepaid Wallet)`,
        timestamp: new Date().toISOString()
      };
      setTransactions(prev => [newTxn, ...prev]);
    }

    // Determine Queue Number
    const activeCafeteriaOrders = orders.filter(o => o.cafeteria === currentUser.cafeteria && (o.status === 'Placed' || o.status === 'Preparing'));
    const queueNum = activeCafeteriaOrders.length + 1;
    const etaMinutes = queueNum * 5; // roughly 5 minutes per order

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: currentUser.name,
      studentMatric: currentUser.username,
      studentEmail: currentUser.email,
      items,
      total,
      status: 'Placed',
      queueNum,
      etaMinutes,
      cafeteria: currentUser.cafeteria,
      paymentMethod,
      timestamp: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Trigger audio notification for steward
    playAlert('new_order');

    return { success: true, order: newOrder };
  };

  // Steward / Manager updating status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders => {
      const updated = prevOrders.map(order => {
        if (order.id === orderId) {
          // Trigger audio if ready
          if (newStatus === 'Ready for Pickup') {
            playAlert('ready');
          }
          
          // Re-calculate other queue positions if served/cancelled
          return { 
            ...order, 
            status: newStatus,
            etaMinutes: newStatus === 'Ready for Pickup' ? 2 : (newStatus === 'Served' || newStatus === 'Cancelled' ? 0 : order.etaMinutes)
          };
        }
        return order;
      });

      // Recalculate queue positions for remaining items in the cafeteria
      const activeQueue = updated
        .filter(o => (o.status === 'Placed' || o.status === 'Preparing'))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      return updated.map(order => {
        if (order.status === 'Placed' || order.status === 'Preparing') {
          const index = activeQueue.findIndex(q => q.id === order.id);
          return {
            ...order,
            queueNum: index + 1,
            etaMinutes: (index + 1) * 5
          };
        }
        return order;
      });
    });
  };

  // Student wallet top up
  const topUpWallet = (amount) => {
    if (!currentUser || currentUser.role !== 'student') return { success: false };
    
    const depositAmt = parseFloat(amount);
    if (isNaN(depositAmt) || depositAmt <= 0) return { success: false, message: 'Invalid deposit amount.' };

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, walletBalance: u.walletBalance + depositAmt };
      }
      return u;
    });
    setUsers(updatedUsers);

    const newTxn = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      studentMatric: currentUser.username,
      type: 'Credit',
      amount: depositAmt,
      description: 'Prepaid Wallet Deposit (Bank Transfer/POS Mock)',
      timestamp: new Date().toISOString()
    };

    setTransactions(prev => [newTxn, ...prev]);
    return { success: true };
  };

  // Manager toggling stock availability
  const toggleItemAvailability = (itemId) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, available: !item.available };
      }
      return item;
    }));
  };

  // Manager updating menu details
  const updateItemDetails = (itemId, updatedData) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, ...updatedData };
      }
      return item;
    }));
  };

  // Manager adding food item
  const addMenuItem = (item) => {
    const newItem = {
      id: `m${menuItems.length + 1}`,
      ...item,
      available: true
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  // Admin updating permissions/users
  const addStaffOrUser = (newUser) => {
    const userExists = users.some(u => u.username === newUser.username || u.email === newUser.email);
    if (userExists) return { success: false, message: 'Matric number, Staff ID, or Email already registered.' };
    
    const created = {
      id: `u${users.length + 1}`,
      walletBalance: newUser.role === 'student' ? 0 : undefined,
      ...newUser
    };
    setUsers(prev => [...prev, created]);
    return { success: true };
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <CucmsContext.Provider value={{
      currentUser,
      menuItems,
      orders,
      transactions,
      users,
      systemConfig,
      setSystemConfig,
      login,
      logout,
      placeOrder,
      updateOrderStatus,
      topUpWallet,
      toggleItemAvailability,
      updateItemDetails,
      addMenuItem,
      addStaffOrUser,
      deleteUser,
      playAlert
    }}>
      {children}
    </CucmsContext.Provider>
  );
};

export const useCucms = () => {
  const context = useContext(CucmsContext);
  if (!context) throw new Error('useCucms must be used within CucmsProvider');
  return context;
};
