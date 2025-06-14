function showError(message) {
  const oldModal = document.getElementById('error-modal');
  if (oldModal) oldModal.remove();
  const modal = document.createElement('div');
  modal.id = 'error-modal';
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10000',
  });
  const box = document.createElement('div');
  Object.assign(box.style, {
    background: '#111729',
    border: '2px solid rgb(44, 47, 69, .2)',
    borderRadius: '10px',
    color: '#fff',
    padding: '30px 40px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
    backdropFilter: 'blur(50px)',
    fontFamily: '"Jost", sans-serif',
    maxWidth: '340px',
    textAlign: 'center',
  });
  const title = document.createElement('h2');
  title.textContent = 'Erro';
  title.style.marginBottom = '16px';
  title.style.fontSize = '28px';
  title.style.fontWeight = '700';
  const msg = document.createElement('p');
  msg.textContent = message;
  msg.style.marginBottom = '24px';
  msg.style.fontSize = '16px';
  const btn = document.createElement('button');
  btn.textContent = 'Fechar';
  Object.assign(btn.style, {
    width: '100%',
    height: '45px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#333',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    transition: '0.5s',
    marginTop: '10px'
  });
  btn.onmouseenter = () => {
    btn.style.backgroundColor = 'transparent';
    btn.style.border = '2px solid rgba(255,255,255,.2)';
    btn.style.color = '#fff';
  };
  btn.onmouseleave = () => {
    btn.style.backgroundColor = '#fff';
    btn.style.border = 'none';
    btn.style.color = '#333';
  };
  btn.onclick = () => modal.remove();
  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(btn);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

function showNotification(message, redirectUrl = null) {
  const oldModal = document.getElementById('error-modal');
  if (oldModal) oldModal.remove();
  const modal = document.createElement('div');
  modal.id = 'error-modal';
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10000',
  });
  const box = document.createElement('div');
  Object.assign(box.style, {
    background: '#111729',
    border: '2px solid rgb(44, 47, 69, .2)',
    borderRadius: '10px',
    color: '#fff',
    padding: '30px 40px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
    backdropFilter: 'blur(50px)',
    fontFamily: '"Jost", sans-serif',
    maxWidth: '340px',
    textAlign: 'center',
  });
  const title = document.createElement('h2');
  title.textContent = 'Notificação';
  title.style.marginBottom = '16px';
  title.style.fontSize = '28px';
  title.style.fontWeight = '700';
  const msg = document.createElement('p');
  msg.textContent = message;
  msg.style.marginBottom = '24px';
  msg.style.fontSize = '16px';
  const btn = document.createElement('button');
  btn.textContent = 'Fechar';
  Object.assign(btn.style, {
    width: '100%',
    height: '45px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#333',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    transition: '0.5s',
    marginTop: '10px'
  });
  btn.onclick = () => {
    modal.remove();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };
  box.appendChild(title);
  box.appendChild(msg);
  box.appendChild(btn);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

