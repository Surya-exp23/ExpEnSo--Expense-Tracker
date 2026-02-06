const container = document.querySelector('.cota_1');
const registerbtn = document.querySelector('.btn_pt');
const loginbtn = document.querySelector('.login_btn');


registerbtn.addEventListener('click', () => {
    container.classList.add('active');
} );



loginbtn.addEventListener('click', () => {
    container.classList.remove('active');
} );



const loginForm = document.querySelector('.formbox form');
const registerForm = document.querySelector('.register form');


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = registerForm.querySelector('.inputbox31 input').value.trim();
    const email = registerForm.querySelector('.inputbox32 input').value.trim().toLowerCase();
    const password = registerForm.querySelector('.inputbox33 input').value;
    

    if (!username || !email || !password) {
        showMessage('Please fill all fields!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters!', 'error');
        return;
    }
    

    let users = JSON.parse(localStorage.getItem('users')) || [];
    

    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
        showMessage('Email already registered! Please login instead.', 'error');

        setTimeout(() => {
            container.classList.remove('active');
        }, 2000);
        return;
    }

    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        password: password, 
        createdAt: new Date().toISOString()
    };
    

    users.push(newUser);
    

    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('Registration successful! Please login.', 'success');
    

    registerForm.reset();
    

    setTimeout(() => {
        container.classList.remove('active');
    }, 1500);
});


loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = loginForm.querySelector('.inputbox12 input').value.trim();
    const password = loginForm.querySelector('.inputbox22 input').value;
    

    if (!username || !password) {
        showMessage('Please fill all fields!', 'error');
        return;
    }
    

    let users = JSON.parse(localStorage.getItem('users')) || [];
    

    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() || 
        u.email.toLowerCase() === username.toLowerCase()
    );
    
    if (!user) {
        showMessage('User not found! Please register first.', 'error');
        return;
    }
    

    if (user.password !== password) {
        showMessage('Incorrect password!', 'error');
        return;
    }
    

    showMessage(`Welcome back, ${user.username}!`, 'success');

    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email
    }));
    

    loginForm.reset();
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    animation: fadeIn 0.3s ease-in;
`;

const redirectText = document.createElement('div');
redirectText.textContent = 'Redirecting...';
redirectText.style.cssText = `
    color: white;
    font-size: 2rem;
    font-family: 'Pixelify Sans', monospace;
    font-weight: bold;
    animation: pulse 1s infinite;
`;

overlay.appendChild(redirectText);
document.body.appendChild(overlay);


if (!document.querySelector('#pulseAnimation')) {
    const style = document.createElement('style');
    style.id = 'pulseAnimation';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
}
    
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1800);
});

function showMessage(message, type) {
    const existingMsg = document.querySelector('.auth-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    



    const msgDiv = document.createElement('div');
    msgDiv.className = 'auth-message';
    msgDiv.textContent = message;
    



    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Pixelify Sans', monospace;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    if (type === 'success') {
        msgDiv.style.background = '#6600c5';
        msgDiv.style.color = 'white';
    } else {
        msgDiv.style.background = '#6600c5';
        msgDiv.style.color = 'white';
    }
    
    if (!document.querySelector('#msgAnimation')) {
        const style = document.createElement('style');
        style.id = 'msgAnimation';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(msgDiv);
    

    setTimeout(() => {
        msgDiv.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}




window.addEventListener('load', () => {
    
    localStorage.removeItem('currentUser');
});