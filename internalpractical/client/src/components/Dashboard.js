import React, { useEffect, useState } from 'react';
import API from '../services/api';
export default function Dashboard(){
  const [user, setUser] = useState(null);
  useEffect(()=>{
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);
  return <div>{user ? <h3>Welcome, {user.name}</h3> : <p>Loading...</p>}</div>;
}