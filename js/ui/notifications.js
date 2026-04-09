// /js/ui/notifications.js

function notify(msg, color = "white") {
    const box = document.getElementById('notification-box');
    const el = document.createElement('div');
    el.className = `bg-gray-900 border-l-4 border-yellow-600 p-3 text-sm shadow-xl rounded animate-bounce-in pointer-events-auto`;
    el.innerHTML = `<span style="color: ${color}">${msg}</span>`;
    box.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        el.style.transition = 'all 0.5s ease';
        setTimeout(() => el.remove(), 500);
    }, 3000);
}