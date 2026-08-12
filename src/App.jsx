import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'

/* ══════════════════════════════════════════════
   CONFIG
   ══════════════════════════════════════════════ */
const EJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'

const WHATSAPP_NUM  = '923001234567'
const PHONE_DISPLAY = '+92 300 123 4567'
const FACEBOOK_URL  = 'https://facebook.com/heritagefoodspk'
const EMAIL_ADDR    = 'info@heritagefoodspk.com'

const PAYMENT = {
  hbl:      { label: 'HBL Bank Transfer', bank: 'Habib Bank Limited (HBL)', accountTitle: 'Heritage Foods PK', accountNo: 'XXXX-XXXX-XXXXXXXX', iban: 'PK00HABB0000000000000000' },
  jazzcash:  { label: 'JazzCash',  number: '0300-XXXXXXX', name: 'Heritage Foods PK' },
  easypaisa: { label: 'EasyPaisa', number: '0300-XXXXXXX', name: 'Heritage Foods PK' },
}

const pkr   = (n) => 'Rs. ' + Number(n).toLocaleString('en-PK')
const genId = () => 'HFP-' + Math.random().toString(36).slice(2, 8).toUpperCase()

const SCRIPT = "'Dancing Script', cursive"
const SERIF  = "'Playfair Display', serif"

/* ══════════════════════════════════════════════
   CATEGORIES
   ══════════════════════════════════════════════ */
const CATS = [
  { id: 'achar',    label: 'Achar (Pickles)',           short: 'Achar',      icon: '🫙', color: '#B91C1C', bg: '#FEF2F2' },
  { id: 'dryfruit', label: 'Dry Fruits, Nuts & Seeds',  short: 'Dry Fruits', icon: '🥜', color: '#92400E', bg: '#FFFBEB' },
  { id: 'sweets',   label: 'Sweets, Halwa & Murabba',   short: 'Sweets',     icon: '🍬', color: '#86198F', bg: '#FDF4FF' },
]

/* ══════════════════════════════════════════════
   PRODUCTS  (achar a1-a12, dryfruit d1-d20, sweets t1-t15)
   ══════════════════════════════════════════════ */
const PRODUCTS = [
  /* ─── ACHAR (12) ─── */
  { id:1,  name:'Imli (Tamarind) Achar',      cat:'achar',    price:380,  badge:null,           special:false, img:'/a1.jpg' },
  { id:2,  name:'Lasora (Cordia) Achar',       cat:'achar',    price:420,  badge:null,           special:false, img:'/a2.jpg' },
  { id:3,  name:'Sabaz Mirch (Green Chili)',   cat:'achar',    price:350,  badge:'Popular 🌶',     special:true,  img:'/a3.jpg',  sImg:'/s1.jpg' },
  { id:4,  name:'Lahsun (Garlic) Achar',       cat:'achar',    price:520,  badge:null,      special:false,  img:'/a4.jpg' },
  { id:5,  name:'Piyaz (Onion) Achar',         cat:'achar',    price:320,  badge:null,           special:false, img:'/a5.jpg' },
  { id:6,  name:'Aam (Mango) Achar',           cat:'achar',    price:650,  badge:'Bestseller',   special:true,  img:'/a6.jpg',  sImg:'/s4.jpg' },
  { id:7,  name:'Nimbu (Lemon) Achar',         cat:'achar',    price:400,  badge:null,           special:true, img:'/a7.jpg' ,  sImg:'/s7.jpg' },
  { id:8,  name:'Gajar (Carrot) Achar',        cat:'achar',    price:360,  badge:'Organic',      special:true, img:'/a8.jpg' ,  sImg:'/s10.jpg'},
  { id:9,  name:'Lal Mirch (Red Chili) Achar', cat:'achar',    price:480,  badge:'Extra Hot',    special:true,  img:'/a9.jpg' },
  { id:10, name:'Amla (Gooseberry) Achar',     cat:'achar',    price:550,  badge:'Healthy',      special:false, img:'/a10.jpg' },
  { id:11, name:'Mix (Mixed Veg) Achar',       cat:'achar',    price:450,  badge:'Chef Mix',     special:false, img:'/a11.jpg' },
  { id:12, name:'Adrak (Ginger) Achar',        cat:'achar',    price:500,  badge:'New',          special:false, img:'/a12.jpg' },

  /* ─── DRY FRUITS (20) ─── */
  { id:13, name:'Anjeer (Figs)',               cat:'dryfruit', price:1800, badge:'Premium',      special:true,  img:'/d1.jpg',   sImg:'/s2.jpg' },
  { id:14, name:'Khajoor (Dates)',             cat:'dryfruit', price:950,  badge:'Bestseller',   special:true,  img:'/d2.jpg',  sImg:'/s11.jpg' },
  { id:15, name:'Kishmish (Raisins)',          cat:'dryfruit', price:850,  badge:null,           special:false, img:'/d3.jpg' },
  { id:16, name:'Khubani (Dried Apricots)',    cat:'dryfruit', price:1200, badge:null,           special:true, img:'/d4.jpg' , sImg:'/s5.jpg'},
  { id:17, name:'Aloo Bukhara (Prunes)',       cat:'dryfruit', price:1100, badge:null,           special:false, img:'/d5.jpg' },
  { id:18, name:'Badam (Almonds)',             cat:'dryfruit', price:2800, badge:'Popular',      special:true,  img:'/d6.jpg' },
  { id:19, name:'Akhrot (Walnut)',             cat:'dryfruit', price:2200, badge:null,           special:true, img:'/d7.jpg' ,  sImg:'/s8.jpg'},
  { id:20, name:'Kaju (Cashew)',               cat:'dryfruit', price:2400, badge:null,           special:false, img:'/d8.jpg' },
  { id:21, name:'Pista (Pistachio)',           cat:'dryfruit', price:3500, badge:'Premium',      special:true,  img:'/d9.jpg' },
  { id:22, name:'Chilgoza (Pine Nuts)',        cat:'dryfruit', price:5500, badge:'Rare',         special:false, img:'/d10.jpg' },
  { id:23, name:'Mungphali (Peanuts)',         cat:'dryfruit', price:380,  badge:null,           special:false, img:'/d11.jpg' },
  { id:24, name:'Hazelnuts',                   cat:'dryfruit', price:1600, badge:null,           special:false, img:'/d12.jpg' },
  { id:25, name:'Brazil Nuts',                 cat:'dryfruit', price:2100, badge:'Imported',     special:false, img:'/d13.jpg' },
  { id:26, name:'Til (Sesame Seeds)',          cat:'dryfruit', price:450,  badge:null,           special:false, img:'/d14.jpg' },
  { id:27, name:'Pumpkin Seeds',               cat:'dryfruit', price:680,  badge:null,           special:false, img:'/d15.jpg' },
  { id:28, name:'Sunflower Seeds',             cat:'dryfruit', price:520,  badge:null,           special:false, img:'/d16.jpg' },
  { id:29, name:'Alsi (Flax Seeds)',           cat:'dryfruit', price:380,  badge:'Healthy',      special:false, img:'/d17.jpg' },
  { id:30, name:'Chia Seeds',                  cat:'dryfruit', price:1200, badge:null,           special:false, img:'/d18.jpg' },
  { id:31, name:'Macadamia Nuts',              cat:'dryfruit', price:4200, badge:'Imported',     special:false, img:'/d19.jpg' },
  { id:32, name:'Mixed Dried Berries',         cat:'dryfruit', price:1800, badge:'New',          special:false, img:'/d20.jpg' },

  /* ─── SWEETS & MURABBA (15) ─── */
  { id:33, name:'Multani Sohan Halwa',         cat:'sweets',   price:950,  badge:'Famous',       special:true,  img:'/t1.jpg',  sImg:'/s3.jpg' },
  { id:34, name:"Khushab's Dodha Halwa",       cat:'sweets',   price:850,  badge:'Traditional',  special:true, img:'/t2.jpg' , sImg:'/s9.jpg' },
  { id:35, name:'Mianwali Desi Ghee Halwa',    cat:'sweets',   price:1100, badge:'Pure Ghee',    special:false, img:'/t3.jpg' },
  { id:36, name:'Gajar (Carrot) ka Halwa',     cat:'sweets',   price:750,  badge:'Seasonal',     special:true, img:'/t4.jpg' ,  sImg:'/s12.jpg'},
  { id:37, name:'Sooji (Semolina) ka Halwa',   cat:'sweets',   price:480,  badge:null,           special:false, img:'/t5.jpg' },
  { id:38, name:'Moong Dal ka Halwa',          cat:'sweets',   price:820,  badge:'Rich',         special:false, img:'/t6.jpg' },
  { id:39, name:'Gulab Jamun',                 cat:'sweets',   price:580,  badge:'Bestseller',   special:true,  img:'/t7.jpg',  sImg:'/s6.jpg' },
  { id:40, name:'Jalebi',                      cat:'sweets',   price:420,  badge:'Fresh Daily',  special:true,  img:'/t8.jpg' },
  { id:41, name:'Barfi (Pista / Coconut)',     cat:'sweets',   price:950,  badge:'Gift Ready',   special:false, img:'/t9.jpg' },
  { id:42, name:'Kaju Katli',                  cat:'sweets',   price:1800, badge:'Premium',      special:true,  img:'/t10.jpg' },
  { id:43, name:'Motichoor Laddoo',            cat:'sweets',   price:650,  badge:null,           special:false, img:'/t11.jpg' },
  { id:44, name:'Patisa / Sohan Papdi',        cat:'sweets',   price:720,  badge:'Light',        special:false, img:'/t12.jpg' },
  { id:45, name:'Aam (Mango) Murabba',         cat:'sweets',   price:580,  badge:'Traditional',  special:false, img:'/t13.jpg' },
  { id:46, name:'Amla Murabba',                cat:'sweets',   price:620,  badge:'Healthy',      special:false, img:'/t14.jpg' },
  { id:47, name:'Karela Murabba',              cat:'sweets',   price:550,  badge:'Medicinal',    special:false, img:'/t15.jpg' },
]

