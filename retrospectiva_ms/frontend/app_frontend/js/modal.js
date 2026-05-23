/* ── Modal (toast) ──────────────────────────────────────── */
const modal1   = document.getElementById('modal1');
const modalMsg = document.getElementById('modalMsg');
const modalIcon = document.getElementById('modalIcon');

let _modalTimer = null;

const showModal = (text, tipo = 'ok') => {
    modalMsg.textContent = text;

    if (tipo === 'ok') {
        modal1.classList.remove('modal--error');
        modalIcon.textContent = '✓';
        modalIcon.style.background = 'var(--success-soft)';
        modalIcon.style.color      = 'var(--success)';
    } else {
        modal1.classList.add('modal--error');
        modalIcon.textContent = '✕';
        modalIcon.style.background = 'var(--danger-soft)';
        modalIcon.style.color      = 'var(--danger)';
    }

    modal1.classList.remove('modal--hidden');

    if (_modalTimer) clearTimeout(_modalTimer);
    _modalTimer = setTimeout(hideModal, 3500);
};

const hideModal = () => {
    modal1.classList.add('modal--hidden');
};

document.getElementById('modalBtn').addEventListener('click', hideModal);
