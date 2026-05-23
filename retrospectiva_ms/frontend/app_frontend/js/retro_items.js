/* ── Config ─────────────────────────────────────────────── */
const API_BASE = 'http://127.0.0.1:8000';

/* ── Estado ─────────────────────────────────────────────── */
let items          = [];
let categoriaActiva = null;
let itemEnEdicion   = null;
let sprintIdActivo  = null;

/* ── Columnas DOM ───────────────────────────────────────── */
const columnas = {
    logro:       { items: document.getElementById('itemsLogros'),       cnt: document.getElementById('cntLogros') },
    impedimento: { items: document.getElementById('itemsImpedimentos'), cnt: document.getElementById('cntImpedimentos') },
    accion:      { items: document.getElementById('itemsAcciones'),     cnt: document.getElementById('cntAcciones') },
    comentario:  { items: document.getElementById('itemsComentarios'),  cnt: document.getElementById('cntComentarios') },
};

/* ── Render cards ───────────────────────────────────────── */
const renderItems = () => {
    for (const cat of Object.keys(columnas)) {
        const col        = columnas[cat];
        const filtrados  = items.filter(i => i.categoria === cat);
        col.cnt.textContent = filtrados.length;
        col.items.innerHTML = '';

        if (filtrados.length === 0) {
            const vacio = document.createElement('p');
            vacio.style.cssText = 'font-size:.8rem;color:var(--text-muted);text-align:center;padding:.5rem 0;';
            vacio.textContent   = 'Sin registros';
            col.items.appendChild(vacio);
            continue;
        }

        for (const item of filtrados) {
            col.items.appendChild(crearCard(item));
        }
    }
};

const crearCard = (item) => {
    const card = document.createElement('div');
    card.className = 'retro-card';

    const desc = document.createElement('p');
    desc.textContent = item.descripcion;
    card.appendChild(desc);

    if (item.categoria === 'accion') {
        const badge = document.createElement('span');
        badge.className = 'cumplida-badge';
        if (item.cumplida === true || item.cumplida === 1) {
            badge.classList.add('cumplida-badge--si');
            badge.textContent = '✓ Cumplida';
        } else if (item.cumplida === false || item.cumplida === 0) {
            badge.classList.add('cumplida-badge--no');
            badge.textContent = '✗ No cumplida';
        } else {
            badge.classList.add('cumplida-badge--pend');
            badge.textContent = '⏳ Pendiente';
        }
        card.appendChild(badge);

        if (item.fecha_revision) {
            const meta = document.createElement('p');
            meta.className   = 'card-meta';
            meta.textContent = `Revisión: ${formatDate(item.fecha_revision)}`;
            card.appendChild(meta);
        }
    }

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'action-btn action-btn--edit';
    btnEdit.textContent = 'Editar';
    btnEdit.addEventListener('click', () => abrirModalEditar(item));

    const btnDel = document.createElement('button');
    btnDel.className = 'action-btn action-btn--delete';
    btnDel.textContent = 'Eliminar';
    btnDel.addEventListener('click', () => eliminarItem(item.id));

    actions.appendChild(btnEdit);
    actions.appendChild(btnDel);
    card.appendChild(actions);

    return card;
};

/* ── API: consultar items de un sprint ──────────────────── */
const consultarItems = async (sprintId) => {
    sprintIdActivo = sprintId;
    try {
        const res  = await fetch(`${API_BASE}/sprints/${sprintId}/items`);
        const data = await res.json();
        items = data;
        renderItems();
    } catch (e) {
        console.error('Error al consultar items', e);
    }
};

/* ── API: crear item ────────────────────────────────────── */
const crearItem = async (data) => {
    try {
        const res = await fetch(`${API_BASE}/items`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data),
        });
        if (res.status === 201) {
            showModal('Item agregado');
            await consultarItems(sprintIdActivo);
        } else {
            showModal('No se pudo agregar el item', 'error');
        }
    } catch (e) {
        showModal('Error al conectar con el servidor', 'error');
    }
};