/* Interleaved specials: 4 from each category cycling achar→dryfruit→sweets */
const _acharsS = PRODUCTS
  .filter(p => p.cat === 'achar' && p.special)
  .slice(0, 4)

const _dryS = PRODUCTS
  .filter(p => p.cat === 'dryfruit' && p.special)
  .slice(0, 4)

const _sweetsS = PRODUCTS
  .filter(p => p.cat === 'sweets' && p.special)
  .slice(0, 4)

const INTERLEAVED_SPECIALS = []

for (let i = 0; i < 4; i++) {
  if (_acharsS[i]) INTERLEAVED_SPECIALS.push(_acharsS[i])
  if (_dryS[i]) INTERLEAVED_SPECIALS.push(_dryS[i])
  if (_sweetsS[i]) INTERLEAVED_SPECIALS.push(_sweetsS[i])
}

const NAV_LINKS = [
  { label: 'Home',             href: '#top' },
  { label: 'Special Products', href: '#specials', hot: true },
  { label: 'Our Story',        href: '#about' },
  { label: 'Reviews',          href: '#feedback' },
  { label: 'Contact',          href: '#contact' },
]

/* ══════════════════════════════════════════════
   REVIEW SYSTEM (localStorage)
   ══════════════════════════════════════════════ */
function getReviewData(productId) {
  try {
    const s = localStorage.getItem('hfpk_r_' + productId)
    if (s) return JSON.parse(s)
  } catch(e) {}
  return { totalStars: 25, count: 5, hasReviewed: false, userStars: 0 }
}

function saveProductReview(productId, stars) {
  const curr = getReviewData(productId)
  if (curr.hasReviewed) return curr
  const updated = { totalStars: curr.totalStars + stars, count: curr.count + 1, hasReviewed: true, userStars: stars }
  try { localStorage.setItem('hfpk_r_' + productId, JSON.stringify(updated)) } catch(e) {}
  return updated
}

function avgRating(data) {
  return (data.totalStars / data.count).toFixed(1)
}

/* ══════════════════════════════════════════════
   FEEDBACK SYSTEM (localStorage)
   ══════════════════════════════════════════════ */
const INITIAL_FEEDBACKS = [
  { id:1,  name:'Fatima Malik',     stars:5, date:'15 Jan 2026', text:"Absolutely love the Aam Achar! Tastes exactly like my dadi's recipe — pure homemade flavor, zero artificial taste. Already on my third order!" },
  { id:2,  name:'Ahmad Raza',       stars:5, date:'18 Jan 2026', text:'Khajoor quality is outstanding — fresh, soft, perfectly sweet. Best dates I have ever ordered online. Fast delivery and perfect packaging!' },
  { id:3,  name:'Sara Khan',        stars:5, date:'22 Jan 2026', text:'Multani Sohan Halwa was absolutely divine! Reminded me of my childhood visits to Multan. Authentic taste, perfect texture. Heritage Foods never disappoints!' },
  { id:4,  name:'Usman Ali',        stars:4, date:'25 Jan 2026', text:'Badam and Pista mix — freshness is unmatched! You can instantly tell these are premium quality nuts. Became a regular customer from day one.' },
  { id:5,  name:'Zainab Hussain',   stars:5, date:'28 Jan 2026', text:'Gulab Jamun are absolutely amazing — soft, melt-in-your-mouth perfection. Ordered for Eid and every single guest asked where I bought them!' },
  { id:6,  name:'Hassan Nawaz',     stars:5, date:'2 Feb 2026',  text:'Lahsun Achar has changed my life! I put it on literally everything. Perfectly marinated garlic, spice is just right. MashAllah, truly incredible.' },
  { id:7,  name:'Ayesha Tariq',     stars:5, date:'5 Feb 2026',  text:'Mixed dry fruits order arrived beautifully packaged. Everything is fresh and of premium quality. Heritage Foods sets the standard in Pakistan!' },
  { id:8,  name:'Bilal Cheema',     stars:4, date:'8 Feb 2026',  text:'Kaju Katli is restaurant quality at a home price! Smooth, rich, perfectly made. My family finished the entire box within an hour. Ordered again the same day!' },
  { id:9,  name:'Nadia Iqbal',      stars:5, date:'11 Feb 2026', text:'Jalebi is crispy, perfectly sweet — honestly the best I have had outside a proper halwai. Fresh daily delivery means you get it at absolute peak freshness!' },
  { id:10, name:'Tariq Mahmood',    stars:5, date:'14 Feb 2026', text:'Been ordering from Heritage Foods for 6 months now. Consistent quality every single time. Aam Achar is pure magic in a jar. Cannot imagine eating without it!' },
  { id:11, name:'Saba Yousuf',      stars:5, date:'17 Feb 2026', text:'Ordered Sohan Halwa for my parents and they loved it so much they asked me to place another order the very same week. Truly heritage quality!' },
  { id:12, name:'Kamran Sheikh',    stars:4, date:'20 Feb 2026', text:'Anjeer quality is premium — soft, plump, naturally sweet. Far better than local market options. Great value for the quality you receive!' },
  { id:13, name:'Huma Asif',        stars:5, date:'23 Feb 2026', text:'Everything from Heritage Foods feels made with love. Lal Mirch Achar has the perfect heat and incredibly deep authentic flavor. Highly recommended!' },
  { id:14, name:'Imran Siddiqui',   stars:5, date:'26 Feb 2026', text:'Gajar ka Halwa tastes EXACTLY like my mother used to make! Rich, ghee-infused, perfectly sweet. Thank you for preserving these precious recipes!' },
  { id:15, name:'Rabia Farooq',     stars:5, date:'1 Mar 2026',  text:'Chilgoza (pine nuts) are absolutely fresh and high quality — you can taste the difference from anything in local markets. Simply outstanding!' },
  { id:16, name:'Omer Khurshid',    stars:4, date:'4 Mar 2026',  text:'Excellent packaging, lightning-fast delivery, and amazing product quality. Nimbu Achar is tangy, spicy and delicious — perfect with biryani!' },
  { id:17, name:'Mariam Bajwa',     stars:5, date:'7 Mar 2026',  text:'Was looking for authentic Pakistani sweets online and Heritage Foods exceeded every expectation. The Barfi selection is absolutely outstanding!' },
  { id:18, name:'Faisal Qureshi',   stars:5, date:'10 Mar 2026', text:'My grandmother tried the Dodha Halwa and said it is the closest to authentic Khushab taste she has had in years. That says absolutely everything!' },
  { id:19, name:'Lubna Mirza',      stars:5, date:'13 Mar 2026', text:'Kishmish are plump, sweet and perfect for baking. Always buy my dry fruits from Heritage Foods now — consistently excellent quality every time!' },
  { id:20, name:'Waqas Anwar',      stars:4, date:'16 Mar 2026', text:'Mix Achar is a brilliant combination of vegetables perfectly marinated together. Goes amazingly well with daal and roti. Reordering this week!' },
  { id:21, name:'Asma Shahid',      stars:5, date:'19 Mar 2026', text:'Chia Seeds and Flax Seeds are super fresh! Use them in my smoothies daily. Heritage Foods quality is unmatched for health products too — truly excellent!' },
  { id:22, name:'Rizwan Butt',      stars:5, date:'22 Mar 2026', text:'Honestly the best online food store in Pakistan. Everything from achar to dry fruits is premium quality. Heritage Foods has earned a loyal lifelong customer!' },
  { id:23, name:'Kiran Latif',      stars:5, date:'25 Mar 2026', text:'Moong Dal Halwa is incredibly rich and authentic. Perfect for special occasions. Ordered for a dinner party and every guest asked for the recipe!' },
  { id:24, name:'Shahid Gul',       stars:4, date:'28 Mar 2026', text:'Walnut quality is superb — fresh, perfectly dried, full of flavor, not bitter at all. Will keep buying all my dry fruits from Heritage Foods!' },
  { id:25, name:'Noor Fatima',      stars:5, date:'31 Mar 2026', text:'Aam Murabba is amazing for health and taste both. My kids actually love it! Sweet, tangy, authentically made. Heritage quality guaranteed every time!' },
  { id:26, name:'Adnan Malik',      stars:5, date:'3 Apr 2026',  text:'Sunflower and Pumpkin seeds are excellent quality — perfect for snacking. Heritage Foods makes healthy eating so much more enjoyable and accessible!' },
  { id:27, name:'Sana Rehman',      stars:5, date:'6 Apr 2026',  text:'Pista quality is the best I have found anywhere in Pakistan — bright green, perfectly salted, absolutely fresh. Premium quality at a great price!' },
  { id:28, name:'Junaid Aslam',     stars:4, date:'9 Apr 2026',  text:'Ordered 3 different achars and all were fantastic! Imli Achar is my personal favorite — perfect balance of sweet and tangy. Absolutely brilliant!' },
  { id:29, name:'Tooba Hassan',     stars:5, date:'12 Apr 2026', text:'Aam Murabba is an absolute delight — sweet, perfectly preserved mango in light syrup. My family loves it for breakfast with paratha. Pure perfection!' },
  { id:30, name:'Zubair Ahmad',     stars:5, date:'15 Apr 2026', text:'Heritage Foods truly lives up to its name. The Sohan Halwa is world class! MashAllah, keep it up!' },
]

