function toast(msg,type='success'){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast '+type; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),3000);
}
function openM(id){document.getElementById(id).style.display='flex';}
function closeM(id){document.getElementById(id).style.display='none';}

document.querySelectorAll('.overlay').forEach(o=>{
  o.addEventListener('click',e=>{if(e.target===o)o.style.display='none';});
});

/* auth button */
const user = authService.getCurrentUser();
const authBtn = document.getElementById('authBtn');
if(authBtn){
  if(user){
    authBtn.textContent = authService.isAdmin(user) ? 'Admin Panel' : 'Dashboard';
    authBtn.onclick = () => window.location.href = authService.isAdmin(user) ? 'admin.html' : 'dashboard.html';
  } else {
    authBtn.textContent = 'Kirish';
    authBtn.onclick = () => window.location.href = 'index.html';
  }
}

/* Load prices from settings */
function loadPrices(){
  const s = authService.getSettings();
  const p = s.plans || { p30:'50000', p90:'120000', pvip:'300000' };
  document.getElementById('price30').textContent = Number(p.p30||50000).toLocaleString('uz-UZ');
  document.getElementById('price90').textContent = Number(p.p90||120000).toLocaleString('uz-UZ');
  document.getElementById('priceVip').textContent = Number(p.pvip||300000).toLocaleString('uz-UZ');
}

let selectedPlan = null;

function selectPlan(plan){
  if(!user){
    openM('loginRequiredModal');
    return;
  }

  selectedPlan = plan;
  const s = authService.getSettings();
  const p = s.plans || { p30:'50000', p90:'120000', pvip:'300000' };

  const labels = {
    '30':  { name:'30 kunlik - Standart', price: p.p30||'50000' },
    '90':  { name:'90 kunlik - Pro',      price: p.p90||'120000' },
    'vip': { name:'VIP - Muddatsiz',      price: p.pvip||'300000' }
  };

  const info = labels[plan];
  document.getElementById('payPlanLabel').textContent = info.name;
  document.getElementById('payAmountShow').textContent = Number(info.price).toLocaleString('uz-UZ') + ' UZS';
  document.getElementById('adminCardNum').textContent  = s.cardNum  || '8600 0000 0000 0000';
  document.getElementById('adminCardName').textContent = s.cardName || 'REXIUM CLIENT';

  openM('payModal');
}

/* Image preview */
document.getElementById('checkImg')?.addEventListener('change', e => {
  const f = e.target.files[0]; if(!f) return;
  const r = new FileReader();
  r.onload = ev => {
    document.getElementById('previewSrc').src = ev.target.result;
    document.getElementById('imgPreview').style.display = 'block';
  };
  r.readAsDataURL(f);
});

/* Pay form */
document.getElementById('payForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if(!user){ openM('loginRequiredModal'); return; }

  const name = document.getElementById('payerName').value.trim();
  const img  = document.getElementById('previewSrc').src;

  if(!img || img === window.location.href){
    toast('Check rasmini yuklang!','error'); return;
  }

  const s = authService.getSettings();
  const p = s.plans || { p30:'50000', p90:'120000', pvip:'300000' };
  const amounts = { '30': p.p30||'50000', '90': p.p90||'120000', 'vip': p.pvip||'300000' };
  const amount = amounts[selectedPlan] || '50000';
  const planLabel = { '30':'30 kun', '90':'90 kun', 'vip':'VIP' }[selectedPlan];

  authService.addPayment(user.id, name, amount, img, planLabel);

  closeM('payModal');
  toast("To'lov yuborildi! Admin tasdiqlashini kuting.",'info');
  document.getElementById('payForm').reset();
  document.getElementById('imgPreview').style.display = 'none';
});

/* Promo form */
document.getElementById('promoForm')?.addEventListener('submit', e => {
  e.preventDefault();
  if(!user){ openM('loginRequiredModal'); return; }
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  if(!code){ toast('Promo-kodni kiriting','error'); return; }
  try{
    authService.usePromo(code, user.id);
    document.getElementById('promoInput').value = '';
    toast('Promo-kod tasdiqlandi! Dashboard ga o\'ting.','success');
  } catch(err){
    toast(err.message,'error');
  }
});

document.addEventListener('DOMContentLoaded', loadPrices);
