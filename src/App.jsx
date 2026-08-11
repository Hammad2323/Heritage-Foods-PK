import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'

/* ══════════════════════════════════════════════
   CONFIG — Replace these with your actual values
   ══════════════════════════════════════════════ */
const EJS_SERVICE_ID  = 'YOUR_SERVICE_ID'   // EmailJS → Email Services → Service ID
const EJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'  // EmailJS → Email Templates → Template ID
const EJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'   // EmailJS → Account → Public Key

// ── Contact info (replace with real) ──────────
const WHATSAPP_NUM  = '923001234567'         // without + for wa.me link
const PHONE_DISPLAY = '+92 300 123 4567'
const FACEBOOK_URL  = 'https://facebook.com/heritagefoodspk'
const EMAIL_ADDR    = 'info@heritagefoodspk.com'

// ── Payment details (replace with real) ───────
const PAYMENT = {
  hbl: {
    label: 'HBL Bank Transfer',
    bank: 'Habib Bank Limited (HBL)',
    accountTitle: 'Heritage Foods PK',
    accountNo: 'XXXX-XXXX-XXXXXXXX',
    iban: 'PK00HABB0000000000000000',
  },
  jazzcash:  { label: 'JazzCash',  number: '0300-XXXXXXX', name: 'Heritage Foods PK' },
  easypaisa: { label: 'EasyPaisa', number: '0300-XXXXXXX', name: 'Heritage Foods PK' },
}

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */
const pkr = (n) => 'Rs. ' + Number(n).toLocaleString('en-PK')
const genId = () => 'HFP-' + Math.random().toString(36).slice(2, 8).toUpperCase()

/* ══════════════════════════════════════════════
   CATEGORIES  (3)
   ══════════════════════════════════════════════ */
const CATS = [
  { id: 'achar',    label: 'Achar (Pickles)',             short: 'Achar',      icon: '🫙', color: '#B91C1C', bg: '#FEF2F2' },
  { id: 'dryfruit', label: 'Dry Fruits, Nuts & Seeds',    short: 'Dry Fruits', icon: '🥜', color: '#92400E', bg: '#FFFBEB' },
  { id: 'sweets',   label: 'Traditional Sweets & Halwa',  short: 'Sweets',     icon: '🍬', color: '#86198F', bg: '#FDF4FF' },
]

/* ══════════════════════════════════════════════
   PRODUCTS  (12 Achar + 20 Dry Fruits + 12 Sweets = 44)
   12 specials total: 4 from each category
   ══════════════════════════════════════════════ */