function getFeedbacks() {
  try {
    const s = localStorage.getItem('hfpk_feedbacks')
    if (s) return JSON.parse(s)
  } catch(e) {}
  return INITIAL_FEEDBACKS
}

function addFeedback(name, text, stars) {
  const list = getFeedbacks()
  const entry = { id: Date.now(), name, stars, date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }), text }
  const updated = [entry, ...list].slice(0, 100)
  try { localStorage.setItem('hfpk_feedbacks', JSON.stringify(updated)) } catch(e) {}
  return updated
}

/* ══════════════════════════════════════════════
   STARS
   ══════════════════════════════════════════════ */
function Stars({ n, size = 12 }) {
  const score = parseFloat(n) || 0
  return (
    <span style={{ display: 'flex', gap: 1, fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= score ? '#E07830' : '#D1B99A' }}>★</span>
      ))}
    </span>
  )
}

function InteractiveStars({ value, onChange, size = 24 }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          style={{ fontSize: size, color: i <= (hovered || value) ? '#E07830' : '#D1B99A', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, transition: 'color .1s' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════
   LOGO
   ══════════════════════════════════════════════ */
function HeritageLogo({ compact = false }) {
  const sz = compact ? 44 : 56
  return (
    <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
      <img
        src="/logo1.jpg"
        alt="Heritage Foods PK Logo"
        style={{ width: sz, height: sz, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #14532D', boxShadow: '0 2px 10px rgba(20,83,45,.25)', flexShrink: 0 }}
        onError={e => {
          const el = e.currentTarget
          el.style.display = 'none'
          const next = el.nextElementSibling
          if (next) next.style.display = 'flex'
        }}
      />
      <div style={{ display: 'none', width: sz, height: sz, borderRadius: '50%', background: '#14532D', alignItems: 'center', justifyContent: 'center', fontSize: sz * 0.55, flexShrink: 0 }}>🌿</div>
      <div>
        <div style={{ fontSize: compact ? 18 : 22, lineHeight: 1.1, color: 'var(--foreground)', fontFamily: SCRIPT, fontWeight: 700, letterSpacing: '0.01em' }}>
          Heritage Foods
        </div>
        <div style={{ fontSize: compact ? 9 : 11, fontWeight: 900, letterSpacing: '0.22em', color: '#D97706', marginTop: 2, fontFamily: 'Inter, sans-serif' }}>
          PK ✦ Lahore
        </div>
      </div>
    </a>
  )
}

/* ══════════════════════════════════════════════
   REVIEW MODAL
   ══════════════════════════════════════════════ */
function ReviewModal({ product, onClose }) {
  const [reviewData, setReviewData] = useState(() => getReviewData(product.id))
  const [selected, setSelected] = useState(0)
  const [submitted, setSubmitted] = useState(reviewData.hasReviewed)

  function handleSubmit() {
    if (!selected) return
    const updated = saveProductReview(product.id, selected)
    setReviewData(updated)
    setSubmitted(true)
  }

  const avg = avgRating(reviewData)

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.72)' }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--card)' }} onClick={e => e.stopPropagation()}>
        <div style={{ background: '#14532D', padding: '24px 20px 18px' }}>
          <div className="flex items-center justify-between">
            <h3 style={{ fontFamily: SERIF, fontWeight: 900, color: '#fff', fontSize: 18 }}>Product Reviews</h3>
            <button onClick={onClose} style={{ color: '#86EFAC', fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
          </div>
          <p style={{ color: '#D1FAE5', fontSize: 13, marginTop: 4 }}>{product.name}</p>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5 p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
            <div className="text-center">
              <div style={{ fontFamily: SERIF, fontSize: 36, fontWeight: 900, color: '#E07830', lineHeight: 1 }}>{avg}</div>
              <Stars n={parseFloat(avg)} size={14} />
              <div style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 3 }}>{reviewData.count} reviews</div>
            </div>
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map(s => {
                const inGroup = Math.max(0, reviewData.count - (s < 5 ? Math.round(reviewData.count * (5 - s) * 0.08) : 0))
                const pct = Math.round((inGroup / reviewData.count) * 100)
                return (
                  <div key={s} className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: 10, color: 'var(--muted-foreground)', width: 8 }}>{s}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div style={{ width: pct + '%', height: '100%', background: '#E07830', borderRadius: 4, transition: 'width .4s' }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--muted-foreground)', width: 24 }}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {submitted ? (
            <div className="text-center p-4 rounded-xl" style={{ background: '#ECFDF5', border: '2px solid #86EFAC' }}>
              <div style={{ fontSize: 32 }}>✅</div>
              <p style={{ fontFamily: SERIF, fontWeight: 700, color: '#14532D', marginTop: 6 }}>Thank you for your review!</p>
              {reviewData.hasReviewed && reviewData.userStars > 0 && (
                <div className="flex justify-center mt-2">
                  <Stars n={reviewData.userStars} size={18} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 14, color: 'var(--foreground)', fontWeight: 700, marginBottom: 12 }}>Rate this product:</p>
              <div className="flex justify-center mb-5">
                <InteractiveStars value={selected} onChange={setSelected} size={32} />
              </div>
              {selected > 0 && (
                <p className="text-center mb-3" style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][selected]}
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className="w-full py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
                style={{ background: selected ? 'var(--primary)' : 'var(--muted)', color: selected ? '#fff' : 'var(--muted-foreground)', cursor: selected ? 'pointer' : 'not-allowed' }}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   PRODUCT CARD
   ══════════════════════════════════════════════ */
function ProductCard({ product, onAdd, searchQuery, useSpecialImg = false }) {
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [added, setAdded] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [reviewData, setReviewData] = useState(() => getReviewData(product.id))

  const cat = CATS.find(c => c.id === product.cat)
  const isMatch = searchQuery && searchQuery.trim().length > 0 &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  const imgSrc = useSpecialImg && product.sImg ? product.sImg : product.img
  const avg = avgRating(reviewData)

  function handleAdd() {
    onAdd(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      {reviewOpen && (
        <ReviewModal
          product={product}
          onClose={() => {
            setReviewOpen(false)
            setReviewData(getReviewData(product.id))
          }}
        />
      )}
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
        <div className="relative overflow-hidden shrink-0 h-[105px] sm:h-[135px] lg:h-[160px]" style={{ background: cat.bg }}>
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          {product.special && (
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ background: '#E07830', color: '#fff' }}>⭐</div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-2 sm:p-3 gap-1.5">
          <span className="text-[8px] sm:text-[10px] font-black tracking-wide uppercase px-1.5 sm:px-2 py-0.5 rounded-full w-fit max-w-full truncate"
            style={{ background: cat.bg, color: cat.color }}>
            {cat.icon} {cat.short}
          </span>
          <h3 className="font-semibold text-[11px] sm:text-sm leading-tight line-clamp-2 min-h-[28px] sm:min-h-[40px]"
            style={{ color: 'var(--card-foreground)', fontFamily: SERIF }}>
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="font-black text-[12px] sm:text-base" style={{ color: 'var(--primary)', fontFamily: SERIF }}>{pkr(product.price)}</span>
            <span className="text-[9px] sm:text-[11px]" style={{ color: 'var(--muted-foreground)' }}>/kg</span>
          </div>

          <button
            onClick={() => setReviewOpen(true)}
            className="flex items-center gap-1 min-w-0 w-fit group/rev"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <Stars n={parseFloat(avg)} />
            <span className="text-[9px] sm:text-[11px] group-hover/rev:underline" style={{ color: 'var(--muted-foreground)' }}>
              {avg} ({reviewData.count})
            </span>
          </button>

          <div className="mt-auto pt-2 flex flex-col gap-2">
            <div className="flex justify-center">
              <div className="flex items-center rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center font-black text-base hover:bg-[var(--muted)] transition-colors"
                  style={{ color: 'var(--foreground)' }}>−</button>
                <span className="w-7 sm:w-6 text-center text-sm font-bold" style={{ color: 'var(--foreground)' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center font-black text-base hover:bg-[var(--muted)] transition-colors"
                  style={{ color: 'var(--foreground)' }}>+</button>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="w-full py-2 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-all duration-200 active:scale-[0.97]"
              style={{ background: added ? '#16a34a' : 'var(--primary)', color: '#fff' }}
            >
              {added ? '✓ Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   SPECIALS CAROUSEL — horizontal with arrows
   ══════════════════════════════════════════════ */
function SpecialsCarousel({ onAdd, searchQuery }) {
 const trackRef = useRef(null)
 const CARD_W = 180
const GAP = 10

  function scroll(dir) {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: dir * (CARD_W + GAP) * 3, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: 'var(--primary)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: GAP,
          overflowX: 'auto',
          scrollbarWidth: 'none',
         paddingLeft: 38,
paddingRight: 38,
          paddingBottom: 8,
          scrollSnapType: 'x mandatory',
        }}
      >
        <style>{`.specials-track::-webkit-scrollbar{display:none}`}</style>
        {INTERLEAVED_SPECIALS.map(p => (
          <div
  key={p.id}
  style={{
    width: '180px',
    minWidth: '180px',
    scrollSnapAlign: 'start',
    flexShrink: 0,
  }}
>
            <ProductCard product={p} onAdd={onAdd} searchQuery={searchQuery} useSpecialImg={true} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{ background: 'var(--primary)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)' }}
        aria-label="Next"
      >
        ›
      </button>
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
      {open && <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />}
      <div
        className="fixed top-0 right-0 h-full z-50 w-full max-w-sm flex flex-col transition-transform duration-300"
        style={{ background: 'var(--card)', borderLeft: '1px solid var(--border)', transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-bold text-xl" style={{ color: 'var(--card-foreground)', fontFamily: SERIF }}>Your Cart</h2>
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
            <p className="font-bold text-lg" style={{ color: 'var(--card-foreground)', fontFamily: SERIF }}>Cart is empty</p>
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
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0" style={{ background: 'var(--muted)' }}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={e => { e.currentTarget.style.display = 'none' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--card-foreground)' }}>{item.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{pkr(item.price)}/kg</p>
                    <div className="flex items-center justify-between mt-2">
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
                  <button onClick={() => onRemove(item.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg self-start hover:bg-red-50"
                    style={{ color: '#DC2626', fontSize: 17 }}>🗑</button>
                </div>
              ))}
            </div>
            <div className="p-5 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between font-black text-xl mb-4" style={{ color: 'var(--card-foreground)', fontFamily: SERIF }}>
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
    w.document.write(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Heritage Foods PK — Receipt #${order.id}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#FAF6F1;display:flex;justify-content:center;padding:24px;color:#1C1008}.receipt{width:480px;background:#fff;border:2px solid #DDD0C0;border-radius:18px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12)}.header{background:#14532D;color:#fff;text-align:center;padding:30px 24px 22px}.logo-icon{font-size:44px;margin-bottom:6px}.brand{font-size:30px;font-weight:900;letter-spacing:1px}.sub{font-size:11px;letter-spacing:3px;color:#86EFAC;margin-top:3px}.badge{background:#E07830;color:#fff;display:inline-block;padding:5px 20px;border-radius:20px;font-weight:800;font-size:12px;margin-top:14px;letter-spacing:1.5px}.order-meta{color:#86EFAC;font-size:12px;margin-top:8px;opacity:.85}.section{padding:16px 22px;border-bottom:1px dashed #DDD0C0}.section:last-of-type{border-bottom:none}.sec-title{font-size:9px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase;color:#7A5C44;margin-bottom:10px}.row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;align-items:flex-start}.name{color:#1C1008;flex:1;padding-right:12px}.price{color:#C85A18;font-weight:800;white-space:nowrap}.total-row{display:flex;justify-content:space-between;font-size:17px;font-weight:900;padding:6px 0}.total-price{color:#C85A18}.notice{background:linear-gradient(135deg,#ECFDF5,#F0FFF4);border:2px solid #86EFAC;border-radius:12px;padding:14px;text-align:center;margin:16px 22px}.notice p{font-size:13px;color:#14532D;font-weight:700;margin:4px 0;line-height:1.5}.footer{background:#1C1008;color:#A07850;text-align:center;padding:18px 24px;font-size:11px;line-height:1.8}.footer strong{color:#86EFAC}@media print{body{background:#fff;padding:0}.receipt{border:none;border-radius:0;box-shadow:none;width:100%}}</style></head>
<body><div class="receipt"><div class="header"><div class="logo-icon">🌿</div><div class="brand">HERITAGE FOODS</div><div class="sub">PK ✦ EST. 1982</div><div class="badge">ORDER RECEIPT</div><div class="order-meta">Order #${order.id} &nbsp;|&nbsp; ${order.date}</div></div>
<div class="section"><div class="sec-title">Customer Details</div><div class="row"><span class="name">Full Name</span><span>${order.name}</span></div><div class="row"><span class="name">Phone / WhatsApp</span><span>${order.phone}</span></div><div class="row"><span class="name">City</span><span>${order.city}</span></div><div class="row"><span class="name">Delivery Address</span><span style="text-align:right;max-width:55%">${order.address}</span></div></div>
<div class="section"><div class="sec-title">Order Items</div>${itemsHTML}</div>
<div class="section"><div class="total-row"><span>Total Amount</span><span class="total-price">Rs. ${order.total.toLocaleString()}</span></div><div class="row" style="margin-top:8px"><span class="name" style="color:#7A5C44">Payment Method</span><span style="font-weight:700">${order.paymentMethod}</span></div></div>
<div class="notice"><p>✅ Your order will be delivered within <strong>1 hour</strong></p><p>📞 Our team will contact you within <strong>10 minutes</strong></p></div>
<div class="footer"><p>Thank you for choosing <strong>Heritage Foods PK!</strong></p><p>WhatsApp: ${PHONE_DISPLAY} &nbsp;|&nbsp; ${EMAIL_ADDR}</p><p style="margin-top:6px;font-size:10px;opacity:.55">This is your official order confirmation. Keep it for reference.</p></div></div>
<script>window.onload=()=>{window.print()}<\/script></body></html>`)
    w.document.close()
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--card)' }}>
        <div style={{ background: '#14532D', padding: '28px 24px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>🌿</div>
          <div className="font-black text-white text-2xl mt-2" style={{ fontFamily: SERIF }}>Order Confirmed!</div>
          <div style={{ background: '#E07830', color: '#fff', display: 'inline-block', padding: '4px 18px', borderRadius: 20, fontSize: 12, fontWeight: 900, marginTop: 12, letterSpacing: 1.5 }}>#{order.id}</div>
        </div>
        <div className="p-6">
          <div className="rounded-xl p-4 mb-5 text-center" style={{ background: '#ECFDF5', border: '2px solid #86EFAC' }}>
            <p className="font-bold text-sm" style={{ color: '#14532D' }}>✅ Delivered within <strong>1 hour</strong></p>
            <p className="font-bold text-sm mt-1" style={{ color: '#14532D' }}>📞 We will contact you within <strong>10 minutes</strong></p>
          </div>
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
    reader.onload = ev => { setReceiptPreview(ev.target.result); setReceiptB64(ev.target.result) }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!receiptFile) { setErr('Please upload your payment receipt screenshot.'); return }
    setSubmitting(true); setErr('')
    const orderId = genId()
    const orderDate = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })
    const itemsText = items.map(i => `${i.name} x${i.qty}kg = Rs.${(i.price * i.qty).toLocaleString()}`).join('\n')
    const params = { order_id: orderId, order_date: orderDate, customer_name: form.name, customer_phone: form.phone, customer_email: form.email || 'N/A', customer_city: form.city, customer_address: form.address, customer_notes: form.notes || 'None', order_items: itemsText, order_total: pkr(total), payment_method: p.label, payment_receipt: receiptB64 }
    try {
      await emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, params, EJS_PUBLIC_KEY)
      setSubmitting(false)
      onOrderComplete({ id: orderId, date: orderDate, name: form.name, phone: form.phone, city: form.city, address: form.address, items, total, paymentMethod: p.label })
    } catch(error) {
      setSubmitting(false)
      setErr('Failed to send order. Please contact us on WhatsApp: ' + PHONE_DISPLAY)
    }
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="w-full max-w-lg max-h-[94vh] overflow-y-auto rounded-2xl shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between p-5 border-b sticky top-0" style={{ borderColor: 'var(--border)', background: 'var(--card)', zIndex: 1 }}>
          <div>
            <h2 className="font-bold text-xl" style={{ color: 'var(--card-foreground)', fontFamily: SERIF }}>Checkout</h2>
            <div className="flex gap-4 mt-1.5">
              {['Your Details', 'Payment & Receipt'].map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                    style={{ background: step === i + 1 ? 'var(--primary)' : 'var(--muted)', color: step === i + 1 ? '#fff' : 'var(--muted-foreground)' }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: step === i + 1 ? 'var(--primary)' : 'var(--muted-foreground)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--muted)]" style={{ color: 'var(--muted-foreground)', fontSize: 20 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          <div className="rounded-xl p-4 border" style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--muted-foreground)' }}>{items.length} items — {items.reduce((s, i) => s + i.qty, 0)} kg</p>
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

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <p className="font-bold text-base" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>Your Details</p>
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
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                      required={key !== 'email' && key !== 'notes'}
                      className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                      style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                  </div>
                ))}
              </div>
              {err && <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: '#FEE2E2', color: '#991B1B' }}>⚠️ {err}</div>}
              <button type="button"
                onClick={() => { if (!form.name || !form.phone || !form.city || !form.address) { setErr('Please fill all required fields.'); return } setErr(''); setStep(2) }}
                className="w-full py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)', color: '#fff' }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setStep(1)} className="text-sm font-black hover:underline" style={{ color: 'var(--primary)' }}>← Back</button>
                <p className="font-bold text-base" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>Payment Method</p>
              </div>
              <div className="flex gap-2">
                {Object.entries(PAYMENT).map(([key, val]) => (
                  <button key={key} type="button" onClick={() => setPayMethod(key)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black border transition-all"
                    style={{ background: payMethod === key ? 'var(--primary)' : 'var(--muted)', color: payMethod === key ? '#fff' : 'var(--muted-foreground)', borderColor: payMethod === key ? 'var(--primary)' : 'var(--border)' }}>
                    {val.label}
                  </button>
                ))}
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
                {payMethod === 'hbl' ? (
                  <>
                    <p className="font-black text-sm mb-3" style={{ color: 'var(--primary)' }}>🏦 {p.bank}</p>
                    {[['Account Title', p.accountTitle], ['Account Number', p.accountNo], ['IBAN', p.iban]].map(([l, v]) => (
                      <div key={l} className="flex justify-between py-1.5 border-b text-sm" style={{ borderColor: 'var(--border)' }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>{l}</span>
                        <span className="font-mono font-bold" style={{ color: 'var(--foreground)' }}>{v}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <p className="font-black text-sm mb-3" style={{ color: 'var(--primary)' }}>{payMethod === 'jazzcash' ? '💳' : '📱'} {p.label}</p>
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
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>Upload Payment Receipt *</p>
                <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Screenshot or photo of your payment confirmation.</p>
                <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
                <button type="button" onClick={() => fileRef.current.click()}
                  className="w-full py-3 rounded-xl border-2 border-dashed font-bold text-sm transition-all hover:bg-[var(--muted)]"
                  style={{ borderColor: receiptFile ? 'var(--primary)' : 'var(--border)', color: receiptFile ? 'var(--primary)' : 'var(--muted-foreground)' }}>
                  {receiptFile ? `✅ ${receiptFile.name}` : '📎 Click to upload receipt image'}
                </button>
                {receiptPreview && receiptPreview.startsWith('data:image') && (
                  <img src={receiptPreview} alt="Receipt preview" className="mt-2 rounded-xl w-full object-contain border" style={{ maxHeight: 130, borderColor: 'var(--border)' }} />
                )}
              </div>
              {err && <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: '#FEE2E2', color: '#991B1B' }}>⚠️ {err}</div>}
              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-xl font-black text-base transition-all hover:opacity-90"
                style={{ background: submitting ? 'var(--muted)' : 'var(--primary)', color: submitting ? 'var(--muted-foreground)' : '#fff' }}>
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
  const [mobileCatId, setMobileCatId] = useState(null)
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

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function doSearch() {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return
    const match = PRODUCTS.find(p => p.name.toLowerCase().includes(q))
    if (match) document.getElementById('cat-' + match.cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Announcement bar */}
      <div style={{ background: '#14532D', color: '#D1FAE5', fontSize: 12, padding: '7px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontFamily: 'Inter, sans-serif' }}>
        <span>🌿 &nbsp;Free delivery on orders over Rs. 2,000 — Code: <strong>HERITAGE10</strong></span>
        <span className="hidden sm:flex items-center gap-4 shrink-0">
          <a href={'tel:' + PHONE_DISPLAY} style={{ color: '#D1FAE5', textDecoration: 'none' }}>{PHONE_DISPLAY}</a>
          <span style={{ opacity: .3 }}>|</span>
          <a href={'mailto:' + EMAIL_ADDR} style={{ color: '#D1FAE5', textDecoration: 'none' }}>{EMAIL_ADDR}</a>
        </span>
      </div>

      {/* Logo + Search + Social row */}
      <div style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4" style={{ height: 80 }}>
          <HeritageLogo />

          <div className="flex-1 max-w-2xl hidden sm:flex items-center rounded-xl overflow-hidden border"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', height: 46, boxShadow: '0 2px 8px rgba(0,0,0,.05)' }}>
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
              onClick={() => setMobileOpen(m => !m)}
              aria-label="Toggle menu">
              <span style={{ fontSize: 20, color: 'var(--foreground)' }}>{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky nav bar */}
      <nav className="sticky top-0 z-50 w-full"
        style={{
          background: scrolled ? (dark ? 'rgba(28,16,8,0.97)' : 'rgba(250,246,241,0.97)') : 'var(--background)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          transition: 'all 0.3s',
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-12 gap-1">

          <div ref={catRef} className="relative shrink-0">
            <button
              onClick={() => setCatOpen(o => !o)}
              className="flex items-center gap-2 px-4 h-12 font-black text-sm transition-all"
              style={{ background: catOpen ? '#0F3D1E' : '#14532D', color: '#fff', borderRadius: 0 }}
            >
              <span>☰</span>
              <span>All Categories</span>
              <span className="text-xs opacity-80 ml-0.5">{catOpen ? '▲' : '▼'}</span>
            </button>

            {catOpen && (
              <div
                className="absolute top-full left-0 z-50 shadow-2xl rounded-b-2xl overflow-hidden"
                style={{ width: 560, background: 'var(--card)', border: '1px solid var(--border)', borderTop: 'none', animation: 'fadeInDown .18s ease' }}
              >
                <style>{`@keyframes fadeInDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
                <div className="flex">
                  <div className="w-52 shrink-0 py-2 border-r" style={{ borderColor: 'var(--border)', background: 'var(--secondary)' }}>
                    <p className="px-4 pt-2 pb-3 text-[9px] font-black tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>Browse Categories</p>
                    {CATS.map(cat => (
                      <button key={cat.id}
                        onMouseEnter={() => setActiveCat(cat)}
                        onClick={() => { setCatOpen(false); setTimeout(() => document.getElementById('cat-' + cat.id)?.scrollIntoView({ behavior: 'smooth' }), 80) }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-left"
                        style={{
                          background: activeCat.id === cat.id ? 'var(--card)' : 'transparent',
                          color: activeCat.id === cat.id ? cat.color : 'var(--secondary-foreground)',
                          borderLeft: '3px solid ' + (activeCat.id === cat.id ? cat.color : 'transparent'),
                          transition: 'all .12s',
                        }}>
                        <span style={{ fontSize: 22 }}>{cat.icon}</span>
                        <div>
                          <div>{cat.short}</div>
                          <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 500 }}>{PRODUCTS.filter(p => p.cat === cat.id).length} products</div>
                        </div>
                        <span className="ml-auto text-xs opacity-40">›</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 p-4">
                    <p className="text-[10px] font-black tracking-widest uppercase mb-3 flex items-center gap-2" style={{ color: activeCat.color }}>
                      {activeCat.icon} {activeCat.label}
                    </p>
                    <div className="grid grid-cols-2 gap-0.5">
                      {PRODUCTS.filter(p => p.cat === activeCat.id).slice(0, 10).map(prod => (
                        <a key={prod.id} href={'#cat-' + activeCat.id}
                          onClick={() => setCatOpen(false)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
                          style={{ color: 'var(--card-foreground)', textDecoration: 'none' }}>
                          <span style={{ color: activeCat.color, fontSize: 8 }}>●</span>
                          <span className="truncate">{prod.name}</span>
                        </a>
                      ))}
                    </div>
                    <div className="pt-3 mt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                      <a href={'#cat-' + activeCat.id} onClick={() => setCatOpen(false)}
                        className="text-xs font-black hover:underline" style={{ color: activeCat.color, textDecoration: 'none' }}>
                        View all {PRODUCTS.filter(p => p.cat === activeCat.id).length} {activeCat.short} products →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 mx-2 shrink-0" style={{ background: 'var(--border)' }} />

          <div className="hidden lg:flex items-center">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href}
                className="px-4 h-12 flex items-center text-sm font-bold relative group hover:text-[var(--primary)] transition-colors"
                style={{ color: 'var(--foreground)', textDecoration: 'none' }}>
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
            <span>🕐 Daily: 9am – 9pm</span>
          </div>
        </div>

        {/* Mobile full-screen menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 top-[calc(80px+32px)] z-40 flex flex-col overflow-y-auto" style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
            <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                <input className="flex-1 px-3 py-3 text-sm outline-none" placeholder="Search products…"
                  style={{ background: 'var(--muted)', color: 'var(--foreground)' }}
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { doSearch(); setMobileOpen(false) } }} />
                <button onClick={() => { doSearch(); setMobileOpen(false) }} className="px-4 text-sm font-black" style={{ background: 'var(--primary)', color: '#fff' }}>🔍</button>
              </div>
            </div>

            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                className="px-5 py-4 text-sm font-bold border-b flex items-center justify-between min-h-[52px] active:bg-[var(--muted)]"
                style={{ color: 'var(--foreground)', borderColor: 'var(--border)', textDecoration: 'none' }}>
                {link.label}
                {link.hot && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: '#E07830', color: '#fff' }}>HOT</span>}
              </a>
            ))}

            <div className="border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="px-5 py-3 text-[9px] font-black tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>Shop by Category</p>
              {CATS.map(c => (
                <div key={c.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => setMobileCatId(id => id === c.id ? null : c.id)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 font-bold text-sm"
                    style={{ color: c.color, background: mobileCatId === c.id ? c.bg : 'transparent' }}
                  >
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <span>{c.label}</span>
                    <span className="ml-auto text-xs opacity-50">{mobileCatId === c.id ? '▲' : '▼'}</span>
                  </button>
                  {mobileCatId === c.id && (
                    <div className="pb-2 px-4" style={{ background: c.bg }}>
                      <div className="grid grid-cols-2 gap-1">
                        {PRODUCTS.filter(p => p.cat === c.id).map(prod => (
                          <a key={prod.id} href={'#cat-' + c.id}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                            style={{ color: c.color, textDecoration: 'none', background: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ fontSize: 7 }}>●</span>
                            <span className="truncate">{prod.name}</span>
                          </a>
                        ))}
                      </div>
                      <a href={'#cat-' + c.id} onClick={() => setMobileOpen(false)}
                        className="block mt-2 text-center py-2 rounded-lg text-xs font-black"
                        style={{ background: c.color, color: '#fff', textDecoration: 'none' }}>
                        View all {PRODUCTS.filter(p => p.cat === c.id).length} {c.short} →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-4 py-4 flex gap-2">
              {[
                { href: 'https://wa.me/' + WHATSAPP_NUM, bg: '#25D366', label: 'WhatsApp' },
                { href: FACEBOOK_URL, bg: '#1877F2', label: 'Facebook' },
                { href: 'mailto:' + EMAIL_ADDR, bg: '#EA4335', label: 'Email' },
                { href: 'tel:' + PHONE_DISPLAY, bg: '#E07830', label: 'Call' },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="flex-1 text-center py-2.5 rounded-xl text-white text-xs font-black"
                  style={{ background: s.bg, textDecoration: 'none' }}>
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
    <div className="hidden lg:block" style={{ background: 'var(--background)', padding: '24px 16px 20px', borderBottom: '1px solid var(--border)' }}>
      <p className="text-center text-xs font-black tracking-widest uppercase mb-5" style={{ color: 'var(--muted-foreground)' }}>Browse by Category</p>
      <div className="max-w-3xl mx-auto flex items-center justify-center gap-8 sm:gap-20">
        {CATS.map(cat => {
          const count = PRODUCTS.filter(p => p.cat === cat.id).length
          return (
            <a key={cat.id} href={'#cat-' + cat.id}
              className="flex flex-col items-center gap-2.5 group cursor-pointer"
              style={{ textDecoration: 'none' }}>
              <div
                className="rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
                style={{ width: 88, height: 88, fontSize: 40, background: cat.bg, borderColor: cat.color, boxShadow: '0 4px 20px ' + cat.color + '30' }}>
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
   FLOATING BUTTONS
   ══════════════════════════════════════════════ */
function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-3">
      <a href={'https://wa.me/' + WHATSAPP_NUM + '?text=Hello%20Heritage%20Foods%20PK%2C%20I%20want%20to%20place%20an%20order'}
        target="_blank" rel="noreferrer"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        style={{ background: '#25D366' }} title="WhatsApp Us">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a href={'tel:' + PHONE_DISPLAY}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
        style={{ background: '#E07830' }} title="Call Us">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
      </a>
    </div>
  )
}

/* ══════════════════════════════════════════════
   FEEDBACK CAROUSEL
   ══════════════════════════════════════════════ */
function FeedbackCarousel({ feedbacks }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame
    let pos = 0
    const speed = 0.5

    function tick() {
      pos += speed
      if (pos >= track.scrollWidth / 2) pos = 0
      track.scrollLeft = pos
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    track.addEventListener('mouseenter', () => cancelAnimationFrame(frame))
    track.addEventListener('mouseleave', () => { frame = requestAnimationFrame(tick) })
    return () => cancelAnimationFrame(frame)
  }, [feedbacks.length])

  const doubled = [...feedbacks, ...feedbacks]

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div
        ref={trackRef}
        style={{ display: 'flex', gap: 16, overflowX: 'hidden', paddingBottom: 8, scrollbarWidth: 'none' }}
      >
        {doubled.map((fb, idx) => (
          <div key={idx} className="shrink-0 rounded-2xl p-5 border"
            style={{ width: 280, background: 'var(--card)', borderColor: 'var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
            <div className="flex items-center gap-1 mb-3">
              <Stars n={fb.stars} size={13} />
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--foreground)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              &ldquo;{fb.text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ background: '#14532D', color: '#86EFAC' }}>
                  {fb.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{fb.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{fb.date}</p>
                </div>
              </div>
              <span style={{ fontSize: 18 }}>✅</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   WHY HERITAGE FOODS SECTION
   ══════════════════════════════════════════════ */
function WhyHeritageFoods() {
  const reasons = [
    { icon: '🫙', title: 'Handcrafted with Love', desc: 'Every jar of achar, every batch of halwa is prepared by skilled artisans following century-old family recipes passed down through generations.' },
    { icon: '🌿', title: 'Zero Preservatives', desc: 'We use only natural spices, pure mustard oil, and traditional techniques. No artificial colors, no chemicals — just honest, pure food.' },
    { icon: '🥜', title: 'Directly from Farms', desc: 'Our dry fruits, nuts, and seeds are sourced directly from the finest farms in Balochistan, Gilgit-Baltistan, and Khyber Pakhtunkhwa.' },
    { icon: '🍬', title: 'Heritage Recipes', desc: 'The same beloved recipes that delighted families for generations are alive today in every bite of our Sohan Halwa, Gulab Jamun, and Murabba.' },
    { icon: '📦', title: 'Safe & Hygienic Packaging', desc: 'Products are packed in food-grade, air-tight containers ensuring maximum freshness, hygiene, and a long shelf life without compromise.' },
    { icon: '⚡', title: 'Same-Day Delivery', desc: 'Order before 2 PM and receive your products the same day. We deliver with care, ensuring everything arrives in perfect condition at your door.' },
  ]

  return (
    <section style={{ background: 'var(--secondary)', padding: '72px 16px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: 'var(--primary)' }}>Our Difference</p>
          <h2 style={{ fontFamily: SCRIPT, fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#14532D', fontWeight: 700, lineHeight: 1.2 }}>
            Why Choose Heritage Foods?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base" style={{ color: 'var(--muted-foreground)' }}>
            In a world of shortcuts, we choose the longer, purer path — because you and your family deserve nothing less than the authentic taste of Pakistan.
          </p>
          <div className="w-24 h-1 mx-auto mt-5 rounded-full" style={{ background: 'linear-gradient(to right, #14532D, #E07830)' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div key={i} className="rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ background: '#ECFDF5', border: '2px solid #86EFAC' }}>
                {r.icon}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>{r.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl overflow-hidden relative" style={{ height: 240 }}>
          <img
            src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1400&h=480&fit=crop&auto=format"
            alt="Why Heritage Foods"
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(20,83,45,0.88) 0%, rgba(20,83,45,0.55) 100%)' }}>
            <div className="text-center text-white p-6">
              <div style={{ fontFamily: SCRIPT, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, color: '#86EFAC' }}>
                Taste the Difference
              </div>
              <p className="mt-2 text-sm" style={{ color: '#D1FAE5' }}>Over 1,000 happy families trust Heritage Foods PK</p>
              <a href={'https://wa.me/' + WHATSAPP_NUM} target="_blank" rel="noreferrer"
                className="inline-block mt-4 px-6 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
                style={{ background: '#E07830', color: '#fff', textDecoration: 'none' }}>
                Order Now on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   QUALITY PROMISE SECTION
   ══════════════════════════════════════════════ */
function QualityPromise() {
  const promises = [
    { icon: '🔬', label: '100% Natural', desc: 'No artificial ingredients or preservatives ever' },
    { icon: '🌱', label: 'Farm Fresh', desc: 'Sourced from verified premium farms across Pakistan' },
    { icon: '🫙', label: 'Traditional Recipes', desc: 'Authentic methods perfected over many decades' },
    { icon: '✅', label: 'Quality Tested', desc: 'Every batch checked for freshness and taste before dispatch' },
  ]

  return (
    <section style={{ background: 'var(--background)', padding: '72px 16px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="/quality-promise.jpg"
              alt="Quality Promise"
              className="w-full rounded-2xl object-cover shadow-2xl"
              style={{ height: 420 }}
              onError={e => { e.currentTarget.style.background = '#ECFDF5' }}
            />
            <div className="absolute -bottom-4 -right-4 p-5 rounded-2xl border shadow-xl"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div style={{ fontFamily: SCRIPT, fontSize: 28, color: 'var(--primary)', fontWeight: 700 }}>47+</div>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Premium Products</p>
            </div>
            <div className="absolute top-4 left-4 px-4 py-2 rounded-xl font-black text-xs" style={{ background: '#14532D', color: '#D1FAE5' }}>
              🌿 Quality Guaranteed
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--primary)' }}>Our Commitment</p>
            <h2 style={{ fontFamily: SCRIPT, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#14532D', fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
              Our Quality Promise to You
            </h2>
            <p className="leading-relaxed mb-7" style={{ color: 'var(--muted-foreground)', fontSize: 15 }}>
              At Heritage Foods PK, quality is not just a word — it is our founding principle. We maintain the same exacting standards in every product we craft: handpicked achars, premium nuts sourced directly from farm to your table, and traditional sweets prepared with pure desi ghee and authentic spices. Every item that leaves our kitchen is personally tasted and approved.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {promises.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{p.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#ECFDF5', border: '2px solid #86EFAC' }}>
              <span style={{ fontSize: 28 }}>🏆</span>
              <p className="text-sm font-bold" style={{ color: '#14532D' }}>
                Trusted by 1,000+ families across Pakistan with a 4.9★ average rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   FAQ SECTION
   ══════════════════════════════════════════════ */
function FAQSection() {
  const [open, setOpen] = useState(null)

  const faqs = [
    {
      q: 'How can I place an order?',
      a: "You can place an order directly on our website by browsing products, adding them to cart, and checking out. Alternatively, you can message us on WhatsApp at " + PHONE_DISPLAY + " and our team will assist you personally with your order.",
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'We offer multiple secure payment options including HBL Bank Transfer, JazzCash, and EasyPaisa. Available payment methods and their details are clearly shown during the checkout process. We aim to add more options soon for maximum convenience.',
    },
    {
      q: 'How long does delivery take?',
      a: 'For local city orders placed before 2:00 PM, we offer same-day delivery within 1–2 hours. Our team will contact you within 10 minutes of order confirmation. For orders to other cities, delivery is typically within 1–3 business days via TCS or Leopards Courier.',
    },
    {
      q: 'Are your products preservative-free and Halal?',
      a: 'Absolutely. All Heritage Foods PK products are 100% Halal, made with pure natural ingredients, traditional spices, and pure mustard or desi ghee. We never use artificial preservatives, colors, or flavor enhancers. What you get is exactly what your grandmother would have made.',
    },
    {
      q: 'Can I return or exchange a product?',
      a: 'Yes! If you receive a damaged, incorrect, or unsatisfactory product, please contact us within 24 hours of delivery via WhatsApp at ' + PHONE_DISPLAY + '. We will arrange a replacement or refund promptly. Customer satisfaction is our top priority.',
    },
    {
      q: 'Do you offer bulk or wholesale orders?',
      a: 'Yes, we welcome bulk and wholesale orders for families, events, restaurants, and businesses. Please contact us on WhatsApp or email us at ' + EMAIL_ADDR + ' with your requirements and we will provide a custom quote with special wholesale pricing.',
    },
  ]

  return (
    <section style={{ background: 'var(--secondary)', padding: '72px 16px' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: 'var(--primary)' }}>Got Questions?</p>
          <h2 style={{ fontFamily: SCRIPT, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#14532D', fontWeight: 700, lineHeight: 1.2 }}>
            Frequently Asked Questions
          </h2>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(to right, #14532D, #E07830)' }} />
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
              <button
                onClick={() => setOpen(o => o === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-sm sm:text-base"
                style={{ color: 'var(--foreground)' }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: 18, color: 'var(--primary)', transition: 'transform .2s', transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)', flexShrink: 0, marginLeft: 12 }}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-5" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-sm leading-relaxed pt-4" style={{ color: 'var(--muted-foreground)' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center p-6 rounded-2xl" style={{ background: '#14532D' }}>
          <p className="text-white font-bold mb-2" style={{ fontFamily: SERIF }}>Still have a question?</p>
          <p className="text-sm mb-4" style={{ color: '#D1FAE5' }}>We are here to help! Message us on WhatsApp anytime.</p>
          <a href={'https://wa.me/' + WHATSAPP_NUM + '?text=Hello%20I%20have%20a%20question%20about%20Heritage%20Foods%20PK'}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
            style={{ background: '#25D366', color: '#fff', textDecoration: 'none' }}>
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   FEEDBACK SECTION
   ══════════════════════════════════════════════ */
function FeedbackSection({ feedbacks, onAddFeedback }) {
  const [stars, setStars] = useState(0)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [err, setErr] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!stars) { setErr('Please select a star rating.'); return }
    if (stars >= 4 && !name.trim()) { setErr('Please enter your name.'); return }
    if (stars >= 4 && !text.trim()) { setErr('Please write your feedback.'); return }
    if (stars >= 4) {
      onAddFeedback(name.trim(), text.trim(), stars)
      setSubmitted(true)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <section id="feedback" style={{ background: 'var(--background)', padding: '72px 16px' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: 'var(--primary)' }}>Customer Love</p>
          <h2 style={{ fontFamily: SCRIPT, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#14532D', fontWeight: 700, lineHeight: 1.2 }}>
            What Our Customers Say
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Real experiences from real Heritage Foods PK customers across Pakistan
          </p>
          <div className="w-20 h-1 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(to right, #14532D, #E07830)' }} />
        </div>

        <FeedbackCarousel feedbacks={feedbacks} />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="font-bold text-xl mb-2" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>Share Your Experience</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Tried Heritage Foods PK? We would love to hear from you!
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl text-center" style={{ background: '#ECFDF5', border: '2px solid #86EFAC' }}>
                <div style={{ fontSize: 48 }}>🌿</div>
                <h4 className="font-black text-xl mt-3" style={{ color: '#14532D', fontFamily: SERIF }}>JazakAllah Khair!</h4>
                <p className="text-sm mt-2" style={{ color: '#166534' }}>Thank you for your valuable feedback. It means the world to us!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: 'var(--foreground)' }}>Your Rating *</label>
                  <InteractiveStars value={stars} onChange={setStars} size={36} />
                  {stars > 0 && (
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                      {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent — Please write a review below!'][stars]}
                    </p>
                  )}
                </div>

                {stars >= 4 && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>Your Name *</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ahmed Ali"
                        className="w-full px-4 py-3 rounded-xl text-sm border outline-none"
                        style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>Your Feedback *</label>
                      <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
                        placeholder="Share your experience with Heritage Foods PK…"
                        className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none"
                        style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                    </div>
                  </>
                )}

                {err && <p className="text-xs font-bold px-3 py-2 rounded-lg" style={{ background: '#FEE2E2', color: '#991B1B' }}>⚠️ {err}</p>}

                <button type="submit" disabled={!stars}
                  className="w-full py-3.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
                  style={{ background: stars ? 'var(--primary)' : 'var(--muted)', color: stars ? '#fff' : 'var(--muted-foreground)', cursor: stars ? 'pointer' : 'not-allowed' }}>
                  {stars >= 4 ? 'Submit Feedback' : stars > 0 ? 'Submit Rating' : 'Select a rating first'}
                </button>
              </form>
            )}
          </div>

          <div>
            <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h4 className="font-bold text-lg mb-4" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>Overall Ratings</h4>
              <div className="flex items-center gap-4 mb-5 p-4 rounded-xl" style={{ background: 'var(--secondary)' }}>
                <div className="text-center">
                  <div style={{ fontFamily: SCRIPT, fontSize: 44, fontWeight: 700, color: '#14532D', lineHeight: 1 }}>4.9</div>
                  <Stars n={5} size={16} />
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Average rating</p>
                </div>
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map(s => {
                    const pcts = [72, 22, 4, 1, 1]
                    const pct = pcts[5 - s]
                    return (
                      <div key={s} className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs w-3" style={{ color: 'var(--muted-foreground)' }}>{s}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div style={{ width: pct + '%', height: '100%', background: s >= 4 ? '#14532D' : s === 3 ? '#E07830' : '#DC2626', borderRadius: 4 }} />
                        </div>
                        <span className="text-xs w-6 text-right" style={{ color: 'var(--muted-foreground)' }}>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '👥', val: '1,000+', label: 'Happy Customers' },
                  { icon: '📦', val: '5,000+', label: 'Orders Delivered' },
                  { icon: '⭐', val: '4.9', label: 'Average Rating' },
                  { icon: '🔄', val: '92%', label: 'Repeat Customers' },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
                    <div style={{ fontSize: 22 }}>{s.icon}</div>
                    <div className="font-black text-lg" style={{ color: '#14532D', fontFamily: SERIF }}>{s.val}</div>
                    <p className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
  const [feedbacks, setFeedbacks] = useState(() => getFeedbacks())
  const [heroImg, setHeroImg] = useState(0)

  const heroImages = ['/h1.jpg', '/h2.jpg', '/h3.jpg', '/h4.jpg', '/h5.jpg']

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(t)
  }, [])

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
  function handleOrderComplete(order) { setCheckoutOpen(false); setCart([]); setCompletedOrder(order); setReceiptOpen(true) }

  function handleAddFeedback(name, text, stars) {
    const updated = addFeedback(name, text, stars)
    setFeedbacks(updated)
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

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden" style={{ minHeight: 580 }}>
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div key={src} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: heroImg === i ? 1 : 0 }}>
              <img
                src={src}
                alt="Heritage Foods PK"
                className="w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&h=650&fit=crop&auto=format'
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0" style={{
            background: dark
              ? 'linear-gradient(135deg,rgba(10,7,4,0.93) 0%,rgba(10,7,4,0.4) 100%)'
              : 'linear-gradient(135deg,rgba(250,246,241,0.95) 0%,rgba(250,246,241,0.25) 100%)'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
           

            <div style={{ fontFamily: SCRIPT, fontSize: 'clamp(2.8rem, 9vw, 5.5rem)', fontWeight: 700, color: '#14532D', lineHeight: 1.05, marginBottom: 4 }}>
              Heritage Foods
            </div>
            <div style={{ fontFamily: SCRIPT, fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', fontWeight: 600, color: 'var(--primary)', marginBottom: 18, letterSpacing: '0.02em' }}>
              A Legacy of Pure Taste
            </div>

            <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: 'var(--muted-foreground)', maxWidth: 480 }}>
              <span style={{ color: '#B91C1C', fontWeight: 700 }}>✦ Handcrafted Achar</span>
              {' · '}
              <span style={{ color: '#92400E', fontWeight: 700 }}>Premium Dry Fruits</span>
              {' · '}
              <span style={{ color: '#92400E', fontWeight: 700 }}>Exotic Nuts & Seeds</span>
              {' · '}
              <span style={{ color: '#86198F', fontWeight: 700 }}>Traditional Sweets & Murabba</span>
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted-foreground)', maxWidth: 440 }}>
              Where every jar, every bite, every sweet morsel carries the warmth of a Pakistani home — made with love, served with pride.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#specials"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-all text-center"
                style={{ background: 'var(--primary)', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 20px rgba(224,120,48,.4)' }}>
                Shop Specials 🔥
              </a>
              <a href={'https://wa.me/' + WHATSAPP_NUM} target="_blank" rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-all flex items-center justify-center gap-2"
                style={{ background: '#25D366', color: '#fff', textDecoration: 'none', boxShadow: '0 4px 20px rgba(37,211,102,.35)' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order on WhatsApp
              </a>
            </div>

            <div className="flex gap-10 mt-10">
              {[['47+', 'Products'], ['3', 'Categories'], ['1,000+', 'Customers'], ['4.9★', 'Rating']].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="font-black text-xl sm:text-2xl" style={{ color: '#14532D', fontFamily: SERIF }}>{n}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-3 gap-3">
            {CATS.map(cat => {
              const img = PRODUCTS.find(p => p.cat === cat.id && p.special)
              return (
                <a key={cat.id} href={'#cat-' + cat.id}
                  className="relative rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                  style={{ height: 240, textDecoration: 'none' }}>
                  <div className="w-full h-full flex items-center justify-center" style={{ background: cat.bg, fontSize: 80 }}>
                    {img ? (
                      <img src={img.img} alt={cat.label} className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.style.display = 'none' }} />
                    ) : cat.icon}
                  </div>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 55%)' }} />
                  <div className="absolute bottom-0 left-0 p-4">
                    <div style={{ fontSize: 30 }}>{cat.icon}</div>
                    <p className="font-black text-sm text-white leading-tight mt-1" style={{ fontFamily: SERIF }}>{cat.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#86EFAC' }}>{PRODUCTS.filter(p => p.cat === cat.id).length} items →</p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroImg(i)}
              style={{ width: heroImg === i ? 24 : 8, height: 8, borderRadius: 4, background: heroImg === i ? '#E07830' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all .3s', padding: 0 }} />
          ))}
        </div>
      </section>

      {/* ══ PERKS STRIP ══ */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '🚚', label: 'Free Delivery',  sub: 'Orders above Rs. 2,000' },
            { icon: '🫙', label: 'Homemade Achar', sub: 'Traditional recipes' },
            { icon: '✅', label: 'Pure & Halal',   sub: 'No preservatives' },
            { icon: '⚡', label: 'Same-Day',        sub: 'Order before 2 PM' },
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

      {/* ══ CATEGORY ICON ROW ══ */}
      <CategoryIconRow />

      {/* ══ SEARCH RESULTS ══ */}
      {searchQuery.trim() && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-xl" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>
              Results for &ldquo;{searchQuery}&rdquo; — {searchResults.length} found
            </h2>
            <button onClick={() => setSearchQuery('')} className="text-sm font-black hover:underline" style={{ color: 'var(--primary)' }}>
              Clear ✕
            </button>
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-10">
              <div style={{ fontSize: 48 }}>🔍</div>
              <p className="mt-3 font-bold" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>No results found</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Try searching for "Achar", "Badam", "Halwa", "Dates" etc.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
              {searchResults.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} searchQuery={searchQuery} />)}
            </div>
          )}
        </div>
      )}

      {/* ══ SPECIAL PRODUCTS ══ */}
      <section id="specials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: 'var(--primary)' }}>Editor Picks</p>
            <h2 className="font-black text-2xl sm:text-3xl" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>Special Products</h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>12 hand-picked highlights — 4 from each category</p>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            🔥 12 Specials
          </span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
          <SpecialsCarousel onAdd={addToCart} searchQuery={searchQuery} />
        </div>
      </section>

      {/* ══ PROMO BANNER ══ */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden relative" style={{ minHeight: 165 }}>
          <img src="/h2.jpg" alt="Premium dry fruits"
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1772986796415-d38ed846bca7?w=1400&h=260&fit=crop&auto=format' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,rgba(20,83,45,0.95) 0%,rgba(20,83,45,0.65) 60%,transparent 100%)' }} />
          <div className="relative p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: '#86EFAC' }}>This Week</p>
              <h3 className="font-black text-2xl sm:text-3xl text-white" style={{ fontFamily: SERIF }}>20% OFF Dry Fruits</h3>
              <p className="text-sm mt-1" style={{ color: '#D1FAE5' }}>Fresh premium stock, direct from farms.</p>
            </div>
            <div className="flex flex-col items-center gap-2.5 shrink-0">
              <p className="font-black text-2xl text-white tracking-wider" style={{ fontFamily: SERIF }}>DRYFRUIT20</p>
              <a href="#cat-dryfruit"
                className="px-7 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
                style={{ background: '#fff', color: '#14532D', textDecoration: 'none' }}>
                Shop Dry Fruits →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══ ALL PRODUCTS BY CATEGORY ══ */}
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
                  <h2 className="font-bold text-2xl sm:text-3xl" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>{cat.label}</h2>
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

      {/* ══ OUR STORY ══ */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1778448806852-db6a837fa98f?w=700&h=500&fit=crop&auto=format"
              alt="Heritage Foods sweets" className="w-full rounded-2xl object-cover"
              style={{ height: 420, background: 'var(--muted)' }}
              onError={e => { e.currentTarget.style.background = '#ECFDF5' }} />
            <div className="absolute -bottom-4 -right-4 p-5 rounded-2xl border shadow-xl"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="font-black text-2xl sm:text-3xl" style={{ color: 'var(--primary)', fontFamily: SCRIPT }}>47+</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Authentic Products</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: 'var(--primary)' }}>Our Story</p>
            <h2 className="font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'var(--foreground)', fontFamily: SCRIPT }}>
              Bringing Pakistan&rsquo;s<br />Culinary Heritage<br />to Your Home
            </h2>
            <p className="leading-relaxed mb-5" style={{ color: 'var(--muted-foreground)' }}>
              Heritage Foods PK preserves the authentic flavours of Pakistani homes — from the tangy kick of hand-made Aam Achar to the rich sweetness of Multani Sohan Halwa, the crunch of premium nuts, and the delight of traditional Murabba. Every product is crafted with pure natural ingredients, following time-honoured recipes that have brought families together for generations.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {[
                ['🫙', 'Hand-Crafted Achar', '12 varieties, zero additives'],
                ['🥜', 'Premium Dry Fruits', '20 varieties from top farms'],
                ['🍬', 'Sweets & Murabba', '15 traditional recipes'],
                ['🚚', 'Fast Delivery',      'Same day across the city'],
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
              style={{ background: '#25D366', color: '#fff', textDecoration: 'none' }}>
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══ WHY HERITAGE FOODS ══ */}
      <WhyHeritageFoods />

      {/* ══ QUALITY PROMISE ══ */}
      <QualityPromise />

      {/* ══ FEEDBACK SECTION ══ */}
      <FeedbackSection feedbacks={feedbacks} onAddFeedback={handleAddFeedback} />

      {/* ══ FAQ ══ */}
      <FAQSection />

      {/* ══ CONTACT / NEWSLETTER ══ */}
      <section id="contact" style={{ background: 'var(--secondary)', padding: '56px 16px' }}>
        <div className="max-w-xl mx-auto text-center">
          <span style={{ fontSize: 44 }}>📬</span>
          <h2 className="font-bold text-2xl sm:text-3xl mt-4 mb-3" style={{ color: 'var(--foreground)', fontFamily: SERIF }}>
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
          <div className="flex items-center justify-center gap-5 mt-10">
            {[
              { href: 'https://wa.me/' + WHATSAPP_NUM, bg: '#25D366', icon: '💬', label: 'WhatsApp' },
              { href: FACEBOOK_URL,                    bg: '#1877F2', icon: '📘', label: 'Facebook' },
              { href: 'mailto:' + EMAIL_ADDR,          bg: '#EA4335', icon: '📧', label: 'Email' },
              { href: 'tel:' + PHONE_DISPLAY,          bg: '#E07830', icon: '📞', label: 'Call' },
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

      {/* ══ FOOTER ══ */}
      <footer style={{ background: dark ? '#080504' : '#1C1008', borderTop: '1px solid #2E1E0F' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <img
                src="/logo.jpg"
                alt="Heritage Foods PK"
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4ADE80', flexShrink: 0 }}
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <div>
                <div style={{ fontFamily: SCRIPT, fontSize: 18, color: '#fff', fontWeight: 700 }}>Heritage Foods</div>
                <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.22em', color: '#D97706' }}>PK ✦ EST. 1982</div>
              </div>
            </a>
            <p className="text-sm leading-relaxed mt-4" style={{ color: '#A07850' }}>
              Authentic Pakistani Achar, premium Dry Fruits, traditional Sweets & Murabba — handcrafted with pure natural ingredients.
            </p>
            <div className="flex gap-2 mt-5">
              {[
                { href: 'https://wa.me/' + WHATSAPP_NUM, bg: '#25D366', l: 'W' },
                { href: FACEBOOK_URL,                    bg: '#1877F2', l: 'f' },
                { href: 'mailto:' + EMAIL_ADDR,          bg: '#EA4335', l: '@' },
                { href: 'tel:' + PHONE_DISPLAY,          bg: '#E07830', l: '☎' },
              ].map(s => (
                <a key={s.l} href={s.href} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black hover:opacity-90 transition-opacity text-white"
                  style={{ background: s.bg, textDecoration: 'none' }}>
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
                { label: 'Our Story',       href: '#about' },
                { label: 'Why Us',          href: '#' },
                { label: 'Wholesale Orders', href: '#contact' },
                { label: 'Recipes Blog',    href: '#' },
              ],
            },
            {
              title: 'Help',
              links: [
                { label: 'Track Order',   href: '#' },
                { label: 'Returns Policy', href: '#' },
                { label: 'Delivery Info', href: '#' },
                { label: 'FAQ',           href: '#' },
                { label: 'Reviews',       href: '#feedback' },
                { label: 'Contact Us',    href: '#contact' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-bold text-sm mb-4 text-white">{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm hover:text-white transition-colors" style={{ color: '#A07850', textDecoration: 'none' }}>{l.label}</a>
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
              <a key={l} href="#" className="hover:text-white transition-colors" style={{ color: '#6B4A2C', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
