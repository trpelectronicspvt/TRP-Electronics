/* script.js - single file for shop + cart pages */
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Dark mode toggle (shared) ---------- */
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "☀ Light Mode";
  } else {
    if (toggleBtn) toggleBtn.textContent = "🌙 Dark Mode";
  }
  toggleBtn?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
    toggleBtn.textContent = body.classList.contains("dark-mode") ? "☀ Light Mode" : "🌙 Dark Mode";
  });

  /* ------------------ IMAGE LOAD EFFECT (non-blocking) ------------------ */
  document.querySelectorAll(".product-card img").forEach(img => {
    if (img.complete) img.classList.add("loaded");
    else img.addEventListener("load", () => img.classList.add("loaded"));
  });

  /* ------------------ LOGO HOVER (non-invasive) ------------------ */
  const logo = document.getElementById("logo");
  if (logo) {
    // keep layout stable: wrap characters in spans but no display change
    const text = logo.textContent.trim();
    logo.innerHTML = "";
    text.split("").forEach(ch => {
      const s = document.createElement("span");
      s.textContent = ch;
      s.style.display = "inline-block";
      s.style.transition = "transform .25s, text-shadow .25s, color .25s";
      logo.appendChild(s);
    });

    const pop = new Audio("Data Files/pop.mp3");
    logo.addEventListener("mouseenter", () => {
      pop.currentTime = 0;
      pop.play().catch(()=>{});
      logo.querySelectorAll("span").forEach((sp,i) => {
        setTimeout(()=> {
          sp.classList.add("glow");
          setTimeout(()=> sp.classList.remove("glow"), 350);
        }, i*55);
      });
   });
  }

  /* ---------- Shared cart storage ---------- */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const deliveryCharge = 49;
  const freeDeliveryLimit = 999;

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCount();
  }

  function updateHeaderCount() {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const qty = cart.reduce((s,i) => s + (i.qty||0), 0);
    el.textContent = qty;
  }
  updateHeaderCount();

  /* ---------- on components.html: add-to-cart behaviour ---------- */
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const found = cart.find(x => x.name === name);
      if (found) found.qty++;
      else cart.push({ name, price, qty: 1, img: btn.closest('.product-card')?.querySelector('img')?.src || ''});
      saveCart();
      // open cart page

      showCartAlert(name);
    
    });
  });

  const openCartBtn = document.getElementById("openCartBtn");
if (openCartBtn) {
  openCartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}

