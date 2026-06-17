import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle } from 'lucide-react';
import OrderStatusPill from './OrderStatusPill';

const ReceiptModal = ({ order, onClose }) => {
  const receiptRef = useRef();

  if (!order) return null;

  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Create temporary print window style
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body { background: white; color: black; padding: 20px; font-family: Arial, sans-serif; }
        .no-print { display: none !important; }
        .receipt-container { border: none !important; box-shadow: none !important; }
      }
    `;
    document.head.appendChild(style);
    
    window.print();
    
    // Cleanup
    document.head.removeChild(style);
  };

  const handleDownload = () => {
    // Simulated PDF download
    const element = document.createElement("a");
    const file = new Blob([
      `COVENANT UNIVERSITY CAFETERIA RECEIPT\n`,
      `======================================\n`,
      `Receipt ID: ${order.id}\n`,
      `Cafeteria: ${order.cafeteria}\n`,
      `Date/Time: ${new Date(order.timestamp).toLocaleString()}\n`,
      `Student Name: ${order.studentName}\n`,
      `Matric Number: ${order.studentMatric}\n`,
      `--------------------------------------\n`,
      order.items.map(item => `${item.name} x${item.qty} - NGN ${(item.price * item.qty).toLocaleString()}`).join('\n'),
      `\n--------------------------------------\n`,
      `Total Amount: NGN ${order.total.toLocaleString()}\n`,
      `Payment Method: ${order.paymentMethod}\n`,
      `Status: ${order.status}\n`,
      `======================================\n`,
      `Thank you for your patronage!`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `CUCMS_Receipt_${order.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="receipt-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card animate-slide" style={{
        maxWidth: '450px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        padding: '0',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--color-deep-navy)',
          color: 'white'
        }}>
          <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Digital Receipt</span>
          </h3>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.8)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Printable Area */}
        <div ref={receiptRef} style={{
          padding: '30px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          color: '#334155'
        }} className="receipt-container">
          {/* School branding */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-deep-navy)',
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '0 auto 10px',
              border: '2px solid var(--color-gold)'
            }}>
              CU
            </div>
            <h4 style={{ color: 'var(--color-deep-navy)', fontSize: '15px', fontWeight: '600', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
              Covenant University Cafeterias
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
              {order.cafeteria} Operations Portal
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            borderBottom: '1px dashed var(--color-border)',
            paddingBottom: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <p style={{ margin: '0 0 4px 0' }}><strong>Receipt ID:</strong> {order.id}</p>
              <p style={{ margin: 0 }}><strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px 0' }}><strong>Matric:</strong> {order.studentMatric}</p>
              <p style={{ margin: 0 }}><strong>Name:</strong> {order.studentName}</p>
            </div>
          </div>

          {/* Items Table */}
          <div style={{ marginBottom: '20px' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>
                  <th style={{ textAlign: 'left', padding: '6px 0' }}>Item Description</th>
                  <th style={{ textAlign: 'center', padding: '6px 0', width: '50px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', width: '80px' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 0', textAlign: 'left' }}>{item.name}</td>
                    <td style={{ padding: '8px 0', textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right' }}>₦{(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div style={{
            backgroundColor: 'var(--color-warm-white)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Payment Mode:</span>
              <strong style={{ color: 'var(--color-deep-navy)' }}>{order.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Order Status:</span>
              <OrderStatusPill status={order.status} />
            </div>
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--color-border)', fontSize: '15px' }}>
              <strong>Total Amount:</strong>
              <strong style={{ color: 'var(--color-covenant-blue)' }}>₦{order.total.toLocaleString()}</strong>
            </div>
          </div>

          {/* QR Code Validation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '6px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}>
              {/* Custom SVG QR Code representation */}
              <svg viewBox="0 0 100 100" width="80" height="80">
                <rect x="0" y="0" width="20" height="20" fill="currentColor"/>
                <rect x="0" y="80" width="20" height="20" fill="currentColor"/>
                <rect x="80" y="0" width="20" height="20" fill="currentColor"/>
                <rect x="5" y="5" width="10" height="10" fill="white"/>
                <rect x="5" y="85" width="10" height="10" fill="white"/>
                <rect x="85" y="5" width="10" height="10" fill="white"/>
                {/* Random QR code pixels */}
                <rect x="30" y="10" width="10" height="20" fill="currentColor"/>
                <rect x="50" y="0" width="20" height="10" fill="currentColor"/>
                <rect x="30" y="40" width="30" height="10" fill="currentColor"/>
                <rect x="10" y="30" width="15" height="15" fill="currentColor"/>
                <rect x="70" y="30" width="10" height="30" fill="currentColor"/>
                <rect x="0" y="60" width="10" height="10" fill="currentColor"/>
                <rect x="30" y="70" width="20" height="20" fill="currentColor"/>
                <rect x="60" y="80" width="30" height="10" fill="currentColor"/>
                <rect x="80" y="60" width="10" height="15" fill="currentColor"/>
                <rect x="50" y="60" width="15" height="10" fill="currentColor"/>
              </svg>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Scan at Pickup Counter
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '12px',
          backgroundColor: 'var(--color-warm-white)'
        }} className="no-print">
          <button className="btn btn-secondary" onClick={handlePrint} style={{ flex: 1 }}>
            <Printer size={16} />
            Print
          </button>
          <button className="btn btn-primary" onClick={handleDownload} style={{ flex: 1 }}>
            <Download size={16} />
            Download TXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
