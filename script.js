/* script.js - TRP Electronics Single File for Shop + Cart Pages */
document.addEventListener("DOMContentLoaded", () => {
  
  /* ---------- 1. DARK MODE TOGGLE (SHARED) ---------- */
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

  /* ---------- 2. IMAGE LOAD EFFECT ---------- */
  document.querySelectorAll(".product-card img").forEach(img => {
    if (img.complete) img.classList.add("loaded");
    else img.addEventListener("load", () => img.classList.add("loaded"));
  });

  /* ---------- 3. LOGO HOVER EFFECTS ---------- */
  const logo = document.getElementById("logo");
  if (logo) {
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
      logo.querySelectorAll("span").forEach((sp, i) => {
        setTimeout(() => {
          sp.classList.add("glow");
          setTimeout(() => sp.classList.remove("glow"), 350);
        }, i * 55);
      });
    });
  }

  /* ---------- 4. SHARED CART STORAGE GLOBAL LOGIC ---------- */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const deliveryCharge = 49;
  const freeDeliveryLimit = 699;

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateHeaderCount();
  }

  function updateHeaderCount() {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const qty = cart.reduce((s, i) => s + (i.qty || 0), 0);
    el.textContent = qty;
  }
  updateHeaderCount(); // Initialize counter on load

  /* ---------- 5. DYNAMIC EXPANDABLE CARDS + DATASHEET BUILDER ---------- */
  document.querySelectorAll(".product-card").forEach(card => {
    // 1. Add Expand Button
    const expandBtn = document.createElement("button");
    expandBtn.className = "expand-icon-btn";
    expandBtn.innerHTML = "⤢";
    expandBtn.title = "Expand Details";
    card.appendChild(expandBtn);

    // 2. Fetch Card Info
    const title = card.querySelector("h3")?.textContent || "Electronic Component";
    const priceText = card.querySelector("p")?.textContent || "₹0";
    const priceVal = card.querySelector(".add-cart")?.dataset.price || "0";
    const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, "-");

    // 3. Create Expanded Content Area
    const expandedBody = document.createElement("div");
    expandedBody.className = "card-expanded-body";
    expandedBody.innerHTML = `
      <h3>${title}</h3>
      <p class="expand-price">${priceText}</p>
      <p class="expand-desc">
        <strong>Technical Specs:</strong> High quality, tested component for circuits and DIY projects. Features standard pin spacing, reliable stability, and long operational life.
      </p>
      <div class="card-expanded-actions">
        <a href="datasheets/${cleanName}-datasheet.pdf" download="${cleanName}-datasheet.pdf" class="datasheet-btn" target="_blank">
          📥 Download Datasheet
        </a>
        <button class="add-cart" data-name="${title}" data-price="${priceVal}">Add to Cart ❤️</button>
      </div>
    `;
    card.appendChild(expandedBody);

    // 4. Click Listener to Toggle Expand
    expandBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = card.classList.contains("expanded");
      
      // Close any other open card
      document.querySelectorAll(".product-card.expanded").forEach(c => {
        c.classList.remove("expanded");
        c.querySelector(".expand-icon-btn").innerHTML = "⤢";
      });

      if (!isExpanded) {
        card.classList.add("expanded");
        expandBtn.innerHTML = "✕"; // Close icon
      }
    });
  });

  /* ---------- 6. COMPONENTS.HTML: ADD TO CART BEHAVIOR ---------- */
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-cart")) {
      const btn = e.target;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      if (!name || isNaN(price)) return;

      const found = cart.find(x => x.name === name);
      if (found) {
        found.qty++;
      } else {
        const productCard = btn.closest('.product-card');
        const imgUrl = productCard?.querySelector('img')?.src || 'images/all.png';
        cart.push({ name, price, qty: 1, img: imgUrl });
      }
      
      saveCart();
      showCartAlert(name);
    }
  });

  function showCartAlert(productName) {
    const alertBox = document.getElementById("cart-alert");
    if (alertBox) {
      alertBox.innerText = `✅ "${productName}" added to your cart`;
      alertBox.classList.add("show");
      setTimeout(() => {
        alertBox.classList.remove("show");
      }, 2500);
    } else {
      alert(`✅ "${productName}" added to your cart`);
    }
  }

  /* ---------- 7. COMPONENTS.HTML: SEARCH + CATEGORY FILTER ---------- */
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

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  document.querySelectorAll(".category-menu-new .cat-item, .category-menu-new button, .cat-item").forEach(li => {
    li.addEventListener("click", () => {
      document.querySelectorAll(".category-menu-new .cat-item, .cat-item").forEach(x => x.classList.remove("active"));
      li.classList.add("active");
      activeCategory = li.dataset.cat || "all";
      applyFilters();
    });
  });
  
  if (productCards.length > 0) {
    applyFilters();
  }

  /* ---------- 8. CART.HTML: RENDER CART & RAZORPAY SYSTEM ---------- */
  if (document.body.classList.contains("cart-page")) {
    const itemsContainer = document.getElementById("cart-items-list");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryDelivery = document.getElementById("summary-delivery");
    const summaryTotal = document.getElementById("summary-total");
    const orderNow = document.getElementById("orderNow");

    function renderCart() {
      if (!itemsContainer) return;
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
            <img src="${it.img || 'images/all.png'}" alt="" style="width:50px; height:50px;">
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

      const delivery = subtotal >= freeDeliveryLimit || subtotal === 0 ? 0 : deliveryCharge;
      if (summarySubtotal) summarySubtotal.textContent = `Subtotal: ₹${subtotal}`;
      if (summaryDelivery) summaryDelivery.textContent = `Delivery: ₹${delivery}`;
      if (summaryTotal) summaryTotal.textContent = `Total: ₹${subtotal + delivery}`;

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
          cart.splice(i, 1);
          saveCart();
          renderCart();
        };
      });
    }

    renderCart();

    orderNow?.addEventListener("click", (e) => {
      e.preventDefault();

      if (cart.length === 0) return alert("❌ Add products first.");
      
      const name = document.getElementById("name")?.value.trim();
      const address = document.getElementById("address")?.value.trim();
      const pincode = document.getElementById("pincode")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();

      if (!name || !address || !pincode || !phone) {
        return alert("❌ Please fill all delivery details.");
      }

      if (phone.length !== 10 || !/^[6-9][0-9]{9}$/.test(phone)) {
        alert("❌ Enter a valid 10-digit Indian mobile number.");
        document.getElementById("phone")?.focus();
        return;
      }

      const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const delivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
      const totalAmount = subtotal + delivery;
      const amountInPaise = totalAmount * 100;

      const itemsDescription = cart.map(i => `${i.name} (x${i.qty})`).join(", ");

      var options = {
        "key": "rzp_live_T9fdcBxIRGP1MY", 
        "amount": amountInPaise,
        "currency": "INR",
        "name": "TRP Electronics",
        "description": "Components Purchase",
        "image": "images/logo.png",
        "handler": function (response) {
          alert(`🎉 Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

          const orderText = cart.map(i => `• ${i.name} - ₹${i.price} x ${i.qty}`).join("\n");
          const msg = `🧾 *New Verified Order*\n*Payment ID:* ${response.razorpay_payment_id}\n--------------------\n${orderText}\n--------------------\n*Delivery:* ₹${delivery}\n*Total Paid:* ₹${totalAmount}\n\n👤 *Name:* ${name}\n🏠 *Address:* ${address}\n📮 *Pincode:* ${pincode}\n📞 *Phone:* ${phone}`;
          
          cart = [];
          saveCart();
          renderCart();

          window.location.href = `https://api.whatsapp.com/send?phone=919115603213&text=${encodeURIComponent(msg)}`;
        },
        "prefill": {
          "name": name,
          "contact": phone
        },
        "theme": {
          "color": "#0052FF"
        }
      };

      try {
        var rzp1 = new Razorpay(options);
        rzp1.open();
      } catch (err) {
        alert("❌ Razorpay Open Error: " + err.message + "\nCheck Key ID configuration.");
      }
    });
  }

  /* ---------- 9. MOBILE NAV TOGGLE & ABOUT ACCORDION ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  menuToggle?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("show");
  });

  const aboutToggle = document.getElementById('aboutToggle');
  aboutToggle?.addEventListener('click', function() {
    const content = document.getElementById('aboutContent');
    const arrow = document.getElementById('aboutArrow');
    if (content) {
      content.classList.toggle('show');
      if (arrow) {
        arrow.style.transform = content.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  });

  const phoneInput = document.getElementById("phone");
  phoneInput?.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, "");
    if (phoneInput.value.length > 10) {
      phoneInput.value = phoneInput.value.slice(0, 10);
    }
  });

});
