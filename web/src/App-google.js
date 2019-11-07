import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
 
import './App.css';


const responseGoogle = (response) => {
  localStorage.setItem('auth', response)
  console.log('response', response);
  const { googleId, accessToken, profileObj } = response

  /* inserta a la db... */
}

const logout = (res) => {

  console.log('session finish', res)

  localStorage.removeItem('auth')
}
 
// 441857646099-f4fueoic3rfffm1rn3uo2snum8dfrsja.apps.googleusercontent.com
//
function App() {

  if(localStorage.auth){

    return(
      <GoogleLogout
        clientId="541512946942-qunj36a5emmppsnt8001e3j7k03tnj65.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={logout}
      >
      </GoogleLogout>
    )
  }
    
   return (
      <div className="App">
        <GoogleLogin
          clientId="541512946942-qunj36a5emmppsnt8001e3j7k03tnj65.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    );
}

export default App;
