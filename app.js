// Shop WhatsApp Number
const SHOP_WHATSAPP_NUMBER = "918091810807";

// Default Starter Inventory
const defaultProducts = [
  {
    id: 1,
    title: "Handcrafted Banarasi Raw Silk Saree",
    category: "Saree",
    price: 2499,
    sizes: ["Free Size"],
    colors: ["Classic Black", "Ivory"],
    inStock: true,
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&auto=format&fit=crop" }
    ]
  },
  {
    id: 2,
    title: "Embroidered Velvet Tuxedo Blazer",
    category: "Men",
    price: 3999,
    sizes: ["38", "40", "42", "44"],
    colors: ["Midnight Black"],
    inStock: true,
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=700&auto=format&fit=crop" }
    ]
  },
  {
    id: 3,
    title: "Partywear Anarkali Chiffon Suit with Dupatta",
    category: "Suit",
    price: 1899,
    sizes: ["M", "L", "XL"],
    colors: ["Jet Black", "Bottle Green"],
    inStock: true,
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop" }
    ]
  },
  {
    id: 4,
    title: "Kids Traditional Kurta Pajama Festive Set",
    category: "Kids",
    price: 899,
    sizes: ["4-5 Yrs", "6-7 Yrs", "8-9 Yrs"],
    colors: ["Off White", "Gold"],
    inStock: true,
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=700&auto=format&fit=crop" }
    ]
  }
];

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("fp_theme") || "dark";
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("fp_theme", isDark ? "dark" : "light");
}

// Local Storage Helper
function getProducts() {
  const stored = localStorage.getItem("fashion_point_v4");
  if (!stored) {
    localStorage.setItem("fashion_point_v4", JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
}

function saveProducts(products) {
  localStorage.setItem("fashion_point_v4", JSON.stringify(products));
}

// Render Products Grid
function renderProducts(filter = "all") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const products = getProducts();
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-20 text-neutral-400 font-medium">No items found in this collection.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isAvailable = item.inStock !== false;
    const primaryMedia = (item.media && item.media.length > 0)
      ? item.media[0]
      : { type: "image", url: "https://placehold.co/600x800/171717/ffffff?text=Fashion+Point" };

    return `
      <div class="bg-white dark:bg-brand-cardDark rounded-2xl overflow-hidden border border-neutral-200 dark:border-brand-borderDark flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 ${!isAvailable ? 'opacity-70' : ''}">
        <div>
          <!-- Product Media Banner -->
          <div class="relative w-full h-80 bg-neutral-100 dark:bg-neutral-900 overflow-hidden group cursor-pointer" onclick="openMediaPreview('${primaryMedia.url}', '${primaryMedia.type}')">
            ${primaryMedia.type === "video"
              ? `<video src="${primaryMedia.url}" autoplay muted loop playsinline class="w-full h-full object-cover"></video>`
              : `<img src="${primaryMedia.url}" alt="${item.title}" loading="lazy" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />`
            }
            
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

          <!-- Product Details -->
          <div class="p-4">
            <h3 class="font-bold text-neutral-900 dark:text-white text-base tracking-tight line-clamp-1">${item.title}</h3>
            
            <div class="flex items-baseline gap-2 mt-1">
              <span class="text-neutral-900 dark:text-white font-black text-2xl">₹${item.price}</span>
              <span class="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">In Stock & Verified</span>
            </div>

            <!-- Size & Quantity Selectors -->
            <div class="grid grid-cols-2 gap-2 mt-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Select Size</label>
                <select id="size-${item.id}" ${!isAvailable ? 'disabled' : ''} class="w-full text-xs font-semibold border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none">
                  ${item.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}
                </select>
              </div>

              <div>
                <label class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">Quantity</label>
                <select id="qty-${item.id}" ${!isAvailable ? 'disabled' : ''} class="w-full text-xs font-semibold border border-neutral-300 dark:border-neutral-700 rounded-lg p-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white outline-none">
                  <option value="1">1 piece</option>
                  <option value="2">2 pieces</option>
                  <option value="3">3 pieces</option>
                  <option value="4">4 pieces</option>
                  <option value="5">5 pieces</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- High-Conversion Action Button -->
        <div class="p-4 pt-0">
          ${isAvailable ? `
            <button onclick="orderDirectWhatsApp(${item.id})" class="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 btn-bounce shadow-md">
              <i class="fa-brands fa-whatsapp text-base"></i> Order via WhatsApp
            </button>
          ` : `
            <button disabled class="w-full bg-neutral-300 dark:bg-neutral-800 text-neutral-500 text-xs font-bold uppercase py-3 rounded-xl cursor-not-allowed">
              Currently Out of Stock
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

// Direct Order via WhatsApp
function orderDirectWhatsApp(productId) {
  const products = getProducts();
  const item = products.find(p => p.id === productId);
  if (!item) return;

  const selectedSize = document.getElementById(`size-${item.id}`).value;
  const selectedQty = document.getElementById(`qty-${item.id}`).value;
  const totalPrice = item.price * Number(selectedQty);

  // Structured Order Message for the Shopkeeper
  const message = 
`*NEW ORDER ENQUIRY - FASHION POINT*

Hello Fashion Point, I want to purchase this item:
*Item:* ${item.title}
*Category:* ${item.category}
*Size Selected:* ${selectedSize}
*Quantity:* ${selectedQty}
*Total Amount:* ₹${totalPrice}

Please confirm availability and share payment/delivery details!`;

  const waUrl = `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");
}

// Media Lightbox Modal
function openMediaPreview(url, type) {
  const modal = document.getElementById("media-modal");
  const modalContent = document.getElementById("modal-content");
  
  if (type === "video") {
    modalContent.innerHTML = `<video src="${url}" controls autoplay playsinline class="max-h-[60vh] max-w-full rounded-2xl"></video>`;
  } else {
    modalContent.innerHTML = `<img src="${url}" class="max-h-[60vh] max-w-full object-contain rounded-2xl" />`;
  }
  modal.classList.remove("hidden");
}

function closeMediaModal() {
  const modal = document.getElementById("media-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.getElementById("modal-content").innerHTML = "";
  }
}

// Filter Categories
function filterItems(category, event) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    btn.classList.remove("bg-neutral-900", "text-white", "dark:bg-white", "dark:text-neutral-900");
    btn.classList.add("bg-neutral-200/80", "dark:bg-neutral-800", "text-neutral-700", "dark:text-neutral-300");
  });

  if (event) {
    event.currentTarget.classList.remove("bg-neutral-200/80", "dark:bg-neutral-800", "text-neutral-700", "dark:text-neutral-300");
    event.currentTarget.classList.add("bg-neutral-900", "text-white", "dark:bg-white", "dark:text-neutral-900");
  }

  renderProducts(category);
}

// ----------------------------------------------------
// SECRET TRIGGER: Press 'p' 3 times to open Admin Panel
// ----------------------------------------------------
let pKeyPressCount = 0;
let pKeyTimer;

document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

  if (e.key.toLowerCase() === "p") {
    pKeyPressCount++;
    clearTimeout(pKeyTimer);

    if (pKeyPressCount >= 3) {
      pKeyPressCount = 0;
      window.location.href = "admin.html";
    }

    pKeyTimer = setTimeout(() => {
      pKeyPressCount = 0;
    }, 1200);
  }
});