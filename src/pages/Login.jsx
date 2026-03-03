import React, { useState } from 'react'
import axios from 'axios'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #f0ede8; font-family: 'Jost', sans-serif; }
  .auth-page {
    min-height: 100vh; background: #f0ede8;
    display: flex; flex-direction: column; align-items: center;
  }
  .auth-brand {
    font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700;
    color: #0a0a0a; letter-spacing: 4px; text-transform: uppercase;
    padding: 32px; cursor: pointer; text-align: center;
    border-bottom: 1px solid rgba(0,0,0,0.08); width: 100%;
    text-align: center;
  }
  .auth-panels {
    display: flex; width: 100%; max-width: 1100px; min-height: calc(100vh - 80px);
  }
  .auth-panel {
    flex: 1; padding: 80px 80px; display: flex; flex-direction: column; justify-content: center;
  }
  .auth-panel-left { border-right: 1px solid rgba(0,0,0,0.08); }
  .panel-title {
    font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700;
    color: #0a0a0a; letter-spacing: 4px; text-transform: uppercase;
    text-align: center; margin-bottom: 48px;
  }
  .form-group { margin-bottom: 28px; }
  .form-label {
    display: block; font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
    color: #888; margin-bottom: 10px;
  }
  .form-input {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid rgba(0,0,0,0.2);
    color: #0a0a0a; padding: 10px 0; font-family: 'Jost', sans-serif; font-size: 14px;
    outline: none; transition: all 0.3s; letter-spacing: 0.5px;
  }
  .form-input::placeholder { color: #bbb; }
  .form-input:focus { border-bottom-color: #0a0a0a; }
  .submit-btn {
    display: block; margin: 40px auto 0;
    background: #0a0a0a; color: #f0ede8; border: none; padding: 16px 60px;
    font-family: 'Jost', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 3px;
    text-transform: uppercase; cursor: pointer; transition: all 0.3s;
    border-radius: 50px;
  }
  .submit-btn:hover { background: #333; }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .forgot-link {
    display: block; text-align: center; margin-top: 20px;
    font-size: 12px; color: #888; text-decoration: underline; cursor: pointer;
    background: none; border: none; font-family: 'Jost', sans-serif; letter-spacing: 1px;
  }
  .error-msg {
    background: rgba(192,57,43,0.08); border: 1px solid rgba(192,57,43,0.2);
    color: #c0392b; padding: 12px 16px; font-size: 11px; letter-spacing: 1px;
    margin-bottom: 24px; text-align: center;
  }
  .success-msg {
    background: rgba(39,174,96,0.08); border: 1px solid rgba(39,174,96,0.2);
    color: #27ae60; padding: 12px 16px; font-size: 11px; letter-spacing: 1px;
    margin-bottom: 24px; text-align: center;
  }
  .otp-section { text-align: center; }
  .otp-subtitle { font-size: 12px; color: #888; letter-spacing: 1px; margin-bottom: 32px; line-height: 1.6; }
  .otp-inputs { display: flex; gap: 10px; justify-content: center; margin: 28px 0; }
  .otp-input {
    width: 48px; height: 56px; text-align: center; background: transparent;
    border: none; border-bottom: 2px solid rgba(0,0,0,0.2);
    color: #0a0a0a; font-size: 22px; font-weight: 700;
    font-family: 'Jost', sans-serif; outline: none; transition: all 0.3s;
  }
  .otp-input:focus { border-bottom-color: #0a0a0a; }
  .resend-btn {
    background: none; border: none; color: #888; font-family: 'Jost', sans-serif;
    font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer;
    text-decoration: underline; margin-top: 16px;
  }
  .resend-btn:hover { color: #0a0a0a; }
  .checkbox-group { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 28px; }
  .checkbox-group input { margin-top: 2px; accent-color: #0a0a0a; }
  .checkbox-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #888; line-height: 1.5; }
`

export default function Auth() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', mobile: '', password: '' })
  const [step, setStep] = useState('register') // 'register' or 'verify'
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')

  const handleLogin = async () => {
    setLoginError('')
    if (!loginForm.email || !loginForm.password) { setLoginError('Please fill in all fields!'); return }
    setLoginLoading(true)
    try {
      const res = await axios.post('https://ecomma-backend.onrender.com/api/auth/login', loginForm)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      window.location.href = '/'
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid email or password!')
    }
    setLoginLoading(false)
  }

  const handleRegister = async () => {
    setRegisterError('')
    if (!registerForm.name || !registerForm.email || !registerForm.mobile || !registerForm.password) {
      setRegisterError('Please fill in all fields!'); return
    }
    setRegisterLoading(true)
    try {
      await axios.post('https://ecomma-backend.onrender.com/api/auth/register', registerForm)
      setRegisterSuccess(`OTP sent to ${registerForm.email}!`)
      setStep('verify')
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Something went wrong!')
    }
    setRegisterLoading(false)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = async () => {
    setRegisterError('')
    const otpString = otp.join('')
    if (otpString.length !== 6) { setRegisterError('Please enter complete OTP!'); return }
    setRegisterLoading(true)
    try {
      const res = await axios.post('https://ecomma-backend.onrender.com/api/auth/verify-otp', {
        email: registerForm.email, otp: otpString
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setRegisterSuccess('Account verified! Redirecting...')
      setTimeout(() => window.location.href = '/', 1500)
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Invalid OTP!')
    }
    setRegisterLoading(false)
  }

  const handleResend = async () => {
    try {
      await axios.post('https://ecomma-backend.onrender.com/api/auth/resend-otp', { email: registerForm.email })
      setRegisterSuccess('New OTP sent!')
    } catch (err) {
      setRegisterError('Could not resend OTP!')
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">

        {/* BRAND */}
        <div className="auth-brand" onClick={() => window.location.href = '/'}>E—Comma</div>

        <div className="auth-panels">

          {/* LEFT — SIGN IN */}
          <div className="auth-panel auth-panel-left">
            <h2 className="panel-title">Sign In</h2>

            {loginError && <div className="error-msg">{loginError}</div>}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="email@email.com"
                value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>

            <button className="submit-btn" onClick={handleLogin} disabled={loginLoading}>
              {loginLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <button className="forgot-link">Forgot your password?</button>
          </div>

          {/* RIGHT — SIGN UP */}
          <div className="auth-panel">
            <h2 className="panel-title">Sign Up</h2>

            {registerError && <div className="error-msg">{registerError}</div>}
            {registerSuccess && <div className="success-msg">{registerSuccess}</div>}

            {step === 'register' ? (
              <>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="First Name"
                    value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input className="form-input" placeholder="9876543210"
                    value={registerForm.mobile} onChange={e => setRegisterForm({...registerForm, mobile: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" placeholder="email@email.com"
                    value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input className="form-input" type="password" placeholder="••••••••"
                    value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} />
                </div>

                <div className="checkbox-group">
                  <input type="checkbox" id="offers" />
                  <label className="checkbox-label" htmlFor="offers">
                    Keep me up to date with special offers and promotions
                  </label>
                </div>

                <button className="submit-btn" onClick={handleRegister} disabled={registerLoading}>
                  {registerLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </>
            ) : (
              <div className="otp-section">
                <p className="otp-subtitle">
                  We sent a 6-digit code to<br />
                  <strong style={{color:'#0a0a0a'}}>{registerForm.email}</strong>
                </p>
                <div className="otp-inputs">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      className="otp-input"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
                <button className="submit-btn" onClick={handleVerify} disabled={registerLoading}>
                  {registerLoading ? 'Verifying...' : 'Verify Account'}
                </button>
                <br />
                <button className="resend-btn" onClick={handleResend}>Resend OTP</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}