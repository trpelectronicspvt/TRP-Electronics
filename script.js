document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------------------------
     DARK MODE
  ---------------------------------------------------*/
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀ Light Mode";
  } else {
    toggleBtn.textContent = "🌙 Dark Mode";
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const mode = body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
    toggleBtn.textContent = mode === "dark" ? "☀ Light Mode" : "🌙 Dark Mode";
  });

  /* ------------------------------------------------
     IMAGE LOADING FADE-IN
  ---------------------------------------------------*/
  const cards = document.querySelectorAll(".card img");
  cards.forEach(img => {
    if (img.complete) img.parentElement.classList.add("loaded");
    else img.addEventListener("load", () => img.parentElement.classList.add("loaded"));
  });

  /* ------------------------------------------------
     LOGO HOVER ANIMATION (NO LAYOUT BREAK)
  ---------------------------------------------------*/
  const logo = document.getElementById("logo");
  if (logo) {
    const letters = logo.textContent.split("");
    logo.innerHTML = "";

    letters.forEach(letter => {
      const span = document.createElement("span");
      span.textContent = letter;
      logo.appendChild(span);
    });

    const popSound = new Audio("Data Files/pop.mp3");

    logo.addEventListener("mouseenter", () => {
      popSound.currentTime = 0;
      popSound.play();
      logo.querySelectorAll("span").forEach((span, i) => {
        setTimeout(() => {
          span.classList.add("glow");
          setTimeout(() => span.classList.remove("glow"), 350);
        }, i * 50);
      });
    });
  }
});

/* ------------------------------------------------
   CART SYSTEM
---------------------------------------------------*/
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const deliveryCharge = 49;
const freeDeliveryLimit = 999;

const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const cartSection = document.getElementById("cart-section");
const noticeEl = document.getElementById("freeNotice");
const orderBtn = document.getElementById("orderNow");

// Load previous cart
if (cart.length > 0) updateCart();

// ADD TO CART
document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const found = cart.find(i => i.name === name);

    if (found) found.qty++;
    else cart.push({ name, price, qty: 1 });

    updateCart();
  });
});

// UPDATE CART UI
function updateCart() {
  cartSection?.classList.remove("hidden");
  cartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price} × 
      <input type="number" min="1" value="${item.qty}" data-i="${index}" class="qty-input">
      <button class="remove-btn" data-i="${index}">✖</button>
    `;
    cartList.appendChild(li);
  });

  // Delivery logic
  let finalDelivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
  let remaining = freeDeliveryLimit - subtotal;

  if (finalDelivery === 0) {
    noticeEl.textContent = "🎉 Congratulations! You unlocked FREE DELIVERY!";
    noticeEl.style.color = "green";
  } else {
    noticeEl.innerHTML = `Add items worth ₹${remaining} more for <b>FREE DELIVERY!</b>`;
    noticeEl.style.color = "#0044cc";
  }

  const total = subtotal + finalDelivery;
  totalEl.textContent = `Subtotal: ₹${subtotal} + Delivery ₹${finalDelivery} = Total ₹${total}`;

  // Qty listener
  document.querySelectorAll(".qty-input").forEach(inp => {
    inp.onchange = e => {
      const i = e.target.dataset.i;
      cart[i].qty = parseInt(e.target.value);
      updateCart();
    };
  });

  // Remove button listener
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = e => {
      const i = e.target.dataset.i;
      cart.splice(i, 1);
      updateCart();
    };
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  if (!orderBtn) return;

  if (cart.length === 0 || subtotal === 0) {
    orderBtn.disabled = true;
    totalEl.textContent = "Your cart is empty!";
  } else {
    orderBtn.disabled = false;
  }
}

/* ------------------------------------------------
   WHATSAPP ORDER
---------------------------------------------------*/
orderBtn?.addEventListener("click", () => {
  if (cart.length < 1) return alert("Cart empty!");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const finalDelivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
  const total = subtotal + finalDelivery;

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const pincode = document.getElementById("pincode").value;
  const phone = document.getElementById("phone").value;
  if (!name || !address || !pincode || !phone) return alert("Fill all details!");

  const orderText = cart
    .map(i => `• ${i.name} - ₹${i.price} × ${i.qty}`)
    .join("%0A");

  const msg = `🧾 *New Order*%0A--------------------%0A${orderText}%0A--------------------%0A*Delivery:* ₹${finalDelivery}%0A*Total:* ₹${total}%0A%0A👤 ${name}%0A🏠 ${address}%0A📮 ${pincode}%0A📞 ${phone}`;

  window.open(`https://wa.me/919115603213?text=${msg}`, "_blank");

  cart = [];
  localStorage.removeItem("cart");
  updateCart();
});

/* ------------------------------------------------
   CLEAN SINGLE SEARCH FUNCTION
---------------------------------------------------*/
const searchInput = document.getElementById("componentSearch");
const productCards = document.querySelectorAll(".product-card");

searchInput?.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();
  productCards.forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const keywords = (card.dataset.keywords || "").toLowerCase();
    card.style.display = name.includes(q) || keywords.includes(q) ? "block" : "none";
  });
});
