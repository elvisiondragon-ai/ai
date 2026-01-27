const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f8f8',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '4em',
        margin: '0.2em',
        color: '#ff6347' // Tomato color
      }}>404</h1>
      <p style={{
        fontSize: '1.5em',
        marginBottom: '1em'
      }}>Anda Salah Pages Loh !</p>
      <p style={{
        fontSize: '1em',
        color: '#666'
      }}>The page you are looking for does not exist.</p>
      <a href="/" style={{
        marginTop: '2em',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease'
      }}>Go to Home</a>
    </div>
  );
};

export default NotFound;
