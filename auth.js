const STORAGE = {
    user: 'rx_user', users: 'rx_users', news: 'rx_news',
    settings: 'rx_settings', payments: 'rx_payments', promos: 'rx_promos'
};
const ADMIN_EMAIL = atob('bmVncmthcmxvQGdtYWlsLmNvbQ==');
const ADMIN_PASS  = atob('YXppbWpvbnV6YmVr');

class AuthService {
    constructor() { this._initAdmin(); }

    _initAdmin() {
        const users = this.getUsers();
        if (!users.find(u => u.isAdmin)) {
            users.push({ id:'admin_1', name:'Admin', email:ADMIN_EMAIL,
                password:btoa(ADMIN_PASS), isPurchased:true, isAdmin:true,
                createdAt:new Date().toISOString() });
            this._saveUsers(users);
        }
    }

    getUsers() { return JSON.parse(localStorage.getItem(STORAGE.users)||'[]'); }
    _saveUsers(u) { localStorage.setItem(STORAGE.users, JSON.stringify(u)); }

    register(name, email, password) {
        const users = this.getUsers();
        if (users.find(u => u.email.toLowerCase()===email.toLowerCase()))
            throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
        const user = { id:Date.now().toString(), name, email,
            password:btoa(password), isPurchased:false, isAdmin:false,
            createdAt:new Date().toISOString() };
        users.push(user);
        this._saveUsers(users);
        return user;
    }

    login(email, password) {
        const u = this.getUsers().find(u =>
            u.email.toLowerCase()===email.toLowerCase() && u.password===btoa(password));
        if (!u) throw new Error("Email yoki parol noto'g'ri");
        localStorage.setItem(STORAGE.user, JSON.stringify(u));
        return u;
    }

    logout() { localStorage.removeItem(STORAGE.user); }
    getCurrentUser() { const d=localStorage.getItem(STORAGE.user); return d?JSON.parse(d):null; }
    isAdmin(u) { return u&&u.isAdmin===true; }

    hasPurchased(user) {
        if (!user) return false;
        const u = this.getUsers().find(x=>x.id===user.id);
        return u?u.isPurchased:false;
    }

    purchase(userId) {
        const users = this.getUsers();
        const i = users.findIndex(u=>u.id===userId);
        if (i!==-1) {
            users[i].isPurchased = true;
            this._saveUsers(users);
            const cur = this.getCurrentUser();
            if (cur&&cur.id===userId) {
                cur.isPurchased = true;
                localStorage.setItem(STORAGE.user, JSON.stringify(cur));
            }
            return true;
        }
        return false;
    }

    updateUser(userId, name, email, isPurchased) {
        const users = this.getUsers();
        const i = users.findIndex(u=>u.id===userId);
        if (i!==-1) {
            users[i].name = name;
            users[i].email = email;
            users[i].isPurchased = isPurchased;
            this._saveUsers(users);
            const cur = this.getCurrentUser();
            if (cur&&cur.id===userId) {
                cur.name=name; cur.email=email; cur.isPurchased=isPurchased;
                localStorage.setItem(STORAGE.user, JSON.stringify(cur));
            }
            return true;
        }
        return false;
    }

    changePassword(userId, oldPass, newPass) {
        const users = this.getUsers();
        const i = users.findIndex(u=>u.id===userId);
        if (i===-1) throw new Error("Foydalanuvchi topilmadi");
        if (users[i].password!==btoa(oldPass)) throw new Error("Eski parol noto'g'ri");
        users[i].password = btoa(newPass);
        this._saveUsers(users);
        const cur = this.getCurrentUser();
        if (cur&&cur.id===userId) {
            cur.password = btoa(newPass);
            localStorage.setItem(STORAGE.user, JSON.stringify(cur));
        }
    }

    deleteUser(userId) {
        this._saveUsers(this.getUsers().filter(u=>u.id!==userId));
    }

    getSettings() {
        const d = localStorage.getItem(STORAGE.settings);
        return d ? JSON.parse(d) : {
            price:'120000', version:'3.0.14', mcVersion:'1.21.4',
            downloadLink:'', cardNum:'8600 0000 0000 0000', cardName:'REXIUM CLIENT',
            cfgUrl:'', cfgFileData:'', cfgFileName:'',
            plans:{ p30:'50000', p90:'120000', pvip:'300000' }
        };
    }
    saveSettings(s) { localStorage.setItem(STORAGE.settings, JSON.stringify(s)); }

    getPayments() { return JSON.parse(localStorage.getItem(STORAGE.payments)||'[]'); }
    _savePayments(p) { localStorage.setItem(STORAGE.payments, JSON.stringify(p)); }

    addPayment(userId, payerName, amount, checkImage, planLabel) {
        const payments = this.getPayments();
        const p = {
            id: Date.now().toString(),
            userId, payerName, amount, checkImage,
            planLabel: planLabel || 'Standart',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        payments.push(p);
        this._savePayments(payments);
        return p;
    }

    approvePayment(id) {
        const p = this.getPayments(); const item = p.find(x=>x.id===id);
        if (item) { item.status='approved'; this._savePayments(p); this.purchase(item.userId); return true; }
        return false;
    }

    rejectPayment(id) {
        const p = this.getPayments(); const item = p.find(x=>x.id===id);
        if (item) { item.status='rejected'; this._savePayments(p); return true; }
        return false;
    }

    getUserPayments(userId) { return this.getPayments().filter(p=>p.userId===userId); }

    /* ── PROMO CODES ── */
    getPromos() { return JSON.parse(localStorage.getItem(STORAGE.promos)||'[]'); }
    _savePromos(p) { localStorage.setItem(STORAGE.promos, JSON.stringify(p)); }

    addPromo(code, maxUses) {
        const promos = this.getPromos();
        if (promos.find(p=>p.code.toUpperCase()===code.toUpperCase()))
            throw new Error("Bu promo-kod allaqachon mavjud");
        const p = { id:Date.now().toString(), code:code.toUpperCase(),
            maxUses:Number(maxUses), usedCount:0, usedBy:[],
            createdAt:new Date().toISOString() };
        promos.push(p);
        this._savePromos(promos);
        return p;
    }

    usePromo(code, userId) {
        const promos = this.getPromos();
        const p = promos.find(x=>x.code===code.toUpperCase());
        if (!p) throw new Error("Promo-kod topilmadi");
        if (p.usedBy.includes(userId)) throw new Error("Bu promo-kodni allaqachon ishlatgansiz");
        if (p.usedCount >= p.maxUses) throw new Error("Bu promo-kodning muddati o'tgan");
        p.usedCount++;
        p.usedBy.push(userId);
        this._savePromos(promos);
        this.purchase(userId);
        return true;
    }

    deletePromo(id) { this._savePromos(this.getPromos().filter(p=>p.id!==id)); }
}

class NewsService {
    getNews() { return JSON.parse(localStorage.getItem(STORAGE.news)||'[]'); }
    _save(n)  { localStorage.setItem(STORAGE.news, JSON.stringify(n)); }
    addNews(title, content) {
        const news = this.getNews();
        const item = { id:Date.now().toString(), title, content,
            date:new Date().toLocaleDateString('uz-UZ') };
        news.unshift(item);
        this._save(news);
        return item;
    }
    deleteNews(id) { this._save(this.getNews().filter(n=>n.id!==id)); }
}

const authService = new AuthService();
const newsService = new NewsService();
