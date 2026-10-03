function toast(msg,type='success'){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast '+type; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),3000);
}
function openM(id){document.getElementById(id).style.display='flex';}
function closeM(id){document.getElementById(id).style.display='none';}

const user=authService.getCurrentUser();
if(!user){window.location.href='index.html';}
if(!authService.isAdmin(user)){window.location.href='dashboard.html';}

/* overlay click to close */
document.querySelectorAll('.overlay').forEach(o=>{
  o.addEventListener('click',e=>{if(e.target===o)o.style.display='none';});
});

/* LOGOUT */
document.getElementById('logoutBtn').addEventListener('click',()=>openM('logoutModal'));
document.getElementById('confirmNo').addEventListener('click',()=>closeM('logoutModal'));
document.getElementById('confirmYes').addEventListener('click',()=>{authService.logout();window.location.href='index.html';});

/* TABS */
document.querySelectorAll('.atab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.atab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tpane').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
  });
});

/* ══════════════ PAYMENTS ══════════════ */
function loadPayments(){
  const payments=authService.getPayments();
  const users=authService.getUsers();
  const pending=payments.filter(p=>p.status==='pending');
  const history=payments.filter(p=>p.status!=='pending').reverse();

  document.getElementById('pendingCount').textContent=pending.length;

  const pel=document.getElementById('pendingPaysList');
  if(!pending.length){
    pel.innerHTML='<p class="empty">Kutilayotgan to\'lovlar yo\'q</p>';
  } else {
    pel.innerHTML=pending.map(p=>{
      const u=users.find(x=>x.id===p.userId)||{name:'Noma\'lum',email:''};
      const dt=new Date(p.createdAt).toLocaleString('uz-UZ');
      return `<div class="pitem">
        <div class="pinfo">
          <h4>${u.name}</h4>
          <div class="pemail">${u.email}</div>
          <div class="pmeta">
            <span class="mtag">👤 ${p.payerName}</span>
            <span class="mtag">💵 ${Number(p.amount).toLocaleString('uz-UZ')} UZS</span>
            <span class="mtag">📦 ${p.planLabel||'Standart'}</span>
            <span class="mtag">📅 ${dt}</span>
          </div>
          <div class="chk-img">
            <img src="${p.checkImage}" alt="check" onclick="viewImg('${p.checkImage}')">
            <div class="chk-lbl">Rasmni bosib kattalashtirish</div>
          </div>
        </div>
        <div class="pacts">
          <button class="btn-ok btn-sm" onclick="approveP('${p.id}')">✓ Tasdiqlash</button>
          <button class="btn-err btn-sm" onclick="rejectP('${p.id}')">✗ Rad etish</button>
        </div>
      </div>`;
    }).join('');
  }

  const hel=document.getElementById('historyPaysList');
  if(!history.length){
    hel.innerHTML='<p class="empty">Tarix bo\'sh</p>';
  } else {
    hel.innerHTML=history.map(p=>{
      const u=users.find(x=>x.id===p.userId)||{name:'Noma\'lum',email:''};
      const dt=new Date(p.createdAt).toLocaleString('uz-UZ');
      const cls=p.status==='approved'?'ppill ppill-ok':'ppill ppill-rej';
      const lbl=p.status==='approved'?'✓ Tasdiqlangan':'✗ Rad etilgan';
      return `<div class="pitem">
        <div class="pinfo">
          <h4>${u.name} — <span style="color:var(--sub);font-weight:400">${u.email}</span></h4>
          <div class="pmeta">
            <span class="mtag">👤 ${p.payerName}</span>
            <span class="mtag">💵 ${Number(p.amount).toLocaleString('uz-UZ')} UZS</span>
            <span class="mtag">📅 ${dt}</span>
          </div>
        </div>
        <div class="pacts"><span class="${cls}">${lbl}</span></div>
      </div>`;
    }).join('');
  }
}

function approveP(id){
  authService.approvePayment(id);
  loadPayments(); loadUsers();
  toast('To\'lov tasdiqlandi! Foydalanuvchiga ruxsat berildi.','success');
}
function rejectP(id){
  authService.rejectPayment(id);
  loadPayments();
  toast('To\'lov rad etildi','info');
}

/* IMAGE VIEWER */
function viewImg(src){
  document.getElementById('viewerImg').src=src;
  openM('imgViewer');
}

/* ══════════════ NEWS ══════════════ */
document.getElementById('newsForm').addEventListener('submit',e=>{
  e.preventDefault();
  const title=document.getElementById('newsTitle').value.trim();
  const text=document.getElementById('newsText').value.trim();
  newsService.addNews(title,text);
  document.getElementById('newsTitle').value='';
  document.getElementById('newsText').value='';
  loadNewsList();
  toast('Yangilik qo\'shildi!','success');
});

