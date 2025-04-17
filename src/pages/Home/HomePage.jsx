import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  //const [books, setBooks] = useState([]);



  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>الصفحة الرئيسية</h1>
      <p>مرحباً بكم في التطبيق</p>

      <button 
        onClick={handleLoginRedirect}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        الانتقال إلى تسجيل الدخول
      </button>

     
    </div>
  );
};

export default HomePage;
