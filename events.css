// 🎉 TRP EVENTS SYSTEM (Santa + Snow)

(function () {

  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 🎄 CHRISTMAS – 25 DEC
  if (month === 12 && day === 25) {
    startSnow();
    startSanta();
    setTimeout(stopSnow, 9000); // auto stop
  }

  /* ❄️ Snow Logic */
  function startSnow() {
    for (let i = 0; i < 45; i++) {
      createSnowflake();
    }
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

  /* 🎅 Santa Logic */
  function startSanta() {
    const santa = document.createElement("div");
    santa.className = "santa";
    santa.innerHTML = "🎅🛷🎁";
    document.body.appendChild(santa);

    setTimeout(() => santa.remove(), 8500);
  }

})();
