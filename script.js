// ========== LOGIN ==========
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    if (loginForm && window.location.pathname.includes('index.html')) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (username && password) {
                const now = new Date().toISOString();
                localStorage.setItem('username', username);
                localStorage.setItem('memberSince', now);
                window.location.href = 'dashboard.html';
            } else {
                alert('Por favor, complete todos los campos.');
            }
        });
    }
});

// ========== RENDERIZAR PERFIL ==========
function renderProfile() {
    const username = localStorage.getItem('username') || 'Usuario';
    const initial = username.charAt(0).toUpperCase();
    const memberSince = new Date(localStorage.getItem('memberSince') || new Date())
        .toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

    // Mostrar nombre e inicial
    const initialEl = document.querySelector('.profile-initial');
    const nameEl = document.querySelector('.profile-text h4');

    if (initialEl) initialEl.textContent = initial;
    if (nameEl) nameEl.textContent = username;

    // Mostrar "Miembro desde"
    const memberCard = document.querySelectorAll('.cards-container .card')[2];
    if (memberCard) {
        memberCard.querySelector('p').textContent = memberSince;
    }

    // Mostrar estadísticas
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const totalEntries = entries.length;
    const totalWords = entries.reduce((acc, cur) => acc + cur.content.split(/\s+/).length, 0);

    document.querySelectorAll('.cards-container .card')[0].querySelector('p').textContent = totalEntries;
    document.querySelectorAll('.cards-container .card')[1].querySelector('p').textContent = totalWords;
}

// Ejecutar solo en profile.html
if (window.location.pathname.includes('profile.html')) {
    document.addEventListener('DOMContentLoaded', renderProfile);
}

// ========== ELIMINAR DATOS ==========
document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.querySelector('.settings-card button');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const confirmDelete = confirm('¿Estás seguro de que deseas eliminar todos tus datos? Esta acción no se puede deshacer.');
            if (confirmDelete) {
                localStorage.removeItem('diaryEntries');
                alert('Datos eliminados exitosamente.');
                window.location.reload();
            }
        });
    }
});



// New entry dialog
const dialog = document.getElementById('new-entry-dialog');
const openButton = document.getElementById('open-dialog');
const cancelButton = document.getElementById('cancel-dialog');
const entryForm = dialog.querySelector('form');
const recentEntriesContainer = document.querySelector('.recent-entries');

openButton.addEventListener('click', () => {
    dialog.showModal();
});

cancelButton.addEventListener('click', () => {
    dialog.close();
});

entryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('entry-title').value.trim();
    const content = document.getElementById('entry-content').value.trim();
    const date = new Date().toLocaleDateString('es-CO', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    if (!title || !content) return;

    const newEntry = { title, content, date };
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    entries.unshift(newEntry);
    localStorage.setItem('diaryEntries', JSON.stringify(entries));

    dialog.close();
    entryForm.reset();

    renderEntries();
});

function renderEntries() {
    const entries = JSON.parse(localStorage.getItem('diaryEntries')) || [];
    const container = document.querySelector('.recent-entries');

    container.innerHTML = `<h6>Escrituras recientes</h6>`;

    if (entries.length === 0) {
        container.innerHTML += `
            <div class="recent-entry-card">
                <p>✨</p>
                <p>Aún no se ha escrito nada. Empieza escribiendo tu primer diario.</p>
            </div>
        `;
        return;
    }

    entries.slice(0, 3).forEach(entry => {
        const card = document.createElement('div');
        card.classList.add('recent-entry-card');
        card.innerHTML = `
            <p>📝</p>
            <div>
                <strong>${entry.title}</strong>
                <p>${entry.content.slice(0, 100)}...</p>
                <small>${entry.date}</small>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.card')[0].querySelector('p').textContent = entries.length;
    document.querySelectorAll('.card')[2].querySelector('p').textContent =
        entries.reduce((acc, cur) => acc + cur.content.split(/\s+/).length, 0);
}

if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', renderEntries);
}