function showConfirm(message, onConfirm) {
  const oldModal = document.getElementById('confirm-modal');
  if (oldModal) oldModal.remove();
  const modal = document.createElement('div');
  modal.id = 'confirm-modal';
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10000',
  });
  const box = document.createElement('div');
  Object.assign(box.style, {
    background: '#111729',
    border: '2px solid rgb(44, 47, 69, .2)',
    borderRadius: '10px',
    color: '#fff',
    padding: '30px 40px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
    backdropFilter: 'blur(50px)',
    fontFamily: '"Jost", sans-serif',
    maxWidth: '340px',
    textAlign: 'center',
  });
  const msg = document.createElement('p');
  msg.textContent = message;
  msg.style.marginBottom = '24px';
  msg.style.fontSize = '16px';
  const btns = document.createElement('div');
  btns.style.display = 'flex';
  btns.style.gap = '10px';
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';
  Object.assign(cancelBtn.style, {
    flex: 1,
    height: '45px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#333',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    transition: '0.5s'
  });
  cancelBtn.onmouseenter = () => {
    cancelBtn.style.backgroundColor = 'transparent';
    cancelBtn.style.border = '2px solid rgba(255,255,255,.2)';
    cancelBtn.style.color = '#fff';
  };
  cancelBtn.onmouseleave = () => {
    cancelBtn.style.backgroundColor = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.color = '#333';
  };
  cancelBtn.onclick = () => modal.remove();
  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = 'Excluir';
  Object.assign(confirmBtn.style, {
    flex: 1,
    height: '45px',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#fff',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    transition: '0.5s'
  });
  confirmBtn.onmouseenter = () => {
    confirmBtn.style.backgroundColor = 'transparent';
    confirmBtn.style.border = '2px solid #e74c3c';
    confirmBtn.style.color = '#e74c3c';
  };
  confirmBtn.onmouseleave = () => {
    confirmBtn.style.backgroundColor = '#e74c3c';
    confirmBtn.style.border = 'none';
    confirmBtn.style.color = '#fff';
  };
  confirmBtn.onclick = () => {
    modal.remove();
    onConfirm();
  };
  btns.appendChild(cancelBtn);
  btns.appendChild(confirmBtn);
  box.appendChild(msg);
  box.appendChild(btns);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

function showExit(message, onExit) {
  const oldModal = document.getElementById('exit-modal');
  if (oldModal) oldModal.remove();
  const modal = document.createElement('div');
  modal.id = 'exit-modal';
  Object.assign(modal.style, {
    position: 'fixed',
    top: '0', left: '0',
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '10000',
  });
  const box = document.createElement('div');
  Object.assign(box.style, {
    background: '#111729',
    border: '2px solid rgb(44, 47, 69, .2)',
    borderRadius: '10px',
    color: '#fff',
    padding: '30px 40px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .2)',
    backdropFilter: 'blur(50px)',
    fontFamily: '"Jost", sans-serif',
    maxWidth: '340px',
    textAlign: 'center',
  });
  const msg = document.createElement('p');
  msg.textContent = message;
  msg.style.marginBottom = '24px';
  msg.style.fontSize = '16px';
  const btns = document.createElement('div');
  btns.style.display = 'flex';
  btns.style.gap = '10px';
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';
  Object.assign(cancelBtn.style, {
    flex: 1,
    height: '45px',
    backgroundColor: '#fff',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#333',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    transition: '0.5s'
  });
  cancelBtn.onmouseenter = () => {
    cancelBtn.style.backgroundColor = 'transparent';
    cancelBtn.style.border = '2px solid rgba(255,255,255,.2)';
    cancelBtn.style.color = '#fff';
  };
  cancelBtn.onmouseleave = () => {
    cancelBtn.style.backgroundColor = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.color = '#333';
  };
  cancelBtn.onclick = () => modal.remove();
  const exitBtn = document.createElement('button');
  exitBtn.textContent = 'Sair';
  Object.assign(exitBtn.style, {
    flex: 1,
    height: '45px',
    backgroundColor: '#e74c3c',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#fff',
    fontWeight: '600',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    transition: '0.5s'
  });
  exitBtn.onmouseenter = () => {
    exitBtn.style.backgroundColor = 'transparent';
    exitBtn.style.border = '2px solid #e74c3c';
    exitBtn.style.color = '#e74c3c';
  };
  exitBtn.onmouseleave = () => {
    exitBtn.style.backgroundColor = '#e74c3c';
    exitBtn.style.border = 'none';
    exitBtn.style.color = '#fff';
  };
  exitBtn.onclick = () => {
    modal.remove();
    onExit();
  };
  btns.appendChild(cancelBtn);
  btns.appendChild(exitBtn);
  box.appendChild(msg);
  box.appendChild(btns);
  modal.appendChild(box);
  document.body.appendChild(modal);
}