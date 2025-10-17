document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;

  // 🔹 Check localStorage for saved mode
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀ Light Mode";
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
});

// 🔹 Image Loading Effect
document.addEventListener("DOMContentLoaded", () => {
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
});
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  const text = logo.textContent;
  logo.textContent = "";

  // Har letter ko alag span me daalna
  text.split("").forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.animationDelay = ${i * 0.08}s;
    logo.appendChild(span);
  });

  // Sound effect setup
  const popSound = new Audio("Data Files/pop.mp3"); // <- yahan apni pop sound file ka path do

  // Hover par sound play
  logo.addEventListener("mouseenter", () => {
    popSound.currentTime = 0;
    popSound.play();
  });
});
