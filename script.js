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

  // ✅ LOGO ANIMATION + POP SOUND + GLOW
  const logo = document.getElementById("logo");
  if (logo) {
    const text = logo.textContent;
    logo.textContent = "";

    // Har letter ko span me daalna with delay
    text.split("").forEach((letter, i) => {
      const span = document.createElement("span");
      span.textContent = letter;
      span.style.display = "inline-block";
      span.style.animation = `popEffect 0.4s ease forwards`;
      span.style.animationDelay = `${i * 0.08}s`;
      logo.appendChild(span);
    });

    // Sound setup
    const popSound = new Audio("Data Files/pop.mp3");

    // Hover par effect trigger + sound + glow
    logo.addEventListener("mouseenter", () => {
      popSound.currentTime = 0;
      popSound.play();

      logo.querySelectorAll("span").forEach((span, i) => {
        setTimeout(() => {
          span.classList.add("glow");
          setTimeout(() => span.classList.remove("glow"), 400);
        }, i * 50);
      });
    });
  }
});