function loadNewsList(){
  const list=newsService.getNews();
  const el=document.getElementById('newsList');
  if(!list.length){el.innerHTML='<p class="empty">Yangiliklar yo\'q</p>';return;}
  el.innerHTML=list.map(n=>`
    <div class="nitem">
      <div class="ncont">
        <h4>${n.title}</h4>
        <p>${n.content}</p>
        <span class="ndate">${n.date}</span>
      </div>
      <button class="btn-err btn-sm" onclick="delNews('${n.id}')">🗑</button>
    </div>`).join('');
}

function delNews(id){
  newsService.deleteNews(id);
  loadNewsList();
  toast('Yangilik o\'chirildi','info');
}

/* ══════════════ USERS ══════════════ */
let _pendingDelId=null;

function loadUsers(){
  const users=authService.getUsers().filter(u=>!u.isAdmin);
  document.getElementById('statTotal').textContent=users.length;
  document.getElementById('statBought').textContent=users.filter(u=>u.isPurchased).length;

  const el=document.getElementById('usersList');
  if(!users.length){el.innerHTML='<p class="empty">Foydalanuvchilar yo\'q</p>';return;}

  el.innerHTML=users.map(u=>`
    <div class="uitem">
      <div class="uavatar">${u.name.charAt(0).toUpperCase()}</div>
      <div class="uinfo">
        <strong>${u.name}</strong>
        <span>${u.email} &nbsp;•&nbsp; ${u.isPurchased
          ?'<span style="color:var(--ok)">✓ Sotib olgan</span>'
          :'<span style="color:var(--err)">✗ Sotib olmagan</span>'}</span>
      </div>
      <div class="uacts">
        <button class="btn-warn btn-sm" onclick="editUser('${u.id}')">✏️</button>
        ${!u.isPurchased?`<button class="btn-ok btn-sm" onclick="grantU('${u.id}')">✓ Ruxsat</button>`:''}
        <button class="btn-err btn-sm" onclick="confirmDelUser('${u.id}')">🗑</button>
      </div>
    </div>`).join('');
}

function grantU(id){
  authService.purchase(id);
  loadUsers();
  toast('Foydalanuvchiga ruxsat berildi!','success');
}

function confirmDelUser(id){
  _pendingDelId=id;
  openM('delUserModal');
}

document.getElementById('delUserYes').addEventListener('click',()=>{
  if(_pendingDelId){
    authService.deleteUser(_pendingDelId);
    _pendingDelId=null;
    closeM('delUserModal');
    loadUsers();
    toast('Foydalanuvchi o\'chirildi','info');
  }
});
document.getElementById('delUserNo').addEventListener('click',()=>closeM('delUserModal'));

function editUser(id){
  const u=authService.getUsers().find(x=>x.id===id);
  if(!u) return;
  document.getElementById('editUId').value=id;
  document.getElementById('editUName').value=u.name;
  document.getElementById('editUEmail').value=u.email;
  document.getElementById('editUStatus').value=u.isPurchased?'1':'0';
  openM('editUserModal');
}

document.getElementById('saveEditUser').addEventListener('click',()=>{
  const id=document.getElementById('editUId').value;
  const name=document.getElementById('editUName').value.trim();
  const email=document.getElementById('editUEmail').value.trim();
  const status=document.getElementById('editUStatus').value==='1';
  if(!name||!email){toast('Ism va email bo\'sh bo\'lmasin','error');return;}
  authService.updateUser(id,name,email,status);
  closeM('editUserModal');
  loadUsers();
  toast('Foydalanuvchi ma\'lumotlari yangilandi!','success');
});

/* ══════════════ PROMO CODES ══════════════ */
document.getElementById('promoCreateForm').addEventListener('submit',e=>{
  e.preventDefault();
  const code=document.getElementById('promoCode').value.trim();
  const max=document.getElementById('promoMax').value;
  try{
    authService.addPromo(code,max);
    document.getElementById('promoCode').value='';
    document.getElementById('promoMax').value='';
    loadPromos();
    toast(`Promo-kod "${code.toUpperCase()}" yaratildi!`,'success');
  }catch(err){toast(err.message,'error');}
});

