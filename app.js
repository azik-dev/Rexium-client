/* ── helpers ── */
function toast(msg, type='success'){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast '+type;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t=setTimeout(()=>t.classList.remove('show'),3000);
}
/* openM va closeM - barcha sahifalarda ishlaydi */
function openM(id){
  const el=document.getElementById(id);
  if(el){ el.style.display='flex'; }
}
function closeM(id){
  const el=document.getElementById(id);
  if(el){ el.style.display='none'; }
}
/* eski nomlar ham ishlash uchun */
const openModal=openM;
const closeModal=closeM;

/* overlay click to close */
document.addEventListener('click', e=>{
  if(e.target && e.target.classList.contains('overlay')){
    e.target.style.display='none';
  }
});

/* ── MAIN BUTTON logic ── */
const mainBtn = document.getElementById('mainBtn');

function refreshBtn(){
  if(!mainBtn) return;
  const u = authService.getCurrentUser();
  if(u){ mainBtn.textContent='Sahifani Ochish'; }
  else {
    const v = localStorage.getItem('rx_visited');
    mainBtn.textContent = v ? 'Kirish' : "Ro'yxatdan o'tish";
  }
}

mainBtn?.addEventListener('click',()=>{
  const u = authService.getCurrentUser();
  if(u){
    window.location.href = authService.isAdmin(u) ? 'admin.html' : 'dashboard.html';
    return;
  }
  const v = localStorage.getItem('rx_visited');
  if(!v){ localStorage.setItem('rx_visited','1'); openModal('regModal'); }
  else openModal('loginModal');
});

/* hero download btn */
document.getElementById('heroDlBtn')?.addEventListener('click',()=>{
  const u = authService.getCurrentUser();
  if(!u){
    const v=localStorage.getItem('rx_visited');
    if(!v){ localStorage.setItem('rx_visited','1'); openModal('regModal'); }
    else openModal('loginModal');
    return;
  }
  window.location.href = authService.isAdmin(u)?'admin.html':'dashboard.html';
});

/* switch login <-> register */
document.getElementById('toReg')?.addEventListener('click',e=>{
  e.preventDefault(); closeModal('loginModal'); openModal('regModal');
});
document.getElementById('toLogin')?.addEventListener('click',e=>{
  e.preventDefault(); closeModal('regModal'); openModal('loginModal');
});

/* ── LOGIN ── */
document.getElementById('loginForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const email=document.getElementById('lEmail').value.trim();
  const pass=document.getElementById('lPass').value;
  try{
    const u=authService.login(email,pass);
    closeModal('loginModal');
    toast('Muvaffaqiyatli kirdingiz!','success');
    setTimeout(()=>{
      window.location.href=authService.isAdmin(u)?'admin.html':'dashboard.html';
    },900);
  }catch(err){ toast(err.message,'error'); }
});

/* ── REGISTER ── */
document.getElementById('regForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('rName').value.trim();
  const email=document.getElementById('rEmail').value.trim();
  const pass=document.getElementById('rPass').value;
  try{
    authService.register(name,email,pass);
    closeModal('regModal');
    toast("Ro'yxatdan o'tdingiz! Endi kirish mumkin.",'success');
    setTimeout(()=>openModal('loginModal'),1200);
  }catch(err){ toast(err.message,'error'); }
});

/* ── NEWS ── */
function loadNews(){
  const c=document.getElementById('newsContainer');
  if(!c) return;
  const list=newsService.getNews();
  if(!list.length){
    c.innerHTML=`<div class="news-card glass"><span class="ndate">01.10.2026</span><h3>Rexium Client chiqdi!</h3><p>To'liq uzbekcha interfeys bilan birinchi versiya!</p></div>`;
    return;
  }
  c.innerHTML=list.map(n=>`
    <div class="news-card glass">
      <span class="ndate">${n.date}</span>
      <h3>${n.title}</h3>
      <p>${n.content}</p>
    </div>`).join('');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',()=>{
  refreshBtn();
  loadNews();
});
