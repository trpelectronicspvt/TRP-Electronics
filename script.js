document.addEventListener("DOMContentLoaded", () => {
  // ✅ DARK MODE TOGGLE
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

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "☀ Light Mode";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  });

  // ✅ IMAGE LOADING EFFECT
  const cards = document.querySelectorAll(".card img");
  cards.forEach(img => {
    if (img.complete) {
      img.parentElement.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.parentElement.classList.add("loaded");
      });
    }
  });

  // ✅ LOGO ANIMATION + POP SOUND + GLOW (on hover only)
  const logo = document.getElementById("logo");
  if (logo) {
    const text = logo.textContent;
    logo.textContent = "";

    // Har letter ko span me daalna (without auto animation)
    text.split("").forEach(letter => {
      const span = document.createElement("span");
      span.textContent = letter;
      logo.appendChild(span);
    });

    // Sound setup
    const popSound = new Audio("Data Files/pop.mp3");

    // Hover par effect trigger + sound
    logo.addEventListener("mouseenter", () => {
      popSound.currentTime = 0;
      popSound.play();

      logo.querySelectorAll("span").forEach((span, i) => {
        setTimeout(() => {
          span.classList.add("glow");
          setTimeout(() => {
            span.classList.remove("glow");
          }, 400);
        }, i * 60);
      });
    });
  }
});
// ✅ Step 1: Restore cart from localStorage if available
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const deliveryCharge = 30;
const freeDeliveryLimit = 500;
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const cartSection = document.getElementById("cart-section");
const noticeEl = document.getElementById("freeNotice");

// Agar cart me pehle se items hain to turant update dikhao
if (cart.length > 0) updateCart();


// 🔍 search filter
document.getElementById("componentSearch").addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();
    const keywords = card.dataset.keywords.toLowerCase();
    card.style.display =
      name.includes(query) || keywords.includes(query) ? "block" : "none";
  });
});

// 🛒 Add to cart
document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCart();
  });
});

function updateCart() {
  cartSection.classList.remove("hidden");
  cartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - ₹${item.price} × 
      <input type="number" min="1" value="${item.qty}" data-index="${index}" class="qty-input">
      <button class="remove-btn" data-index="${index}">✖</button>
    `;
    cartList.appendChild(li);
  });

  // 🧮 Delivery Logic
  let finalDelivery = deliveryCharge;
  if (subtotal >= freeDeliveryLimit) {
    finalDelivery = 0;
    noticeEl.textContent = "🎉 Congratulations! You’ve unlocked FREE DELIVERY.";
    noticeEl.style.color = "green";
  } else {
    const remaining = freeDeliveryLimit - subtotal;
    noticeEl.textContent = `Add items worth ₹${remaining} more for FREE DELIVERY!`;
    noticeEl.style.color = "#0044cc";
  }

  const total = subtotal + finalDelivery;
  totalEl.textContent = `Subtotal: ₹${subtotal} + Delivery ₹${finalDelivery} = Total ₹${total}`;

  // Quantity change
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", e => {
      const i = e.target.dataset.index;
      cart[i].qty = parseInt(e.target.value);
      updateCart();
    });
  });

    // ✅ Step 2: Save cart in localStorage every time it updates
  localStorage.setItem("cart", JSON.stringify(cart));
}
// ✅ Remove item (event delegation)
cartList.addEventListener("click", e => {
  if (e.target.classList.contains("remove-btn")) {
    const i = e.target.dataset.index;
    cart.splice(i, 1);
    updateCart();
  }
});
// ✅ Order via WhatsApp
document.getElementById("orderNow").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const pincode = document.getElementById("pincode").value;
  const phone = document.getElementById("phone").value;

  if (!name || !address || !pincode || !phone) {
    alert("Please fill all details!");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const finalDelivery = subtotal >= freeDeliveryLimit ? 0 : deliveryCharge;
  const orderText = cart
    .map(item => `• ${item.name} - ₹${item.price} × ${item.qty}`)
    .join("%0A");
  const total = subtotal + finalDelivery;

  const msg = `🧾 *New Order*%0A--------------------%0A${orderText}%0A--------------------%0A*Delivery:* ₹${finalDelivery}%0A*Total:* ₹${total}%0A%0A👤 *Name:* ${name}%0A🏠 *Address:* ${address}%0A📮 *Pincode:* ${pincode}%0A📞 *Phone:* ${phone}`;

  const whatsappURL = `https://wa.me/919115603213?text=${msg}`;
  window.open(whatsappURL, "_blank");
  // ✅ Step 3: Clear cart after successful order
cart = [];
localStorage.removeItem("cart");
updateCart();
});

// 🔍 Component Search Functionality
const searchInput = document.getElementById("componentSearch");
const componentCards = document.querySelectorAll(".product-card");

if (searchInput) { // Only runs on Components page
  searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.toLowerCase();
    componentCards.forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      if (name.includes(query)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}
