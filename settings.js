/* ══════════════════════════════════════════
   SHARED SETTINGS MODAL
   Barcha sahifalarda ishlaydi.
   Faqat shu faylni + settings modal HTML ni
   har bir sahifaga qo'shish kifoya.
══════════════════════════════════════════ */

const PREF_KEY = 'rx_ui_prefs';

/* openM / closeM - agar app.js dan oldin yuklansa ham ishlaydi */
function openM(id){
    const el=document.getElementById(id);
    if(el) el.style.display='flex';
}
function closeM(id){
    const el=document.getElementById(id);
    if(el) el.style.display='none';
}

function getPrefs() {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{"anim":true,"glass":true,"transitions":true}');
}

function savePrefs(p) {
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
}

function applyPrefs(p) {
    // Animatsiya
    const bg = document.getElementById('bgWrap');
    if (bg) bg.style.display = p.anim ? 'block' : 'none';

    // Transitions
    let noTr = document.getElementById('_noTr');
    if (!p.transitions) {
        if (!noTr) {
            noTr = document.createElement('style');
            noTr.id = '_noTr';
            noTr.textContent = '.card,.dcard,.acard,.modal,.navbar,.news-card{transition:none!important;animation:none!important}';
            document.head.appendChild(noTr);
        }
    } else {
        noTr && noTr.remove();
    }

    // Glass
    let noGl = document.getElementById('_noGl');
    if (!p.glass) {
        if (!noGl) {
            noGl = document.createElement('style');
            noGl.id = '_noGl';
            noGl.textContent = '.glass{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:rgba(12,12,26,0.97)!important}';
            document.head.appendChild(noGl);
        }
    } else {
        noGl && noGl.remove();
    }
}

function openSettings() {
    const user = authService.getCurrentUser();
    const p = getPrefs();

    // Togglelarni joriy holatga moslashtirish
    document.getElementById('stgAnim').checked = p.anim;
    document.getElementById('stgGlass').checked = p.glass;
    document.getElementById('stgTransitions').checked = p.transitions;

    // Foydalanuvchi ma'lumotlari
    if (user) {
        const el = document.getElementById('stgUserInfo');
        if (el) {
            const purchased = authService.hasPurchased(user);
            el.innerHTML = `
                <div class="irow"><span class="ilabel">Ism</span><span class="ival">${user.name}</span></div>
                <div class="irow"><span class="ilabel">Email</span><span class="ival">${user.email}</span></div>
                <div class="irow"><span class="ilabel">Status</span><span class="ival">
                    ${purchased
                        ? '<span class="spill spill-ok">✓ Sotib olingan</span>'
                        : '<span class="spill spill-no">✗ Sotib olinmagan</span>'}
                </span></div>`;
        }

        // Parol o'zgartirish faqat kirgan bo'lsa
        const passSection = document.getElementById('stgPassSection');
        if (passSection) passSection.style.display = 'block';
    } else {
        const passSection = document.getElementById('stgPassSection');
        if (passSection) passSection.style.display = 'none';
    }

    openM('settingsModal');
}

/* Toggle change handlers */
function _bindToggles() {
    ['stgAnim', 'stgGlass', 'stgTransitions'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', () => {
            const p = {
                anim: document.getElementById('stgAnim').checked,
                glass: document.getElementById('stgGlass').checked,
                transitions: document.getElementById('stgTransitions').checked,
            };
            savePrefs(p);
            applyPrefs(p);
            if (typeof toast === 'function') toast('Sozlamalar saqlandi', 'success');
        });
    });
}

/* Password form */
function _bindPassForm() {
    const form = document.getElementById('stgPassForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const user = authService.getCurrentUser();
        if (!user) return;
        const old = document.getElementById('stgOldPass').value;
        const nw  = document.getElementById('stgNewPass').value;
        const nw2 = document.getElementById('stgNewPass2').value;
        if (nw !== nw2) { if (typeof toast==='function') toast('Yangi parollar mos kelmadi', 'error'); return; }
        if (nw.length < 6) { if (typeof toast==='function') toast('Parol kamida 6 ta belgi', 'error'); return; }
        try {
            authService.changePassword(user.id, old, nw);
            form.reset();
            if (typeof toast==='function') toast('Parol muvaffaqiyatli o\'zgartirildi!', 'success');
        } catch(err) {
            if (typeof toast==='function') toast(err.message, 'error');
        }
    });
}

/* Init on DOM ready */
document.addEventListener('DOMContentLoaded', () => {
    applyPrefs(getPrefs());
    _bindToggles();
    _bindPassForm();

    // Settings tugmasi - DOM tayyor bo'lganda ulash
    const btn = document.getElementById('settingsBtn');
    if(btn){
        btn.addEventListener('click', openSettings);
    }
});
