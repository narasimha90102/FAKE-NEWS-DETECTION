/* ═══════════════════════════════════════════
   TRUTHCHECK — auth.js
   Complete Authentication & User Session Manager
═══════════════════════════════════════════ */

/* ── 25 LANGUAGES DEFINITION ── */
const ALL_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', flag: '🇮🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' }
];

/* ── VALIDATION RULES ── */
function validateUsername(username) {
  if (!username) return { valid: false, message: 'Username is required' };
  const trimmed = username.trim();
  if (/\s/.test(trimmed)) return { valid: false, message: 'Username cannot contain spaces' };
  if (trimmed.length < 5) return { valid: false, message: 'Minimum 5 characters required' };
  if (trimmed.length > 20) return { valid: false, message: 'Maximum 20 characters allowed' };
  if (!/^[a-zA-Z0-9_.-]+$/.test(trimmed)) {
    return { valid: false, message: 'Only letters, numbers, _, ., and - allowed' };
  }
  return { valid: true, message: '✓ Username available' };
}

function validateEmail(email) {
  if (!email) return { valid: false, message: 'Email address is required' };
  const trimmed = email.trim();
  if (/\s/.test(trimmed)) return { valid: false, message: 'Email address cannot contain spaces' };
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) return { valid: false, message: 'Invalid email address format' };
  return { valid: true, message: '✓ Valid email address' };
}

function validatePassword(password) {
  if (!password) return { valid: false, message: 'Password is required' };
  
  const checks = {
    minLen: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-.\?]/.test(password),
    noSpaces: !/\s/.test(password)
  };

  if (!checks.noSpaces) return { valid: false, message: 'Password cannot contain spaces', checks };
  if (!checks.minLen) return { valid: false, message: 'Password too short (min 8 chars)', checks };
  if (!checks.uppercase) return { valid: false, message: 'Must contain at least 1 uppercase letter', checks };
  if (!checks.lowercase) return { valid: false, message: 'Must contain at least 1 lowercase letter', checks };
  if (!checks.number) return { valid: false, message: 'Must contain at least 1 number', checks };
  if (!checks.special) return { valid: false, message: 'Must contain at least 1 special character (!@#$%^&*()_+-...?)', checks };

  return { valid: true, message: '✓ Strong password', checks };
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return { valid: false, message: 'Please confirm password' };
  if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match' };
  return { valid: true, message: '✓ Passwords match' };
}

/* ── LOCAL USER DATABASE ── */
function getUsers() {
  try { return JSON.parse(localStorage.getItem('tg_users') || '[]'); }
  catch { return []; }
}

function saveUsers(users) {
  try { localStorage.setItem('tg_users', JSON.stringify(users)); }
  catch (e) { console.error('Error saving users', e); }
}

function findUserByInput(loginInput) {
  const users = getUsers();
  const lower = loginInput.trim().toLowerCase();
  return users.find(u => u.username.toLowerCase() === lower || u.email.toLowerCase() === lower);
}

/* Simple hash function for client-side security demo */
function hashPassword(pwd) {
  let hash = 0;
  for (let i = 0; i < pwd.length; i++) {
    const char = pwd.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'tg_' + Math.abs(hash).toString(16);
}

/* ── ACCOUNT CREATION ── */
function registerUser(username, email, password, confirmPassword) {
  const vUser = validateUsername(username);
  if (!vUser.valid) return { success: false, message: vUser.message };

  const vEmail = validateEmail(email);
  if (!vEmail.valid) return { success: false, message: vEmail.message };

  const vPwd = validatePassword(password);
  if (!vPwd.valid) return { success: false, message: vPwd.message };

  const vConf = validateConfirmPassword(password, confirmPassword);
  if (!vConf.valid) return { success: false, message: vConf.message };

  const users = getUsers();
  const existingName = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existingName) return { success: false, message: 'Username is already taken' };

  const existingEmail = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) return { success: false, message: 'Email address is already registered' };

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    username: username.trim(),
    email: email.trim(),
    passwordHash: hashPassword(password),
    avatar: '🛡️',
    created: new Date().toISOString(),
    verified: false,
    searchesCount: 0
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Account created successfully.' };
}

/* ── LOGIN & SESSION ── */
function loginUser(loginInput, password, rememberMe = false) {
  if (!loginInput || !password) {
    return { success: false, message: 'Please enter username/email and password' };
  }

  const user = findUserByInput(loginInput);
  if (!user) {
    return { success: false, message: 'Invalid username/email or password.' };
  }

  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, message: 'Invalid username/email or password.' };
  }

  /* Store session */
  const sessionData = {
    userId: user.id,
    loginTime: new Date().toISOString()
  };

  if (rememberMe) {
    localStorage.setItem('tg_session', JSON.stringify(sessionData));
    sessionStorage.removeItem('tg_session');
  } else {
    sessionStorage.setItem('tg_session', JSON.stringify(sessionData));
    localStorage.removeItem('tg_session');
  }

  return { success: true, user, message: 'Login successful' };
}