function showCartAlert(productName) {
  const alertBox = document.getElementById("cart-alert");
  alertBox.innerText = `✅ "${productName}" added to your cart`;
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2500);
}
  /* ---------- components.html: search + category ---------- */
  const searchInput = document.getElementById("componentSearch");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  let activeCategory = "all";

  function applyFilters() {
    const q = (searchInput?.value || "").toLowerCase().trim();
    productCards.forEach(card => {
      const cat = (card.dataset.category || "").toLowerCase();
      const name = (card.querySelector("h3")?.textContent || "").toLowerCase();
      const keywords = (card.dataset.keywords || "").toLowerCase();
      const matchesCategory = (activeCategory === "all") || (cat === activeCategory.toLowerCase());
      const matchesSearch = !q || name.includes(q) || keywords.includes(q);
      card.style.display = (matchesCategory && matchesSearch) ? "block" : "none";
    });
  }
  searchInput?.addEventListener("input", applyFilters);
  document.querySelectorAll(".category-menu-new .cat-item").forEach(li => {
    li.addEventListener("click", () => {
      document.querySelectorAll(".category-menu-new .cat-item").forEach(x => x.classList.remove("active"));
      li.classList.add("active");
      activeCategory = li.dataset.cat || "all";
      applyFilters();
    });
  });
  applyFilters();

  /* ---------- on cart.html: render cart, qty, remove, order ---------- */
  if (document.body.classList.contains("cart-page")) {
    const itemsContainer = document.getElementById("cart-items-list");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryDelivery = document.getElementById("summary-delivery");
    const summaryTotal = document.getElementById("summary-total");
    const orderNow = document.getElementById("orderNow");
    const backToShop = document.getElementById("backToShop");

    function renderCart() {
      itemsContainer.innerHTML = "";
      let subtotal = 0;
      if (cart.length === 0) {
        itemsContainer.innerHTML = "<p>Your cart is empty. <a href='components.html'>Continue shopping</a></p>";
      } else {
        cart.forEach((it, idx) => {
          subtotal += it.price * it.qty;
          const row = document.createElement("div");
          row.className = "cart-row";
          row.innerHTML = `
            <img src="${it.img || 'images/all.png'}" alt="">
            <div class="info">
              <h4>${it.name}</h4>
              <p>₹${it.price} each</p>
            </div>
            <div class="controls">
              <input class="qty-input" data-i="${idx}" type="number" min="1" value="${it.qty}">
              <button class="remove-btn" data-i="${idx}">Remove</button>
            </div>
          `;
          itemsContainer.appendChild(row);
        });
      }

      const delivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
      summarySubtotal.textContent = `Subtotal: ₹${subtotal}`;
      summaryDelivery.textContent = `Delivery: ₹${delivery}`;
      summaryTotal.textContent = `Total: ₹${subtotal + delivery}`;

      // attach listeners
      document.querySelectorAll(".qty-input").forEach(inp => {
        inp.onchange = (e) => {
          const i = parseInt(e.target.dataset.i, 10);
          const v = Math.max(1, parseInt(e.target.value, 10) || 1);
          cart[i].qty = v;
          saveCart();
          renderCart();
        };
      });
      document.querySelectorAll(".remove-btn").forEach(b => {
        b.onclick = (e) => {
          const i = parseInt(e.target.dataset.i, 10);
          cart.splice(i,1);
          saveCart();
          renderCart();
        };
      });
    }

    renderCart();

    orderNow?.addEventListener("click", () => {
      if (cart.length === 0) return alert("Add products first.");
      const name = document.getElementById("name").value.trim();
      const address = document.getElementById("address").value.trim();
      const pincode = document.getElementById("pincode").value.trim();
      const phone = document.getElementById("phone").value.trim();
      if (!name || !address || !pincode || !phone) return alert("Please fill all address details.");

      const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
      const delivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
      const total = subtotal + delivery;
      const orderText = cart.map(i => `• ${i.name} - ₹${i.price} × ${i.qty}`).join("%0A");
      const msg = `🧾 *New Order*%0A${orderText}%0A--------------------%0A*Delivery:* ₹${delivery}%0A*Total:* ₹${total}%0A%0A👤 ${name}%0A🏠 ${address}%0A📮 ${pincode}%0A📞 ${phone}`;
      window.open(`https://wa.me/919115603213?text=${msg}`, "_blank");

      // clear cart after ordering
      cart = [];
      saveCart();
      renderCart();
    });

    backToShop?.addEventListener("click", (e) => {
      // normal link; user can go back to shop
    });
  }

});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("show");
});


const phoneInput = document.getElementById("phone");
const orderBtn = document.getElementById("orderNow");

// allow only numbers
phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
  if (phoneInput.value.length > 10) {
    phoneInput.value = phoneInput.value.slice(0, 10);
  }
});

orderBtn.addEventListener("click", function (e) {
  e.preventDefault(); // 🔥 PROCESS STOP HERE

  const phone = phoneInput.value.trim();

  // ❌ length check
  if (phone.length !== 10) {
    alert("❌ Enter exactly 10 digit mobile number");
    phoneInput.focus();
    return; // 🛑 STOP
  }

  // ❌ India number check
  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    alert("❌ Mobile number must start with 6, 7, 8 or 9");
    phoneInput.focus();
    return; // 🛑 STOP
  }

  // ✅ ONLY VALID CASE REACHES HERE
  const whatsappNumber = "91XXXXXXXXXX"; // apna number
  const message = `New Order\nPhone: ${phone}`;
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank"); // ✅ NOW SAFE
});

const products = [
  {
    name: "9V Battery",
    price: 19,
    image: "images/battery.jpg",
    description: "High quality battery",
    extra: ["images/battery2.jpg"]
  },
  {
    name: "DC Motor",
    price: 12,
    image: "images/motor.jpg",
    description: "Mini motor",
    extra: ["images/motor2.jpg"]
  }
];

const container = document.getElementById("products-container");

products.forEach(p => {
  container.innerHTML += `
    <div class="product-card">
      <img src="${p.image}" class="product-img">
      <span class="arrow">➤</span>

      <h3>${p.name}</h3>
      <p>₹${p.price}</p>

      <button onclick="addToCart('${p.name}')">Add to Cart ❤️</button>

      <div class="extra-info">
        <p>${p.description}</p>
        ${p.extra.map(img => `<img src="${img}" class="extra-img">`).join("")}
      </div>
    </div>
  `;
});

// expand card
document.addEventListener("click", function(e) {
  if(e.target.classList.contains("arrow")) {
    const card = e.target.closest(".product-card");
    card.classList.toggle("active");
  }
});

// cart
function addToCart(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(name);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

fetch("http://localhost:5000/products")
  .then(res => res.json())
  .then(data => {
    console.log(data);
  });
