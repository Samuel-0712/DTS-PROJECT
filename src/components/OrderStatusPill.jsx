import React from 'react';

const OrderStatusPill = ({ status }) => {
  let bg = '';
  let color = '';
  let border = '';
  let dotClass = '';
  
  switch (status) {
    case 'Placed':
      bg = 'var(--status-placed-bg)';
      color = 'var(--status-placed-text)';
      border = '1px solid var(--status-placed-border)';
      break;
    case 'Preparing':
      bg = 'var(--status-preparing-bg)';
      color = 'var(--status-preparing-text)';
      border = '1px solid var(--status-preparing-border)';
      dotClass = 'animate-pulse';
      break;
    case 'Ready for Pickup':
    case 'Ready':
      bg = 'var(--status-ready-bg)';
      color = 'var(--status-ready-text)';
      border = '1px solid var(--status-ready-border)';
      dotClass = 'animate-bounce';
      break;
    case 'Served':
      bg = 'var(--status-served-bg)';
      color = 'var(--status-served-text)';
      border = '1px solid var(--status-served-border)';
      break;
    case 'Cancelled':
      bg = 'var(--status-cancelled-bg)';
      color = 'var(--status-cancelled-text)';
      border = '1px solid var(--status-cancelled-border)';
      break;
    default:
      bg = 'var(--color-border)';
      color = 'var(--color-text-secondary)';
      border = '1px solid var(--color-border)';
  }

  return (
    <span 
      className="badge animate-fade" 
      style={{ backgroundColor: bg, color: color, border: border, gap: '6px', display: 'inline-flex', alignItems: 'center' }}
    >
      {dotClass && (
        <span 
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: color,
            display: 'inline-block'
          }} 
          className={dotClass}
        />
      )}
      {status}
    </span>
  );
};

export default OrderStatusPill;