function getCurrentUser() {
  let sessionRaw = sessionStorage.getItem('tg_session') || localStorage.getItem('tg_session');
  if (!sessionRaw) return null;

  try {
    const session = JSON.parse(sessionRaw);
    const users = getUsers();
    return users.find(u => u.id === session.userId) || null;
  } catch {
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem('tg_session');
  sessionStorage.removeItem('tg_session');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 300);
}

/* ── SESSION PROTECTION ── */
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `login.html?redirect=${currentPath}&auth_required=1`;
    return null;
  }
  return user;
}

function requireGuest() {
  const user = getCurrentUser();
  if (user) {
    window.location.href = 'dashboard.html';
    return null;
  }
  return true;
}

/* ── PROFILE & ACCOUNT ACTIONS ── */
function updateUserProfile(updates) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'User not logged in' };

  const users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx === -1) return { success: false, message: 'User not found' };

  if (updates.username && updates.username !== currentUser.username) {
    const vUser = validateUsername(updates.username);
    if (!vUser.valid) return { success: false, message: vUser.message };
    const exists = users.find(u => u.id !== currentUser.id && u.username.toLowerCase() === updates.username.toLowerCase());
    if (exists) return { success: false, message: 'Username already taken' };
    users[idx].username = updates.username;
  }

  if (updates.email && updates.email !== currentUser.email) {
    const vEmail = validateEmail(updates.email);
    if (!vEmail.valid) return { success: false, message: vEmail.message };
    const exists = users.find(u => u.id !== currentUser.id && u.email.toLowerCase() === updates.email.toLowerCase());
    if (exists) return { success: false, message: 'Email already registered' };
    users[idx].email = updates.email;
    users[idx].verified = false;
  }

  if (updates.avatar) users[idx].avatar = updates.avatar;

  saveUsers(users);
  return { success: true, message: 'Profile updated successfully', user: users[idx] };
}

function changeUserPassword(oldPassword, newPassword, confirmPassword) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'User not logged in' };

  if (currentUser.passwordHash !== hashPassword(oldPassword)) {
    return { success: false, message: 'Current password is incorrect' };
  }

  const vPwd = validatePassword(newPassword);
  if (!vPwd.valid) return { success: false, message: vPwd.message };

  const vConf = validateConfirmPassword(newPassword, confirmPassword);
  if (!vConf.valid) return { success: false, message: vConf.message };

  const users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx].passwordHash = hashPassword(newPassword);
    saveUsers(users);
  }

  return { success: true, message: 'Password updated successfully' };
}

function verifyUserEmail() {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'User not logged in' };

  const users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx !== -1) {
    users[idx].verified = true;
    saveUsers(users);
  }
  return { success: true, message: 'Email verified successfully!' };
}

function deleteUserAccount(password) {
  const currentUser = getCurrentUser();
  if (!currentUser) return { success: false, message: 'User not logged in' };

  if (currentUser.passwordHash !== hashPassword(password)) {
    return { success: false, message: 'Incorrect password. Account not deleted.' };
  }

  let users = getUsers();
  users = users.filter(u => u.id !== currentUser.id);
  saveUsers(users);

  logoutUser();
  return { success: true, message: 'Account permanently deleted' };
}

/* ── FORGOT PASSWORD FLOW ── */
function requestPasswordReset(email) {
  const vEmail = validateEmail(email);
  if (!vEmail.valid) return { success: false, message: vEmail.message };

  const user = findUserByInput(email);
  if (!user) {
    /* Security best practice: don't reveal user existence, show generic success message */
    return { success: true, message: 'If an account exists for this email, password reset instructions have been sent.' };
  }

  return {
    success: true,
    resetToken: 'rst_' + Math.random().toString(36).substr(2, 8),
    email: user.email,
    message: 'Password reset link sent! Check your email inbox.'
  };
}

function resetPasswordWithToken(email, newPassword, confirmPassword) {
  const vPwd = validatePassword(newPassword);
  if (!vPwd.valid) return { success: false, message: vPwd.message };

  const vConf = validateConfirmPassword(newPassword, confirmPassword);
  if (!vConf.valid) return { success: false, message: vConf.message };

  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { success: false, message: 'Account not found' };

  users[idx].passwordHash = hashPassword(newPassword);
  saveUsers(users);

  return { success: true, message: 'Password has been reset successfully. Please log in.' };
}