const PRODUCTS = [
  /* ─── ACHAR (12) ─── */
  { id:1,  name:'Imli (Tamarind) Achar',      cat:'achar',    price:380,  badge:null,          special:false, rating:5, reviews:142, img:'https://images.unsplash.com/photo-1617854307432-13950e24ba07?w=400&h=400&fit=crop&auto=format' },
  { id:2,  name:'Lasora (Cordia) Achar',       cat:'achar',    price:420,  badge:null,          special:false, rating:4, reviews:87,  img:'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400&h=400&fit=crop&auto=format' },
  { id:3,  name:'Sabaz Mirch (Green Chili)',   cat:'achar',    price:350,  badge:'Spicy 🌶',    special:true,  rating:5, reviews:198, img:'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=400&fit=crop&auto=format' },
  { id:4,  name:'Lahsun (Garlic) Achar',       cat:'achar',    price:520,  badge:'Popular',     special:true,  rating:5, reviews:231, img:'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=400&h=400&fit=crop&auto=format' },
  { id:5,  name:'Piyaz (Onion) Achar',         cat:'achar',    price:320,  badge:null,          special:false, rating:4, reviews:76,  img:'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=400&fit=crop&auto=format' },
  { id:6,  name:'Aam (Mango) Achar',           cat:'achar',    price:650,  badge:'Bestseller',  special:true,  rating:5, reviews:387, img:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop&auto=format' },
  { id:7,  name:'Nimbu (Lemon) Achar',         cat:'achar',    price:400,  badge:null,          special:false, rating:4, reviews:112, img:'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&h=400&fit=crop&auto=format' },
  { id:8,  name:'Gajar (Carrot) Achar',        cat:'achar',    price:360,  badge:'Organic',     special:false, rating:4, reviews:94,  img:'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop&auto=format' },
  { id:9,  name:'Lal Mirch (Red Chili) Achar', cat:'achar',    price:480,  badge:'Extra Hot',   special:true,  rating:5, reviews:267, img:'https://images.unsplash.com/photo-1588186939781-ecc55d4e9edf?w=400&h=400&fit=crop&auto=format' },
  { id:10, name:'Amla (Gooseberry) Achar',     cat:'achar',    price:550,  badge:'Healthy',     special:false, rating:4, reviews:83,  img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&auto=format' },
  { id:11, name:'Mix (Mixed Veg) Achar',       cat:'achar',    price:450,  badge:'Chef Mix',    special:false, rating:5, reviews:156, img:'https://images.unsplash.com/photo-1769255484646-16988ad5552d?w=400&h=400&fit=crop&auto=format' },
  { id:12, name:'Adrak (Ginger) Achar',        cat:'achar',    price:500,  badge:'New',         special:false, rating:4, reviews:61,  img:'https://images.unsplash.com/photo-1617854307432-13950e24ba07?w=400&h=400&fit=crop&auto=format' },

  /* ─── DRY FRUITS (20) ─── */
  { id:13, name:'Anjeer (Figs)',               cat:'dryfruit', price:1800, badge:'Premium',     special:true,  rating:5, reviews:203, img:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&auto=format' },
  { id:14, name:'Khajoor (Dates)',             cat:'dryfruit', price:950,  badge:'Bestseller',  special:true,  rating:5, reviews:441, img:'https://images.unsplash.com/photo-1617076678955-2ab0aa77a3b2?w=400&h=400&fit=crop&auto=format' },
  { id:15, name:'Kishmish (Raisins)',          cat:'dryfruit', price:850,  badge:null,          special:false, rating:4, reviews:178, img:'https://images.unsplash.com/photo-1633168850968-76be3bb0a2fc?w=400&h=400&fit=crop&auto=format' },
  { id:16, name:'Khubani (Dried Apricots)',    cat:'dryfruit', price:1200, badge:null,          special:false, rating:4, reviews:134, img:'https://images.unsplash.com/photo-1600781165060-f81e7c29f7f9?w=400&h=400&fit=crop&auto=format' },
  { id:17, name:'Aloo Bukhara (Prunes)',       cat:'dryfruit', price:1100, badge:null,          special:false, rating:4, reviews:92,  img:'https://images.unsplash.com/photo-1598371623789-44e341c1b6ab?w=400&h=400&fit=crop&auto=format' },
  { id:18, name:'Badam (Almonds)',             cat:'dryfruit', price:2800, badge:'Popular',     special:true,  rating:5, reviews:389, img:'https://images.unsplash.com/photo-1772986796415-d38ed846bca7?w=400&h=400&fit=crop&auto=format' },
  { id:19, name:'Akhrot (Walnut)',             cat:'dryfruit', price:2200, badge:null,          special:false, rating:4, reviews:267, img:'https://images.unsplash.com/photo-1595412017587-b7f3117dff54?w=400&h=400&fit=crop&auto=format' },
  { id:20, name:'Kaju (Cashew)',               cat:'dryfruit', price:2400, badge:null,          special:false, rating:5, reviews:312, img:'https://images.unsplash.com/photo-1661836990173-97481f67f85b?w=400&h=400&fit=crop&auto=format' },
  { id:21, name:'Pista (Pistachio)',           cat:'dryfruit', price:3500, badge:'Premium',     special:true,  rating:5, reviews:276, img:'https://images.unsplash.com/photo-1772986754581-ea80e5fa21a7?w=400&h=400&fit=crop&auto=format' },
  { id:22, name:'Chilgoza (Pine Nuts)',        cat:'dryfruit', price:5500, badge:'Rare',        special:false, rating:5, reviews:189, img:'https://images.unsplash.com/photo-1772985205925-8719d1055423?w=400&h=400&fit=crop&auto=format' },
  { id:23, name:'Mungphali (Peanuts)',         cat:'dryfruit', price:380,  badge:null,          special:false, rating:4, reviews:156, img:'https://images.unsplash.com/photo-1600973785836-d7e9d4f24bba?w=400&h=400&fit=crop&auto=format' },
  { id:24, name:'Hazelnuts',                   cat:'dryfruit', price:1600, badge:null,          special:false, rating:4, reviews:143, img:'https://images.unsplash.com/photo-1605024344839-e6e41aea6b23?w=400&h=400&fit=crop&auto=format' },
  { id:25, name:'Brazil Nuts',                 cat:'dryfruit', price:2100, badge:'Imported',    special:false, rating:4, reviews:98,  img:'https://images.unsplash.com/photo-1769255484888-e2c82fc1238c?w=400&h=400&fit=crop&auto=format' },
  { id:26, name:'Til (Sesame Seeds)',          cat:'dryfruit', price:450,  badge:null,          special:false, rating:4, reviews:87,  img:'https://images.unsplash.com/photo-1598371624529-2d1d43686b5f?w=400&h=400&fit=crop&auto=format' },
  { id:27, name:'Pumpkin Seeds',               cat:'dryfruit', price:680,  badge:null,          special:false, rating:4, reviews:112, img:'https://images.unsplash.com/photo-1769255485022-f9bb6d6e8169?w=400&h=400&fit=crop&auto=format' },
  { id:28, name:'Sunflower Seeds',             cat:'dryfruit', price:520,  badge:null,          special:false, rating:4, reviews:94,  img:'https://images.unsplash.com/photo-1769255484646-16988ad5552d?w=400&h=400&fit=crop&auto=format' },
  { id:29, name:'Alsi (Flax Seeds)',           cat:'dryfruit', price:380,  badge:'Healthy',     special:false, rating:4, reviews:76,  img:'https://images.unsplash.com/photo-1633168850968-76be3bb0a2fc?w=400&h=400&fit=crop&auto=format' },
  { id:30, name:'Chia Seeds',                  cat:'dryfruit', price:1200, badge:null,          special:false, rating:5, reviews:167, img:'https://images.unsplash.com/photo-1769255485022-f9bb6d6e8169?w=400&h=400&fit=crop&auto=format' },
  { id:31, name:'Macadamia Nuts',              cat:'dryfruit', price:4200, badge:'Imported',    special:false, rating:5, reviews:83,  img:'https://images.unsplash.com/photo-1769255484888-e2c82fc1238c?w=400&h=400&fit=crop&auto=format' },
  { id:32, name:'Mixed Dried Berries',         cat:'dryfruit', price:1800, badge:'New',         special:false, rating:4, reviews:124, img:'https://images.unsplash.com/photo-1598371624529-2d1d43686b5f?w=400&h=400&fit=crop&auto=format' },

  /* ─── SWEETS (12) ─── */
  { id:33, name:'Multani Sohan Halwa',         cat:'sweets',   price:950,  badge:'Famous',      special:true,  rating:5, reviews:512, img:'https://images.unsplash.com/photo-1695568181440-aca4dac18650?w=400&h=400&fit=crop&auto=format' },
  { id:34, name:"Khushab's Dodha Halwa",       cat:'sweets',   price:850,  badge:'Traditional', special:false, rating:5, reviews:378, img:'https://images.unsplash.com/photo-1695568181117-c91fe299acc3?w=400&h=400&fit=crop&auto=format' },
  { id:35, name:'Mianwali Desi Ghee Halwa',    cat:'sweets',   price:1100, badge:'Pure Ghee',   special:false, rating:5, reviews:289, img:'https://images.unsplash.com/photo-1695568181219-9b9bfc04f2db?w=400&h=400&fit=crop&auto=format' },
  { id:36, name:'Gajar (Carrot) ka Halwa',     cat:'sweets',   price:750,  badge:'Seasonal',    special:false, rating:5, reviews:445, img:'https://images.unsplash.com/photo-1666601434378-b0ca655bf2b1?w=400&h=400&fit=crop&auto=format' },
  { id:37, name:'Sooji (Semolina) ka Halwa',   cat:'sweets',   price:480,  badge:null,          special:false, rating:4, reviews:198, img:'https://images.unsplash.com/photo-1695568181440-aca4dac18650?w=400&h=400&fit=crop&auto=format' },
  { id:38, name:'Moong Dal ka Halwa',          cat:'sweets',   price:820,  badge:'Rich',        special:false, rating:5, reviews:234, img:'https://images.unsplash.com/photo-1695568181117-c91fe299acc3?w=400&h=400&fit=crop&auto=format' },
  { id:39, name:'Gulab Jamun',                 cat:'sweets',   price:580,  badge:'Bestseller',  special:true,  rating:5, reviews:678, img:'https://images.unsplash.com/photo-1695568180070-8b5acead5cf4?w=400&h=400&fit=crop&auto=format' },
  { id:40, name:'Jalebi',                      cat:'sweets',   price:420,  badge:'Fresh Daily', special:true,  rating:5, reviews:534, img:'https://images.unsplash.com/photo-1778448806852-db6a837fa98f?w=400&h=400&fit=crop&auto=format' },
  { id:41, name:'Barfi (Pista / Coconut)',     cat:'sweets',   price:950,  badge:'Gift Ready',  special:false, rating:5, reviews:312, img:'https://images.unsplash.com/photo-1758910536889-43ce7b3199fd?w=400&h=400&fit=crop&auto=format' },
  { id:42, name:'Kaju Katli',                  cat:'sweets',   price:1800, badge:'Premium',     special:true,  rating:5, reviews:423, img:'https://images.unsplash.com/photo-1695568181219-9b9bfc04f2db?w=400&h=400&fit=crop&auto=format' },
  { id:43, name:'Motichoor Laddoo',            cat:'sweets',   price:650,  badge:null,          special:false, rating:4, reviews:287, img:'https://images.unsplash.com/photo-1655235317329-3f3cda09102e?w=400&h=400&fit=crop&auto=format' },
  { id:44, name:'Patisa / Sohan Papdi',        cat:'sweets',   price:720,  badge:'Light',       special:false, rating:4, reviews:198, img:'https://images.unsplash.com/photo-1695568181117-c91fe299acc3?w=400&h=400&fit=crop&auto=format' },
]

const SPECIALS = PRODUCTS.filter(p => p.special) // exactly 12

const NAV_LINKS = [
  { label: 'Home',             href: '#top' },
  { label: 'Special Products', href: '#specials', hot: true },
  { label: 'Our Story',        href: '#about' },
  { label: 'Contact',          href: '#contact' },
]

/* ══════════════════════════════════════════════
   STARS
   ══════════════════════════════════════════════ */
function Stars({ n, size = 12 }) {
  return (
    <span style={{ display: 'flex', gap: 1, fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= n ? '#E07830' : '#D1B99A' }}>★</span>
      ))}
    </span>
  )
}

