// 🎉 TRP EVENTS SYSTEM (Christmas + Republic Day)

(function () {

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 🎄 CHRISTMAS – 25 DEC
  if (month === 12 && day === 25) {
    startSnow();
    startSanta();
    setTimeout(stopSnow, 9000);
  }

  // 🇮🇳 REPUBLIC DAY – 26 JAN
  if (month === 1 && day === 26) {
    startTricolor();
    startIndiaFlag();
    showRepublicBanner();
    setTimeout(stopTricolor, 9000);
  }

  /* ❄️ Snow Logic */
  function startSnow() {
    for (let i = 0; i < 45; i++) createSnowflake();
  }

  function createSnowflake() {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.innerHTML = "❄";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.animationDuration = 3 + Math.random() * 5 + "s";
    snow.style.opacity = Math.random();
    snow.style.fontSize = 10 + Math.random() * 20 + "px";
    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), 9000);
  }

  function stopSnow() {
    document.querySelectorAll(".snowflake").forEach(e => e.remove());
  }

  /* 🇮🇳 Tricolor Logic */
  function startTricolor() {
    const colors = ["#FF9933", "#FFFFFF", "#138808"];
    for (let i = 0; i < 50; i++) {
      const dot = document.createElement("div");
      dot.className = "tri-dot";
      dot.style.background = colors[Math.floor(Math.random() * 3)];
      dot.style.left = Math.random() * 100 + "vw";
      dot.style.animationDuration = 3 + Math.random() * 4 + "s";
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 9000);
    }
  }

  function stopTricolor() {
    document.querySelectorAll(".tri-dot").forEach(e => e.remove());
  }

  /* 🎅 Santa */
  function startSanta() {
    const santa = document.createElement("div");
    santa.className = "santa";
    santa.innerHTML = "🎅🛷🎁";
    document.body.appendChild(santa);
    setTimeout(() => santa.remove(), 8500);
  }

  /* 🇮🇳 India Flag */
  function startIndiaFlag() {
    const flag = document.createElement("div");
    flag.className = "india-flag";
    flag.innerHTML = "🇮🇳";
    document.body.appendChild(flag);
    setTimeout(() => flag.remove(), 8000);
  }

  /* 🇮🇳 Banner */
  function showRepublicBanner() {
    const banner = document.createElement("div");
    banner.className = "republic-banner";
    banner.innerHTML = "🇮🇳 Happy Republic Day 🇮🇳<br><small>Jai Hind</small>";
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
  }

})();
