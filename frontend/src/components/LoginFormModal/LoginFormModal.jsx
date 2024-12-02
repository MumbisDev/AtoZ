import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormPage.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    // Check if credential length is >= 4 and password length is >= 6
    setIsDisabled(credential.length < 4 || password.length < 6);
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      {errors.credential && (
        <p className="error-message">{errors.credential}</p>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className={errors.credential ? 'input-error' : ''}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={errors.credential ? 'input-error' : ''}
          />
        </label>
        <button 
          type="submit" 
          disabled={isDisabled}
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;