/* ── TOAST NOTIFICATIONS ── */
function showToast(message, type = 'info') {
  let container = document.getElementById('tg-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'tg-toast-container';
    container.className = 'tg-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `tg-toast tg-toast-${type}`;
  
  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span class="tg-toast-icon">${iconMap[type] || 'ℹ'}</span>
    <span class="tg-toast-msg">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── NAVBAR USER RENDERER ── */
function renderNavbarUser() {
  const navContainer = document.querySelector('.navbar');
  if (!navContainer) return;

  const currentUser = getCurrentUser();
  let existingCta = navContainer.querySelector('#nav-auth-container');
  if (!existingCta) existingCta = navContainer.querySelector('.nav-user-wrapper');
  if (!existingCta) existingCta = navContainer.querySelector('.nav-cta');
  
  const navLinksContainer = navContainer.querySelector('.nav-links');
  const themeToggle = navContainer.querySelector('#theme-toggle-btn');

  if (currentUser) {
    if (navLinksContainer) {
      navLinksContainer.innerHTML = `
        <a href="verify.html" class="nav-link">Verify</a>
        <a href="trending.html" class="nav-link">Trending</a>
      `;
      const links = navLinksContainer.querySelectorAll('.nav-link');
      links.forEach(link => {
         if(window.location.href.includes(link.getAttribute('href'))) {
            link.classList.add('active');
         }
      });
    }
    if (themeToggle) {
      themeToggle.style.display = 'flex';
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-user-wrapper';
    wrapper.innerHTML = `
      <button class="nav-user-btn" id="nav-user-dropdown-btn">
        <span class="nav-user-avatar">${currentUser.avatar || '🛡️'}</span>
        <span class="nav-user-name">${currentUser.username}</span>
        <span class="nav-user-arrow">▾</span>
      </button>
      <div class="nav-user-menu" id="nav-user-menu">
        <div class="nav-menu-header">
          <div class="nmh-avatar">${currentUser.avatar || '🛡️'}</div>
          <div class="nmh-info">
            <div class="nmh-name">${currentUser.username}</div>
            <div class="nmh-email">${currentUser.email}</div>
          </div>
        </div>
        <div class="nav-menu-divider"></div>
        <a href="profile.html" class="nav-menu-item">👤 My Profile</a>
        <a href="history.html" class="nav-menu-item">📜 Search History</a>
        <a href="dashboard.html" class="nav-menu-item">📊 Dashboard</a>
        <a href="settings.html" class="nav-menu-item">⚙️ Settings</a>
        <div class="nav-menu-divider"></div>
        <button class="nav-menu-item danger" onclick="logoutUser()">🚪 Logout</button>
      </div>
    `;

    if (existingCta) existingCta.replaceWith(wrapper);
    else navContainer.appendChild(wrapper);

    /* Setup click toggle */
    const btn = document.getElementById('nav-user-dropdown-btn');
    const menu = document.getElementById('nav-user-menu');
    if (btn && menu) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
      });
      document.addEventListener('click', () => menu.classList.remove('active'));
    }
  } else {
    if (navLinksContainer) {
      navLinksContainer.innerHTML = `
        <a href="index.html" class="nav-link">Home</a>
      `;
    }
    if (themeToggle) {
      themeToggle.style.display = 'flex';
    }
    
    const cta = document.createElement('div');
    cta.className = 'nav-auth-buttons';
    cta.id = 'nav-auth-container';
    cta.innerHTML = `
      <a href="login.html" class="nav-link-btn">Log In</a>
      <a href="register.html" class="nav-cta"><span>Register</span></a>
    `;
    if (existingCta) existingCta.replaceWith(cta);
    else navContainer.appendChild(cta);
  }
}

/* ── THEME TOGGLER ── */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem('tc_theme', isLight ? 'light' : 'dark');
  updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
  const sun = document.getElementById('theme-icon-sun');
  const moon = document.getElementById('theme-icon-moon');
  if (sun && moon) {
    sun.style.display = isLight ? 'none' : 'block';
    moon.style.display = isLight ? 'block' : 'none';
  }
}

function initTheme() {
  const isLight = localStorage.getItem('tc_theme') === 'light';
  if (isLight) document.body.classList.add('light-theme');
  updateThemeIcon(isLight);

  const btn = document.getElementById('theme-toggle-btn');
  if (btn) btn.addEventListener('click', toggleTheme);
}

/* Automatically render navbar user state on script load */
document.addEventListener('DOMContentLoaded', () => {
  renderNavbarUser();
  initTheme();
  
  /* Check query parameter for auth messages */
  const params = new URLSearchParams(window.location.search);
  if (params.get('auth_required') === '1') {
    showToast('Please log in to access that page.', 'warning');
  }
});