/* ══════════════════════════════════════════════
   LOGO
   ══════════════════════════════════════════════ */
function HeritageLogo({ compact = false }) {
  const sz = compact ? 44 : 56
  return (
    <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
      <svg width={sz} height={sz} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="32" fill="#14532D" />
        <circle cx="32" cy="32" r="28" fill="none" stroke="#4ADE80" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        {/* Crescent */}
        <path d="M32 12C21 12 14 20 14 30C14 40 21 48 32 48C26 45 21 38 21 30C21 22 26 15 32 12Z" fill="#86EFAC" />
        {/* 5-point star */}
        <path d="M45 14L46.9 19.7H52.9L48.0 23.1L49.9 28.8L45 25.4L40.1 28.8L42.0 23.1L37.1 19.7H43.1L45 14Z" fill="#FCD34D" />
        {/* Leaf pair */}
        <ellipse cx="43" cy="35" rx="5.5" ry="2.2" fill="#4ADE80" opacity="0.55" transform="rotate(22 43 35)" />
        <ellipse cx="21" cy="35" rx="5.5" ry="2.2" fill="#4ADE80" opacity="0.35" transform="rotate(-22 21 35)" />
        {/* Bottom arc */}
        <path d="M23 50 Q32 57 41 50" stroke="#4ADE80" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Center gem */}
        <circle cx="32" cy="32" r="3" fill="#FCD34D" />
        <circle cx="32" cy="32" r="1.5" fill="#14532D" />
      </svg>
      <div>
        <div className="font-display font-black" style={{ fontSize: compact ? 18 : 22, lineHeight: 1.1, color: 'var(--foreground)' }}>
          Heritage Foods
        </div>
        <div style={{ fontSize: compact ? 9 : 11, fontWeight: 900, letterSpacing: '0.22em', color: '#D97706', marginTop: 2 }}>
          PK ✦ EST. 1982
        </div>
      </div>
    </a>
  )
}

/* ══════════════════════════════════════════════
   PRODUCT CARD
   ══════════════════════════════════════════════ */
function ProductCard({ product, onAdd, searchQuery }) {
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const cat = CATS.find(c => c.id === product.cat)
  const isMatch = searchQuery && searchQuery.trim().length > 0 &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())

  function handleAdd() {
    onAdd(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      className="group relative flex flex-col rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      style={{
        background: 'var(--card)',
        borderColor: isMatch ? '#E07830' : 'var(--border)',
        outline: isMatch ? '2px solid #E07830' : 'none',
      }}
    >
      {product.badge && (
        <span className="absolute top-2 left-2 z-10 text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
          {product.badge}
        </span>
      )}
      <button
        onClick={() => setWished(w => !w)}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(4px)' }}
        aria-label="Wishlist"
      >
        <span style={{ color: wished ? '#ff6b6b' : '#fff', fontSize: 13 }}>{wished ? '♥' : '♡'}</span>
      </button>

      {/* Image */}
      <div
  className="relative overflow-hidden shrink-0 h-[105px] sm:h-[135px] lg:h-[160px]"
  style={{ background: 'var(--muted)' }}
>
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.special && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: '#E07830', color: '#fff' }}>⭐</div>
        )}
      </div>

      {/* Body */}
    <div className="flex flex-col flex-1 p-2 sm:p-3 gap-1.5">
        {/* Category chip */}
        <span className="text-[8px] sm:text-[10px] font-black tracking-wide uppercase px-1.5 sm:px-2 py-0.5 rounded-full w-fit max-w-full truncate"
          style={{ background: cat.bg, color: cat.color }}>
          {cat.icon} {cat.short}
        </span>

        {/* Name */}
        <h3
  className="font-semibold text-[11px] sm:text-sm leading-tight line-clamp-2 min-h-[28px] sm:min-h-[40px]" style={{ color: 'var(--card-foreground)' }}>
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1">
       <span className="font-display font-black text-[12px] sm:text-base" style={{ color: 'var(--primary)' }}>
            {pkr(product.price)}
          </span>
         <span className="text-[9px] sm:text-[11px]" style={{ color: 'var(--muted-foreground)' }}>/kg</span>
        </div>

        {/* Stars */}
       <div className="flex items-center gap-1 min-w-0">
          <Stars n={product.rating} />
        <span className="text-[9px] sm:text-[11px] truncate" style={{ color: 'var(--muted-foreground)' }}>({product.reviews})</span>
        </div>

       {/* Qty + Add */}
