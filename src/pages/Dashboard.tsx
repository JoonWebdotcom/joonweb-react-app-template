import React from 'react';
import { useAppBridge } from '@joonweb/app-bridge-react';
import { Settings, BarChart3, Users, Zap, Package, ExternalLink, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { appBridge, isReady: isBridgeReady } = useAppBridge();
  
  const params = new URLSearchParams(window.location.search);
  const sessionToken = params.get('sessionToken') || localStorage.getItem('sessionToken') || '';
  const siteDomain = params.get('site') || localStorage.getItem('site') || 'Unknown Store';
  
  if (params.get('sessionToken')) localStorage.setItem('sessionToken', params.get('sessionToken') as string);
  if (params.get('site')) localStorage.setItem('site', params.get('site') as string);

  // Example placeholder for product fetching (mocked since useJoonweb signature issues were resolved earlier, but keeping it robust)
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (sessionToken || siteDomain) {
      setLoading(true);
      fetch(`/api/products?site=${siteDomain}`, { 
        headers: { Authorization: `Bearer ${sessionToken}` } 
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.data) {
             setProducts(data.data);
          } else {
             setProducts([]);
          }
        })
        .catch(err => {
          console.error('Failed to load products', err);
          appBridge?.actions.Toast.show({ message: 'Failed to load products' });
        })
        .finally(() => setLoading(false));
    }
  }, [sessionToken, siteDomain, appBridge]);

  // Auto-inject the Admin Menu when the bridge is ready
  React.useEffect(() => {
    if (appBridge) {
      appBridge.actions.Navigation.setMenu({
        items: [
          { label: 'Overview', destination: '/', active: true },
          { label: 'Settings', destination: '/settings' },
          { label: 'Help', destination: '/help' }
        ]
      });
    }
  }, [appBridge]);

  const handleProductPicker = async () => {
    try {
      const selected = await appBridge?.actions.Components.show('ProductPicker');
      appBridge?.actions.Toast.show({ message: `Selected ${selected?.length || 0} products` });
    } catch (e) {
      console.log('Product picker closed', e);
    }
  };

  const handleFileManager = async () => {
    try {
      const file = await appBridge?.actions.Components.show('FileManager');
      appBridge?.actions.Toast.show({ message: `File selected: ${file?.name || 'Unknown'}` });
    } catch (e) {
      console.log('File manager closed', e);
    }
  };

  const handleLinkManager = async () => {
    try {
      const link = await appBridge?.actions.Components.show('LinkManager');
      appBridge?.actions.Toast.show({ message: `Link selected: ${link?.title || 'Unknown'}` });
      console.log('Link Manager opened', link);
    } catch (e) {
      console.log('Link manager closed', e);
    }
  };

  if (!isBridgeReady) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <h2 style={styles.loadingTitle}>Connecting</h2>
        <p style={styles.loadingText}>Verifying session with JoonWeb...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>
            Overview for <span style={styles.highlight}>{siteDomain}</span>
          </p>
        </div>
        <div style={styles.headerActions}>
          <button 
            style={styles.secondaryButton}
            onClick={() => window.open(`https://${siteDomain}`, '_blank')}
          >
            <ExternalLink size={16} />
            View Store
          </button>
          <button 
            style={styles.primaryButton}
            onClick={() => appBridge?.actions.Toast.show({ message: 'Settings opened' })}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Total Revenue</h3>
            <BarChart3 size={18} color="#6b7280" strokeWidth={1.5} />
          </div>
          <div style={styles.metricValue}>$12,450.00</div>
          <p style={styles.metricTrend}><span style={styles.trendUp}>+14.5%</span> from last month</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Active Customers</h3>
            <Users size={18} color="#6b7280" strokeWidth={1.5} />
          </div>
          <div style={styles.metricValue}>1,204</div>
          <p style={styles.metricTrend}><span style={styles.trendUp}>+5.2%</span> from last month</p>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>App Bridge Components</h3>
            <Zap size={18} color="#6b7280" strokeWidth={1.5} />
          </div>
          <div style={styles.componentActions}>
            <button style={styles.actionButton} onClick={handleProductPicker}>
              Open Product Picker
            </button>
            <button style={styles.actionButton} onClick={handleFileManager}>
              Open File Manager
            </button>
            <button style={styles.actionButton} onClick={handleLinkManager}>
              Open Link Manager
            </button>
            <button style={styles.actionButton} onClick={() => appBridge?.actions.Toast.show({ message: 'Hello from React!' })}>
              Show Toast
            </button>
          </div>
        </div>
      </div>
      
      {/* Products Table */}
      <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
         <div style={styles.tableHeader}>
           <h2 style={styles.tableTitle}>
             <Package size={20} strokeWidth={1.5} /> 
             Recent Products
           </h2>
           <button style={styles.iconButton} onClick={() => setLoading(true)}>
             <RefreshCw size={16} color="#6b7280" />
           </button>
         </div>
         
         <div style={styles.tableContainer}>
           {loading ? (
             <div style={styles.tableLoading}>Loading products...</div>
           ) : products.length === 0 ? (
             <div style={styles.tableEmpty}>No products found.</div>
           ) : (
             <table style={styles.table}>
               <thead>
                 <tr>
                   <th style={styles.th}>Product</th>
                   <th style={styles.th}>Status</th>
                   <th style={styles.th}>Inventory</th>
                   <th style={styles.th}>Price</th>
                 </tr>
               </thead>
               <tbody>
                 {products.map((product: any) => (
                   <tr key={product.id} style={styles.tr}>
                     <td style={styles.td}>
                       <div style={styles.productName}>{product.title}</div>
                     </td>
                     <td style={styles.td}>
                       <span style={product.stock > 0 ? styles.badgeActive : styles.badgeInactive}>
                         {product.status}
                       </span>
                     </td>
                     <td style={styles.td}>
                       <span style={{ color: product.stock > 0 || product.quantity > 0 ? '#374151' : '#ef4444' }}>
                         {product.stock || product.quantity || 0} in stock
                       </span>
                     </td>
                     <td style={styles.td}>
                       <span style={styles.productPrice}>{product.price || product.price_raw || 'N/A'}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
         </div>
      </div>
    </div>
  );
};

// Minimal, Professional Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#111827',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '"Inter", sans-serif',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingTitle: {
    fontSize: '18px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: '#111827',
  },
  loadingText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 600,
    margin: '0 0 4px 0',
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  highlight: {
    color: '#111827',
    fontWeight: 500,
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#111827',
    color: '#ffffff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#6b7280',
    margin: 0,
  },
  metricValue: {
    fontSize: '32px',
    fontWeight: 600,
    color: '#111827',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  metricTrend: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  trendUp: {
    color: '#059669',
    fontWeight: 500,
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#111827',
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '12px 24px',
    fontSize: '12px',
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    borderBottom: '1px solid #e5e7eb',
  },
  tr: {
    transition: 'background-color 0.15s',
  },
  productName: {
    fontWeight: 500,
    color: '#111827',
  },
  productPrice: {
    color: '#374151',
  },
  badgeActive: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  badgeInactive: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
  tableLoading: {
    padding: '32px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },
  tableEmpty: {
    padding: '32px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },
  componentActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  },
  actionButton: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #e5e7eb',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  }
};

export default Dashboard;