/* ── API: actualizar item ───────────────────────────────── */
const actualizarItem = async (id, data) => {
    try {
        const res = await fetch(`${API_BASE}/items/${id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data),
        });
        if (res.ok) {
            showModal('Item actualizado');
            await consultarItems(sprintIdActivo);
        } else {
            showModal('No se pudo actualizar el item', 'error');
        }
    } catch (e) {
        showModal('Error al conectar con el servidor', 'error');
    }
};

/* ── API: eliminar item ─────────────────────────────────── */
const eliminarItem = async (id) => {
    if (!confirm('¿Eliminar este item?')) return;
    try {
        const res = await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showModal('Item eliminado');
            await consultarItems(sprintIdActivo);
        } else {
            showModal('No se pudo eliminar el item', 'error');
        }
    } catch (e) {
        showModal('Error al conectar con el servidor', 'error');
    }
};

/* ── Helpers ────────────────────────────────────────────── */
const formatDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
};

/* ── Modal de item ──────────────────────────────────────── */
const itemModal     = document.getElementById('itemModal');
const itemOverlay   = document.getElementById('itemOverlay');
const itemModalTitle = document.getElementById('itemModalTitle');
const inputDesc      = document.getElementById('itemDescripcion');
const inputRevision  = document.getElementById('itemFechaRevision');
const checkCumplida  = document.getElementById('itemCumplida');
const grupoAccion    = document.getElementById('grupoAccion');
const grupoCumplida  = document.getElementById('grupoCumplida');
const errDesc        = document.getElementById('errDescripcion');
const btnGuardarItem = document.getElementById('btnGuardarItem');
const btnCancelarItem = document.getElementById('btnCancelarItem');
const closeItemModal  = document.getElementById('closeItemModal');

const abrirModal = (titulo, categoria, item = null) => {
    itemModalTitle.textContent = titulo;
    categoriaActiva = categoria;
    itemEnEdicion   = item;

    inputDesc.value     = item ? item.descripcion : '';
    inputRevision.value = item ? (item.fecha_revision || '') : '';
    checkCumplida.checked = item ? !!(item.cumplida) : false;
    errDesc.classList.add('hidden');

    const esAccion = categoria === 'accion';
    grupoAccion.style.display   = esAccion ? 'block' : 'none';
    grupoCumplida.style.display = esAccion ? 'block' : 'none';

    itemModal.classList.remove('hidden');
    itemOverlay.classList.remove('hidden');
    inputDesc.focus();
};

const abrirModalEditar = (item) => {
    abrirModal(`Editar ${item.categoria}`, item.categoria, item);
};

const cerrarModal = () => {
    itemModal.classList.add('hidden');
    itemOverlay.classList.add('hidden');
};

btnGuardarItem.addEventListener('click', () => {
    const desc = inputDesc.value.trim();
    if (!desc) {
        errDesc.classList.remove('hidden');
        return;
    }
    errDesc.classList.add('hidden');

    const data = {
        sprint_id:     sprintIdActivo,
        categoria:     categoriaActiva,
        descripcion:   desc,
        cumplida:      categoriaActiva === 'accion' ? checkCumplida.checked : null,
        fecha_revision: categoriaActiva === 'accion' ? (inputRevision.value || null) : null,
    };

    if (itemEnEdicion) {
        actualizarItem(itemEnEdicion.id, data);
    } else {
        crearItem(data);
    }
    cerrarModal();
});

btnCancelarItem.addEventListener('click', cerrarModal);
closeItemModal.addEventListener('click', cerrarModal);
itemOverlay.addEventListener('click', cerrarModal);

/* ── Botones "Agregar" en columnas ──────────────────────── */
document.querySelectorAll('.add-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!sprintIdActivo) {
            showModal('Selecciona un sprint primero', 'error');
            return;
        }
        const cat = btn.dataset.categoria;
        const labels = { logro: 'Logro', impedimento: 'Impedimento', accion: 'Acción', comentario: 'Comentario' };
        abrirModal(`Agregar ${labels[cat]}`, cat);
    });
});
