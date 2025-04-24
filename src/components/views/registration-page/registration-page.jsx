import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase'; // Ensure you export 'auth' and 'db' from your firebase config file
import './registration-page.scss';

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favoritePedals, setFavoritePedals] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        // Clear previous errors
        setError(null);

        try {
            // Create user using Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log('Registration successful', user);

            // Optionally update the user's profile with their username
            await user.updateProfile({ displayName: username });

            // Optionally, store additional user data (e.g., favoritePedals) in Firestore
            await db.collection("users").doc(user.uid).set({
              email,
              username,
              favoritePedals,
              createdAt: new Date().toISOString()
            });

            // Redirect to homepage with a registration success state
            navigate('/', { state: { registrationSuccess: true } });
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message);
        }
    };

    return (
        <div className='registration-page'>
            <div className='registration-container'>
                <h1>Register</h1>
                {error && <p className='error'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='username'>Username:</label>
                        <input
                            type='text'
                            id='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Enter your username'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your Email'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            id='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='confirmPassword'>Confirm Password:</label>
                        <input
                            type='password'
                            id='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm your password'
                        />
                    </div>
                    <button type='submit'>Register</button>
                </form>
                <div className='registration-footer'>
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './registration-page.scss';

// const RegistrationPage = () => {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [favoritePedals, setFavoritePedals] = useState('');
//     const [error, setError] = useState(null);

//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (password !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }
//         // Clear previous errors
//         setError(null);

//         const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5001/pedalboxd/us-central1/api";

//         try {
//             const response = await fetch(`${API_BASE_URL}/users/register`, {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({email, username, password, favoritePedals}),  
//             });
//             const data = await response.json();
//             if (response.ok) {
//                 console.log('Registration successful', data);
//                 // Redirect to homepage and set success message
//                 navigate('/', {state: { registrationSuccess: true } });
//             } else {
//                 setError(data.error || 'Registration failed');
//             }
//         } catch (err) {
//             setError('An error occurred: ' + err.message);
//         }
//     };

//     return (
//         <div className='registration-page'>
//             <div className='registration-container'>
//                 <h1>Register</h1>
//                 {error && <p className='error'>{error}</p>}
//                 <form onSubmit={handleSubmit}>
//                     <div className='form-group'>
//                         <label htmlFor='username'>Username:</label>
//                         <input
//                             type='text'
//                             id='username'
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             placeholder='Enter your username'
//                         />
//                     </div>
//                     <div className='form-group'>
//                         <label htmlFor='email'>Email:</label>
//                         <input
//                             type='text'
//                             id='email'
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder='Enter your Email'
//                         />
//                     </div>
//                     <div className='form-group'>
//                         <label htmlFor='password'>Password:</label>
//                         <input
//                             type='password'
//                             id='password'
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             placeholder='Enter your password'
//                         />
//                     </div>
//                     <div className='form-group'>
//                         <label htmlFor='confirmPassword'>Confirm Password:</label>
//                         <input
//                             type='password'
//                             id='confirmPassword'
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             placeholder='Confirm your password'
//                         />
//                     </div>
//                     <button type='submit'>Register</button>
//                 </form>
//                 <div className='registration-footer'>
//                     <p>Already have an account? <a href="/login">Login</a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RegistrationPage;
