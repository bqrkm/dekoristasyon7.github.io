import { useState, useEffect, useCallback } from 'react';

// Types
interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  city: string;
}

interface CartItem {
  name: string;
  price: number;
  img: string;
  qty: number;
}

interface Order {
  orderNumber: string;
  date: string;
  customer: { name: string; email: string; phone: string; address: string; city: string };
  items: CartItem[];
  total: number;
  payment: string;
  note: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  colorOptions?: Array<{ name: string; image: string }>;
  badge?: string;
  badgeType?: string;
  stock?: number;
  variants?: string[];
}

interface ProductReview {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Data - Products
const productsData: Product[] = [
  { id: 1, name: 'Ceviz Dokulu Duvar Dekoru', category: 'DUVAR DEKORLARI', price: 1890, oldPrice: 2690, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop', badge: '%30 İNDİRİM', stock: 3, variants: ['Küçük (40x40cm)', 'Orta (60x60cm)', 'Büyük (80x80cm)'] },
  { id: 2, name: 'Altın Yaldız Fotoğraf Çerçeve Seti', category: 'FOTOĞRAF ÇERÇEVELERİ', price: 890, image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=400&h=400&fit=crop', badge: 'YENİ', badgeType: 'new', stock: 15, variants: ['3\'lü Set', '5\'li Set', '7\'li Set'] },
  { id: 3, name: 'Hasır Sehpa - Oval Model', category: 'SEHPALAR', price: 1290, oldPrice: 1690, image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=400&fit=crop', stock: 5, variants: ['Küçük', 'Orta', 'Büyük'] },
  { id: 4, name: 'Seramik Masaüstü Vazo Seti', category: 'MASAÜSTÜ DEKORLARI', price: 590, oldPrice: 790, image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400&h=400&fit=crop', badge: 'FIRSAT', stock: 2, variants: ['Beyaz', 'Bej', 'Lacivert'] },
  { id: 5, name: 'Pirinç Sarkıt Avize', category: 'AYDINLATMA', price: 2490, image: 'https://images.unsplash.com/photo-1543198126-a8ad8e219841?w=400&h=400&fit=crop', badge: 'YENİ', badgeType: 'new', stock: 8, variants: ['Tekli', 'Üçlü'] },
  { id: 6, name: 'Ahşap Duvar Saati - Büyük Boy', category: 'SAAT', price: 890, oldPrice: 1190, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop', stock: 4, variants: ['Ceviz', 'Meşe', 'Beyaz'] },
  { id: 7, name: 'Yapay Orkide Çiçeği - Beyaz', category: 'YAPAY ÇİÇEK', price: 690, image: 'https://images.unsplash.com/photo-1566938064504-a38b5a2a1f47?w=400&h=400&fit=crop', stock: 20, variants: ['Beyaz', 'Pembe', 'Mor'] },
  { id: 8, name: 'Hasır Saklama Sepeti Seti (3\'lü)', category: 'HASIR ÜRÜNLER', price: 490, oldPrice: 690, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop', badge: '%25 İNDİRİM', stock: 6, variants: ['Doğal', 'Koyu Kahve', 'Siyah'] },
  { id: 11, name: 'Hasır Yelpaze Duvar Dekoru - Büyük', category: 'DUVAR DEKORLARI', price: 1590, oldPrice: 2190, image: '/images/hasir-yelpaze-buyuk.jpg', badge: 'YENİ', badgeType: 'new', stock: 8, variants: ['Büyük (80cm)'] },
  { id: 12, name: 'Hasır Yelpaze Duvar Dekoru - Orta', category: 'DUVAR DEKORLARI', price: 1290, oldPrice: 1790, image: '/images/hasir-yelpaze-orta.jpg', badge: 'YENİ', badgeType: 'new', stock: 12, variants: ['Orta (60cm)'] },
  { id: 13, name: 'Hasır Yelpaze Duvar Dekoru - Küçük', category: 'DUVAR DEKORLARI', price: 890, image: '/images/hasir-yelpaze-kucuk.jpg', badge: 'YENİ', badgeType: 'new', stock: 15, variants: ['Küçük (40cm)'] },
  { id: 14, name: 'Lotus Mandala Triptik Duvar Sanatı', category: 'DUVAR DEKORLARI', price: 1890, oldPrice: 2490, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop', badge: '%25 İNDİRİM', stock: 10, variants: ['Siyah', 'Beyaz', 'Altın'] },
  { id: 15, name: 'Kelebek & Çiçek Ay Duvar Dekoru', category: 'DUVAR DEKORLARI', price: 1190, oldPrice: 1590, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop', badge: 'YENİ', badgeType: 'new', stock: 14, variants: ['Siyah-Altın', 'Siyah-Gümüş'] },
  {
    id: 9,
    name: 'Besmele Duvar Dekoru (Dikdörtgen)',
    category: 'BESMELE',
    price: 1290,
    oldPrice: 1790,
    image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/beyaz_alt%C4%B1n-D%C3%BCz.jpg',
    colorOptions: [
      { name: 'Beyaz Altın', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/beyaz_alt%C4%B1n-D%C3%BCz.jpg' },
      { name: 'Beyaz Gümüş', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/Beyaz_g%C3%BCm%C3%BC%C5%9F_D%C3%BCz.jpg' },
      { name: 'Siyah Gümüş', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/Siyah_g%C3%BCm%C3%BC%C5%9F_D%C3%BCz.jpg' },
    ],
    badge: 'YENİ',
    stock: 10,
    variants: ['Standart (70x25cm)'],
  },
  {
    id: 10,
    name: 'Besmele Duvar Dekoru (Oval)',
    category: 'BESMELE',
    price: 1290,
    oldPrice: 1790,
    image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/beyaz_alt%C4%B1n-Oval.jpg',
    colorOptions: [
      { name: 'Beyaz Altın', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/beyaz_alt%C4%B1n-Oval.jpg' },
      { name: 'Beyaz Gümüş', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/beyaz_g%C3%BCm%C3%BC%C5%9F_Oval.jpg' },
      { name: 'Siyah Gümüş', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/Siyah_g%C3%BCm%C3%BC%C5%9F_Oval.jpg' },
      { name: 'Krem Siyah', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/krem_siyah_oval.jpg' },
    ],
    badge: 'YENİ',
    stock: 12,
    variants: ['Standart (70x25cm)'],
  },
];

const categories = [
  { name: 'Besmele', image: 'https://raw.githubusercontent.com/bqrkm/dekoristasyon.github.io/main/beyaz_alt%C4%B1n-D%C3%BCz.jpg' },
  { name: 'Duvar Dekorları', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop' },
  { name: 'Fotoğraf Çerçeveleri', image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=200&h=200&fit=crop' },
  { name: 'Sehpalar', image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=200&h=200&fit=crop' },
  { name: 'Masaüstü Dekorları', image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=200&h=200&fit=crop' },
  { name: 'Aydınlatma', image: 'https://images.unsplash.com/photo-1543198126-a8ad8e219841?w=200&h=200&fit=crop' },
  { name: 'Saat', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=200&h=200&fit=crop' },
  { name: 'Yapay Çiçek', image: 'https://images.unsplash.com/photo-1566938064504-a38b5a2a1f47?w=200&h=200&fit=crop' },
  { name: 'Hasır Ürünler', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&h=200&fit=crop' },
];

const slidesData = [
  { image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=1600&h=700&fit=crop', title: 'Duvar Dekorlarında %30 İndirim', text: 'Şık duvar dekorları, fotoğraf çerçeveleri ve daha fazlası. Evinize yenilik katın.', btn: 'Hemen Keşfet' },
  { image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1600&h=700&fit=crop', title: '2025 Yeni Koleksiyon', text: 'Aydınlatma, saat, yapay çiçek ve hasır ürünlerle tanışın.', btn: 'Koleksiyonu Gör' },
  { image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&h=700&fit=crop', title: 'Ücretsiz Kargo', text: 'Tüm siparişlerde Türkiye geneli ücretsiz kargo avantajı.', btn: 'Alışverişe Başla' },
];

const campaignBoxes = [
  { image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=500&h=300&fit=crop', title: 'Duvar Dekorları', text: 'Evinize şıklık katın' },
  { image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=500&h=300&fit=crop', title: 'Fotoğraf Çerçeveleri', text: '%20\'ye varan indirim' },
  { image: 'https://images.unsplash.com/photo-1566938064504-a38b5a2a1f47?w=500&h=300&fit=crop', title: 'Yapay Çiçek & Hasır', text: 'Doğal dokunuşlar' },
];

const instaImages = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1543198126-a8ad8e219841?w=300&h=300&fit=crop',
  'https://images.unsplash.com/photo-1566938064504-a38b5a2a1f47?w=300&h=300&fit=crop',
];

const dropdownCategories = [
  '🌙 Besmele', '🖼️ Duvar Dekorları', '📷 Fotoğraf Çerçeveleri', '🪑 Sehpalar', '🎨 Masaüstü Dekorları',
  '💡 Aydınlatma', '🕐 Saat', '🌸 Yapay Çiçek', '🧺 Hasır Ürünler'
];

type AccountTab = 'info' | 'edit' | 'password' | 'address' | 'orders';

function renderStars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function getPrimaryImage(product: Product) {
  return product.images?.[0] || product.image;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favCount, setFavCount] = useState(0);
  const [favs, setFavs] = useState<Set<number>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; text: string }>({ show: false, text: '' });
  const [orderNum, setOrderNum] = useState('');

  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [accountModal, setAccountModal] = useState(false);
  const [accountTab, setAccountTab] = useState<AccountTab>('info');

  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '', password2: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '', address: '', city: '', payment: '', note: '' });
  const [regErrors, setRegErrors] = useState<Record<string, boolean>>({});
  const [loginErrors, setLoginErrors] = useState<Record<string, boolean>>({});
  const [chkErrors, setChkErrors] = useState<Record<string, boolean>>({});

  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [editErrors, setEditErrors] = useState<Record<string, boolean>>({});
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', newPass2: '' });
  const [passErrors, setPassErrors] = useState<Record<string, boolean>>({});
  const [addressForm, setAddressForm] = useState({ address: '', city: '' });
  const [addrErrors, setAddrErrors] = useState<Record<string, boolean>>({});

  const [reviewModal, setReviewModal] = useState<number | null>(null);
  const [productReviews, setProductReviews] = useState<Record<number, ProductReview[]>>({});
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewError, setReviewError] = useState('');

  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [cardErrors, setCardErrors] = useState<Record<string, boolean>>({});
  const [processingPayment, setProcessingPayment] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [duplicateError, setDuplicateError] = useState({ email: '', phone: '' });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Tümü');
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState<'home' | 'product'>('home');
  const [productDetail, setProductDetail] = useState<number | null>(null);
  const [selectedProductImage, setSelectedProductImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');

  const [compareList, setCompareList] = useState<number[]>([]);
  const [, setCompareModal] = useState(false);

  const [returnModal, setReturnModal] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ valid: boolean; discount: number; label: string } | null>(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);

  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<Event | null>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(false);

  useEffect(() => {
    const su = localStorage.getItem('mdfUser');
    const sus = localStorage.getItem('mdfUsers');
    const sc = localStorage.getItem('mdfCart');
    const sr = localStorage.getItem('mdfReviews');
    if (su) setCurrentUser(JSON.parse(su));
    if (sus) setUsers(JSON.parse(sus));
    if (sc) setCart(JSON.parse(sc));
    if (sr) setProductReviews(JSON.parse(sr));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
      setTimeout(() => setShowPwaBanner(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installPwa = async () => {
    if (!pwaInstallPrompt) return;
    (pwaInstallPrompt as any).prompt();
    await (pwaInstallPrompt as any).userChoice;
    setPwaInstallPrompt(null);
    setShowPwaBanner(false);
  };

  useEffect(() => { localStorage.setItem('mdfCart', JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slidesData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRegisterModal(false); setLoginModal(false); setCheckoutModal(false);
        setSuccessModal(false); setCartOpen(false); setAccountModal(false);
        setReviewModal(null); setTermsModal(false); setPrivacyModal(false);
        setProductDetail(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const showToast = useCallback((text: string) => {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: '' }), 3000);
  }, []);

  const persistUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('mdfUser', JSON.stringify(updatedUser));
    setUsers(prev => {
      const updated = prev.map(u => u.email === updatedUser.email ? updatedUser : u);
      localStorage.setItem('mdfUsers', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRegister = () => {
    const errors: Record<string, boolean> = {};
    setDuplicateError({ email: '', phone: '' });
    const nameWords = regForm.name.trim().split(/\s+/);
    if (!regForm.name.trim() || nameWords.length < 2) errors.name = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regForm.email.trim()) { errors.email = true; }
    else if (!emailRegex.test(regForm.email.trim())) { errors.email = true; }
    const phoneDigits = regForm.phone.replace(/\D/g, '');
    if (!regForm.phone.trim()) { errors.phone = true; }
    else if (phoneDigits.length < 10 || phoneDigits.length > 11) { errors.phone = true; }
    else if (!phoneDigits.startsWith('05') && !phoneDigits.startsWith('5')) { errors.phone = true; }
    if (!regForm.password || regForm.password.length < 6) errors.password = true;
    if (regForm.password !== regForm.password2) errors.password2 = true;
    if (!termsAccepted) setTermsError(true);
    else setTermsError(false);
    setRegErrors(errors);
    if (Object.keys(errors).length > 0 || !termsAccepted) return;
    if (users.find(u => u.email.toLowerCase() === regForm.email.toLowerCase())) {
      setDuplicateError(prev => ({ ...prev, email: 'Bu e-posta adresi zaten kullanılıyor!' }));
      return;
    }
    if (users.find(u => u.phone === regForm.phone)) {
      setDuplicateError(prev => ({ ...prev, phone: 'Bu telefon numarası zaten kullanılıyor!' }));
      return;
    }
    const upperName = regForm.name.trim().replace(/\b\w/g, l => l.toLocaleUpperCase('tr-TR'));
    const user: User = { name: upperName, email: regForm.email, phone: regForm.phone, password: regForm.password, address: '', city: '' };
    const updated = [...users, user];
    setUsers(updated);
    localStorage.setItem('mdfUsers', JSON.stringify(updated));
    localStorage.setItem('mdfUser', JSON.stringify(user));
    setCurrentUser(user);
    setRegisterModal(false);
    setRegForm({ name: '', email: '', phone: '', password: '', password2: '' });
    setRegErrors({});
    setTermsAccepted(false);
    setTermsError(false);
    setDuplicateError({ email: '', phone: '' });
    showToast('Kayıt başarılı! Hoş geldiniz, ' + upperName.split(' ')[0]);
  };

  const handleLogin = () => {
    const errors: Record<string, boolean> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!loginForm.email.trim() || !emailRegex.test(loginForm.email.trim())) errors.email = true;
    if (!loginForm.password) errors.password = true;
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (!user) { alert('E-posta veya şifre hatalı!'); return; }
    localStorage.setItem('mdfUser', JSON.stringify(user));
    setCurrentUser(user);
    setLoginModal(false);
    setLoginForm({ email: '', password: '' });
    setLoginErrors({});
    showToast('Giriş başarılı! Hoş geldiniz, ' + user.name.split(' ')[0]);
  };

  const handleLogout = () => {
    localStorage.removeItem('mdfUser');
    setCurrentUser(null);
    setAccountModal(false);
    showToast('Çıkış yapıldı');
  };

  const openAccountModal = (tab?: AccountTab) => {
    if (!currentUser) { setLoginErrors({}); setLoginModal(true); return; }
    setEditForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone });
    setAddressForm({ address: currentUser.address || '', city: currentUser.city || '' });
    setPasswordForm({ current: '', newPass: '', newPass2: '' });
    setEditErrors({}); setPassErrors({}); setAddrErrors({});
    setAccountTab(tab || 'info');
    setAccountModal(true);
  };

  const handleUpdateAccount = () => {
    const errors: Record<string, boolean> = {};
    const nameWords = editForm.name.trim().split(/\s+/);
    if (!editForm.name.trim() || nameWords.length < 2) errors.name = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email.trim() || !emailRegex.test(editForm.email.trim())) errors.email = true;
    const phoneDigits = editForm.phone.replace(/\D/g, '');
    if (!editForm.phone.trim() || phoneDigits.length < 10 || !phoneDigits.startsWith('05') && !phoneDigits.startsWith('5')) errors.phone = true;
    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!currentUser) return;
    const upperName = editForm.name.trim().replace(/\b\w/g, l => l.toLocaleUpperCase('tr-TR'));
    const updatedUser: User = { ...currentUser, name: upperName, email: editForm.email, phone: editForm.phone };
    persistUser(updatedUser);
    showToast('Hesap bilgileriniz güncellendi!');
    setAccountTab('info');
  };

  const handleChangePassword = () => {
    const errors: Record<string, boolean> = {};
    if (!passwordForm.current) errors.current = true;
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) errors.newPass = true;
    if (passwordForm.newPass !== passwordForm.newPass2) errors.newPass2 = true;
    setPassErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!currentUser) return;
    if (passwordForm.current !== currentUser.password) { alert('Mevcut şifreniz hatalı!'); return; }
    const updatedUser: User = { ...currentUser, password: passwordForm.newPass };
    persistUser(updatedUser);
    setPasswordForm({ current: '', newPass: '', newPass2: '' });
    showToast('Şifreniz başarıyla değiştirildi!');
    setAccountTab('info');
  };

  const handleSaveAddress = () => {
    const errors: Record<string, boolean> = {};
    if (!addressForm.address.trim()) errors.address = true;
    if (!addressForm.city.trim()) errors.city = true;
    setAddrErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!currentUser) return;
    const updatedUser: User = { ...currentUser, address: addressForm.address, city: addressForm.city };
    persistUser(updatedUser);
    showToast('Adres bilgileriniz kaydedildi!');
    setAccountTab('info');
  };

  const addToCart = (product: Product) => {
    if (!currentUser) { setLoginErrors({}); setLoginModal(true); showToast('Sepete eklemek için giriş yapın'); return; }
    const thumb = getPrimaryImage(product);
    setCart(prev => {
      const existing = prev.find(c => c.name === product.name);
      if (existing) return prev.map(c => c.name === product.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { name: product.name, price: product.price, img: thumb, qty: 1 }];
    });
    showToast(product.name + ' sepete eklendi!');
  };

  const removeFromCart = (index: number) => { setCart(prev => prev.filter((_, i) => i !== index)); };

  const changeQty = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], qty: updated[index].qty + delta };
      if (updated[index].qty <= 0) updated.splice(index, 1);
      return updated;
    });
  };

  const toggleCart = () => setCartOpen(prev => !prev);

  const toggleFav = (id: number) => {
    if (!currentUser) {
      setLoginErrors({});
      setLoginModal(true);
      showToast('Favorilere eklemek için giriş yapın');
      return;
    }
    setFavs(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setFavCount(c => c - 1); }
      else { next.add(id); setFavCount(c => c + 1); }
      return next;
    });
  };

  const getProductReviews = (productId: number): ProductReview[] => productReviews[productId] || [];
  const getProductAvgRating = (productId: number): number => {
    const revs = getProductReviews(productId);
    if (revs.length === 0) return 0;
    return Math.round(revs.reduce((s, r) => s + r.rating, 0) / revs.length);
  };
  const getProductReviewCount = (productId: number): number => getProductReviews(productId).length;

  const hasUserPurchased = (productId: number): boolean => {
    if (!currentUser) return false;
    const product = productsData.find(p => p.id === productId);
    if (!product) return false;
    const orders: Order[] = JSON.parse(localStorage.getItem('mdfOrders') || '[]');
    return orders.some(o => o.customer.email === currentUser!.email && o.items.some(item => item.name === product.name));
  };

  const hasUserReviewed = (productId: number): boolean => {
    if (!currentUser) return false;
    return getProductReviews(productId).some(r => r.userName === currentUser!.name);
  };

  const handleSubmitReview = () => {
    if (reviewModal === null || !currentUser) return;
    if (reviewForm.rating === 0) { setReviewError('Lütfen bir puan seçin'); return; }
    if (reviewForm.comment.trim().length < 10) { setReviewError('Yorumunuz en az 10 karakter olmalıdır'); return; }
    const newReview: ProductReview = {
      id: Date.now(), productId: reviewModal, userName: currentUser.name,
      rating: reviewForm.rating, comment: reviewForm.comment.trim(),
      date: new Date().toLocaleString('tr-TR'),
    };
    const updated = { ...productReviews };
    if (!updated[reviewModal]) updated[reviewModal] = [];
    updated[reviewModal] = [...updated[reviewModal], newReview];
    setProductReviews(updated);
    localStorage.setItem('mdfReviews', JSON.stringify(updated));
    setReviewForm({ rating: 0, comment: '' }); setReviewError(''); setReviewHover(0);
    showToast('Yorumunuz başarıyla eklendi!');
  };

  const openReviewModal = (productId: number) => {
    setReviewModal(productId); setReviewForm({ rating: 0, comment: '' }); setReviewError(''); setReviewHover(0);
  };

  const startCheckout = () => {
    if (cart.length === 0) { alert('Sepetiniz boş!'); return; }
    if (!currentUser) { setCartOpen(false); setLoginErrors({}); setLoginModal(true); showToast('Sipariş vermek için giriş yapın'); return; }
    if (!currentUser.address || !currentUser.city) {
      setCartOpen(false); showToast('Sipariş vermek için önce adres bilgilerinizi ekleyin');
      setTimeout(() => openAccountModal('address'), 400); return;
    }
    setCartOpen(false);
    setCheckoutForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone, address: currentUser.address, city: currentUser.city, payment: '', note: '' });
    setChkErrors({}); setCheckoutModal(true);
  };

  const formatCardNumber = (val: string) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val: string) => { const d = val.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d; };
  const getCardType = (num: string): { type: string; icon: string; color: string } => {
    const d = num.replace(/\s/g, '');
    if (/^4/.test(d)) return { type: 'Visa', icon: 'fab fa-cc-visa', color: '#1a1f71' };
    if (/^5[1-5]/.test(d)) return { type: 'Mastercard', icon: 'fab fa-cc-mastercard', color: '#eb001b' };
    if (/^3[47]/.test(d)) return { type: 'Amex', icon: 'fab fa-cc-amex', color: '#006fcf' };
    if (/^9/.test(d)) return { type: 'Troy', icon: 'fas fa-credit-card', color: '#e3292e' };
    return { type: 'Kart', icon: 'fas fa-credit-card', color: '#8B6F47' };
  };

  const placeOrder = () => {
    const errors: Record<string, boolean> = {};
    if (!checkoutForm.name.trim()) errors.name = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!checkoutForm.email.trim() || !emailRegex.test(checkoutForm.email.trim())) errors.email = true;
    const phoneDigits = checkoutForm.phone.replace(/\D/g, '');
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10 || !phoneDigits.startsWith('05') && !phoneDigits.startsWith('5')) errors.phone = true;
    if (!checkoutForm.address.trim()) errors.address = true;
    if (!checkoutForm.city.trim()) errors.city = true;
    if (!checkoutForm.payment) errors.payment = true;
    setChkErrors(errors);
    if (checkoutForm.payment === 'credit_card') {
      const cErrors: Record<string, boolean> = {};
      const cardDigits = cardForm.number.replace(/\s/g, '');
      if (cardDigits.length < 16) cErrors.number = true;
      if (!/^\d{2}\/\d{2}$/.test(cardForm.expiry)) cErrors.expiry = true;
      if (cardForm.cvv.length < 3) cErrors.cvv = true;
      if (!cardForm.holder.trim() || cardForm.holder.trim().split(/\s+/).length < 2) cErrors.holder = true;
      setCardErrors(cErrors);
      if (Object.keys(cErrors).length > 0) return;
    }
    if (Object.keys(errors).length > 0) return;
    if (checkoutForm.payment === 'credit_card') {
      setProcessingPayment(true);
      setTimeout(() => completeOrder(), 3000);
    } else { completeOrder(); }
  };

  const completeOrder = () => {
    setProcessingPayment(false);
    const count = parseInt(localStorage.getItem('mdfOrderCount') || '0') + 1;
    localStorage.setItem('mdfOrderCount', count.toString());
    const on = 'DK-' + String(count).padStart(6, '0');
    let paymentLabel = '';
    if (checkoutForm.payment === 'kapida_nakit') paymentLabel = 'Kapıda Ödeme (Nakit)';
    else if (checkoutForm.payment === 'kapida_kart') paymentLabel = 'Kapıda Ödeme (Kredi Kartı)';
    else if (checkoutForm.payment === 'havale') paymentLabel = 'Havale / EFT';
    else if (checkoutForm.payment === 'credit_card') paymentLabel = 'Kredi Kartı';
    const order: Order = {
      orderNumber: on, date: new Date().toLocaleString('tr-TR'),
      customer: { name: checkoutForm.name, email: checkoutForm.email, phone: checkoutForm.phone, address: checkoutForm.address, city: checkoutForm.city },
      items: [...cart], total: cart.reduce((s, c) => s + c.price * c.qty, 0),
      payment: paymentLabel, note: checkoutForm.note, status: 'Hazırlanıyor'
    };
    const orders = JSON.parse(localStorage.getItem('mdfOrders') || '[]');
    orders.push(order);
    localStorage.setItem('mdfOrders', JSON.stringify(orders));
    setCart([]); setCardForm({ number: '', expiry: '', cvv: '', holder: '' }); setCardErrors({});
    setCheckoutModal(false); setOrderNum(on); setSuccessModal(true);
  };

  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartQty = cart.reduce((s, c) => s + c.qty, 0);
  const cartDiscountTotal = couponApplied ? Math.round(cartTotal * (1 - couponApplied.discount / 100)) : cartTotal;

  const validCoupons: Record<string, { discount: number; label: string }> = {
    'DEKOR50': { discount: 50, label: '%50 İndirim' },
    'DEKOR30': { discount: 30, label: '%30 İndirim' },
    'DEKOR20': { discount: 20, label: '%20 İndirim' },
    'HOSGELDIN': { discount: 15, label: '%15 Hoş Geldin İndirimi' },
    'KARGO10': { discount: 10, label: '%10 İndirim' },
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (validCoupons[code]) {
      setCouponApplied({ valid: true, discount: validCoupons[code].discount, label: validCoupons[code].label });
      showToast(`Kupon uygulandı! ${validCoupons[code].label}`);
    } else {
      setCouponApplied({ valid: false, discount: 0, label: '' });
      showToast('Geçersiz kupon kodu!');
    }
  };

  const openProductDetail = (id: number) => {
    setProductDetail(id); setSelectedVariant(''); setSelectedProductImage(0); setSelectedColorIndex(0); setCurrentPage('product');
    window.history.pushState({ page: 'product', id }, '', `/urun/${id}`);
    setRecentlyViewed(prev => [id, ...prev.filter(p => p !== id)].slice(0, 10));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentPage('home'); setProductDetail(null); setSelectedVariant(''); setSelectedProductImage(0); setSelectedColorIndex(0);
    window.history.pushState({ page: 'home' }, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const state = window.history.state;
      if (state?.page === 'product' && state?.id) { setCurrentPage('product'); setProductDetail(state.id); setSelectedProductImage(0); setSelectedColorIndex(0); }
      else { setCurrentPage('home'); setProductDetail(null); setSelectedProductImage(0); setSelectedColorIndex(0); }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const getFilteredProducts = () => {
    let filtered = [...productsData];
    if (filterCategory !== 'Tümü') filtered = filtered.filter(p => p.category === filterCategory);
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    return filtered;
  };

  const getPastOrders = (): Order[] => {
    if (!currentUser) return [];
    const orders: Order[] = JSON.parse(localStorage.getItem('mdfOrders') || '[]');
    return orders.filter((o: Order) => o.customer.email === currentUser!.email);
  };

  return (
    <>
      <div className="top-campaign">
        ✦ <span>%30'a VARAN İNDİRİM</span> · Ücretsiz Kargo · Ücretsiz Montaj Kılavuzu ✦
      </div>

      <div className="header-top">
        <div>
          <i className="fas fa-phone"></i> 0505 070 5278 &nbsp;|&nbsp;
          <i className="fas fa-envelope"></i> bugra@kamaticaret.com
        </div>
        <div>
          {!currentUser ? (
            <div className="auth-links">
              <button onClick={() => { setRegErrors({}); setRegisterModal(true); }}><i className="fas fa-user-plus"></i> Kayıt Ol</button>
              <span style={{ color: '#ddd' }}>|</span>
              <button onClick={() => { setLoginErrors({}); setLoginModal(true); }}><i className="fas fa-sign-in-alt"></i> Giriş Yap</button>
            </div>
          ) : (
            <div className="user-welcome">
              <div className="user-avatar">{currentUser.name.charAt(0).toLocaleUpperCase('tr-TR')}</div>
              <span>Hoş geldin, {currentUser.name.split(' ')[0].toLocaleUpperCase('tr-TR')}</span>
              <button onClick={handleLogout} style={{ color: 'var(--danger)', marginLeft: '10px', cursor: 'pointer', fontSize: '12px', background: 'none', border: 'none' }}>Çıkış</button>
            </div>
          )}
        </div>
      </div>

      <div className="header-main">
        <a href="#" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <img src="https://dekoristasyon.com/wp-content/uploads/2025/11/cropped-Logo-01-1-2048x577.png" alt="Dekoristasyon" className="logo-img" />
        </a>
        <div className="search-bar" style={{ position: 'relative' }}>
          <input type="text" placeholder="Ürün, kategori veya marka ara..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }} onFocus={() => { if (searchQuery.length > 0) setSearchOpen(true); }} onBlur={() => setTimeout(() => setSearchOpen(false), 200)} />
          <button><i className="fas fa-search"></i></button>
          {searchOpen && searchQuery.length > 0 && (
            <div className="search-dropdown">
              {productsData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                <div className="search-no-result"><i className="fas fa-search"></i> "{searchQuery}" ile eşleşen ürün bulunamadı</div>
              ) : (
                productsData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                  <div key={p.id} className="search-result-item" onClick={() => { setSearchQuery(''); setSearchOpen(false); document.getElementById('urunler')?.scrollIntoView({ behavior: 'smooth' }); }}>
                    <img src={getPrimaryImage(p)} alt="" />
                    <div>
                      <div className="search-result-name">{p.name}</div>
                      <div className="search-result-cat">{p.category}</div>
                    </div>
                    <div className="search-result-price">{p.price.toLocaleString('tr-TR')} TL</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="header-icons">
          <button className="header-icon" onClick={() => openAccountModal()}>
            <i className="far fa-user"></i><span>Hesabım</span>
          </button>
          <button className="header-icon">
            <i className="far fa-heart"></i><span>Favoriler</span>
            {favCount > 0 && <span className="badge">{favCount}</span>}
          </button>
          <button className="header-icon" onClick={toggleCart}>
            <i className="fas fa-shopping-bag"></i><span>Sepetim</span>
            {cartQty > 0 && <span className="badge">{cartQty}</span>}
          </button>
        </div>
      </div>

      <nav className="mega-nav">
        <div className="dropdown">
          <a href="#"><i className="fas fa-bars"></i> TÜM KATEGORİLER</a>
          <div className="dropdown-content">
            {dropdownCategories.map((cat, i) => (<a key={i} href="#">{cat}</a>))}
          </div>
        </div>
        {['YENİ GELENLER', 'ÇOK SATANLAR', 'KAMPANYALAR', 'DUVAR DEKORLARI', 'AYDINLATMA', 'SEHPALAR'].map((item, i) => (
          <a key={i} href="#urunler">{item}</a>
        ))}
        <a href="#iletisim">İLETİŞİM</a>
      </nav>

      {currentPage === 'home' ? (
      <>
      <div className="slider">
        {slidesData.map((slide, index) => (
          <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
            <img src={slide.image} alt="" />
            <div className="slide-overlay"></div>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
              <a href="#urunler" className="btn">{slide.btn}</a>
            </div>
          </div>
        ))}
        <button className="slider-btn prev" onClick={() => setCurrentSlide(prev => (prev - 1 + slidesData.length) % slidesData.length)}>&#10094;</button>
        <button className="slider-btn next" onClick={() => setCurrentSlide(prev => (prev + 1) % slidesData.length)}>&#10095;</button>
        <div className="slider-dots">
          {slidesData.map((_, index) => (
            <button key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)} />
          ))}
        </div>
      </div>

      <div className="campaign-boxes">
        {campaignBoxes.map((box, i) => (
          <div key={i} className="campaign-box">
            <img src={box.image} alt="" />
            <div className="overlay"><h3>{box.title}</h3><p>{box.text}</p></div>
          </div>
        ))}
      </div>

      <section className="section">
        <div className="section-header"><h2>Kategoriler</h2><div className="line"></div><p>İhtiyacınıza uygun kategoriyi seçin</p></div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <div key={i} className="cat-item">
              <div className="cat-circle"><img src={cat.image} alt="" /></div>
              <h4>{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="urunler">
        <div className="section-header"><h2>Öne Çıkan Ürünler</h2><div className="line"></div><p>En çok tercih edilen ürünlerimiz</p></div>
        <div className="filter-bar">
          <button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
            <i className="fas fa-sliders-h"></i> Filtrele & Sırala
          </button>
          {showFilters && (
            <div className="filter-controls">
              <div className="filter-group">
                <label><i className="fas fa-th-large"></i> Kategori</label>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="Tümü">Tümü</option>
                  <option value="BESMELE">Besmele</option>
                  <option value="DUVAR DEKORLARI">Duvar Dekorları</option>
                  <option value="FOTOĞRAF ÇERÇEVELERİ">Fotoğraf Çerçeveleri</option>
                  <option value="SEHPALAR">Sehpalar</option>
                  <option value="MASAÜSTÜ DEKORLARI">Masaüstü Dekorları</option>
                  <option value="AYDINLATMA">Aydınlatma</option>
                  <option value="SAAT">Saat</option>
                  <option value="YAPAY ÇİÇEK">Yapay Çiçek</option>
                  <option value="HASIR ÜRÜNLER">Hasır Ürünler</option>
                </select>
              </div>
              <div className="filter-group">
                <label><i className="fas fa-sort"></i> Sırala</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="default">Varsayılan</option>
                  <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="name">İsme Göre (A-Z)</option>
                </select>
              </div>
              <button className="filter-reset" onClick={() => { setFilterCategory('Tümü'); setSortBy('default'); }}>
                <i className="fas fa-undo"></i> Sıfırla
              </button>
            </div>
          )}
        </div>
        <div className="products-grid">
          {getFilteredProducts().length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              <i className="fas fa-search" style={{ fontSize: 50, color: '#ddd', display: 'block', marginBottom: 15 }}></i>
              <p style={{ fontSize: 18 }}>Bu kategoride ürün bulunamadı</p>
            </div>
          ) : (
            getFilteredProducts().map(product => (
              <div key={product.id} className="product-card">
                {product.badge && <span className={`product-badge ${product.badgeType === 'new' ? 'new' : ''}`}>{product.badge}</span>}
                <button className={`product-wishlist ${favs.has(product.id) ? 'active' : ''}`} onClick={() => toggleFav(product.id)}>
                  <i className={favs.has(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                </button>
                <button className="product-wishlist compare-btn-mobile" style={{ top: 55 }} onClick={() => {
                  if (compareList.includes(product.id)) setCompareList(prev => prev.filter(i => i !== product.id));
                  else if (compareList.length < 3) setCompareList(prev => [...prev, product.id]);
                  else showToast('En fazla 3 ürün karşılaştırabilirsiniz');
                }} title="Karşılaştır"><i className="fas fa-exchange-alt"></i></button>
                {compareList.length >= 2 && compareList.includes(product.id) && (
                  <button className="add-cart-btn" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 0, background: 'var(--dark)', fontSize: 12, padding: 8, zIndex: 10, opacity: 0.9 }} onClick={() => setCompareModal(true)}>
                    <i className="fas fa-exchange-alt"></i> Karşılaştır ({compareList.length} ürün)
                  </button>
                )}
                <div className={`img-wrap ${product.category === 'BESMELE' ? 'besmele-wall' : ''}`} style={{ cursor: 'pointer' }} onClick={() => openProductDetail(product.id)}>
                  <img className={product.category === 'BESMELE' ? 'besmele-cutout' : ''} src={getPrimaryImage(product)} alt="" />
                </div>
                <div className="product-info">
                  <div className="category">{product.category}</div>
                  <h3 style={{ cursor: 'pointer' }} onClick={() => openProductDetail(product.id)}>{product.name}</h3>
                  <div className="stars" style={{ cursor: 'pointer', color: '#D4AF37' }} onClick={() => openReviewModal(product.id)} title="Yorumları gör">
                    {getProductReviewCount(product.id) > 0 && (
                      <>{renderStars(getProductAvgRating(product.id))} <span style={{ color: '#999', fontSize: '12px', marginLeft: '5px' }}>({getProductReviewCount(product.id)} Yorum)</span></>
                    )}
                  </div>
                  <div className="price-row">
                    {product.oldPrice && <span className="old-price">{product.oldPrice.toLocaleString('tr-TR')} TL</span>}
                    <span className="new-price">{product.price.toLocaleString('tr-TR')} TL</span>
                  </div>
                  {(product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0 && (
                    <div className="stock-warning"><i className="fas fa-fire"></i> Son {product.stock} adet! Kaçırmayın</div>
                  )}
                  <div className="trust-badges-mini">
                    <span><i className="fas fa-shield-alt"></i> Güvenli Ödeme</span>
                    <span><i className="fas fa-truck"></i> Ücretsiz Kargo</span>
                    <span><i className="fas fa-undo-alt"></i> 14 Gün İade</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="add-cart-btn" style={{ flex: 1 }} onClick={() => addToCart(product)}>
                      <i className="fas fa-shopping-bag"></i> Sepete Ekle
                    </button>
                    {hasUserPurchased(product.id) && !hasUserReviewed(product.id) && (
                      <button className="add-cart-btn review-btn-card" style={{ flex: '0 0 auto', background: 'var(--gold)' }} onClick={() => openReviewModal(product.id)} title="Yorum Yaz">
                        <i className="fas fa-star"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="parallax-banner" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&h=700&fit=crop)' }}>
        <h2>Evinizi Yeniden Dekore Edin</h2>
        <p>Duvar dekorları, aydınlatma, saat, yapay çiçek ve daha fazlası. Ücretsiz kargo ve kapıda ödeme avantajıyla.</p>
        <a href="#urunler" className="btn-gold">Tüm Ürünleri Gör</a>
      </div>

      <section className="section">
        <div className="section-header"><h2>Müşteri Yorumları</h2><div className="line"></div><p>Müşterilerimizin memnuniyeti bizim önceliğimiz</p></div>
        <div className="reviews-grid">
          {(() => {
            const allReviews = Object.values(productReviews).flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            if (allReviews.length === 0) {
              return (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <i className="far fa-comment-dots" style={{ fontSize: 60, color: '#ddd', marginBottom: 20, display: 'block' }}></i>
                  <p style={{ fontSize: 18, marginBottom: 10 }}>Henüz müşteri yorumu bulunmamaktadır</p>
                  <p style={{ fontSize: 14 }}>Ürünlerimizi satın alıp yorum yaptığınızda yorumunuz burada görünecektir.</p>
                </div>
              );
            }
            return allReviews.map((review, i) => {
              const product = productsData.find(p => p.id === review.productId);
              return (
                <div key={i} className="review-card">
                  <div className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p>"{review.comment}"</p>
                  <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>{product ? product.name : 'Ürün'} • {new Date(review.date).toLocaleDateString('tr-TR')}</div>
                  <div className="reviewer">{review.userName}</div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      <div className="features-bar">
        <div className="features-grid">
          <div className="feature-item"><i className="fas fa-shipping-fast"></i><h4>Ücretsiz Kargo</h4><p>Türkiye geneli tüm siparişlerde</p></div>
          <div className="feature-item"><i className="fas fa-shield-alt"></i><h4>Güvenli Alışveriş</h4><p>256-bit SSL ile korunan ödeme</p></div>
          <div className="feature-item"><i className="fas fa-undo-alt"></i><h4>14 Gün İade</h4><p>Koşulsuz iade garantisi</p></div>
          <div className="feature-item"><i className="fas fa-headset"></i><h4>7/24 Destek</h4><p>Telefon ile anında iletişim</p></div>
        </div>
      </div>

      <section className="section" style={{ paddingBottom: 20 }}>
        <div className="section-header">
          <h2>Instagram'da Biz</h2>
          <div className="line"></div>
          <p><a href="https://instagram.com/dekoristasyon" target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>@dekoristasyon</a> · Bizi takip edin, ilham alın</p>
        </div>
      </section>
      <div className="insta-grid">
        {instaImages.map((img, i) => (
          <a key={i} className="insta-item" href="https://instagram.com/dekoristasyon" target="_blank" rel="noopener noreferrer">
            <img src={img} alt="" />
            <div className="insta-overlay"><i className="fab fa-instagram"></i></div>
          </a>
        ))}
      </div>

      <section className="newsletter-section">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h3><i className="far fa-envelope-open"></i> Kampanya ve Fırsatlardan Haberdar Olun</h3>
            <p>Yeni ürünler, indirimler ve özel fırsatlar için e-posta bültenimize abone olun.</p>
          </div>
          <div className="newsletter-form">
            {newsletterSuccess ? (
              <div className="newsletter-success"><i className="fas fa-check-circle"></i> Başarıyla abone oldunuz!</div>
            ) : (
              <>
                <input type="email" placeholder="E-posta adresiniz" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} />
                <button onClick={() => { if (newsletterEmail.includes('@')) { setNewsletterSuccess(true); showToast('Bültene başarıyla abone oldunuz!'); setTimeout(() => { setNewsletterSuccess(false); setNewsletterEmail(''); }, 3000); } else { showToast('Geçerli bir e-posta girin'); } }}>Abone Ol</button>
              </>
            )}
          </div>
        </div>
      </section>
      </>
      ) : currentPage === 'product' && productDetail !== null ? (() => {
        const p = productsData.find(pr => pr.id === productDetail);
        if (!p) return null;
        const revs = getProductReviews(p.id);
        const avgR = getProductAvgRating(p.id);
        const totalR = getProductReviewCount(p.id);
        const colorOptions = p.colorOptions || [];
        const activeColor = colorOptions[selectedColorIndex];
        const productImages = p.images && p.images.length > 0 ? p.images : [p.image];
        const activeImage = activeColor?.image || productImages[selectedProductImage] || productImages[0];
        const relatedProducts = productsData.filter(rp => rp.category === p.category && rp.id !== p.id).slice(0, 4);
        return (
          <div className="product-page">
            <div className="product-page-breadcrumb">
              <div className="product-page-container">
                <span onClick={goHome} style={{ cursor: 'pointer', color: 'var(--primary)' }}><i className="fas fa-home"></i> Anasayfa</span>
                <span className="breadcrumb-sep">/</span>
                <span>{p.category}</span>
                <span className="breadcrumb-sep">/</span>
                <span style={{ color: 'var(--dark)' }}>{p.name}</span>
              </div>
            </div>
            <div className="product-page-container">
              <div className="product-page-grid">
                <div className="product-page-media">
                  <div className={`product-page-img ${p.category === 'BESMELE' ? 'besmele-stage' : ''}`}>
                    <img className={p.category === 'BESMELE' ? 'besmele-cutout' : ''} src={activeImage} alt={p.name} />
                    {p.badge && <span className={`product-badge ${p.badgeType === 'new' ? 'new' : ''}`} style={{ position: 'absolute', top: 15, left: 15, fontSize: 14, padding: '8px 16px' }}>{p.badge}</span>}
                  </div>
                  {colorOptions.length > 0 && (
                    <div style={{ marginTop: 14 }}>
                      <label style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)', display: 'block', marginBottom: 10 }}>Renk Seçeneği:</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {colorOptions.map((option, index) => (
                          <button
                            key={option.name}
                            type="button"
                            className={`variant-btn ${selectedColorIndex === index ? 'active' : ''}`}
                            onClick={() => setSelectedColorIndex(index)}
                          >
                            {option.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {colorOptions.length === 0 && productImages.length > 1 && (
                    <div className="product-gallery-thumbs">
                      {productImages.map((img, index) => (
                        <button
                          key={img + index}
                          type="button"
                          className={`product-gallery-thumb ${selectedProductImage === index ? 'active' : ''}`}
                          onClick={() => setSelectedProductImage(index)}
                        >
                          <img src={img} alt={`${p.name} ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="product-page-info">
                  <div className="product-page-category">{p.category}</div>
                  <h1 className="product-page-title">{p.name}</h1>
                  {totalR > 0 && (
                    <div className="product-page-rating" onClick={() => openReviewModal(p.id)} style={{ cursor: 'pointer' }}>
                      <span style={{ color: 'var(--gold)', fontSize: 20 }}>{'★'.repeat(avgR)}{'☆'.repeat(5 - avgR)}</span>
                      <span style={{ fontSize: 14, color: '#999' }}>({totalR} değerlendirme)</span>
                    </div>
                  )}
                  <div className="product-page-price-row">
                    {p.oldPrice && <span className="old-price" style={{ fontSize: 22 }}>{p.oldPrice.toLocaleString('tr-TR')} TL</span>}
                    <span className="new-price" style={{ fontSize: 36 }}>{p.price.toLocaleString('tr-TR')} TL</span>
                    {p.oldPrice && <span className="product-page-discount">%{Math.round((1 - p.price / p.oldPrice) * 100)} indirim</span>}
                  </div>
                  {(p.stock ?? 0) <= 5 && (p.stock ?? 0) > 0 && (
                    <div className="stock-warning" style={{ marginBottom: 15 }}><i className="fas fa-fire"></i> Son {p.stock} adet! Kaçırmayın</div>
                  )}
                  <div className="trust-badges-mini" style={{ marginBottom: 20 }}>
                    <span><i className="fas fa-shield-alt"></i> Güvenli Ödeme</span>
                    <span><i className="fas fa-truck"></i> Ücretsiz Kargo</span>
                    <span><i className="fas fa-undo-alt"></i> 14 Gün İade</span>
                  </div>
                  {p.variants && p.variants.length > 0 && (
                    <div style={{ marginBottom: 25 }}>
                      <label style={{ fontSize: 15, fontWeight: 600, color: 'var(--dark)', display: 'block', marginBottom: 12 }}>Seçenek:</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {p.variants.map((v, vi) => (
                          <button key={vi} className={`variant-btn ${selectedVariant === v ? 'active' : ''}`} onClick={() => setSelectedVariant(v)}>{v}</button>
                        ))}
                      </div>
                      {selectedVariant === '' && <p style={{ fontSize: 13, color: '#999', marginTop: 8, fontStyle: 'italic' }}>Lütfen bir seçenek belirleyin</p>}
                    </div>
                  )}
                  <button className="product-page-add-cart" onClick={() => {
                    if (p.variants && p.variants.length > 0 && !selectedVariant) { showToast('Lütfen bir seçenek belirleyin'); return; }
                    addToCart({ ...p, name: activeColor ? `${p.name} - ${activeColor.name}` : p.name, image: activeImage });
                    setSelectedVariant('');
                  }}>
                    <i className="fas fa-shopping-bag"></i> Sepete Ekle - {p.price.toLocaleString('tr-TR')} TL
                  </button>
                  <div className="product-page-features">
                    <div><i className="fas fa-truck"></i><div><strong>Ücretsiz Kargo</strong><br/><small>Türkiye geneli</small></div></div>
                    <div><i className="fas fa-undo-alt"></i><div><strong>14 Gün İade</strong><br/><small>Koşulsuz garanti</small></div></div>
                    <div><i className="fas fa-headset"></i><div><strong>7/24 Destek</strong><br/><small>0505 070 5278</small></div></div>
                  </div>
                </div>
              </div>
              <div className="product-page-description">
                <h3>Ürün Açıklaması</h3>
                <p>Dekoristasyon kalitesiyle evinizi güzelleştirecek bu özel ürün, özenle seçilmiş malzemelerden üretilmiştir. Modern ve şık tasarımıyla her türlü yaşam alanına uyum sağlar.</p>
                <ul>
                  <li>Yüksek kalite malzeme</li>
                  <li>Modern ve şık tasarım</li>
                  <li>Kolay montaj ve bakım</li>
                  <li>Uzun ömürlü kullanım</li>
                  <li>Tüm yaşam alanlarına uyum</li>
                </ul>
              </div>
              <div className="product-page-reviews">
                <h3><i className="fas fa-comments"></i> Müşteri Yorumları {totalR > 0 && `(${totalR})`}</h3>
                {revs.length > 0 ? revs.map(rev => (
                  <div key={rev.id} className="review-item">
                    <div className="review-item-header">
                      <div className="review-item-avatar">{rev.userName.charAt(0)}</div>
                      <div><strong>{rev.userName}</strong><span className="review-item-date">{rev.date}</span></div>
                      <div className="review-item-stars" style={{ color: 'var(--gold)' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                    </div>
                    <p className="review-item-comment">{rev.comment}</p>
                  </div>
                )) : <p style={{ color: '#999', fontStyle: 'italic', padding: '20px 0' }}>Bu ürün hakkında henüz yorum yapılmamış. İlk yorumu siz yapın!</p>}
              </div>
              {relatedProducts.length > 0 && (
                <div className="product-page-related">
                  <h3>Benzer Ürünler</h3>
                  <div className="products-grid">
                    {relatedProducts.map(rp => (
                      <div key={rp.id} className="product-card" style={{ cursor: 'pointer' }} onClick={() => openProductDetail(rp.id)}>
                        <div className={`img-wrap ${rp.category === 'BESMELE' ? 'besmele-wall' : ''}`}><img className={rp.category === 'BESMELE' ? 'besmele-cutout' : ''} src={getPrimaryImage(rp)} alt={rp.name} /></div>
                        <div className="product-info">
                          <div className="category">{rp.category}</div>
                          <h3>{rp.name}</h3>
                          <div className="price-row">
                            {rp.oldPrice && <span className="old-price">{rp.oldPrice.toLocaleString('tr-TR')} TL</span>}
                            <span className="new-price">{rp.price.toLocaleString('tr-TR')} TL</span>
                          </div>
                          <button className="add-cart-btn" onClick={e => { e.stopPropagation(); addToCart(rp); }}><i className="fas fa-shopping-bag"></i> Sepete Ekle</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })() : null}

      <footer id="iletisim">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Dekoristasyon</h3>
            <p>Duvar dekorları, aydınlatma, saat, yapay çiçek ve daha fazlası. Yaşam alanlarınızı dönüştürüyoruz.</p>
            <div className="footer-social">
              <a href="https://instagram.com/dekoristasyon" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-col">
            <h3>Kurumsal</h3>
            <a href="#">Hakkımızda</a><a href="#">İletişim</a><a href="#">Blog</a><a href="#">Kariyer</a><a href="#">Mağazalarımız</a>
          </div>
          <div className="footer-col">
            <h3>Müşteri Hizmetleri</h3>
            <a href="#">Sipariş Takibi</a><a href="#">İade &amp; Değişim</a><a href="#">Kargo Bilgileri</a><a href="#">Montaj Kılavuzu</a><a href="#">Gizlilik Politikası</a>
          </div>
          <div className="footer-col">
            <h3>İletişim</h3>
            <p><i className="fas fa-phone"></i> 0505 070 5278</p>
            <p><i className="fas fa-envelope"></i> bugra@kamaticaret.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Antalya, Türkiye</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Dekoristasyon · Tüm hakları saklıdır.</span>
          <div className="payment-icons"><i className="fab fa-cc-visa"></i><i className="fab fa-cc-mastercard"></i><i className="fas fa-money-bill-wave"></i><i className="fas fa-truck"></i></div>
        </div>
      </footer>

      {/* SEPET PANELİ */}
      <div className={`cart-overlay ${cartOpen ? 'show' : ''}`} onClick={toggleCart}></div>
      <div className={`cart-panel ${cartOpen ? 'open' : ''}`}>
        <div className="cart-panel-header">
          <h3><i className="fas fa-shopping-bag"></i> Sepetim</h3>
          <button className="close-cart" onClick={toggleCart}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart"><i className="fas fa-shopping-bag"></i><p>Sepetiniz boş</p></div>
          ) : cart.map((item, i) => (
            <div key={i} className="cart-item">
              <img src={item.img} alt="" />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <div className="cart-item-price">{(item.price * item.qty).toLocaleString('tr-TR')} TL</div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => changeQty(i, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => changeQty(i, 1)}>+</button>
                </div>
              </div>
              <button className="remove-item" onClick={() => removeFromCart(i)}><i className="fas fa-trash"></i></button>
            </div>
          ))}
        </div>
        <div className="cart-panel-footer">
          <div className="coupon-section">
            <div className="coupon-row">
              <input type="text" placeholder="Kupon kodu girin" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
              <button onClick={applyCoupon}>Uygula</button>
            </div>
            {couponApplied && couponApplied.valid && (
              <div className="coupon-applied">
                <i className="fas fa-tag"></i> {couponApplied.label} uygulandı!
                <button onClick={() => { setCouponApplied(null); setCouponCode(''); }} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', marginLeft: 'auto', fontSize: 12 }}><i className="fas fa-times"></i></button>
              </div>
            )}
          </div>
          <div className="cart-summary">
            <div className="cart-summary-row"><span>Ara Toplam</span><span>{cartTotal.toLocaleString('tr-TR')} TL</span></div>
            {couponApplied && couponApplied.valid && (
              <div className="cart-summary-row" style={{ color: 'var(--success)' }}><span>İndirim ({couponApplied.label})</span><span>-{Math.round(cartTotal * couponApplied.discount / 100).toLocaleString('tr-TR')} TL</span></div>
            )}
            <div className="cart-summary-row"><span>Kargo</span><span style={{ color: 'var(--success)' }}>Ücretsiz</span></div>
            <div className="cart-summary-row total"><span>Toplam</span><span>{(couponApplied ? cartDiscountTotal : cartTotal).toLocaleString('tr-TR')} TL</span></div>
          </div>
          <button className="checkout-btn" onClick={startCheckout}><i className="fas fa-lock"></i> Siparişi Tamamla</button>
        </div>
      </div>

      {/* HESABIM MODAL */}
      <div className={`modal-overlay ${accountModal ? 'show' : ''}`}>
        <div className="modal" style={{ width: 580 }}>
          <div className="modal-header"><h2>Hesabım</h2><button className="modal-close" onClick={() => setAccountModal(false)}>✕</button></div>
          <div className="account-tabs">
            <button className={`account-tab ${accountTab === 'info' ? 'active' : ''}`} onClick={() => setAccountTab('info')}><i className="fas fa-user"></i> Bilgilerim</button>
            <button className={`account-tab ${accountTab === 'edit' ? 'active' : ''}`} onClick={() => { setEditForm({ name: currentUser?.name || '', email: currentUser?.email || '', phone: currentUser?.phone || '' }); setEditErrors({}); setAccountTab('edit'); }}><i className="fas fa-edit"></i> Düzenle</button>
            <button className={`account-tab ${accountTab === 'password' ? 'active' : ''}`} onClick={() => { setPasswordForm({ current: '', newPass: '', newPass2: '' }); setPassErrors({}); setAccountTab('password'); }}><i className="fas fa-lock"></i> Şifre</button>
            <button className={`account-tab ${accountTab === 'address' ? 'active' : ''}`} onClick={() => { setAddressForm({ address: currentUser?.address || '', city: currentUser?.city || '' }); setAddrErrors({}); setAccountTab('address'); }}><i className="fas fa-map-marker-alt"></i> Adres</button>
            <button className={`account-tab ${accountTab === 'orders' ? 'active' : ''}`} onClick={() => setAccountTab('orders')}><i className="fas fa-box"></i> Siparişlerim</button>
          </div>
          <div className="modal-body">
            {accountTab === 'info' && currentUser && (
              <div className="account-info-section">
                <div className="account-avatar-big">{currentUser.name.charAt(0).toLocaleUpperCase('tr-TR')}</div>
                <h3 style={{ textAlign: 'center', fontFamily: 'Playfair Display, serif', fontSize: 24, color: 'var(--dark)', marginBottom: 5 }}>{currentUser.name}</h3>
                <p style={{ textAlign: 'center', color: '#aaa', fontSize: 13, marginBottom: 30 }}>{currentUser.email}</p>
                <div className="account-info-grid">
                  <div className="account-info-item"><i className="far fa-user"></i><div><label>Ad Soyad</label><span>{currentUser.name}</span></div></div>
                  <div className="account-info-item"><i className="far fa-envelope"></i><div><label>E-posta</label><span>{currentUser.email}</span></div></div>
                  <div className="account-info-item"><i className="fas fa-phone"></i><div><label>Telefon</label><span>{currentUser.phone}</span></div></div>
                  <div className="account-info-item"><i className="fas fa-map-marker-alt"></i><div><label>Adres</label><span>{currentUser.address ? `${currentUser.address}, ${currentUser.city}` : (
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Adres eklenmemiş! <a onClick={() => { setAddressForm({ address: '', city: '' }); setAddrErrors({}); setAccountTab('address'); }} style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Eklemek için tıklayın</a></span>
                  )}</span></div></div>
                </div>
                {!currentUser.address && (
                  <div className="account-warning">
                    <i className="fas fa-exclamation-triangle"></i><span>Sipariş verebilmek için adres bilgilerinizi eklemeniz gerekmektedir.</span>
                    <button onClick={() => { setAddressForm({ address: '', city: '' }); setAddrErrors({}); setAccountTab('address'); }}>Adres Ekle</button>
                  </div>
                )}
                <button className="modal-btn danger" onClick={handleLogout} style={{ marginTop: 20 }}><i className="fas fa-sign-out-alt"></i> Çıkış Yap</button>
              </div>
            )}
            {accountTab === 'edit' && (
              <div>
                <div className={`form-group ${editErrors.name ? 'error' : ''}`}><label><i className="far fa-user"></i> Ad Soyad</label><input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /><div className="error-text">Lütfen Adınızı Soyadınızı giriniz</div></div>
                <div className={`form-group ${editErrors.email ? 'error' : ''}`}><label><i className="far fa-envelope"></i> E-posta Adresi</label><input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} /><div className="error-text">Lütfen geçerli bir e-posta adresi giriniz</div></div>
                <div className={`form-group ${editErrors.phone ? 'error' : ''}`}><label><i className="fas fa-phone"></i> Telefon Numarası</label><input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} /><div className="error-text">Lütfen geçerli bir telefon numarası giriniz</div></div>
                <button className="modal-btn" onClick={handleUpdateAccount}><i className="fas fa-save"></i> Bilgileri Güncelle</button>
              </div>
            )}
            {accountTab === 'password' && (
              <div>
                <div className={`form-group ${passErrors.current ? 'error' : ''}`}><label><i className="fas fa-lock"></i> Mevcut Şifre</label><input type="password" value={passwordForm.current} onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })} /><div className="error-text">Mevcut şifrenizi girin</div></div>
                <div className={`form-group ${passErrors.newPass ? 'error' : ''}`}><label><i className="fas fa-key"></i> Yeni Şifre</label><input type="password" value={passwordForm.newPass} onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })} /><div className="error-text">Yeni şifre en az 6 karakter olmalı</div></div>
                <div className={`form-group ${passErrors.newPass2 ? 'error' : ''}`}><label><i className="fas fa-key"></i> Yeni Şifre Tekrar</label><input type="password" value={passwordForm.newPass2} onChange={e => setPasswordForm({ ...passwordForm, newPass2: e.target.value })} /><div className="error-text">Şifreler eşleşmiyor</div></div>
                <button className="modal-btn" onClick={handleChangePassword}><i className="fas fa-key"></i> Şifreyi Değiştir</button>
              </div>
            )}
            {accountTab === 'address' && (
              <div>
                <div className={`form-group ${addrErrors.address ? 'error' : ''}`}><label><i className="fas fa-map-marker-alt"></i> Teslimat Adresi</label><textarea value={addressForm.address} onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} rows={3} /><div className="error-text">Adres gereklidir</div></div>
                <div className={`form-group ${addrErrors.city ? 'error' : ''}`}><label><i className="fas fa-city"></i> İl / İlçe</label><input type="text" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} /><div className="error-text">İl/İlçe gereklidir</div></div>
                <button className="modal-btn" onClick={handleSaveAddress}><i className="fas fa-save"></i> Adresi Kaydet</button>
              </div>
            )}
            {accountTab === 'orders' && (
              <div>
                {getPastOrders().length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                    <i className="fas fa-box-open" style={{ fontSize: 60, color: '#ddd', marginBottom: 20, display: 'block' }}></i>
                    <p style={{ fontSize: 16, marginBottom: 5 }}>Henüz siparişiniz bulunmuyor</p>
                    <p style={{ fontSize: 13 }}>İlk siparişinizi vermek için alışverişe başlayın!</p>
                  </div>
                ) : getPastOrders().reverse().map((order, i) => (
                  <div key={i} className="order-history-card">
                    <div className="order-history-header">
                      <div><strong>#{order.orderNumber}</strong><span className="order-date">{order.date}</span></div>
                      <span className="order-status">{order.status}</span>
                    </div>
                    <div className="order-history-items">
                      {order.items.map((item, j) => (
                        <div key={j} className="order-history-item">
                          <img src={item.img} alt="" />
                          <div><span className="ohi-name">{item.name}</span><span className="ohi-detail">{item.qty} adet · {(item.price * item.qty).toLocaleString('tr-TR')} TL</span></div>
                        </div>
                      ))}
                    </div>
                    <div className="tracking-steps">
                      {['Sipariş Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi'].map((step, si) => {
                        const statusIndex = ['Sipariş Alındı', 'Hazırlanıyor', 'Kargoya Verildi', 'Teslim Edildi'].indexOf(order.status);
                        const isActive = si <= statusIndex;
                        const isCurrent = si === statusIndex;
                        return (
                          <div key={si} className={`tracking-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                            <div className="tracking-dot">{isActive ? <i className="fas fa-check"></i> : <span>{si + 1}</span>}</div>
                            <span className="tracking-label">{step}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="order-history-footer">
                      <span><i className="fas fa-map-marker-alt"></i> {order.customer.address}, {order.customer.city}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <strong>{order.total.toLocaleString('tr-TR')} TL</strong>
                        <button className="return-btn" onClick={() => { setReturnModal(order.orderNumber); setReturnReason(''); }}><i className="fas fa-undo-alt"></i> İade Talep Et</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KAYIT OL MODAL */}
      <div className={`modal-overlay ${registerModal ? 'show' : ''}`}>
        <div className="modal">
          <div className="modal-header"><h2>Kayıt Ol</h2><button className="modal-close" onClick={() => setRegisterModal(false)}>✕</button></div>
          <div className="modal-body">
            <div className={`form-group ${regErrors.name ? 'error' : ''}`}><label><i className="far fa-user"></i> Ad Soyad</label><input type="text" value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} /><div className="error-text">Lütfen Adınızı Soyadınızı giriniz</div></div>
            <div className={`form-group ${regErrors.email ? 'error' : ''}`}>
              <label><i className="far fa-envelope"></i> E-posta Adresi</label>
              <input type="email" value={regForm.email} onChange={e => { setRegForm({ ...regForm, email: e.target.value }); setDuplicateError(prev => ({ ...prev, email: '' })); }} />
              <div className="error-text">Lütfen geçerli bir e-posta adresi giriniz</div>
              {duplicateError.email && <div className="error-text" style={{ display: 'block', color: '#e74c3c', marginTop: '5px' }}>{duplicateError.email}</div>}
            </div>
            <div className={`form-group ${regErrors.phone ? 'error' : ''}`}>
              <label><i className="fas fa-phone"></i> Telefon Numarası</label>
              <input type="tel" value={regForm.phone} onChange={e => { setRegForm({ ...regForm, phone: e.target.value }); setDuplicateError(prev => ({ ...prev, phone: '' })); }} />
              <div className="error-text">Lütfen geçerli bir telefon numarası giriniz (05XX XXX XX XX)</div>
              {duplicateError.phone && <div className="error-text" style={{ display: 'block', color: '#e74c3c', marginTop: '5px' }}>{duplicateError.phone}</div>}
            </div>
            <div className={`form-group ${regErrors.password ? 'error' : ''}`}><label><i className="fas fa-lock"></i> Şifre</label><input type="password" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} /><div className="error-text">Şifre en az 6 karakter olmalı</div></div>
            <div className={`form-group ${regErrors.password2 ? 'error' : ''}`}><label><i className="fas fa-lock"></i> Şifre Tekrar</label><input type="password" value={regForm.password2} onChange={e => setRegForm({ ...regForm, password2: e.target.value })} /><div className="error-text">Şifreler eşleşmiyor</div></div>
            <div className={`terms-group ${termsError ? 'error' : ''}`}>
              <label className="terms-label">
                <input type="checkbox" checked={termsAccepted} onChange={e => { setTermsAccepted(e.target.checked); setTermsError(false); }} />
                <span><a onClick={() => setTermsModal(true)}>Kullanım Koşulları</a> ve <a onClick={() => setPrivacyModal(true)}>Gizlilik Politikası</a>'nı okudum, kabul ediyorum.</span>
              </label>
              {termsError && <div className="error-text" style={{ display: 'block' }}>Devam etmek için kullanım koşullarını kabul etmelisiniz</div>}
            </div>
            <button className="modal-btn" onClick={handleRegister}><i className="fas fa-user-plus"></i> Kayıt Ol</button>
            <div className="modal-switch">Zaten hesabınız var mı? <a onClick={() => { setRegisterModal(false); setLoginErrors({}); setLoginModal(true); }}>Giriş Yap</a></div>
          </div>
        </div>
      </div>

      {/* GİRİŞ YAP MODAL */}
      <div className={`modal-overlay ${loginModal ? 'show' : ''}`}>
        <div className="modal">
          <div className="modal-header"><h2>Giriş Yap</h2><button className="modal-close" onClick={() => setLoginModal(false)}>✕</button></div>
          <div className="modal-body">
            <div className={`form-group ${loginErrors.email ? 'error' : ''}`}><label><i className="far fa-envelope"></i> E-posta Adresi</label><input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} /><div className="error-text">Lütfen geçerli bir e-posta adresi giriniz</div></div>
            <div className={`form-group ${loginErrors.password ? 'error' : ''}`}><label><i className="fas fa-lock"></i> Şifre</label><input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} /><div className="error-text">Şifre gereklidir</div></div>
            <button className="modal-btn" onClick={handleLogin}><i className="fas fa-sign-in-alt"></i> Giriş Yap</button>
            <div className="modal-switch">Hesabınız yok mu? <a onClick={() => { setLoginModal(false); setRegErrors({}); setRegisterModal(true); }}>Kayıt Ol</a></div>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      <div className={`modal-overlay ${checkoutModal ? 'show' : ''}`}>
        <div className="modal" style={{ maxHeight: processingPayment ? '90vh' : undefined }}>
          <div className="modal-header"><h2>Sipariş Bilgileri</h2><button className="modal-close" onClick={() => { if (!processingPayment) setCheckoutModal(false); }}>✕</button></div>
          <div className="modal-body">
            {processingPayment ? (
              <div className="payment-processing">
                <div className="processing-spinner"><div className="spinner-ring"></div><i className="fas fa-lock"></i></div>
                <h3>Ödeme İşleniyor</h3>
                <p>Lütfen bekleyin, kredi kartınızdan <strong>{cartTotal.toLocaleString('tr-TR')} TL</strong> tahsil ediliyor...</p>
                <div className="processing-steps">
                  <div className="processing-step active"><i className="fas fa-check-circle"></i> Kart bilgileri doğrulanıyor</div>
                  <div className="processing-step"><i className="fas fa-circle-notch fa-spin"></i> Banka onayı bekleniyor</div>
                  <div className="processing-step"><i className="far fa-circle"></i> Ödeme tamamlanıyor</div>
                </div>
              </div>
            ) : (
              <>
                <div className={`form-group ${chkErrors.name ? 'error' : ''}`}><label><i className="far fa-user"></i> Ad Soyad</label><input type="text" value={checkoutForm.name} onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })} /><div className="error-text">Ad soyad gereklidir</div></div>
                <div className={`form-group ${chkErrors.email ? 'error' : ''}`}><label><i className="far fa-envelope"></i> E-posta Adresi</label><input type="email" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} /><div className="error-text">Lütfen geçerli bir e-posta adresi giriniz</div></div>
                <div className={`form-group ${chkErrors.phone ? 'error' : ''}`}><label><i className="fas fa-phone"></i> Telefon Numarası</label><input type="tel" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} /><div className="error-text">Lütfen geçerli bir telefon numarası giriniz</div></div>
                <div className={`form-group ${chkErrors.address ? 'error' : ''}`}><label><i className="fas fa-map-marker-alt"></i> Teslimat Adresi</label><textarea value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} rows={3} /><div className="error-text">Adres gereklidir</div></div>
                <div className={`form-group ${chkErrors.city ? 'error' : ''}`}><label><i className="fas fa-city"></i> İl / İlçe</label><input type="text" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} /><div className="error-text">İl/İlçe gereklidir</div></div>
                <div className={`form-group ${chkErrors.payment ? 'error' : ''}`}>
                  <label><i className="fas fa-credit-card"></i> Ödeme Yöntemi</label>
                  <select value={checkoutForm.payment} onChange={e => { setCheckoutForm({ ...checkoutForm, payment: e.target.value }); setCardErrors({}); }}>
                    <option value="">Seçiniz...</option>
                    <option value="credit_card">💳 Kredi Kartı ile Öde</option>
                    <option value="kapida_nakit">🚚 Kapıda Ödeme (Nakit)</option>
                    <option value="kapida_kart">🚚 Kapıda Ödeme (Kredi Kartı)</option>
                    <option value="havale">🏦 Havale / EFT</option>
                  </select>
                  <div className="error-text">Ödeme yöntemi seçiniz</div>
                </div>
                {checkoutForm.payment === 'credit_card' && (
                  <div className="card-payment-section">
                    <div className="card-demo-notice"><i className="fas fa-info-circle"></i><span><strong>Demo:</strong> Gerçek ödeme alınmaz. Herhangi bir test numarası girilebilir (örn: 4242 4242 4242 4242)</span></div>
                    <div className={`credit-card-visual ${cardForm.cvv.length > 0 ? 'flipped' : ''}`} style={{ background: `linear-gradient(135deg, ${getCardType(cardForm.number).color}, ${getCardType(cardForm.number).color}dd)` }}>
                      <div className="card-front">
                        <div className="card-chip"></div>
                        <div className="card-type-icon"><i className={getCardType(cardForm.number).icon}></i><span>{getCardType(cardForm.number).type}</span></div>
                        <div className="card-number-display">{cardForm.number || '•••• •••• •••• ••••'}</div>
                        <div className="card-bottom">
                          <div className="card-holder-display"><small>Kart Sahibi</small><span>{cardForm.holder.toUpperCase() || 'AD SOYAD'}</span></div>
                          <div className="card-expiry-display"><small>Son Kullanma</small><span>{cardForm.expiry || 'AA/YY'}</span></div>
                        </div>
                      </div>
                      <div className="card-back">
                        <div className="card-magnetic-strip"></div>
                        <div className="card-cvv-strip"><span>CVV</span><div className="cvv-box">{cardForm.cvv || '•••'}</div></div>
                        <div className="card-back-logo"><i className={getCardType(cardForm.number).icon}></i></div>
                      </div>
                    </div>
                    <div className={`form-group ${cardErrors.number ? 'error' : ''}`}><label><i className="far fa-credit-card"></i> Kart Numarası</label><input type="text" value={cardForm.number} onChange={e => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })} maxLength={19} /><div className="error-text">Geçerli bir kart numarası girin (16 hane)</div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                      <div className={`form-group ${cardErrors.expiry ? 'error' : ''}`}><label><i className="far fa-calendar"></i> Son Kullanma</label><input type="text" value={cardForm.expiry} onChange={e => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })} maxLength={5} /><div className="error-text">AA/YY formatında girin</div></div>
                      <div className={`form-group ${cardErrors.cvv ? 'error' : ''}`}><label><i className="fas fa-lock"></i> CVV</label><input type="password" value={cardForm.cvv} onChange={e => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} maxLength={4} /><div className="error-text">CVV gereklidir (3-4 hane)</div></div>
                    </div>
                    <div className={`form-group ${cardErrors.holder ? 'error' : ''}`}><label><i className="far fa-user"></i> Kart Üzerindeki İsim</label><input type="text" value={cardForm.holder} onChange={e => setCardForm({ ...cardForm, holder: e.target.value.toUpperCase() })} /><div className="error-text">Kart sahibinin adını ve soyadını girin</div></div>
                  </div>
                )}
                {checkoutForm.payment === 'havale' && (
                  <div className="bank-info-box">
                    <h4><i className="fas fa-university"></i> Havale Bilgileri</h4>
                    <div className="bank-detail"><span>Banka:</span><strong>Garanti BBVA</strong></div>
                    <div className="bank-detail"><span>Hesap Adı:</span><strong>Dekoristasyon</strong></div>
                    <div className="bank-detail"><span>IBAN:</span><strong>TR00 0000 0000 0000 0000 0000 00</strong></div>
                    <p className="bank-note"><i className="fas fa-info-circle"></i> Sipariş onaylandıktan sonra açıklama kısmına sipariş numaranızı yazarak havale yapınız.</p>
                  </div>
                )}
                <div className="form-group"><label><i className="fas fa-sticky-note"></i> Sipariş Notu (isteğe bağlı)</label><textarea value={checkoutForm.note} onChange={e => setCheckoutForm({ ...checkoutForm, note: e.target.value })} rows={2} /></div>
                <div style={{ background: 'var(--bej)', borderRadius: 10, padding: 20, margin: '20px 0' }}>
                  <h4 style={{ marginBottom: 15, color: 'var(--dark)' }}>Sipariş Özeti</h4>
                  {cart.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14, borderBottom: '1px solid var(--border)' }}>
                      <span>{item.name} x{item.qty}</span>
                      <span style={{ fontWeight: 600 }}>{(item.price * item.qty).toLocaleString('tr-TR')} TL</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '2px solid var(--border)', marginTop: 15, paddingTop: 15, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, color: 'var(--primary)' }}>
                    <span>Toplam:</span><span>{cartTotal.toLocaleString('tr-TR')} TL</span>
                  </div>
                </div>
                {checkoutForm.payment === 'credit_card' && (
                  <div className="secure-payment-notice">
                    <i className="fas fa-shield-alt"></i><span>256-bit SSL ile şifrelenmiş güvenli ödeme</span>
                    <div className="payment-icons-row"><i className="fab fa-cc-visa"></i><i className="fab fa-cc-mastercard"></i><i className="fab fa-cc-amex"></i></div>
                  </div>
                )}
                <button className="modal-btn" onClick={placeOrder}>
                  <i className={checkoutForm.payment === 'credit_card' ? 'fas fa-lock' : 'fas fa-check-circle'}></i>
                  {checkoutForm.payment === 'credit_card' ? ` ${cartTotal.toLocaleString('tr-TR')} TL Öde` : ' Siparişi Onayla'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SİPARİŞ BAŞARILI MODAL */}
      <div className={`modal-overlay ${successModal ? 'show' : ''}`}>
        <div className="modal">
          <div className="modal-header"><h2>Sipariş Onaylandı</h2><button className="modal-close" onClick={() => setSuccessModal(false)}>✕</button></div>
          <div className="modal-body">
            <div className="order-success">
              <i className="fas fa-check-circle"></i>
              <h3>Siparişiniz Alındı!</h3>
              <p>Teşekkür ederiz, Dekoristasyon siparişiniz başarıyla oluşturuldu.</p>
              <div className="order-number">SİPARİŞ #{orderNum}</div>
              <p>Sipariş detayları e-posta adresinize gönderilecektir.</p>
              <button className="modal-btn" onClick={() => setSuccessModal(false)} style={{ marginTop: 20 }}><i className="fas fa-home"></i> Alışverişe Devam Et</button>
            </div>
          </div>
        </div>
      </div>

      {/* YORUM MODAL */}
      {reviewModal !== null && (() => {
        const product = productsData.find(p => p.id === reviewModal);
        const revs = getProductReviews(reviewModal);
        const avgRating = getProductAvgRating(reviewModal);
        const totalReviews = getProductReviewCount(reviewModal);
        const canReview = currentUser && hasUserPurchased(reviewModal) && !hasUserReviewed(reviewModal);
        const purchased = currentUser && hasUserPurchased(reviewModal);
        const alreadyReviewed = currentUser && hasUserReviewed(reviewModal);
        if (!product) return null;
        return (
          <div className="modal-overlay show" onClick={() => setReviewModal(null)}>
            <div className="modal" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Ürün Değerlendirmeleri</h2><button className="modal-close" onClick={() => setReviewModal(null)}>✕</button></div>
              <div className="modal-body">
                <div className="review-product-summary">
                  <img src={getPrimaryImage(product)} alt="" />
                  <div>
                    <div className="category" style={{ fontSize: 11, marginBottom: 4 }}>{product.category}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--dark)', marginBottom: 8 }}>{product.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 32, color: 'var(--gold)', fontWeight: 700 }}>{avgRating}</span>
                      <div>
                        <div style={{ color: 'var(--gold)', fontSize: 18 }}>{'★'.repeat(avgRating)}{'☆'.repeat(5 - avgRating)}</div>
                        <span style={{ fontSize: 13, color: '#999' }}>{totalReviews} değerlendirme</span>
                      </div>
                    </div>
                  </div>
                </div>
                {canReview && (
                  <div className="review-form-section">
                    <h4><i className="fas fa-pen"></i> Yorumunuzu Yazın</h4>
                    <div className="review-star-input">
                      <span style={{ fontSize: 14, color: '#666', marginRight: 8 }}>Puanınız:</span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} className={`review-star-btn ${star <= (reviewHover || reviewForm.rating) ? 'active' : ''}`} onClick={() => setReviewForm({ ...reviewForm, rating: star })} onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)}>
                          {star <= (reviewHover || reviewForm.rating) ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                    <div className="form-group" style={{ marginTop: 12 }}>
                      <textarea value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3} style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical' }} />
                    </div>
                    {reviewError && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 10 }}><i className="fas fa-exclamation-circle"></i> {reviewError}</div>}
                    <button className="modal-btn" onClick={handleSubmitReview}><i className="fas fa-paper-plane"></i> Yorumu Gönder</button>
                  </div>
                )}
                {!currentUser && <div className="review-notice"><i className="fas fa-info-circle"></i><span>Yorum yazmak için <a onClick={() => { setReviewModal(null); setLoginErrors({}); setLoginModal(true); }}>giriş yapın</a></span></div>}
                {currentUser && !purchased && <div className="review-notice warning"><i className="fas fa-shopping-bag"></i><span>Bu ürünü satın almadığınız için yorum yazamazsınız.</span></div>}
                {alreadyReviewed && <div className="review-notice success"><i className="fas fa-check-circle"></i><span>Bu ürünü zaten değerlendirdiniz. Teşekkür ederiz!</span></div>}
                <div className="review-list-section">
                  <h4><i className="fas fa-comments"></i> Yorumlar ({revs.length})</h4>
                  {revs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 20px', color: '#bbb' }}>
                      <i className="far fa-comment-dots" style={{ fontSize: 40, display: 'block', marginBottom: 10 }}></i>
                      <p>Henüz yorum yapılmamış. İlk yorumu siz yazın!</p>
                    </div>
                  ) : revs.map(rev => (
                    <div key={rev.id} className="review-item">
                      <div className="review-item-header">
                        <div className="review-item-avatar">{rev.userName.charAt(0)}</div>
                        <div><strong>{rev.userName}</strong><span className="review-item-date">{rev.date}</span></div>
                        <div className="review-item-stars" style={{ color: 'var(--gold)' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                      </div>
                      <p className="review-item-comment">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* SON GÖRÜNTÜLENEN ÜRÜNLER */}
      {currentPage === 'home' && recentlyViewed.length > 0 && (
        <section className="section" style={{ paddingTop: 40 }}>
          <div className="section-header"><h2>Son Görüntülenen Ürünler</h2><div className="line"></div></div>
          <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {recentlyViewed.slice(0, 4).map(id => {
              const p = productsData.find(pr => pr.id === id);
              if (!p) return null;
              return (
                <div key={p.id} className="product-card" style={{ cursor: 'pointer' }} onClick={() => openProductDetail(p.id)}>
                  <div className={`img-wrap ${p.category === 'BESMELE' ? 'besmele-wall' : ''}`} style={{ height: 200 }}><img className={p.category === 'BESMELE' ? 'besmele-cutout' : ''} src={getPrimaryImage(p)} alt="" /></div>
                  <div className="product-info"><h3 style={{ fontSize: 14 }}>{p.name}</h3><div className="price-row"><span className="new-price">{p.price.toLocaleString('tr-TR')} TL</span></div></div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* KULLANIM KOŞULLARI MODAL */}
      <div className={`modal-overlay ${termsModal ? 'show' : ''}`}>
        <div className="modal" style={{ maxWidth: '650px' }}>
          <div className="modal-header"><h2>Kullanım Koşulları</h2><button className="modal-close" onClick={() => setTermsModal(false)}>✕</button></div>
          <div className="modal-body policy-content">
            <h4>Son Güncelleme: Ocak 2025</h4><br/>
            <p><strong>1. Genel Hükümler</strong></p>
            <p>Dekoristasyon web sitesini kullanarak aşağıdaki kullanım koşullarını kabul etmiş sayılırsınız.</p><br/>
            <p><strong>2. Hesap Kaydı</strong></p>
            <p>Sitemizden alışveriş yapabilmek için doğru ve eksiksiz bilgilerle kayıt olmanız gerekmektedir.</p><br/>
            <p><strong>3. Ürünler ve Fiyatlar</strong></p>
            <p>Sitemizde yer alan ürün görselleri tanıtım amaçlıdır. Fiyatlar önceden bildirilmeksizin değiştirilebilir.</p><br/>
            <p><strong>4. Sipariş ve Ödeme</strong></p>
            <p>Siparişiniz, ödeme onaylandıktan sonra işleme alınır. Kapıda ödeme, kredi kartı ve havale/EFT seçeneklerimiz mevcuttur.</p><br/>
            <p><strong>5. Teslimat</strong></p>
            <p>Tahmini teslimat süresi 1-5 iş günüdür.</p><br/>
            <p><strong>6. İade ve Değişim</strong></p>
            <p>Ürünlerimizi teslimat tarihinden itibaren 14 gün içinde iade edebilirsiniz.</p><br/>
            <p><strong>İletişim:</strong> bugra@kamaticaret.com | 0505 070 5278</p>
          </div>
        </div>
      </div>

      {/* GİZLİLİK POLİTİKASI MODAL */}
      <div className={`modal-overlay ${privacyModal ? 'show' : ''}`}>
        <div className="modal" style={{ maxWidth: '650px' }}>
          <div className="modal-header"><h2>Gizlilik Politikası</h2><button className="modal-close" onClick={() => setPrivacyModal(false)}>✕</button></div>
          <div className="modal-body policy-content">
            <h4>Son Güncelleme: Ocak 2025</h4><br/>
            <p><strong>1. Toplanan Kişisel Veriler</strong></p>
            <p>Ad, soyad, e-posta, telefon, teslimat adresi ve ödeme bilgileri toplanabilir.</p><br/>
            <p><strong>2. Verilerin Kullanım Amaçları</strong></p>
            <p>Sipariş işleme, hesap yönetimi, kampanya bildirimleri ve site deneyimini iyileştirme.</p><br/>
            <p><strong>3. Verilerin Korunması</strong></p>
            <p>Kişisel verileriniz KVKK kapsamında korunmaktadır.</p><br/>
            <p><strong>İletişim:</strong> bugra@kamaticaret.com | 0505 070 5278</p>
          </div>
        </div>
      </div>

      {/* PWA INSTALL BANNER */}
      {showPwaBanner && (
        <div style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8B6F47, #6B5438)', color: 'white', padding: '14px 24px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', zIndex: 6000, display: 'flex', alignItems: 'center', gap: '15px', maxWidth: '90vw' }}>
          <i className="fas fa-mobile-alt" style={{ fontSize: '24px', color: '#D4AF37' }}></i>
          <div><div style={{ fontWeight: 700, fontSize: '14px' }}>Uygulama Olarak Yükle</div><div style={{ fontSize: '12px', opacity: 0.8 }}>Dekoristasyon'u ana ekranınıza ekleyin</div></div>
          <button onClick={installPwa} style={{ background: '#D4AF37', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>Yükle</button>
          <button onClick={() => setShowPwaBanner(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '18px', padding: '0 5px' }}>✕</button>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast ${toast.show ? 'show' : ''}`}><i className="fas fa-check-circle"></i> <span>{toast.text}</span></div>

      {/* İADE TALEP MODAL */}
      {returnModal && (
        <div className="modal-overlay show" onClick={() => setReturnModal(null)}>
          <div className="modal" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>İade Talebi</h2><button className="modal-close" onClick={() => setReturnModal(null)}>✕</button></div>
            <div className="modal-body">
              <div style={{ background: 'var(--bej)', borderRadius: 10, padding: 15, marginBottom: 20, textAlign: 'center' }}><strong>Sipariş #{returnModal}</strong></div>
              <div className="form-group">
                <label><i className="fas fa-clipboard-list"></i> İade Sebebi</label>
                <select value={returnReason} onChange={e => setReturnReason(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  <option value="defective">Ürün hasarlı/kusurlu</option>
                  <option value="wrong">Yanlış ürün geldi</option>
                  <option value="different">Ürün fotoğraftan farklı</option>
                  <option value="unwanted">Vazgeçtim</option>
                  <option value="size">Boyut uyumsuz</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
              <div style={{ background: '#fff3cd', borderRadius: 8, padding: 15, marginBottom: 20, fontSize: 13, color: '#856404' }}>
                <i className="fas fa-info-circle"></i> <strong>İade Koşulları:</strong>
                <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.8 }}>
                  <li>Ürün teslim tarihinden itibaren 14 gün içinde iade edilmelidir</li>
                  <li>Ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
                  <li>İade kargo ücreti alıcıya aittir</li>
                </ul>
              </div>
              <button className="modal-btn danger" onClick={() => {
                if (!returnReason) return;
                setReturnModal(null);
                showToast('İade talebiniz başarıyla oluşturuldu!');
              }}><i className="fas fa-paper-plane"></i> İade Talebini Gönder</button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP BUTONU */}
      <a href="https://wa.me/905050705278?text=Merhaba%2C%20Dekoristasyon%20hakkında%20bilgi%20almak%20istiyorum" target="_blank" rel="noopener noreferrer" className="whatsapp-float" title="WhatsApp ile iletişime geçin">
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* MOBİL ALT MENÜ */}
      <nav className="mobile-bottom-nav">
        <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fas fa-home"></i><span>Ana Sayfa</span></a>
        <a href="#urunler"><i className="fas fa-th-large"></i><span>Ürünler</span></a>
        <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
          <i className="fas fa-shopping-bag"></i><span>Sepetim</span>
          {cartQty > 0 && <span className="mobile-nav-badge">{cartQty}</span>}
        </button>
        <button onClick={() => openAccountModal()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
          <i className="far fa-user"></i><span>Hesabım</span>
        </button>
      </nav>
    </>
  );
}
