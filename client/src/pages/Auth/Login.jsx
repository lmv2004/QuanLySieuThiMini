import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { usePermission } from '../../contexts/PermissionContext.jsx';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { refreshPermissions } = usePermission();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData);
      // Refresh permissions từ API sau khi login
      await refreshPermissions();
      // Tất cả vai trò đều vào dashboard chính — sidebar tự ẩn module theo permission
      navigate('/');
    } catch (err) {
      setError(err.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    // TODO: gọi API forgot password
    await new Promise(r => setTimeout(r, 1200));
    setForgotLoading(false);
    setForgotSent(true);
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail('');
    setForgotSent(false);
    setForgotLoading(false);
  };

  return (
    <>
      <div className="login-root">

        {/* ── LEFT ── */}
        <div className="login-left">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          <div className="left-brand">
            <div className="brand-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#e8ff47"/>
                <path d="M6 10h16M6 14h10M6 18h13" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="brand-name">MiniMart</span>
          </div>

          <div className="left-illustration">
            <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="store-svg">
              <rect width="340" height="260" rx="20" fill="url(#sky)"/>
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="340" y2="260" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1a1a2e"/>
                  <stop offset="100%" stopColor="#16213e"/>
                </linearGradient>
              </defs>
              <circle cx="40" cy="30" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="90" cy="18" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="150" cy="25" r="1.5" fill="rgba(255,255,255,0.7)"/>
              <circle cx="220" cy="15" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="280" cy="28" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="310" cy="12" r="1" fill="rgba(255,255,255,0.4)"/>
              <circle cx="295" cy="38" r="16" fill="rgba(232,255,71,0.15)"/>
              <circle cx="295" cy="38" r="11" fill="rgba(232,255,71,0.25)"/>
              <circle cx="295" cy="38" r="7" fill="rgba(232,255,71,0.5)"/>
              <rect x="0" y="195" width="340" height="65" fill="#0d1117"/>
              <rect x="40" y="85" width="260" height="120" rx="4" fill="#1e2a3a"/>
              <rect x="30" y="72" width="280" height="20" rx="4" fill="#e8ff47"/>
              <rect x="30" y="72" width="280" height="8" rx="4" fill="#d4eb3d"/>
              <rect x="90" y="82" width="160" height="28" rx="6" fill="#111827"/>
              <text x="170" y="101" textAnchor="middle" fill="#e8ff47" fontSize="13" fontWeight="700" fontFamily="system-ui">MINI MART</text>
              {[50,80,110,140,170,200,230,260,290].map((x,i)=>(
                <rect key={i} x={x} y="72" width="10" height="20" fill="rgba(0,0,0,0.12)" rx="1"/>
              ))}
              <rect x="142" y="145" width="56" height="60" rx="3" fill="#0f172a"/>
              <rect x="148" y="151" width="20" height="48" rx="2" fill="rgba(99,102,241,0.3)"/>
              <rect x="172" y="151" width="20" height="48" rx="2" fill="rgba(99,102,241,0.3)"/>
              <circle cx="168" cy="181" r="2.5" fill="#e8ff47"/>
              <circle cx="172" cy="181" r="2.5" fill="#e8ff47"/>
              <rect x="55" y="110" width="65" height="50" rx="4" fill="#0f172a"/>
              <rect x="60" y="115" width="26" height="40" rx="2" fill="rgba(99,102,241,0.25)"/>
              <rect x="90" y="115" width="26" height="40" rx="2" fill="rgba(99,102,241,0.25)"/>
              <rect x="63" y="138" width="8" height="14" rx="1" fill="#ef4444"/>
              <rect x="74" y="135" width="8" height="17" rx="1" fill="#f59e0b"/>
              <rect x="85" y="140" width="8" height="12" rx="1" fill="#10b981"/>
              <rect x="96" y="136" width="8" height="16" rx="1" fill="#6366f1"/>
              <rect x="107" y="139" width="8" height="13" rx="1" fill="#ec4899"/>
              <rect x="220" y="110" width="65" height="50" rx="4" fill="#0f172a"/>
              <rect x="225" y="115" width="26" height="40" rx="2" fill="rgba(99,102,241,0.25)"/>
              <rect x="255" y="115" width="26" height="40" rx="2" fill="rgba(99,102,241,0.25)"/>
              <rect x="228" y="137" width="8" height="15" rx="1" fill="#06b6d4"/>
              <rect x="239" y="133" width="8" height="19" rx="1" fill="#f59e0b"/>
              <rect x="250" y="139" width="8" height="13" rx="1" fill="#ef4444"/>
              <rect x="261" y="135" width="8" height="17" rx="1" fill="#10b981"/>
              <rect x="272" y="138" width="8" height="14" rx="1" fill="#a78bfa"/>
              <rect x="55" y="88" width="42" height="16" rx="4" fill="rgba(16,185,129,0.2)" stroke="#10b981" strokeWidth="1"/>
              <text x="76" y="100" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700" fontFamily="system-ui">OPEN</text>
              <g transform="translate(240,178)">
                <rect x="0" y="0" width="30" height="20" rx="3" fill="none" stroke="#e8ff47" strokeWidth="1.5"/>
                <path d="M-8 -6 L0 0" stroke="#e8ff47" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="5" cy="24" r="3" fill="#e8ff47"/>
                <circle cx="22" cy="24" r="3" fill="#e8ff47"/>
                <rect x="5" y="4" width="6" height="10" rx="1" fill="#ef4444"/>
                <rect x="13" y="6" width="6" height="8" rx="1" fill="#10b981"/>
                <rect x="21" y="5" width="5" height="9" rx="1" fill="#6366f1"/>
              </g>
              <g transform="translate(68,168)">
                <circle cx="10" cy="0" r="6" fill="#fbbf24"/>
                <rect x="6" y="8" width="8" height="16" rx="3" fill="#6366f1"/>
                <path d="M6 16 L2 26" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 16 L18 26" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 12 L0 18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 12 L20 18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                <rect x="18" y="14" width="10" height="8" rx="2" fill="#e8ff47"/>
                <path d="M20 14 Q23 10 26 14" stroke="#e8ff47" strokeWidth="1.5" fill="none"/>
              </g>
              <rect x="18" y="120" width="4" height="80" rx="2" fill="#374151"/>
              <ellipse cx="20" cy="118" rx="12" ry="6" fill="#374151"/>
              <ellipse cx="20" cy="115" rx="6" ry="3" fill="rgba(232,255,71,0.8)"/>
              <g transform="translate(30,48)">
                <rect width="38" height="18" rx="9" fill="rgba(232,255,71,0.15)" stroke="#e8ff47" strokeWidth="1"/>
                <text x="19" y="13" textAnchor="middle" fill="#e8ff47" fontSize="9" fontWeight="600" fontFamily="system-ui">-20%</text>
              </g>
              <g transform="translate(272,50)">
                <rect width="42" height="18" rx="9" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1"/>
                <text x="21" y="13" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="600" fontFamily="system-ui">SALE!</text>
              </g>
            </svg>
          </div>

          <div className="left-stats">
            <div className="stat-badge"><span className="stat-num">500+</span><span className="stat-lbl">Sản phẩm</span></div>
            <div className="stat-badge"><span className="stat-num">24/7</span><span className="stat-lbl">Hoạt động</span></div>
            <div className="stat-badge"><span className="stat-num">99%</span><span className="stat-lbl">Chính xác</span></div>
          </div>

          <p className="left-tagline">Hệ thống quản lý siêu thị<br/>thông minh &amp; hiện đại</p>
        </div>

        {/* ── RIGHT ── */}
        <div className="login-right">
          {/* Ảnh nền siêu thị mờ */}
          <div className="login-right-bg" />
          <div className="login-right-overlay" />

          {/* Glass card form */}
          <div className="login-form-wrap">
            <div className="form-header">
              <div className="form-icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2L3 6v5c0 4.5 3.3 8.7 8 9.9C16.7 19.7 20 15.5 20 11V6L11 2z" fill="#1a1a2e"/>
                </svg>
              </div>
              <h1 className="form-title">Chào mừng trở lại</h1>
              <p className="form-subtitle">Đăng nhập để quản lý hệ thống</p>
            </div>

            {error && (
              <div className="login-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5"/>
                  <path d="M8 5v3M8 10.5v.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="field-group">
                <label className="field-label">Tên đăng nhập</label>
                <div className="field-wrap">
                  <svg className="field-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="3" stroke="#9ca3af" strokeWidth="1.5"/>
                    <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input className="field-input" type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Nhập tên đăng nhập" autoComplete="username" required />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Mật khẩu</label>
                <div className="field-wrap">
                  <svg className="field-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="8" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="#9ca3af" strokeWidth="1.5"/>
                  </svg>
                  <input className="field-input" type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Nhập mật khẩu" autoComplete="current-password" required />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(p => !p)}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" stroke="#9ca3af" strokeWidth="1.5"/><path d="M2 2l12 12" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="#9ca3af" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" stroke="#9ca3af" strokeWidth="1.5"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Quên mật khẩu */}
              <div className="forgot-row">
                <button type="button" className="forgot-link" onClick={() => setShowForgot(true)}>
                  Quên mật khẩu?
                </button>
              </div>

              <button type="submit" className={`login-btn ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? (
                  <><span className="spinner" />Đang đăng nhập...</>
                ) : (
                  <>Đăng nhập
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="form-footer">
              Hệ thống dành riêng cho nhân viên.<br/>
              Liên hệ quản trị viên nếu cần hỗ trợ.
            </p>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgot && (
        <div className="forgot-modal-overlay" onClick={closeForgot}>
          <div className="forgot-modal" onClick={e => e.stopPropagation()}>
            <div className="forgot-modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#d97706" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 8v4M12 16h.01" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="forgot-modal-title">Quên mật khẩu?</div>
            <div className="forgot-modal-desc">
              Nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
            </div>

            {!forgotSent ? (
              <>
                <div className="field-group">
                  <label className="field-label">Email</label>
                  <div className="field-wrap">
                    <svg className="field-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="4" width="12" height="9" rx="2" stroke="#9ca3af" strokeWidth="1.5"/>
                      <path d="M2 6l6 4 6-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                      className="field-input"
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="ten@email.com"
                    />
                  </div>
                </div>
                <div className="forgot-modal-actions">
                  <button className="btn-cancel-modal" onClick={closeForgot}>Hủy</button>
                  <button className="btn-send-modal" onClick={handleForgotSubmit} disabled={forgotLoading}>
                    {forgotLoading ? 'Đang gửi...' : 'Gửi email'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="forgot-success">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{flexShrink:0}}>
                    <circle cx="9" cy="9" r="8" fill="#16a34a"/>
                    <path d="M5 9l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Email đã được gửi tới <strong>{forgotEmail}</strong>. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.</span>
                </div>
                <div className="forgot-modal-actions">
                  <button className="btn-send-modal" style={{flex:'none',width:'100%'}} onClick={closeForgot}>Đóng</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
