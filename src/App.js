import React, {useState, useMemo} from 'react';
import Login from './components/Login'
import Cookies from 'js-cookie'
import { UserContext } from './UserContext'
import LandingPage from './components/LandingPage'

import './App.css';

// eslint-disable-next-line
import ReactNotification from 'react-notifications-component'

function App() {
  const [user,setUser] = useState(null);
  const value = useMemo(() => ({user, setUser}), [user,setUser]);
  //const [Usuario_SM,setUsuario_SM] = useState(Cookies.get('Usuario_SM'));
  const Usuario_SM = Cookies.get('Usuario_SM');

  console.log(process.env.REACT_APP_DOMAIN);

  return (
    <div className="App">
      <UserContext.Provider value={value}>
        {Usuario_SM ? (
                    <LandingPage/>
                ) : (
                    <Login/>
                )
        }
      </UserContext.Provider>
    </div>
  );
}

export default App;
