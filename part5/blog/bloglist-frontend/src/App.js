import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import loginService from "./services/login";
import blogService from "./services/blogs";
import CreateBlogs from "./components/createblogs.js";
import Alert from "./components/alert";
import Notif from "./components/notif";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedinUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const userObj = { username, password };
    const result = await loginService.login(userObj);
    setUsername("");
    setPassword("");
    if (result) {
      setUser(result);
      blogService.setToken(result.token);
      window.localStorage.setItem("loggedinUser", JSON.stringify(result));
    } else {
      setAlert("Invalid Credentials");
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    window.localStorage.removeItem("loggedinUser");
  };

  const loginForm = () => (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  return (
    <div>
      <Alert alert={alert} />
      <Notif notif={notif} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <div>
            <h3>{user.username} logged in</h3>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <h1>blogs</h1>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
          <CreateBlogs
            setBlogs={setBlogs}
            blogs={blogs}
            notif={notif}
            setNotif={setNotif}
            alert={alert}
            setAlert={setAlert}
          />
        </div>
      )}
    </div>
  );
};

export default App;
