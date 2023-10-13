import { useContext, useState } from "react";

import "./loginstyle.css";
import { MainContext } from "../contexts/MainContext";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const {setAuth} = useContext(MainContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername(username);
    setPassword(password);
    if(username === 'nodirbek' && password === 'P@ssw0rd'){
        setAuth(true);
        navigate('/teachers')
    }
  };
  return (
    <div className="container">
      <div className="form-box">
        <div className="header-form">
            {/* <h4 className="text-primary text-center">
              <i className="fa fa-user-circle" style={{ fontSize: "110px" }}></i>
            </h4> */}
            <h1 className="text-center">Log in</h1>
          <div className="image"></div>
        </div>
        <div className="body-form">
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-lock"></i>
                </span>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              LOGIN
            </button>
            <div className="message">
              <div>
                <input type="checkbox" /> Remember me
              </div>
              <div>
                <a href="#">Forgot your password</a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
