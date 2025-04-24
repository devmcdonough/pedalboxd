import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase"; // adjust path as needed
import { AuthContext } from "../../../context/AuthContext";
import './login-page.scss';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { } = useContext(AuthContext); // currentUser is updated automatically

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Use Firebase's signInWithEmailAndPassword method
            await auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful');
            // Navigate to home after login
            navigate('/');
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="login-footer">
                     <p>
                         Dont have an account <a href="/register">Register</a>
                     </p>
                 </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;



// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../../../firebase";
// import { AuthContext } from "../../../context/AuthContext";
// import './login-page.scss';

// const LoginPage = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);

//     const { } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5001/pedalboxd/us-central1/api";

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch(`${API_BASE_URL}/users/login`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({username, password}),
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 console.log('Login successful', data);  
//                 setCurrentUser(data.user);
//                 navigate('/');
//             } else {
//                 setError(data.error || 'Login failed');
//             }
//             } catch (err) {
//                 setError('An error occurred: ' + err.message);
//             }
//     };

//     return (
//         <div className="login-page">
//             <div className="login-container">
//                 <h1>Login</h1>
//                 {error && <p className="error">{error}</p>}
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label htmlFor="username">Username:</label>
//                         <input
//                             type="username"
//                             id="username"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder="Enter your username"
//                             required
//                             />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="password">Password:</label>
//                         <input
//                             type="password"
//                             id="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder="Enter your password"
//                             required
//                             />
//                     </div>
//                     <button type="submit">Login</button>
//                 </form>
//                 <div className="login-footer">
//                     <p>
//                         Dont have an account <a href="/register">Register</a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;