<div className="mt-auto pt-2 flex flex-col gap-2">

  {/* Quantity */}
  <div className="flex justify-center">
    <div
      className="flex items-center rounded-lg overflow-hidden border"
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        onClick={() => setQty(q => Math.max(1, q - 1))}
        className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center font-black text-base hover:bg-[var(--muted)] active:bg-[var(--muted)] transition-colors"
        style={{ color: 'var(--foreground)' }}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span
        className="w-7 sm:w-6 text-center text-sm font-bold"
        style={{ color: 'var(--foreground)' }}
      >
        {qty}
      </span>

      <button
        onClick={() => setQty(q => q + 1)}
        className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center font-black text-base hover:bg-[var(--muted)] active:bg-[var(--muted)] transition-colors"
        style={{ color: 'var(--foreground)' }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  </div>

  {/* Add to cart */}
  <button
    onClick={handleAdd}
    className="w-full py-2 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all duration-200 active:scale-[0.97]"
    style={{
      background: added ? '#16a34a' : 'var(--primary)',
      color: '#fff'
    }}
  >
    {added ? '✓ Added!' : 'Add to Cart'}
  </button>

</div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   CART DRAWER
   ══════════════════════════════════════════════ */
function CartDrawer({ open, onClose, items, onQty, onRemove, onCheckout }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      )}
      <div
        className="fixed top-0 right-0 h-full z-50 w-full max-w-sm flex flex-col transition-transform duration-300"
        style={{
          background: 'var(--card)',
          borderLeft: '1px solid var(--border)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-display font-bold text-xl" style={{ color: 'var(--card-foreground)' }}>Your Cart</h2>
            {items.length > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {items.reduce((s, i) => s + i.qty, 0)} kg across {items.length} items
              </p>
            )}
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--muted)]"
            style={{ color: 'var(--muted-foreground)', fontSize: 20 }}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <span style={{ fontSize: 52 }}>🛒</span>
            <p className="font-display text-lg" style={{ color: 'var(--card-foreground)' }}>Cart is empty</p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Add some delicious items!</p>
            <button onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl border"
                  style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
                  <img src={item.img} alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    style={{ background: 'var(--muted)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--card-foreground)' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pkr(item.price)}/kg</p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Qty */}
                      <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                        <button onClick={() => onQty(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center font-black text-sm hover:bg-[var(--muted)] transition-colors"
                          style={{ color: 'var(--foreground)' }}>−</button>
                        <span className="w-7 text-center text-sm font-bold" style={{ color: 'var(--foreground)' }}>{item.qty}</span>
                        <button onClick={() => onQty(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center font-black text-sm hover:bg-[var(--muted)] transition-colors"
                          style={{ color: 'var(--foreground)' }}>+</button>
                      </div>
                      <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{pkr(item.price * item.qty)}</span>
                    </div>
                  </div>
                  {/* Delete */}
                  <button onClick={() => onRemove(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg self-start transition-colors hover:bg-red-50"
                    style={{ color: '#DC2626', fontSize: 17 }}
                    title="Remove">🗑</button>
                </div>
              ))}
            </div>
            <div className="p-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between font-black text-xl font-display mb-4" style={{ color: 'var(--card-foreground)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>{pkr(total)}</span>
              </div>
              <button onClick={onCheckout}
                className="w-full py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)', color: '#fff' }}>
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   RECEIPT MODAL
   ══════════════════════════════════════════════ */
function ReceiptModal({ open, onClose, order }) {
  if (!open || !order) return null

  function downloadReceipt() {
    const w = window.open('', '_blank')
    const itemsHTML = order.items.map(i =>
      `<div class="row"><span class="name">${i.name} &times; ${i.qty}kg</span><span class="price">Rs. ${(i.price * i.qty).toLocaleString()}</span></div>`
    ).join('')

    w.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Heritage Foods PK — Receipt #${order.id}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;background:#FAF6F1;display:flex;justify-content:center;padding:24px;color:#1C1008}
.receipt{width:480px;background:#fff;border:2px solid #DDD0C0;border-radius:18px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12)}
.header{background:#14532D;color:#fff;text-align:center;padding:30px 24px 22px}
.logo-icon{font-size:44px;margin-bottom:6px}
.brand{font-size:30px;font-weight:900;letter-spacing:1px}
.sub{font-size:11px;letter-spacing:3px;color:#86EFAC;margin-top:3px}
.badge{background:#E07830;color:#fff;display:inline-block;padding:5px 20px;border-radius:20px;font-weight:800;font-size:12px;margin-top:14px;letter-spacing:1.5px}
.order-meta{color:#86EFAC;font-size:12px;margin-top:8px;opacity:.85}
.section{padding:16px 22px;border-bottom:1px dashed #DDD0C0}
.section:last-of-type{border-bottom:none}
.sec-title{font-size:9px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase;color:#7A5C44;margin-bottom:10px}
.row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;align-items:flex-start}
.name{color:#1C1008;flex:1;padding-right:12px}
.price{color:#C85A18;font-weight:800;white-space:nowrap}
.total-row{display:flex;justify-content:space-between;font-size:17px;font-weight:900;padding:6px 0}
.total-price{color:#C85A18}
.notice{background:linear-gradient(135deg,#ECFDF5,#F0FFF4);border:2px solid #86EFAC;border-radius:12px;padding:14px;text-align:center;margin:16px 22px}
.notice p{font-size:13px;color:#14532D;font-weight:700;margin:4px 0;line-height:1.5}
.footer{background:#1C1008;color:#A07850;text-align:center;padding:18px 24px;font-size:11px;line-height:1.8}
.footer strong{color:#86EFAC}
@media print{body{background:#fff;padding:0}.receipt{border:none;border-radius:0;box-shadow:none;width:100%}}
</style>
</head>
<body>
<div class="receipt">
  <div class="header">
    <div class="logo-icon">🌿</div>
    <div class="brand">HERITAGE FOODS</div>
    <div class="sub">PK ✦ EST. 1982</div>
    <div class="badge">ORDER RECEIPT</div>
    <div class="order-meta">Order #${order.id} &nbsp;&nbsp;|&nbsp;&nbsp; ${order.date}</div>
  </div>

  <div class="section">
    <div class="sec-title">Customer Details</div>
    <div class="row"><span class="name">Full Name</span><span>${order.name}</span></div>
    <div class="row"><span class="name">Phone / WhatsApp</span><span>${order.phone}</span></div>
    <div class="row"><span class="name">City</span><span>${order.city}</span></div>
    <div class="row"><span class="name">Delivery Address</span><span style="text-align:right;max-width:55%">${order.address}</span></div>
  </div>

  <div class="section">
    <div class="sec-title">Order Items</div>
    ${itemsHTML}
  </div>

  <div class="section">
    <div class="total-row">
      <span>Total Amount</span>
      <span class="total-price">Rs. ${order.total.toLocaleString()}</span>
    </div>
    <div class="row" style="margin-top:8px">
      <span class="name" style="color:#7A5C44">Payment Method</span>
      <span style="font-weight:700">${order.paymentMethod}</span>
    </div>
  </div>

  <div class="notice">
    <p>✅ Your order will be delivered within <strong>1 hour</strong></p>
    <p>📞 Our team will contact you within <strong>10 minutes</strong></p>
  </div>

  <div class="footer">
    <p>Thank you for choosing <strong>Heritage Foods PK!</strong></p>
    <p>WhatsApp: ${PHONE_DISPLAY} &nbsp;|&nbsp; ${EMAIL_ADDR}</p>
    <p style="margin-top:6px;font-size:10px;opacity:.55">This is your official order confirmation. Keep it for reference.</p>
  </div>
</div>
<script>window.onload=()=>{window.print()}</script>
</body></html>`)
    w.document.close()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--card)' }}>
        {/* Green header */}
        <div style={{ background: '#14532D', padding: '28px 24px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>🌿</div>
          <div className="font-display font-black text-white text-2xl mt-2">Order Confirmed!</div>
          <div style={{ background: '#E07830', color: '#fff', display: 'inline-block', padding: '4px 18px', borderRadius: 20, fontSize: 12, fontWeight: 900, marginTop: 12, letterSpacing: 1.5 }}>
            #{order.id}
          </div>
        </div>

        <div className="p-6">
          {/* Promise box */}
          <div className="rounded-xl p-4 mb-5 text-center" style={{ background: '#ECFDF5', border: '2px solid #86EFAC' }}>
            <p className="font-bold text-sm" style={{ color: '#14532D' }}>✅ Delivered within <strong>1 hour</strong></p>
            <p className="font-bold text-sm mt-1" style={{ color: '#14532D' }}>📞 We will contact you within <strong>10 minutes</strong></p>
          </div>

          {/* Summary */}
          <div className="text-sm space-y-1 mb-5">
            {[['Customer', order.name], ['Phone', order.phone], ['City', order.city]].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>{l}</span>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{v}</span>
              </div>
            ))}
            <div className="flex justify-between font-black text-base pt-3 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--foreground)' }}>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>{pkr(order.total)}</span>
            </div>
          </div>

          <button onClick={downloadReceipt}
            className="w-full py-3.5 rounded-xl font-black text-base mb-3 hover:opacity-90 transition-opacity"
            style={{ background: '#14532D', color: '#fff' }}>
            📥 Download / Print Receipt
          </button>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl font-semibold text-sm"
            style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   CHECKOUT MODAL
   ══════════════════════════════════════════════ */
function CheckoutModal({ open, onClose, items, onOrderComplete }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', address: '', notes: '' })
  const [payMethod, setPayMethod] = useState('hbl')
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState('')
  const [receiptB64, setReceiptB64] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef(null)

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const p = PAYMENT[payMethod]

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setReceiptFile(file)
    const reader = new FileReader()
    reader.onload = ev => {
      setReceiptPreview(ev.target.result)
      setReceiptB64(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!receiptFile) { setErr('Please upload your payment receipt screenshot.'); return }
    setSubmitting(true)
    setErr('')

    const orderId = genId()
    const orderDate = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
    const itemsText = items.map(i => `${i.name} x${i.qty}kg = Rs.${(i.price * i.qty).toLocaleString()}`).join('\n')

    /*
     * ── EmailJS Template Variables ──────────────────────────────────────
     * In your EmailJS template, use these variables:
     *   {{order_id}}  {{order_date}}  {{customer_name}}  {{customer_phone}}
     *   {{customer_email}}  {{customer_city}}  {{customer_address}}
     *   {{customer_notes}}  {{order_items}}  {{order_total}}
     *   {{payment_method}}
     * For the receipt image, add <img src="{{payment_receipt}}" /> in template
     * ────────────────────────────────────────────────────────────────────
     */
    const params = {
      order_id: orderId,
      order_date: orderDate,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email || 'N/A',
      customer_city: form.city,
      customer_address: form.address,
      customer_notes: form.notes || 'None',
      order_items: itemsText,
      order_total: pkr(total),
      payment_method: p.label,
      payment_receipt: receiptB64,
    }

    try {
      await emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, params, EJS_PUBLIC_KEY)
      setSubmitting(false)
      onOrderComplete({ id: orderId, date: orderDate, name: form.name, phone: form.phone, city: form.city, address: form.address, items, total, paymentMethod: p.label })
    } catch (error) {
      setSubmitting(false)
      setErr('Failed to send order. Please contact us on WhatsApp: ' + PHONE_DISPLAY)
      console.error(error)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="w-full max-w-lg max-h-[94vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b sticky top-0"
          style={{ borderColor: 'var(--border)', background: 'var(--card)', zIndex: 1 }}>
          <div>
            <h2 className="font-display font-bold text-xl" style={{ color: 'var(--card-foreground)' }}>Checkout</h2>
            <div className="flex gap-4 mt-1.5">
              {['Your Details', 'Payment & Receipt'].map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{ background: step === i + 1 ? 'var(--primary)' : 'var(--muted)', color: step === i + 1 ? '#fff' : 'var(--muted-foreground)' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </span>
                  <span className="text-xs font-semibold"
                    style={{ color: step === i + 1 ? 'var(--primary)' : 'var(--muted-foreground)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--muted)]"
            style={{ color: 'var(--muted-foreground)', fontSize: 20 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          {/* Order summary */}
          <div className="rounded-xl p-4 border" style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--muted-foreground)' }}>
              {items.length} items — {items.reduce((s, i) => s + i.qty, 0)} kg
            </p>
            <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
              {items.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>{i.name} × {i.qty}kg</span>
                  <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{pkr(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-black" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--foreground)' }}>Total</span>
              <span style={{ color: 'var(--primary)' }}>{pkr(total)}</span>
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="font-display font-bold text-base" style={{ color: 'var(--foreground)' }}>Your Details</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['name', 'Full Name *', 'text', 'Ahmed Ali', true],
                  ['phone', 'WhatsApp / Phone *', 'tel', '+92 300 0000000', true],
                  ['email', 'Email (optional)', 'email', 'you@email.com', true],
                  ['city', 'City / Area *', 'text', 'Karachi, DHA Phase 5', true],
                  ['address', 'Delivery Address *', 'text', 'House 12, Street 4, Block B…', false],
                  ['notes', 'Delivery Notes', 'text', 'Ring bell twice, 3rd floor…', false],
                ].map(([key, label, type, ph, half]) => (
                  <div key={key} className={half ? '' : 'col-span-2'}>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--foreground)' }}>{label}</label>
                    <input type={type} value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={ph}
                      required={key !== 'email' && key !== 'notes'}
                      className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                      style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  </div>
                ))}
              </div>
              {err && <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: '#FEE2E2', color: '#991B1B' }}>⚠️ {err}</div>}
              <button type="button"
                onClick={() => {
                  if (!form.name || !form.phone || !form.city || !form.address) { setErr('Please fill all required fields.'); return }
                  setErr('')
                  setStep(2)
                }}
                className="w-full py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)', color: '#fff' }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="text-sm font-black hover:underline" style={{ color: 'var(--primary)' }}>
                  ← Back
                </button>
                <p className="font-display font-bold text-base" style={{ color: 'var(--foreground)' }}>Payment Method</p>
              </div>

              {/* Payment tabs */}
              <div className="flex gap-2">
                {Object.entries(PAYMENT).map(([key, val]) => (
                  <button key={key} type="button" onClick={() => setPayMethod(key)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black border transition-all"
                    style={{
                      background: payMethod === key ? 'var(--primary)' : 'var(--muted)',
                      color: payMethod === key ? '#fff' : 'var(--muted-foreground)',
                      borderColor: payMethod === key ? 'var(--primary)' : 'var(--border)',
                    }}>
                    {val.label}
                  </button>
                ))}
              </div>

              {/* Payment details */}
              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
                {payMethod === 'hbl' ? (
                  <>
                    <p className="font-black text-sm mb-3" style={{ color: 'var(--primary)' }}>🏦 {p.bank}</p>
                    {[
                      ['Account Title', p.accountTitle],
                      ['Account Number', p.accountNo],
                      ['IBAN', p.iban],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between py-1.5 border-b text-sm" style={{ borderColor: 'var(--border)' }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>{l}</span>
                        <span className="font-mono font-bold" style={{ color: 'var(--foreground)' }}>{v}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="font-black text-sm mb-3" style={{ color: 'var(--primary)' }}>
                      {payMethod === 'jazzcash' ? '💳' : '📱'} {p.label}
                    </p>
                    <div className="flex justify-between py-1.5 border-b text-sm" style={{ borderColor: 'var(--border)' }}>
                      <span style={{ color: 'var(--muted-foreground)' }}>Account Name</span>
                      <span className="font-bold" style={{ color: 'var(--foreground)' }}>{p.name}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm">
                      <span style={{ color: 'var(--muted-foreground)' }}>Mobile Number</span>
                      <span className="font-mono font-black text-lg" style={{ color: 'var(--primary)' }}>{p.number}</span>
                    </div>
                  </>
                )}
                <div className="mt-3 pt-3 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                  <p className="font-black text-2xl" style={{ color: 'var(--primary)' }}>{pkr(total)}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Send exactly this amount</p>
                </div>
              </div>

              {/* Receipt upload */}
              <div>
                <p className="font-display font-bold text-sm mb-1" style={{ color: 'var(--foreground)' }}>Upload Payment Receipt *</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  Screenshot or photo of your payment confirmation.
                </p>
                <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => fileRef.current.click()}
                  className="w-full py-3 rounded-xl border-2 border-dashed font-bold text-sm transition-all hover:bg-[var(--muted)]"
                  style={{
                    borderColor: receiptFile ? 'var(--primary)' : 'var(--border)',
                    color: receiptFile ? 'var(--primary)' : 'var(--muted-foreground)',
                  }}>
                  {receiptFile ? `✅ ${receiptFile.name}` : '📎 Click to upload receipt image'}
                </button>
                {receiptPreview && receiptPreview.startsWith('data:image') && (
                  <img src={receiptPreview} alt="Receipt preview"
                    className="mt-2 rounded-xl w-full object-contain border"
                    style={{ maxHeight: 130, borderColor: 'var(--border)' }} />
                )}
              </div>

              {err && (
                <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                  ⚠️ {err}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-xl font-black text-base transition-all hover:opacity-90"
                style={{
                  background: submitting ? 'var(--muted)' : 'var(--primary)',
                  color: submitting ? 'var(--muted-foreground)' : '#fff',
                }}>
                {submitting ? '⏳ Placing Order…' : `🛒 Place Order · ${pkr(total)}`}
              </button>
              <p className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
                By placing this order you confirm payment of {pkr(total)} via {p.label}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════ */
function Navbar({ dark, onToggleDark, cartCount, onCartOpen, searchQuery, onSearchChange }) {
  const [scrolled, setScrolled] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [activeCat, setActiveCat] = useState(CATS[0])
  const [mobileOpen, setMobileOpen] = useState(false)
  const catRef = useRef(null)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    function outside(e) {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  function doSearch() {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return
    const match = PRODUCTS.find(p => p.name.toLowerCase().includes(q))
    if (match) document.getElementById('cat-' + match.cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Announcement bar */}
      <div style={{ background: '#14532D', color: '#D1FAE5', fontSize: 12, padding: '7px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span>🌿 &nbsp;Free delivery on orders over Rs. 2,000 — Use code: <strong>HERITAGE10</strong></span>
        <span className="hidden sm:flex items-center gap-4 shrink-0">
          <a href={'tel:' + PHONE_DISPLAY} style={{ color: '#D1FAE5', textDecoration: 'none' }}>{PHONE_DISPLAY}</a>
          <span style={{ opacity: .3 }}>|</span>
          <a href={'mailto:' + EMAIL_ADDR} style={{ color: '#D1FAE5', textDecoration: 'none' }}>{EMAIL_ADDR}</a>
        </span>
      </div>

      {/* Logo + Search + Social */}
      <div style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4" style={{ height: 80 }}>
          <HeritageLogo />

          {/* Search */}
          <div className="flex-1 max-w-2xl hidden sm:flex items-center rounded-xl overflow-hidden border"
            style={{ background: 'var(--muted)', borderColor: 'var(--border)', height: 46 }}>
            <select className="text-xs px-3 h-full border-r outline-none bg-transparent font-semibold"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', minWidth: 130 }}>
              <option>All Categories</option>
              {CATS.map(c => <option key={c.id}>{c.label}</option>)}
            </select>
            <input
              className="flex-1 px-4 h-full text-sm outline-none bg-transparent"
              placeholder="Search Aam Achar, Almonds, Jalebi…"
              style={{ color: 'var(--foreground)' }}
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            <button onClick={doSearch}
              className="px-5 h-full font-bold text-sm flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              🔍
            </button>
          </div>

          {/* Social icons — desktop */}
          <div className="hidden lg:flex items-center gap-2 ml-1">
            {[
              { href: 'https://wa.me/' + WHATSAPP_NUM + '?text=Hello%20Heritage%20Foods%20PK', bg: '#25D366', title: 'WhatsApp',
                icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
              { href: FACEBOOK_URL, bg: '#1877F2', title: 'Facebook',
                icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { href: 'mailto:' + EMAIL_ADDR, bg: '#EA4335', title: 'Email',
                icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="white"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> },
              { href: 'tel:' + PHONE_DISPLAY, bg: '#E07830', title: 'Call Us',
                icon: <svg viewBox="0 0 24 24" width="17" height="17" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg> },
            ].map(s => (
              <a key={s.title} href={s.href} target="_blank" rel="noreferrer" title={s.title}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md"
                style={{ background: s.bg }}>
                {s.icon}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={onToggleDark}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
              title={dark ? 'Light mode' : 'Dark mode'}>
              <span style={{ fontSize: 18 }}>{dark ? '☀️' : '🌙'}</span>
            </button>
            <button onClick={onCartOpen}
              className="relative flex items-center gap-2 px-4 h-10 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              <span>🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center font-black"
                  style={{ background: '#22c55e', color: '#fff' }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
              onClick={() => setMobileOpen(m => !m)}>
              <span style={{ fontSize: 20, color: 'var(--foreground)' }}>{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main menu (sticky) */}
      <nav className="sticky top-0 z-50 w-full"
        style={{
          background: scrolled ? (dark ? 'rgba(15,10,6,0.97)' : 'rgba(250,246,241,0.97)') : 'var(--background)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          transition: 'all 0.3s',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-12 gap-1">

          {/* Categories dropdown */}
          <div ref={catRef} className="relative shrink-0">
            <button onClick={() => setCatOpen(o => !o)}
              className="flex items-center gap-2 px-4 h-12 font-black text-sm"
              style={{ background: 'var(--primary)', color: '#fff', borderRadius: 0 }}>
              <span>☰</span><span>Categories</span>
              <span className="text-xs opacity-80 ml-0.5">{catOpen ? '▲' : '▼'}</span>
            </button>

            {catOpen && (
              <div className="absolute top-full left-0 z-50 flex shadow-2xl rounded-b-2xl overflow-hidden"
                style={{ width: 520, background: 'var(--card)', border: '1px solid var(--border)', borderTop: 'none' }}>
                {/* Left: category list */}
                <div className="w-48 shrink-0 py-3 border-r" style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
                  {CATS.map(cat => (
                    <button key={cat.id}
                      onMouseEnter={() => setActiveCat(cat)}
                      onClick={() => { setCatOpen(false); document.getElementById('cat-' + cat.id)?.scrollIntoView({ behavior: 'smooth' }) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left"
                      style={{
                        background: activeCat.id === cat.id ? 'var(--card)' : 'transparent',
                        color: activeCat.id === cat.id ? cat.color : 'var(--secondary-foreground)',
                        borderLeft: '3px solid ' + (activeCat.id === cat.id ? cat.color : 'transparent'),
                        transition: 'all .15s',
                      }}>
                      <span style={{ fontSize: 22 }}>{cat.icon}</span>
                      <span>{cat.short}</span>
                      <span className="ml-auto text-xs opacity-40">›</span>
                    </button>
                  ))}
                </div>
                {/* Right: products list */}
                <div className="flex-1 p-5">
                  <p className="text-[10px] font-black tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: activeCat.color }}>
                    {activeCat.icon} {activeCat.label}
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {PRODUCTS.filter(p => p.cat === activeCat.id).slice(0, 9).map(prod => (
                      <a key={prod.id} href={'#cat-' + activeCat.id}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                        style={{ color: 'var(--card-foreground)' }}>
                        <span style={{ color: activeCat.color, fontSize: 8 }}>●</span>
                        {prod.name}
                      </a>
                    ))}
                  </div>
                  <div className="pt-3 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                    <a href={'#cat-' + activeCat.id} onClick={() => setCatOpen(false)}
                      className="text-xs font-black" style={{ color: activeCat.color }}>
                      View all {PRODUCTS.filter(p => p.cat === activeCat.id).length} {activeCat.short} products →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 mx-2 shrink-0" style={{ background: 'var(--border)' }} />

          {/* Nav links */}
          <div className="hidden lg:flex items-center">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href}
                className="px-4 h-12 flex items-center text-sm font-bold relative group hover:text-[var(--primary)] transition-colors"
                style={{ color: 'var(--foreground)' }}>
                {link.label}
                {link.hot && (
                  <span className="ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#E07830', color: '#fff' }}>HOT</span>
                )}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"
                  style={{ background: 'var(--primary)' }} />
              </a>
            ))}
          </div>

          <div className="ml-auto hidden lg:flex items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            <span>📞 {PHONE_DISPLAY}</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>🕐 Daily: 9am–9pm</span>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t flex flex-col" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
            <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                <input className="flex-1 px-3 py-2.5 text-sm outline-none"
                  placeholder="Search products…"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)} />
                <button onClick={doSearch} className="px-4 py-2.5 text-sm" style={{ background: 'var(--primary)', color: '#fff' }}>🔍</button>
              </div>
            </div>
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
               className="px-3 sm:px-5 py-3 sm:py-4 text-sm font-bold border-b flex items-center justify-between min-h-[52px] active:bg-[var(--muted)]"
                style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                {link.label}
                {link.hot && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#E07830', color: '#fff' }}>HOT</span>}
              </a>
            ))}
            <div className="px-4 py-3 flex flex-wrap gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
              {CATS.map(c => (
                <a key={c.id} href={'#cat-' + c.id} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: c.bg, color: c.color }}>
                  {c.icon} {c.short}
                </a>
              ))}
            </div>
            {/* Mobile socials */}
            <div className="px-4 py-3 flex gap-2">
              {[
                { href: 'https://wa.me/' + WHATSAPP_NUM, bg: '#25D366', label: 'WhatsApp' },
                { href: FACEBOOK_URL, bg: '#1877F2', label: 'Facebook' },
                { href: 'mailto:' + EMAIL_ADDR, bg: '#EA4335', label: 'Email' },
                { href: 'tel:' + PHONE_DISPLAY, bg: '#E07830', label: 'Call' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="flex-1 text-center py-2 rounded-xl text-white text-xs font-black"
                  style={{ background: s.bg }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

/* ══════════════════════════════════════════════
   CATEGORY ICON ROW
   ══════════════════════════════════════════════ */
function CategoryIconRow() {
  return (
   <div
  className="hidden lg:block"
  style={{
    background: 'var(--background)',
    padding: '24px 16px 20px',
    borderBottom: '1px solid var(--border)'
  }}
>
      <p className="text-center text-xs font-black tracking-widest uppercase mb-5" style={{ color: 'var(--muted-foreground)' }}>
        Browse by Category
      </p>
      <div className="max-w-3xl mx-auto flex items-center justify-center gap-8 sm:gap-20">
        {CATS.map(cat => {
          const count = PRODUCTS.filter(p => p.cat === cat.id).length
          return (
            <a key={cat.id} href={'#cat-' + cat.id}
              className="flex flex-col items-center gap-2.5 group cursor-pointer"
              style={{ textDecoration: 'none' }}>
              <div
                className="rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                style={{
                  width: 88, height: 88, fontSize: 40,
                  background: cat.bg,
                  borderColor: cat.color,
                  boxShadow: '0 4px 20px ' + cat.color + '30',
                }}>
                {cat.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-black" style={{ color: 'var(--foreground)' }}>{cat.short}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{count} products</p>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   FLOATING CONTACT BUTTONS
   ══════════════════════════════════════════════ */
function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-3">
      <a
        href={'https://wa.me/' + WHATSAPP_NUM + '?text=Hello%20Heritage%20Foods%20PK%2C%20I%20want%20to%20place%20an%20order'}
        target="_blank" rel="noreferrer"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        style={{ background: '#25D366' }}
        title="WhatsApp Us">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      <a href={'tel:' + PHONE_DISPLAY}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        style={{ background: '#E07830' }}
        title="Call Us">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    </div>
  )
}

/* ══════════════════════════════════════════════
   APP
   ══════════════════════════════════════════════ */
export default function App() {
  const [dark, setDark] = useState(false)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  function addToCart(product, qty) {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
  }
  function updateQty(id, delta) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  }
  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }
  function handleCheckout() { setCartOpen(false); setCheckoutOpen(true) }
  function handleOrderComplete(order) {
    setCheckoutOpen(false)
    setCart([])
    setCompletedOrder(order)
    setReceiptOpen(true)
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div id="top" style={{ background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh' }}>
      <Navbar dark={dark} onToggleDark={() => setDark(d => !d)} cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart}
        onQty={updateQty} onRemove={removeFromCart} onCheckout={handleCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)}
        items={cart} onOrderComplete={handleOrderComplete} />
      <ReceiptModal open={receiptOpen} onClose={() => setReceiptOpen(false)} order={completedOrder} />
      <FloatingButtons />

      {/* ── HERO ── */}
<section
  className="relative overflow-hidden"
  style={{ minHeight: 520 }}
>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1769255484646-16988ad5552d?w=1600&h=650&fit=crop&auto=format"
            alt="Heritage Foods PK" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: dark
              ? 'linear-gradient(135deg,rgba(10,7,4,0.92) 0%,rgba(10,7,4,0.35) 100%)'
              : 'linear-gradient(135deg,rgba(250,246,241,0.94) 0%,rgba(250,246,241,0.2) 100%)'
          }} />
        </div>
       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full mb-5"
              style={{ background: '#14532D', color: '#D1FAE5' }}>
              🌿 Heritage Since 1982 — Pakistan
            </span>
            <h1 className="font-display font-black leading-tight mb-5"
           style={{
  fontSize: 'clamp(1.9rem, 8vw, 3.8rem)',
  color: 'var(--foreground)'
}}>
              Authentic Achar,<br />Dry Fruits &amp;<br />
              <span style={{ color: 'var(--primary)' }}>Pure Mithai</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: 'var(--muted-foreground)' }}>
              Hand-crafted Pakistani pickles, premium dry fruits, and traditional sweets — made with heritage recipes since 1982.
            </p>
         <div className="flex flex-col sm:flex-row gap-3">
              <a href="#specials"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)', color: '#fff' }}>
                Shop Specials 🔥
              </a>
              <a href={'https://wa.me/' + WHATSAPP_NUM} target="_blank" rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: '#25D366', color: '#fff' }}>
                Order on WhatsApp
              </a>
            </div>
            <div className="flex gap-10 mt-10">
              {[['44+', 'Products'], ['3', 'Categories'], ['1,000+', 'Customers']].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display font-black text-2xl" style={{ color: 'var(--primary)' }}>{n}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero category cards */}
         {/* Hero category cards */}
<div className="hidden lg:grid grid-cols-3 gap-3">
  {CATS.map(cat => {
    const img = PRODUCTS.find(p => p.cat === cat.id && p.special)?.img
    return (
      <a key={cat.id} href={'#cat-' + cat.id}
        className="relative rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
        style={{ height: 230 }}>
        <img
          src={img}
          alt={cat.label}
          className="w-full h-full object-cover"
          style={{ background: cat.bg }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top,rgba(0,0,0,0.78) 0%,transparent 55%)'
          }}
        />
        <div className="absolute bottom-0 left-0 p-4">
          <div style={{ fontSize: 30 }}>{cat.icon}</div>
          <p className="font-black text-sm text-white leading-tight mt-1">
            {cat.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#86EFAC' }}>
            {PRODUCTS.filter(p => p.cat === cat.id).length} items
          </p>
        </div>
      </a>
    )
  })}
</div>

</div>
      </section>

      {/* ── PERKS STRIP ── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '🚚', label: 'Free Delivery', sub: 'Orders above Rs. 2,000' },
            { icon: '🫙', label: 'Homemade Achar', sub: 'Traditional recipes' },
            { icon: '✅', label: 'Pure & Halal', sub: 'No preservatives' },
            { icon: '⚡', label: 'Same-Day', sub: 'Order before 2 PM' },
          ].map((f, i) => (
            <div key={f.label} className="flex items-center gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b lg:border-b-0"
              style={{ borderColor: 'var(--border)', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{f.label}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY ICON ROW ── */}
      <CategoryIconRow />

      {/* ── SEARCH RESULTS ── */}
      {searchQuery.trim() && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-xl" style={{ color: 'var(--foreground)' }}>
              Results for &ldquo;{searchQuery}&rdquo; — {searchResults.length} found
            </h2>
            <button onClick={() => setSearchQuery('')} className="text-sm font-black hover:underline" style={{ color: 'var(--primary)' }}>
              Clear ✕
            </button>
          </div>
          {searchResults.length === 0 ? (
            <p style={{ color: 'var(--muted-foreground)' }}>No products found. Try a different keyword.</p>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {searchResults.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} searchQuery={searchQuery} />)}
            </div>
          )}
        </div>
      )}

      {/* ── SPECIAL PRODUCTS ── */}
      <section id="specials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'var(--primary)' }}>Editor Picks</p>
            <h2 className="font-display font-black text-2xl sm:text-3xl sm:text-4xl" style={{ color: 'var(--foreground)' }}>
              Special Products
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              12 hand-picked highlights — 4 from each category
            </p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            🔥 12 Specials
          </span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {SPECIALS.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} searchQuery={searchQuery} />)}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden relative" style={{ minHeight: 165 }}>
          <img src="https://images.unsplash.com/photo-1772986796415-d38ed846bca7?w=1400&h=260&fit=crop&auto=format"
            alt="Premium dry fruits" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(20,83,45,0.95) 0%,rgba(20,83,45,0.65) 60%,transparent 100%)' }} />
          <div className="relative p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: '#86EFAC' }}>This Week</p>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">20% OFF Dry Fruits</h3>
              <p className="text-sm mt-1" style={{ color: '#D1FAE5' }}>Fresh premium stock, direct from farms.</p>
            </div>
            <div className="flex flex-col items-center gap-2.5 shrink-0">
              <p className="font-display font-black text-2xl text-white tracking-wider">DRYFRUIT20</p>
              <a href="#cat-dryfruit"
                className="px-7 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
                style={{ background: '#fff', color: '#14532D' }}>
                Shop Dry Fruits →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALL PRODUCTS BY CATEGORY ── */}
      <div id="products" style={{ paddingTop: 12 }}>
        {CATS.map(cat => {
          const catProds = PRODUCTS.filter(p => p.cat === cat.id)
          return (
            <div key={cat.id}>
              <div id={'cat-' + cat.id}
               className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-4 sm:pb-5 flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-lg"
                  style={{ background: cat.bg, border: '2.5px solid ' + cat.color }}>
                  {cat.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: cat.color }}>{cat.short}</p>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: 'var(--foreground)' }}>{cat.label}</h2>
                </div>
                <span className="ml-auto text-xs px-3 py-1 rounded-full font-black hidden sm:block"
                  style={{ background: cat.bg, color: cat.color }}>
                  {catProds.length} products
                </span>
              </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
             <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                  {catProds.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} searchQuery={searchQuery} />)}
                </div>
              </div>
              <div className="max-w-7xl mx-auto border-b" style={{ borderColor: 'var(--border)' }} />
            </div>
          )
        })}
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1778448806852-db6a837fa98f?w=700&h=500&fit=crop&auto=format"
              alt="Heritage Foods sweets" className="w-full rounded-2xl object-cover"
              style={{ height: 420, background: 'var(--muted)' }} />
            <div className="absolute -bottom-4 -right-4 p-5 rounded-2xl border shadow-xl"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="font-display font-black text-2xl sm:text-3xl" style={{ color: 'var(--primary)' }}>42</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Years of Heritage</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--primary)' }}>Our Story</p>
            <h2 className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'var(--foreground)' }}>
              Bringing Pakistan&rsquo;s<br />Culinary Heritage<br />to Your Home
            </h2>
            <p className="leading-relaxed mb-5" style={{ color: 'var(--muted-foreground)' }}>
              Founded in 1982, Heritage Foods PK has preserved the authentic flavours of Pakistani homes &mdash; from the tangy kick of hand-made Aam Achar to the rich sweetness of Multani Sohan Halwa.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {[
                ['🫙', 'Hand-Crafted Achar', '12 varieties, zero additives'],
                ['🥜', 'Premium Dry Fruits', '20 varieties from top farms'],
                ['🍬', 'Pure Mithai', '12 traditional sweets'],
                ['🚚', 'Fast Delivery', 'Same day across the city'],
              ].map(([icon, title, sub]) => (
                <div key={title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{title}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href={'https://wa.me/' + WHATSAPP_NUM} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black hover:opacity-90 transition-opacity"
              style={{ background: '#25D366', color: '#fff' }}>
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT / NEWSLETTER ── */}
      <section id="contact" style={{ background: 'var(--secondary)', padding: '56px 16px' }}>
        <div className="max-w-xl mx-auto text-center">
          <span style={{ fontSize: 44 }}>📬</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mt-4 mb-3" style={{ color: 'var(--foreground)' }}>
            Stay Connected
          </h2>
          <p className="mb-7" style={{ color: 'var(--muted-foreground)' }}>
            Subscribe for weekly offers, new arrivals, and seasonal deals.
          </p>
          {subscribed ? (
            <div className="px-8 py-4 rounded-xl font-black" style={{ background: '#14532D', color: '#D1FAE5' }}>
              ✓ Subscribed! JazakAllah Khair 🌿
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (emailInput) setSubscribed(true) }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)}
                placeholder="your@email.com" required
                className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              <button type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)', color: '#fff' }}>
                Subscribe
              </button>
            </form>
          )}
          {/* Social contact icons */}
          <div className="flex items-center justify-center gap-5 mt-10">
            {[
              { href: 'https://wa.me/' + WHATSAPP_NUM, bg: '#25D366', icon: '💬', label: 'WhatsApp' },
              { href: FACEBOOK_URL, bg: '#1877F2', icon: '📘', label: 'Facebook' },
              { href: 'mailto:' + EMAIL_ADDR, bg: '#EA4335', icon: '📧', label: 'Email' },
              { href: 'tel:' + PHONE_DISPLAY, bg: '#E07830', icon: '📞', label: 'Call' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                className="flex flex-col items-center gap-1.5 group" style={{ textDecoration: 'none' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110 shadow-lg"
                  style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: dark ? '#080504' : '#1C1008', borderTop: '1px solid #2E1E0F' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <HeritageLogo compact />
            <p className="text-sm leading-relaxed mt-4" style={{ color: '#A07850' }}>
              Authentic Pakistani Achar, premium Dry Fruits, and traditional Mithai — handcrafted since 1982.
            </p>
            <div className="flex gap-2 mt-5">
              {[
                { href: 'https://wa.me/' + WHATSAPP_NUM, bg: '#25D366', l: 'W' },
                { href: FACEBOOK_URL, bg: '#1877F2', l: 'f' },
                { href: 'mailto:' + EMAIL_ADDR, bg: '#EA4335', l: '@' },
                { href: 'tel:' + PHONE_DISPLAY, bg: '#E07830', l: '☎' },
              ].map(s => (
                <a key={s.l} href={s.href} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black hover:opacity-90 transition-opacity text-white"
                  style={{ background: s.bg }}>
                  {s.l}
                </a>
              ))}
            </div>
          </div>
          {[
            {
              title: 'Shop',
              links: CATS.map(c => ({ label: c.label, href: '#cat-' + c.id }))
                .concat([{ label: 'Special Products', href: '#specials' }]),
            },
            {
              title: 'Company',
              links: [
                { label: 'Our Story', href: '#about' },
                { label: 'Wholesale Orders', href: '#contact' },
                { label: 'Recipes Blog', href: '#' },
                { label: 'Careers', href: '#' },
              ],
            },
            {
              title: 'Help',
              links: [
                { label: 'Track Order', href: '#' },
                { label: 'Returns Policy', href: '#' },
                { label: 'Delivery Info', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Contact Us', href: '#contact' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-sm mb-4 text-white">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm hover:text-white transition-colors" style={{ color: '#A07850' }}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ borderTop: '1px solid #2E1E0F', color: '#6B4A2C' }}>
          <span>&copy; 2026 Heritage Foods PK. All rights reserved.</span>
          <div className="flex gap-4">
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors" style={{ color: '#6B4A2C' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
