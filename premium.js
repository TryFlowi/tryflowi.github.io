const MP_PAYMENT_LINK = 'https://mpago.la/1sUenfr';

function injectModalHTML() {
  if (document.getElementById('flowi-premium-modal')) return;

  const modalHTML = `
    <div id="flowi-premium-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; align-items:center; justify-content:center;">
      <div style="background:#fff; padding:24px; border-radius:12px; width:90%; max-width:400px; font-family:sans-serif; text-align:center; position:relative;">
        <span id="close-modal-btn" style="position:absolute; top:12px; right:16px; cursor:pointer; font-size:20px; font-weight:bold; color:#888;">&times;</span>
        <h3 style="margin-top:0; color:#333;">Flowi Premium - R$ 15,90</h3>
        <p style="font-size:14px; color:#666; margin-bottom:20px;">Informe seu e-mail para prosseguir com o pagamento.</p>
        
        <form id="flowi-auth-form" style="display:flex; flex-direction:column; gap:12px;">
          <input type="email" id="flowi-email" placeholder="Seu e-mail" required style="padding:10px; border:1px solid #ccc; border-radius:6px; font-size:14px;">
          <button type="submit" id="flowi-submit-btn" style="padding:12px; background:#009ee3; color:#fff; border:none; border-radius:6px; font-weight:bold; cursor:pointer; font-size:15px;">Ir para o Pagamento</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('flowi-premium-modal').style.display = 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectModalHTML();

  const buttons = document.querySelectorAll('.btn-premium');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('flowi-premium-modal').style.display = 'flex';
    });
  });

  const authForm = document.getElementById('flowi-auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('flowi-email').value;
      localStorage.setItem('flowi_user_email', email);
      window.location.href = MP_PAYMENT_LINK;
    });
  }
});
