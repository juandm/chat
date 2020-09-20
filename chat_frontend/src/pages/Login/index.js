import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";


import api from "../../services/api";
import './styles.css';

const Login = () => {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLogin, setIsLogin] = useState(true);

  let buttonText = isLogin ? 'Login' : 'Register';
  let hrefText = isLogin ? 'Don\t have an account yet? create one!' : 'Go to login';

  async function handleFormAction(e) {
    e.preventDefault();
    setIsLogin(!isLogin);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(!isLogin){
        const response = await api.post('users', { username, password });
        alert('User created successfully');
        setIsLogin(true);
        setUsername('');
        setPassword('');
      } else {
        const response = await api.post('users/login', { username, password });        
        const apiResponse = response.data;
        const decoded = jwt_decode(apiResponse.data);
        localStorage.setItem('token', apiResponse.data);
        localStorage.setItem('userId', decoded.sub);
        history.push('/chat');
      }
      
    } catch (error) {
      console.log(error);
      if(error.isAxiosError) {
        const apiReponse = error.response.data;
         const errors = [];
        Object.keys(apiReponse.data).forEach(errorKey => {
           errors.push(apiReponse.data[errorKey]);
        });
        setValidationErrors(errors);
      } else {
        alert('Register error.')
      }
    }
  }


  return (
    <div className="login-container">
      <h1>ChatApp</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="user name"
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
        <br />
        <input 
          type="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <button className="button" type="submit">{buttonText}</button>
      </form>
      <a href="/" onClick={handleFormAction}>{hrefText}</a>

      <div className="error-container">
        <ul>
          {
            validationErrors.map((error, idx) => (
              <li key={idx}>
                <p>{error}</p>
              </li>
            ))
          }
        </ul>
      </div>

    </div>
  );
};

export default Login;