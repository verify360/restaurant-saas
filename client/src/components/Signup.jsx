import React, { useState } from 'react';
import { auth } from '../firebase';
import '../css/signin.css';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { IoMdClose } from 'react-icons/io';

const Signup = ({ onClose, handleSignIn }) => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);

            const user = auth.currentUser;
            await updateProfile(user, {
                displayName: displayName
            });
            alert('Account created successfully!');
            onClose();
        } catch (error) {
            setError("Please Enter Valid Credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="overlay show-overlay signup-model-overlay">
                <div className="modal signup-model">
                    <form onSubmit={(e) => { handleSignup(e); }}>
                        <div className="form-group sign-up-form">
                            <input type="text" placeholder='Full name' value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                        </div>
                        <div className="form-group sign-up-form">
                            <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group sign-up-form">
                            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <div className="signup-error-message">{error}</div>}
                        <button className='subLogin button login-form-button' type="submit" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>
                    <div className='signup-sign'>
                        Have an account? <span onClick={handleSignIn}> Login</span>
                    </div>
                </div>
                <div className='signup-close-icon' onClick={onClose}><IoMdClose /></div>
            </div>
        </>
    );
}

export default Signup;