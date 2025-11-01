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
const cart = [];
const deliveryCharge = 30; // Auto add delivery
const cartList = document.getElementById("cart-list");
const totalEl = document.getElementById("total");
const cartSection = document.getElementById("cart-section");

document.querySelectorAll(".add-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    cart.push({ name, price });
    updateCart();
  });
});

function updateCart() {
  cartSection.classList.remove("hidden");
  cartList.innerHTML = "";
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    cartList.appendChild(li);
  });
  const total = subtotal + deliveryCharge;
  totalEl.textContent = `Subtotal: ₹${subtotal} + Delivery ₹${deliveryCharge} = Total ₹${total}`;
}

document.getElementById("orderNow").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const pincode = document.getElementById("pincode").value;
  const phone = document.getElementById("phone").value;

  if (!name || !address || !pincode || !phone) {
    alert("Please fill all details!");
    return;
  }

  const orderText = cart.map(item => `• ${item.name} - ₹${item.price}`).join("%0A");
  const total = cart.reduce((sum, item) => sum + item.price, 0) + deliveryCharge;

  const msg = `🧾 *New Order*%0A--------------------%0A${orderText}%0A--------------------%0A*Delivery:* ₹${deliveryCharge}%0A*Total:* ₹${total}%0A%0A👤 *Name:* ${name}%0A🏠 *Address:* ${address}%0A📮 *Pincode:* ${pincode}%0A📞 *Phone:* ${phone}`;

  const whatsappURL = `https://wa.me/919115603213?text=${msg}`;
  window.open(whatsappURL, "_blank");
});

