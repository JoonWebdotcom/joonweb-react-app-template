import React from 'react';
import { useJoonweb } from '@joonweb/react';
import { useAppBridge } from '@joonweb/app-bridge-react';
import { Settings, BarChart3, Users, Zap, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { appBridge, isReady: isBridgeReady } = useAppBridge();
  const params = new URLSearchParams(window.location.search);
  const sessionToken = params.get('sessionToken') || localStorage.getItem('sessionToken') || '';
  const siteDomain = params.get('site') || localStorage.getItem('site') || 'Unknown Store';
  
  if (params.get('sessionToken')) localStorage.setItem('sessionToken', params.get('sessionToken') as string);
  if (params.get('site')) localStorage.setItem('site', params.get('site') as string);

  if (!isBridgeReady) {
    return (
      <div className="glass-card animate-fade-in" style={{ textAlign: 'center', marginTop: '20vh', maxWidth: '400px', margin: '20vh auto' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <h2 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Authenticating Session</h2>
        <p style={{ color: '#94a3b8', margin: 0 }}>Securely connecting to Joonweb servers...</p>
      </div>
    );
  }

  // Fetch real products via our Node backend, which uses the Node SDK!
  const { data: productsResponse, loading, error } = useJoonweb('/api/products', {
    headers: { Authorization: `Bearer ${sessionToken}` }
  });

  if (loading) {
    return (
      <div className="glass-card animate-fade-in" style={{ textAlign: 'center', marginTop: '20vh', maxWidth: '400px', margin: '20vh auto' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <h2 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>Loading Store Data</h2>
        <p style={{ color: '#94a3b8', margin: 0 }}>Fetching products via SDK...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card animate-fade-in" style={{ textAlign: 'center', marginTop: '20vh', maxWidth: '400px', margin: '20vh auto' }}>
        <h2 style={{ color: '#ef4444', margin: '0 0 0.5rem 0' }}>Error Loading Data</h2>
        <p style={{ color: '#94a3b8', margin: 0 }}>{error.message}</p>
      </div>
    );
  }

  const products = productsResponse?.data || [];

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Store Overview
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
            Managing <strong style={{ color: '#fff' }}>{siteDomain}</strong>
          </p>
        </div>
        <button 
          onClick={() => {
            if (isBridgeReady) {
              appBridge.actions.Toast.show({ message: 'Settings opened via App Bridge!' });
            }
          }}
          className="btn-primary" 
          style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '12px', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}>
          <Settings size={18} />
          <span>App Settings</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ animationDelay: '0.1s', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px' }}><BarChart3 size={24} color="#6366f1" /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Total Revenue</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>$12,450</div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>+14.5%</span> from last month
          </p>
        </div>

        <div className="glass-card" style={{ animationDelay: '0.2s', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '10px' }}><Users size={24} color="#a855f7" /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>Active Customers</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>1,204</div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>+5.2%</span> from last month
          </p>
        </div>

        <div className="glass-card" style={{ animationDelay: '0.3s', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#94a3b8', marginBottom: '1rem' }}>
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}><Zap size={24} color="#f59e0b" /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>System Status</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Optimal</div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>All services running smoothly</p>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="glass-card" style={{ animationDelay: '0.4s', padding: '2rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Package size={24} color="#3b82f6" /> Recent Products
           </h2>
           <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>View All</button>
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           {products.length === 0 ? (
             <p style={{ color: '#94a3b8' }}>No products found in this store.</p>
           ) : (
             products.map((product: any) => (
               <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div>
                   <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '1.1rem' }}>{product.title || product.name || 'Unnamed Product'}</h4>
                   <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{product.stock || 0} in stock</p>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                   <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{product.price || '$0.00'}</span>
                   <span style={{ 
                     padding: '4px 10px', 
                     borderRadius: '20px', 
                     fontSize: '0.85rem', 
                     fontWeight: 500,
                     background: 'rgba(16, 185, 129, 0.1)',
                     color: '#10b981'
                   }}>
                     Active
                   </span>
                 </div>
               </div>
             ))
           )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
