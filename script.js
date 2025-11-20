document.addEventListener("DOMContentLoaded", () => {

  /* ------------------ DARK MODE ------------------ */
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
    const mode = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
    toggleBtn.textContent = mode === "dark" ? "☀ Light Mode" : "🌙 Dark Mode";
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

  /* ------------------ CART / SEARCH / CATEGORIES ------------------ */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const deliveryCharge = 49;
  const freeDeliveryLimit = 999;

  const cartList = document.getElementById("cart-list");
  const totalEl = document.getElementById("total");
  const cartSection = document.getElementById("cart-section");
  const noticeEl = document.getElementById("freeNotice");
  const orderBtn = document.getElementById("orderNow");
  const cartToggle = document.getElementById("cartToggle");
  const cartCountEl = document.getElementById("cart-count");

  // helper to update cart-count in header
  function refreshCartCount() {
    const qty = cart.reduce((s,i) => s + (i.qty||0), 0);
    if (cartCountEl) cartCountEl.textContent = qty;
  }

  refreshCartCount(); // show restored count but keep cart hidden

  // Add to cart buttons
  document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const found = cart.find(x => x.name === name);
      if (found) found.qty++;
      else cart.push({ name, price, qty: 1 });
      updateCartUI();
    });
  });

  // Toggle cart visibility when header cart clicked
  cartToggle?.addEventListener("click", () => {
    if (!cartSection) return;
    cartSection.classList.toggle("hidden");
    // scroll into view on open (small nicety)
    if (!cartSection.classList.contains("hidden")) cartSection.scrollIntoView({ behavior: "smooth" });
  });

  // update cart UI
  function updateCartUI() {
    if (!cartSection || !cartList || !totalEl) return;
    cartSection.classList.remove("hidden"); // open cart when items changed
    cartList.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, idx) => {
      subtotal += item.price * item.qty;
      const li = document.createElement("li");
      li.innerHTML = `
        <div style="flex:1">${item.name} - ₹${item.price}</div>
        <div style="display:flex;align-items:center;gap:8px">
          <input class="qty-input" data-i="${idx}" type="number" min="1" value="${item.qty}">
          <button class="remove-btn" data-i="${idx}">✖</button>
        </div>
      `;
      cartList.appendChild(li);
    });

    // delivery & notice
    let finalDelivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
    if (subtotal >= freeDeliveryLimit) {
      noticeEl.textContent = "🎉 Congratulations! You unlocked FREE DELIVERY.";
      noticeEl.style.color = "green";
    } else {
      const remaining = freeDeliveryLimit - subtotal;
      noticeEl.innerHTML = `Add items worth ₹${remaining} more for <b>FREE DELIVERY!</b>`;
      noticeEl.style.color = "#0044cc";
    }

    const total = subtotal + finalDelivery;
    totalEl.textContent = `Subtotal: ₹${subtotal} + Delivery ₹${finalDelivery} = Total ₹${total}`;

    // attach qty and remove listeners (re-attach fresh)
    document.querySelectorAll(".qty-input").forEach(inp => {
      inp.onchange = e => {
        const i = parseInt(e.target.dataset.i, 10);
        const val = parseInt(e.target.value, 10) || 1;
        cart[i].qty = val;
        updateCartUI();
      };
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.onclick = e => {
        const i = parseInt(e.target.dataset.i, 10);
        cart.splice(i,1);
        updateCartUI();
      };
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    refreshCartCount();

    // disable order button logic
    if (!orderBtn) return;
    if (cart.length === 0) {
      orderBtn.disabled = true;
      orderBtn.style.background = "#888";
      orderBtn.style.cursor = "not-allowed";
      totalEl.textContent = "Your cart is empty. Add items to proceed.";
    } else {
      orderBtn.disabled = false;
      orderBtn.style.background = "#28a745";
      orderBtn.style.cursor = "pointer";
    }
  }

  // If already had cart items restore cart UI but keep it hidden (user can open)
  if (cart.length > 0) {
    refreshCartCount();
    // do NOT auto-open (keeps UX clean)
  }

  // WhatsApp order
  orderBtn?.addEventListener("click", () => {
    if (cart.length === 0) return alert("Your cart is empty! Add products.");
    const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
    const finalDelivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
    const total = subtotal + finalDelivery;
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const pincode = document.getElementById("pincode").value;
    const phone = document.getElementById("phone").value;
    if (!name || !address || !pincode || !phone) return alert("Please fill all details!");

    const orderText = cart.map(i => `• ${i.name} - ₹${i.price} × ${i.qty}`).join("%0A");
    const msg = `🧾 *New Order*%0A--------------------%0A${orderText}%0A--------------------%0A*Delivery:* ₹${finalDelivery}%0A*Total:* ₹${total}%0A%0A👤 ${name}%0A🏠 ${address}%0A📮 ${pincode}%0A📞 ${phone}`;
    window.open(`https://wa.me/919115603213?text=${msg}`, "_blank");

    // clear cart
    cart = [];
    localStorage.removeItem("cart");
    updateCartUI();
    refreshCartCount();
  });

  /* ------------------ SEARCH + CATEGORY FILTER ------------------ */
  const searchInput = document.getElementById("componentSearch");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  let activeCategory = "all";

  // apply both filters: category + search text
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

  searchInput?.addEventListener("input", () => applyFilters());

  // categories click handling
  document.querySelectorAll(".category-menu-new .cat-item").forEach(li => {
    li.addEventListener("click", () => {
      document.querySelectorAll(".category-menu-new .cat-item").forEach(x => x.classList.remove("active"));
      li.classList.add("active");
      activeCategory = li.dataset.cat || "all";
      applyFilters();
    });
  });

  // initial apply (in case user had search or category preselected)
  applyFilters();

});