function loadPromos(){
  const list=authService.getPromos();
  const el=document.getElementById('promosList');
  if(!list.length){el.innerHTML='<p class="empty">Promo-kodlar yo\'q</p>';return;}
  el.innerHTML=list.map(p=>{
    const left=p.maxUses-p.usedCount;
    const isExpired=left<=0;
    return `<div class="pitem">
      <div class="pinfo">
        <h4 style="font-family:monospace;font-size:20px;letter-spacing:2px">${p.code}</h4>
        <div class="pmeta">
          <span class="mtag">👥 Ishlagan: ${p.usedCount}/${p.maxUses}</span>
          <span class="mtag ${isExpired?'':''}">
            ${isExpired
              ?'<span style="color:var(--err)">✗ Muddati o\'tgan</span>'
              :`<span style="color:var(--ok)">✓ Faol (${left} ta qoldi)</span>`}
          </span>
        </div>
        ${p.usedBy.length?`<div style="color:var(--sub);font-size:12px;margin-top:6px">Ishlatganlar: ${p.usedBy.length} kishi</div>`:''}
      </div>
      <div class="pacts">
        <button class="btn-err btn-sm" onclick="delPromo('${p.id}')">🗑 O'chirish</button>
      </div>
    </div>`;
  }).join('');
}

function delPromo(id){
  authService.deletePromo(id);
  loadPromos();
  toast('Promo-kod o\'chirildi','info');
}

/* ══════════════ SETTINGS ══════════════ */
function loadSettings(){
  const s=authService.getSettings();
  const p=s.plans||{p30:'50000',p90:'120000',pvip:'300000'};
  document.getElementById('cfgPrice').value=s.price||'120000';
  document.getElementById('cfgP30').value=p.p30||'50000';
  document.getElementById('cfgP90').value=p.p90||'120000';
  document.getElementById('cfgPVip').value=p.pvip||'300000';
  document.getElementById('cfgVersion').value=s.version||'3.0.14';
  document.getElementById('cfgMcVer').value=s.mcVersion||'1.21.4';
  document.getElementById('cfgDlUrl').value=s.downloadLink||'';
  document.getElementById('cfgCardNum').value=s.cardNum||'8600 0000 0000 0000';
  document.getElementById('cfgCardName').value=s.cardName||'REXIUM CLIENT';

  // CFG
  if(s.cfgUrl){
    document.getElementById('cfgUrlInput').value=s.cfgUrl;
  }
  // Mod
  if(s.downloadLink){
    document.getElementById('modUrlInput').value=s.downloadLink;
  }
  updateCfgCurrentBox(s);
  updateModCurrentBox(s);
}

document.getElementById('settingsForm').addEventListener('submit',e=>{
  e.preventDefault();
  const s=authService.getSettings();
  authService.saveSettings({
    ...s,
    price:document.getElementById('cfgPrice').value,
    plans:{
      p30:document.getElementById('cfgP30').value,
      p90:document.getElementById('cfgP90').value,
      pvip:document.getElementById('cfgPVip').value,
    },
    version:document.getElementById('cfgVersion').value,
    mcVersion:document.getElementById('cfgMcVer').value,
    downloadLink:document.getElementById('cfgDlUrl').value,
    cardNum:document.getElementById('cfgCardNum').value,
    cardName:document.getElementById('cfgCardName').value,
  });
  toast('Sozlamalar saqlandi!','success');
});

/* ── CFG URL ── */
document.getElementById('cfgUrlForm').addEventListener('submit',e=>{
  e.preventDefault();
  const url=document.getElementById('cfgUrlInput').value.trim();
  if(!url){ toast('URL kiriting','error'); return; }
  const s=authService.getSettings();
  authService.saveSettings({...s, cfgUrl:url, cfgFileData:'', cfgFileName:''});
  const status=document.getElementById('cfgUrlStatus');
  status.innerHTML='<span style="color:var(--ok)">✅ URL saqlandi!</span>';
  updateCfgCurrentBox(authService.getSettings());
  toast('CFG URL saqlandi!','success');
});

/* ── CFG FAYL ── */
document.getElementById('cfgFileInput')?.addEventListener('change',e=>{
  const f=e.target.files[0];
  if(!f) return;
  document.getElementById('cfgFileLabel').textContent=f.name;
});

document.getElementById('cfgFileForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const fileInput=document.getElementById('cfgFileInput');
  const f=fileInput.files[0];
  if(!f){ toast('Fayl tanlang','error'); return; }

  const blobUrl = URL.createObjectURL(f);
  sessionStorage.setItem('rx_cfg_blob', blobUrl);
  sessionStorage.setItem('rx_cfg_fname', f.name);

  const s=authService.getSettings();
  authService.saveSettings({
    ...s,
    cfgFileData: 'blob',
    cfgFileName: f.name,
    cfgUrl: ''
  });
  document.getElementById('cfgFileStatus').innerHTML=`<span style="color:var(--ok)">✅ "${f.name}" fayli yuklandi!</span>`;
  updateCfgCurrentBox(authService.getSettings());
  toast('CFG fayli yuklandi!','success');
});

