import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Active Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC91-oOwG87W85hbpxzff4acW7KeymceMw",
  authDomain: "fashion-point-1c116.firebaseapp.com",
  projectId: "fashion-point-1c116",
  storageBucket: "fashion-point-1c116.firebasestorage.app",
  messagingSenderId: "755423609380",
  appId: "1:755423609380:web:9f428563412534b8618eb1",
  measurementId: "G-40C2REG60D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SHOP_WHATSAPP_NUMBER = "918091810807";
let currentProducts = [];

// Fallback backup catalog jab tak database me koi item na ho
const defaultProducts = [
  {
    id: "def-1",
    title: "Handcrafted Banarasi Raw Silk Saree",
    category: "Saree",
    price: 2499,
    sizes: ["Free Size"],
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop",
    inStock: true
  },
  {
    id: "def-2",
    title: "Embroidered Velvet Tuxedo Blazer",
    category: "Men",
    price: 3999,
    sizes: ["38", "40", "42", "44"],
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop",
    inStock: true
  },
  {
    id: "def-3",
    title: "Partywear Anarkali Chiffon Suit with Dupatta",
    category: "Suit",
    price: 1899,
    sizes: ["M", "L", "XL"],
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop",
    inStock: true
  },
  {
    id: "def-4",
    title: "Kids Traditional Kurta Pajama Festive Set",
    category: "Kids",
    price: 899,
    sizes: ["4-5 Yrs", "6-7 Yrs", "8-9 Yrs"],
    imageUrl: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=700&auto=format&fit=crop",
    inStock: true
  }
];

// Live Realtime Firestore Listener (Sabhi phones par bina page refresh hue update hoga)
try {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      currentProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      currentProducts = defaultProducts;
    }
    renderProducts();
  }, (err) => {
    console.warn("Firestore listener fallback to defaults:", err);
    currentProducts = defaultProducts;
    renderProducts();
  });
} catch (e) {
  currentProducts = defaultProducts;
  renderProducts();
}

// Theme handling
function initTheme() {
  const saved = localStorage.getItem("fp_theme") || "dark";
  document.documentElement.classList.toggle("dark", saved === "dark");
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("fp_theme", isDark ? "dark" : "light");
}
window.toggleTheme = toggleTheme;

// Catalog Renderer
function renderProducts(filter = "all") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const filtered = filter === "all" ? currentProducts : currentProducts.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-20 text-neutral-400 font-medium">No items found in this category.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isAvailable = item.inStock !== false;
    const imgUrl = item.imageUrl || "https://placehold.co/600x800/171717/ffffff?text=Fashion+Point";

    return `
      <div class="bg-white dark:bg-brand-cardDark rounded-2xl overflow-hidden border border-neutral-200 dark:border-brand-borderDark flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 ${!isAvailable ? 'opacity-70' : ''}">
        <div>
          <div class="relative w-full h-80 bg-neutral-100 dark:bg-neutral-900 overflow-hidden group cursor-pointer" onclick="openMediaPreview('${imgUrl}')">
            <img src="${imgUrl}" alt="${item.title}" loading="lazy" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-3 left-3 flex flex-col gap-1.5">
              <span class="bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-sm">
                ${item.category}
              </span>
              ${!isAvailable ? `<span class="bg-red-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow">Sold Out</span>` : ''}
            </div>
            <div class="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
              <i class="fa-solid fa-expand mr-1"></i> Preview
            </div>
          </div>

          <div class="p-4">
            <h3 class="font-bold text-neutral-900 dark:text-white text-base tracking-tight line-clamp-1">${item.title}</h3>
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-neutral-900 dark:text-white font-black text-2xl">₹${item.price}</span>
              <span class="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">In Stock & Verified</span>
            </div>

            <div class="grid grid-cols-2 gap-2 mt-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Select Size</label>
                <select id="size-${item.id}" ${!isAvailable ? 'disabled' : ''} class="w-full text-xs font-semibold border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none">
                  ${(item.sizes || ["Free Size"]).map(s => `<option value="${s}">${s}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Quantity</label>
                <select id="qty-${item.id}" ${!isAvailable ? 'disabled' : ''} class="w-full text-xs font-semibold border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none">
                  <option value="1">1 pc</option>
                  <option value="2">2 pcs</option>
                  <option value="3">3 pcs</option>
                  <option value="4">4 pcs</option>
                  <option value="5">5 pcs</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 pt-0">
          ${isAvailable ? `
            <button onclick="orderDirectWhatsApp('${item.id}')" class="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 btn-bounce shadow-md">
              <i class="fa-brands fa-whatsapp text-base"></i> Order via WhatsApp
            </button>
          ` : `
            <button disabled class="w-full bg-neutral-300 dark:bg-neutral-800 text-neutral-500 text-xs font-bold uppercase py-3 rounded-xl cursor-not-allowed">
              Sold Out
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

// Global WhatsApp Order Trigger
window.orderDirectWhatsApp = function(productId) {
  const item = currentProducts.find(p => p.id === productId);
  if (!item) return;

  const sizeEl = document.getElementById(`size-${item.id}`);
  const qtyEl = document.getElementById(`qty-${item.id}`);
  const size = sizeEl ? sizeEl.value : "Free Size";
  const qty = qtyEl ? qtyEl.value : "1";
  const total = item.price * Number(qty);

  const msg = `*NEW ORDER - FASHION POINT*\n\nHello Fashion Point, I want to purchase this item:\n*Item:* ${item.title}\n*Category:* ${item.category}\n*Size Selected:* ${size}\n*Quantity:* ${qty}\n*Total Amount:* ₹${total}\n\nPlease confirm availability and share payment/delivery details!`;
  window.open(`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
};

// Global Filters
window.filterItems = function(category, event) {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("bg-neutral-900", "text-white", "dark:bg-white", "dark:text-neutral-900");
    btn.classList.add("bg-neutral-200/80", "dark:bg-neutral-800", "text-neutral-700", "dark:text-neutral-300");
  });
  if (event) {
    event.currentTarget.classList.remove("bg-neutral-200/80", "dark:bg-neutral-800", "text-neutral-700", "dark:text-neutral-300");
    event.currentTarget.classList.add("bg-neutral-900", "text-white", "dark:bg-white", "dark:text-neutral-900");
  }
  renderProducts(category);
};

// Global Media Modal
window.openMediaPreview = function(url) {
  const modal = document.getElementById("media-modal");
  document.getElementById("modal-content").innerHTML = `<img src="${url}" class="max-h-[60vh] max-w-full object-contain rounded-2xl" />`;
  modal.classList.remove("hidden");
};

window.closeMediaModal = function() {
  const modal = document.getElementById("media-modal");
  if (modal) modal.classList.add("hidden");
};

// Admin trigger: Press 'p' 3 times
let pCount = 0;
let pTimer;
document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
  if (e.key.toLowerCase() === "p") {
    pCount++;
    clearTimeout(pTimer);
    if (pCount >= 3) {
      pCount = 0;
      window.location.href = "admin.html";
    }
    pTimer = setTimeout(() => { pCount = 0; }, 1200);
  }
});

initTheme();
renderProducts();