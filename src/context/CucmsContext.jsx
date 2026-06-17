import React, { createContext, useState, useEffect, useContext } from 'react';

const CucmsContext = createContext();

// Predefined mock data (used as fallback when backend is offline)
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
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

const INITIAL_TRANSACTIONS = [
  { id: 'TXN-001', studentMatric: '21/1042', type: 'Debit', amount: 2550, description: 'Order ORD-8291 Payment', timestamp: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: 'TXN-002', studentMatric: '21/1042', type: 'Credit', amount: 10000, description: 'Prepaid Wallet Deposit (Bank Transfer)', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() }
];

const API_URL = 'http://localhost:3000/api';

export const CucmsProvider = ({ children }) => {
  // Flag indicating if live backend connection is active
  const [useRealBackend, setUseRealBackend] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('cucms_token') || null);

  // Core App states (synced from DB or Mock)
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

  // Check backend server availability on startup
  useEffect(() => {
    fetch('http://localhost:3000/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setUseRealBackend(true);
          console.log("CUCMS: Connected to live MySQL API Backend on port 3000.");
        }
      })
      .catch(() => {
        setUseRealBackend(false);
        console.log("CUCMS: Live backend offline. Falling back to local storage simulation.");
      });
  }, []);

  // Sync state between tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cucms_orders') {
        setOrders(JSON.parse(e.newValue));
      } else if (e.key === 'cucms_users') {
        setUsers(JSON.parse(e.newValue));
      } else if (e.key === 'cucms_menu') {
        setMenuItems(JSON.parse(e.newValue));
      } else if (e.key === 'cucms_transactions') {
        setTransactions(JSON.parse(e.newValue));
      } else if (e.key === 'cucms_user') {
        setCurrentUser(JSON.parse(e.newValue));
      } else if (e.key === 'cucms_token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch helper mapping API queries
  const apiRequest = async (path, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { method, headers };
    if (body) {
      config.body = JSON.stringify(body);
    }
    const res = await fetch(`${API_URL}${path}`, config);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Server error occurred');
    }
    return await res.json();
  };

  // Sync state from Database
  const fetchMenu = async () => {
    try {
      if (!useRealBackend) return;
      const data = await apiRequest('/menu');
      // Coerce numeric fields and format images
      const formatted = data.map(item => {
        // Fallback images from the mock menu
        const mockMatch = INITIAL_MENU.find(m => m.name.toLowerCase().includes(item.name.toLowerCase()));
        return {
          id: item.menu_item_id,
          name: item.name,
          price: Number(item.price),
          category: mockMatch ? mockMatch.category : 'Rice & Pasta',
          available: Boolean(item.is_available),
          image: mockMatch ? mockMatch.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=60',
          cafeteria_id: item.cafeteria_id
        };
      });
      setMenuItems(formatted);
      localStorage.setItem('cucms_menu', JSON.stringify(formatted));
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!useRealBackend) return;
      const data = await apiRequest('/orders');
      
      const formatted = data.map(o => {
        // Map backend states
        let status = 'Placed';
        if (o.served_by_user_id) {
          status = 'Served';
        } else {
          // If order is unserved, read intermediate local status if synced, or default to Placed
          const localMatch = orders.find(lo => lo.id === `ORD-${o.order_id}`);
          if (localMatch && ['Preparing', 'Ready for Pickup'].includes(localMatch.status)) {
            status = localMatch.status;
          }
        }

        return {
          id: `ORD-${o.order_id}`,
          db_id: o.order_id,
          studentName: o.student_name || 'Student',
          studentMatric: o.placed_by_user_id.toString(),
          items: o.items.map(item => ({
            id: item.menu_item_id,
            name: item.name,
            price: Number(item.unit_price),
            qty: item.quantity
          })),
          total: Number(o.payment_amount),
          status,
          queueNum: 1, // simulated locally
          etaMinutes: status === 'Ready for Pickup' ? 2 : (status === 'Served' ? 0 : 5),
          cafeteria: o.cafeteria_id === 2 ? 'Cafeteria 2' : 'Cafeteria 1',
          paymentMethod: o.payment_method === 'prepaid' ? 'Prepaid Wallet' : (o.payment_method === 'bank_transfer' ? 'Bank Transfer' : o.payment_method.toUpperCase()),
          timestamp: o.placed_at
        };
      });
      setOrders(formatted);
      localStorage.setItem('cucms_orders', JSON.stringify(formatted));
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const fetchPrepaid = async () => {
    try {
      if (!useRealBackend || currentUser?.role !== 'student') return;
      const data = await apiRequest('/prepaid/me');
      
      // Update local wallet balance state for current student
      if (currentUser) {
        const updatedUser = { ...currentUser, walletBalance: Number(data.balance) };
        setCurrentUser(updatedUser);
        localStorage.setItem('cucms_user', JSON.stringify(updatedUser));
      }

      const txns = data.transactions.map(t => ({
        id: `TXN-${t.prepaid_txn_id}`,
        studentMatric: currentUser.username,
        type: t.txn_type === 'deposit' ? 'Credit' : 'Debit',
        amount: Number(t.amount),
        description: t.txn_type === 'deposit' ? 'Prepaid Wallet Deposit' : `Order ORD-${t.paid_order_id} Payment`,
        timestamp: t.created_at
      }));
      setTransactions(txns);
      localStorage.setItem('cucms_transactions', JSON.stringify(txns));
    } catch (err) {
      console.error("Failed to fetch prepaid details:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      if (!useRealBackend || currentUser?.role !== 'admin') return;
      const data = await apiRequest('/auth/users');
      setUsers(data);
      localStorage.setItem('cucms_users', JSON.stringify(data));
    } catch (err) {
      console.error("Failed to fetch users list:", err);
    }
  };

  // Sync data automatically when live backend flag is activated or user logs in
  useEffect(() => {
    if (useRealBackend && token) {
      fetchMenu();
      fetchOrders();
      fetchPrepaid();
      fetchUsers();
    }
  }, [useRealBackend, token]);

  // Sync fallback localstorage mocks when backend is offline
  useEffect(() => {
    if (!useRealBackend) {
      localStorage.setItem('cucms_menu', JSON.stringify(menuItems));
    }
  }, [menuItems, useRealBackend]);

  useEffect(() => {
    if (!useRealBackend) {
      localStorage.setItem('cucms_users', JSON.stringify(users));
      if (currentUser) {
        const freshUser = users.find(u => u.id === currentUser.id);
        if (freshUser) {
          const mergedUser = {
            ...freshUser,
            cafeteria: currentUser.cafeteria
          };
          if (JSON.stringify(mergedUser) !== JSON.stringify(currentUser)) {
            setCurrentUser(mergedUser);
            localStorage.setItem('cucms_user', JSON.stringify(mergedUser));
          }
        }
      }
    }
  }, [users, currentUser, useRealBackend]);

  useEffect(() => {
    if (!useRealBackend) {
      localStorage.setItem('cucms_orders', JSON.stringify(orders));
    }
  }, [orders, useRealBackend]);

  useEffect(() => {
    if (!useRealBackend) {
      localStorage.setItem('cucms_transactions', JSON.stringify(transactions));
    }
  }, [transactions, useRealBackend]);

  // Audio Alerts helper
  const playAlert = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'new_order') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'ready') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (err) {}
  };

  // Auth actions
  const login = async (usernameOrEmail, password, selectedCafeteria) => {
    if (useRealBackend) {
      try {
        const res = await apiRequest('/auth/login', 'POST', {
          email: usernameOrEmail,
          password
        });
        
        // Save auth state
        localStorage.setItem('cucms_token', res.token);
        setToken(res.token);
        
        const loggedUser = {
          id: res.user.id,
          username: usernameOrEmail,
          email: res.user.email || usernameOrEmail,
          name: res.user.name,
          role: res.user.role,
          cafeteria: selectedCafeteria,
          walletBalance: 0 // Will load on fetchPrepaid
        };

        setCurrentUser(loggedUser);
        localStorage.setItem('cucms_user', JSON.stringify(loggedUser));
        return { success: true, user: loggedUser };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      // Mock Fallback Login
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
      return { success: false, message: 'Invalid credentials. Check email and password.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('cucms_user');
    localStorage.removeItem('cucms_token');
  };

  // Student placing order
  const placeOrder = async (items, paymentMethod) => {
    if (useRealBackend) {
      try {
        // Map payment method to enum matching backend
        const methodMap = {
          'Prepaid Wallet': 'prepaid',
          'Bank Transfer': 'bank_transfer',
          'POS': 'pos',
          'Cash': 'cash'
        };
        const payment_method = methodMap[paymentMethod] || 'cash';

        const body = {
          items: items.map(item => ({
            menu_item_id: item.id,
            quantity: item.qty
          })),
          payment_method
        };

        const res = await apiRequest('/orders', 'POST', body);
        
        // Refresh states
        await fetchOrders();
        await fetchPrepaid();

        const placed = {
          id: `ORD-${res.order_id}`,
          total: res.total,
          paymentMethod,
          timestamp: new Date().toISOString(),
          studentName: currentUser.name,
          studentMatric: currentUser.username,
          cafeteria: currentUser.cafeteria,
          status: 'Placed',
          items
        };

        return { success: true, order: placed };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      // Mock Fallback PlaceOrder
      if (!currentUser || currentUser.role !== 'student') return { success: false, message: 'Only students can place orders.' };
      const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      
      if (paymentMethod === 'Prepaid Wallet') {
        if (currentUser.walletBalance < total) {
          return { success: false, message: 'Insufficient prepaid wallet balance.' };
        }
        const updatedUsers = users.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, walletBalance: u.walletBalance - total };
          }
          return u;
        });
        setUsers(updatedUsers);

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

      const activeCafeteriaOrders = orders.filter(o => o.cafeteria === currentUser.cafeteria && (o.status === 'Placed' || o.status === 'Preparing'));
      const queueNum = activeCafeteriaOrders.length + 1;
      const etaMinutes = queueNum * 5;

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
      playAlert('new_order');
      return { success: true, order: newOrder };
    }
  };

  // Steward / Manager updating status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (useRealBackend) {
      try {
        const numericId = orderId.replace('ORD-', '');
        
        // Intermediate status tracker simulation locally
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        // If the status is 'Served', make the real backend API call
        if (newStatus === 'Served') {
          await apiRequest(`/orders/${numericId}/serve`, 'PATCH');
          await fetchOrders();
        }
        
        if (newStatus === 'Ready for Pickup') {
          playAlert('ready');
        }
      } catch (err) {
        console.error("Failed to update status on server:", err);
      }
    } else {
      // Mock Fallback UpdateStatus
      setOrders(prevOrders => {
        const updated = prevOrders.map(order => {
          if (order.id === orderId) {
            if (newStatus === 'Ready for Pickup') {
              playAlert('ready');
            }
            return { 
              ...order, 
              status: newStatus,
              etaMinutes: newStatus === 'Ready for Pickup' ? 2 : (newStatus === 'Served' || newStatus === 'Cancelled' ? 0 : order.etaMinutes)
            };
          }
          return order;
        });

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
    }
  };

  // Student wallet top up
  const topUpWallet = async (amount) => {
    if (useRealBackend) {
      try {
        await apiRequest('/prepaid/topup', 'POST', { amount: parseFloat(amount) });
        await fetchPrepaid();
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      // Mock Fallback TopUp
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
    }
  };

  // Manager toggling stock availability
  const toggleItemAvailability = async (itemId) => {
    if (useRealBackend) {
      try {
        const item = menuItems.find(i => i.id === itemId);
        if (!item) return;
        await apiRequest(`/menu/${itemId}`, 'PATCH', {
          is_available: !item.available
        });
        await fetchMenu();
      } catch (err) {
        console.error("Failed to toggle availability:", err);
      }
    } else {
      setMenuItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return { ...item, available: !item.available };
        }
        return item;
      }));
    }
  };

  // Manager updating menu details
  const updateItemDetails = async (itemId, updatedData) => {
    if (useRealBackend) {
      try {
        await apiRequest(`/menu/${itemId}`, 'PATCH', {
          price: updatedData.price
        });
        await fetchMenu();
      } catch (err) {
        console.error("Failed to update item price:", err);
      }
    } else {
      setMenuItems(prev => prev.map(item => {
        if (item.id === itemId) {
          return { ...item, ...updatedData };
        }
        return item;
      }));
    }
  };

  // Manager adding food item
  const addMenuItem = async (item) => {
    if (useRealBackend) {
      try {
        await apiRequest('/menu', 'POST', {
          name: item.name,
          price: item.price,
          cafeteria_id: currentUser.cafeteria === 'Cafeteria 2' ? 2 : 1
        });
        await fetchMenu();
      } catch (err) {
        console.error("Failed to create menu item:", err);
      }
    } else {
      const newItem = {
        id: `m${menuItems.length + 1}`,
        ...item,
        available: true
      };
      setMenuItems(prev => [...prev, newItem]);
    }
  };

  // Admin updating permissions/users
  const addStaffOrUser = async (newUser) => {
    if (useRealBackend) {
      try {
        // Map fields
        const body = {
          name: newUser.name,
          email: newUser.email,
          password: newUser.password || 'password123',
          role: newUser.role,
          cafeteria_id: newUser.cafeteria === 'Cafeteria 2' ? 2 : 1,
          phone: newUser.phone || null,
          matriculation_no: newUser.username,
          staff_type: newUser.role === 'steward' ? 'Cook' : null
        };
        
        await apiRequest('/auth/register', 'POST', body);
        await fetchUsers();
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      }
    } else {
      // Mock Fallback
      const userExists = users.some(u => u.username === newUser.username || u.email === newUser.email);
      if (userExists) return { success: false, message: 'Matric number, Staff ID, or Email already registered.' };
      
      const created = {
        id: `u${users.length + 1}`,
        walletBalance: newUser.role === 'student' ? 0 : undefined,
        ...newUser
      };
      setUsers(prev => [...prev, created]);
      return { success: true };
    }
  };

  const deleteUser = async (userId) => {
    if (useRealBackend) {
      try {
        await apiRequest(`/auth/users/${userId}`, 'DELETE');
        await fetchUsers();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    } else {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
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
      useRealBackend,
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