function updateCfgCurrentBox(s){
  const box=document.getElementById('cfgCurrentBox');
  const info=document.getElementById('cfgCurrentInfo');
  if(s.cfgFileData){
    box.style.display='block';
    info.innerHTML=`<span style="color:var(--ok)">📁 Fayl: ${s.cfgFileName||'cfg fayl'}</span>`;
  } else if(s.cfgUrl){
    box.style.display='block';
    info.innerHTML=`<span style="color:var(--ok)">🔗 URL: <a href="${s.cfgUrl}" target="_blank" style="color:var(--p)">${s.cfgUrl.substring(0,50)}...</a></span>`;
  } else {
    box.style.display='none';
  }
}

function clearCfg(){
  const s=authService.getSettings();
  authService.saveSettings({...s, cfgUrl:'', cfgFileData:'', cfgFileName:''});
  document.getElementById('cfgUrlInput').value='';
  document.getElementById('cfgFileLabel').textContent='Faylni tanlang (.cfg, .json, .txt)';
  document.getElementById('cfgUrlStatus').innerHTML='';
  document.getElementById('cfgFileStatus').innerHTML='';
  updateCfgCurrentBox(authService.getSettings());
  toast('CFG o\'chirildi','info');
}

/* ── MOD FAYLI ── */
document.getElementById('modUrlForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const url=document.getElementById('modUrlInput').value.trim();
  if(!url){ toast('URL kiriting','error'); return; }
  const s=authService.getSettings();
  authService.saveSettings({...s, downloadLink:url, modFileData:'', modFileName:''});
  document.getElementById('modUrlStatus').innerHTML='<span style="color:var(--ok)">✅ URL saqlandi!</span>';
  updateModCurrentBox(authService.getSettings());
  toast('Mod URL saqlandi!','success');
});

document.getElementById('modFileInput')?.addEventListener('change',e=>{
  const f=e.target.files[0];
  if(!f) return;
  document.getElementById('modFileLabel').textContent=f.name;
});

document.getElementById('modFileForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const fileInput=document.getElementById('modFileInput');
  const f=fileInput.files[0];
  if(!f){ toast('Fayl tanlang','error'); return; }

  // Faylni Blob URL sifatida saqlash (session davomida ishlaydi)
  const blobUrl = URL.createObjectURL(f);
  
  // Fayl nomini va blob url ni saqlash
  const s=authService.getSettings();
  // localStorage ga faqat fayl nomini saqlaymiz, blob url ni session storage ga
  sessionStorage.setItem('rx_mod_blob', blobUrl);
  sessionStorage.setItem('rx_mod_fname', f.name);
  
  authService.saveSettings({
    ...s,
    modFileName: f.name,
    modFileData: 'blob', // marker - blob storage da
    downloadLink: ''
  });
  
  document.getElementById('modFileStatus').innerHTML=`<span style="color:var(--ok)">✅ "${f.name}" tayyor! Endi foydalanuvchilar yuklab olishi mumkin.</span>`;
  updateModCurrentBox(authService.getSettings());
  toast('Mod fayli yuklandi!','success');
});

function updateModCurrentBox(s){
  const box=document.getElementById('modCurrentBox');
  const info=document.getElementById('modCurrentInfo');
  if(s.modFileData){
    box.style.display='block';
    info.innerHTML=`<span style="color:var(--ok)">📁 Fayl: ${s.modFileName||'mod.jar'}</span>`;
  } else if(s.downloadLink){
    box.style.display='block';
    info.innerHTML=`<span style="color:var(--ok)">🔗 URL: <a href="${s.downloadLink}" target="_blank" style="color:var(--p)">${s.downloadLink.substring(0,50)}...</a></span>`;
  } else {
    box.style.display='none';
  }
}

function clearMod(){
  const s=authService.getSettings();
  authService.saveSettings({...s, downloadLink:'', modFileData:'', modFileName:''});
  document.getElementById('modUrlInput').value='';
  document.getElementById('modFileLabel').textContent='Faylni tanlang (.jar, .zip)';
  document.getElementById('modUrlStatus').innerHTML='';
  document.getElementById('modFileStatus').innerHTML='';
  updateModCurrentBox(authService.getSettings());
  toast('Mod fayli o\'chirildi','info');
}
/* ══════════════ INIT ══════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  loadPayments();
  loadNewsList();
  loadUsers();
  loadPromos();
  loadSettings();
});
