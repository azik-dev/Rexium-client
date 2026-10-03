function toast(msg,type='success'){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast '+type; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),3000);
}
function openM(id){document.getElementById(id).style.display='flex';}
function closeM(id){document.getElementById(id).style.display='none';}

const user=authService.getCurrentUser();
if(!user){window.location.href='index.html';}
// Admin ham dashboard ni ko'ra oladi - redirect qilmaymiz

/* apply ui prefs */
(function(){
  const p=JSON.parse(localStorage.getItem('rx_ui_prefs')||'{"anim":true}');
  if(!p.anim){ const b=document.getElementById('bgWrap'); if(b) b.style.display='none'; }
  if(!p.transitions){
    const s=document.createElement('style');
    s.textContent='*{transition:none!important;animation:none!important}';
    document.head.appendChild(s);
  }
})();

/* LOGOUT */
document.getElementById('logoutBtn').addEventListener('click',()=>openM('logoutModal'));
document.getElementById('confirmNo').addEventListener('click',()=>closeM('logoutModal'));
document.getElementById('confirmYes').addEventListener('click',()=>{authService.logout();window.location.href='index.html';});
document.querySelectorAll('.overlay').forEach(o=>{o.addEventListener('click',e=>{if(e.target===o)o.style.display='none';});});

/* LOAD DASHBOARD */
function load(){
  const s=authService.getSettings();
  const purchased=authService.hasPurchased(user);
  const payments=authService.getUserPayments(user.id);
  const hasPending=payments.some(p=>p.status==='pending');

  document.getElementById('welcomeMsg').textContent=`Xush kelibsiz, ${user.name}!`;
  document.getElementById('uName').textContent=user.name;
  document.getElementById('uEmail').textContent=user.email;
  document.getElementById('uDate').textContent=user.createdAt?new Date(user.createdAt).toLocaleDateString('uz-UZ'):'—';
  document.getElementById('dlVersion').textContent=s.version||'3.0.14';
  document.getElementById('dlMcVersion').textContent=s.mcVersion||'1.21.4';

  const statusEl=document.getElementById('uStatus');
  if(purchased) statusEl.innerHTML='<span class="spill spill-ok">✓ Sotib olingan</span>';
  else if(hasPending) statusEl.innerHTML='<span class="spill spill-wait">⏳ Tekshirilmoqda</span>';
  else statusEl.innerHTML='<span class="spill spill-no">✗ Sotib olinmagan</span>';

  /* download section */
  const dl=document.getElementById('dlSection');
  if(purchased){
    dl.innerHTML=`<div class="dl-avail">
      <span class="big-ico">✅</span>
      <p>Yuklab olishingiz mumkin!</p>
      <button id="realDlBtn" class="btn-primary mt12">⬇ Yuklab Olish</button>
    </div>`;
    document.getElementById('realDlBtn').addEventListener('click',()=>{
      const s2=authService.getSettings();
      const userEmail = user.email;
      const safeEmail = userEmail.replace(/[^a-zA-Z0-9@._-]/g,'');
      const fileName = safeEmail + '_rexiumclient.jar';

      if(s2.modFileData==='blob'){
        const blobUrl=sessionStorage.getItem('rx_mod_blob');
        const origName=sessionStorage.getItem('rx_mod_fname')||'rexium-client.jar';
        if(blobUrl){
          // Faylni fetch qilib, ichiga email yozib qayta yuklaymiz
          fetch(blobUrl)
            .then(r=>r.arrayBuffer())
            .then(buf=>injectEmailAndDownload(buf, userEmail, fileName))
            .catch(()=>{
              // fetch ishlamasa to'g'ridan yuklaymiz
              const a=document.createElement('a');
              a.href=blobUrl; a.download=fileName; a.click();
              toast('Mod yuklab olindi!','success');
            });
        } else {
          toast('Mod fayli topilmadi. Admin sahifani yangilashi kerak.','error');
        }
      } else if(s2.downloadLink){
        // URL orqali - faylni fetch qilib email inject qilamiz
        toast('Yuklab olinmoqda...','info');
        fetch(s2.downloadLink)
          .then(r=>{
            if(!r.ok) throw new Error('fetch failed');
            return r.arrayBuffer();
          })
          .then(buf=>injectEmailAndDownload(buf, userEmail, fileName))
          .catch(()=>{
            // CORS muammo bo'lsa to'g'ridan yuklaymiz
            const a=document.createElement('a');
            a.href=s2.downloadLink; a.download=fileName; a.click();
            toast('Yuklab olish boshlandi!','success');
          });
      } else {
        toast('Mod fayli hali qo\'shilmagan. Admin bilan bog\'laning.','error');
      }
    });
  } else {
    dl.innerHTML=`<div class="dl-locked"><span class="big-ico">🔒</span><p>Yuklab olish uchun modni sotib oling yoki promo-kod ishlating</p></div>`;
  }

  /* purchase card - har doim ko'rsatib turadi */
  const pc=document.getElementById('purchaseCard');
  pc.style.display='block';

  const pendingBox=document.getElementById('pendingBox');
  if(hasPending){
    if(pendingBox) pendingBox.style.display='block';
  } else {
    if(pendingBox) pendingBox.style.display='none';
  }

  /* CFG card - faqat sotib olgan bo'lsa */
  const cfgCard=document.getElementById('cfgCard');
  if(purchased){
    cfgCard.style.display='block';
    loadCfgSection(s);
  } else {
    cfgCard.style.display='none';
  }
}

