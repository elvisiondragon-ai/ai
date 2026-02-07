
import { Link } from 'react-router-dom';

const WebList = () => {
  const webinarRoutes = [
    { name: 'Webinar eL Vision Global', path: '/webpay' },
    { name: 'Webinar Anak Mandiri', path: '/webinar_anakmandiri' },
    { name: 'Webinar Bapak', path: '/webinar_bapak' },
    { name: 'Webinar Burnout', path: '/webinar_burnout' },
    { name: 'Webinar Ibu', path: '/webinar_ibu' },
    { name: 'Webinar Ibu Istri', path: '/webinar_ibuistri' },
    { name: 'Webinar Ibu Jodoh', path: '/webinar_ibujodoh' },
    { name: 'Webinar Ortu Anak', path: '/webinar_ortuanak' },
    { name: 'Webinar Ortu Sakit', path: '/webinar_ortusakit' },
    { name: 'Webinar Pria Single', path: '/webinar_priasingle' },
    { name: 'Webinar Pria Susis', path: '/webinar_priasusis' },
    { name: 'Webinar Sopan Mandiri', path: '/webinar_sopanmandiri' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', padding: '20px' }}>Maaf Pendaftaran Tutup</div>
      <div style={{ fontFamily: "'Inter', sans-serif", padding: '20px', maxWidth: '600px', margin: '50px auto', backgroundColor: '#f8fafc', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#1e293b', fontSize: '2em', marginBottom: '20px', textAlign: 'center' }}>Webinar List</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {webinarRoutes.map((route, index) => (
          <li key={index} style={{ marginBottom: '10px', backgroundColor: '#ffffff', padding: '15px', borderRadius: '5px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#475569', fontSize: '1.1em' }}>{route.name}</span>
            <Link to={route.path} style={{ textDecoration: 'none', color: '#0ea5e9', fontWeight: 'bold' }}>
              View Page
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default WebList;