function loadCfgSection(s){
  const sec=document.getElementById('cfgSection');
  if(!sec) return;

  if(s.cfgFileData==='blob'){
    const blobUrl=sessionStorage.getItem('rx_cfg_blob');
    const fname=sessionStorage.getItem('rx_cfg_fname')||s.cfgFileName||'bezban.cfg';
    sec.innerHTML=`
      <div class="dl-avail">
        <span class="big-ico">📁</span>
        <p>${fname}</p>
        <button id="dlCfgBtn" class="btn-primary mt12">⬇ CFG Yuklab Olish</button>
      </div>`;
    document.getElementById('dlCfgBtn').addEventListener('click',()=>{
      if(blobUrl){
        const a=document.createElement('a');
        a.href=blobUrl; a.download=fname; a.click();
        toast('CFG yuklab olindi!','success');
      } else {
        toast('CFG fayli topilmadi. Admin sahifani yangilashi kerak.','error');
      }
    });
  } else if(s.cfgUrl){
    // URL mavjud
    sec.innerHTML=`
      <div class="dl-avail">
        <span class="big-ico">🔗</span>
        <p>Bez Ban CFG fayli tayyor</p>
        <button id="dlCfgBtn" class="btn-primary mt12">⬇ CFG Yuklab Olish</button>
      </div>`;
    document.getElementById('dlCfgBtn').addEventListener('click',()=>{
      window.open(s.cfgUrl,'_blank');
      toast('CFG yuklab olish boshlandi!','success');
    });
  } else {
    sec.innerHTML=`
      <div class="dl-locked">
        <span class="big-ico">⏳</span>
        <p>CFG fayli hali qo'shilmagan. Tez orada!</p>
      </div>`;
  }
}

/* BUY */
document.getElementById('buyBtn')?.addEventListener('click',()=>{
  const s=authService.getSettings();
  document.getElementById('payAmountShow').textContent=Number(s.price||120000).toLocaleString('uz-UZ')+' UZS';
  document.getElementById('adminCardNum').textContent=s.cardNum||'8600 0000 0000 0000';
  document.getElementById('adminCardName').textContent=s.cardName||'REXIUM CLIENT';
  openM('payModal');
});

document.getElementById('checkImg')?.addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{document.getElementById('previewSrc').src=ev.target.result;document.getElementById('imgPreview').style.display='block';};
  r.readAsDataURL(f);
});

document.getElementById('payForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('payerName').value.trim();
  const img=document.getElementById('previewSrc').src;
  if(!img||img===window.location.href){toast('Check rasmini yuklang!','error');return;}
  const s=authService.getSettings();
  authService.addPayment(user.id,name,s.price||'120000',img);
  closeM('payModal');
  toast("To'lov yuborildi! Admin tasdiqlashini kuting.",'info');
  document.getElementById('payForm').reset();
  document.getElementById('imgPreview').style.display='none';
  setTimeout(load,600);
});

/* PROMO CODE - delegate event, doim ishlaydi */
document.addEventListener('submit', e => {
  if (!e.target || e.target.id !== 'promoForm') return;
  e.preventDefault();
  const input = document.getElementById('promoInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) { toast('Promo-kodni kiriting', 'error'); return; }
  try {
    authService.usePromo(code, user.id);
    toast('Promo-kod tasdiqlandi! Endi yuklab olish mumkin.', 'success');
    input.value = '';
    load();
  } catch(err) {
    toast(err.message, 'error');
  }
});

function _bindPromoForm(){} // bo'sh qoldirdik, delegate ishlatilmoqda

document.addEventListener('DOMContentLoaded', () => {
  load();
});

/* ══ LICENSE INJECT ══
   JAR (ZIP format) ichiga license.txt qo'shib, email bilan yuklaymiz.
   Java kodi /license.txt ni o'qib email ni tekshiradi.
*/
async function injectEmailAndDownload(jarBuffer, email, fileName) {
  try {
    if (typeof JSZip === 'undefined') {
      // JSZip yo'q - to'g'ridan yuklaymiz
      fallbackDownload(jarBuffer, fileName);
      toast('Mod yuklab olindi!', 'success');
      return;
    }

    const zip = await JSZip.loadAsync(jarBuffer);

    // Email ni license.txt ga yozamiz
    zip.file('license.txt', email);

    const newBuf = await zip.generateAsync({
      type: 'arraybuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 1 }
    });

    fallbackDownload(newBuf, fileName);
    toast('✅ Mod yuklab olindi! (' + email + ')', 'success');

  } catch (e) {
    console.error('inject xato:', e);
    fallbackDownload(jarBuffer, fileName);
    toast('Mod yuklab olindi!', 'success');
  }
}

function fallbackDownload(buffer, fileName) {
  const blob = new Blob([buffer], { type: 'application/java-archive' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
