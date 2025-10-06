document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;

  // Check localStorage for saved mode
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
 <script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAjEzrS2vQe-l6lNzNVHJdUY363uab_qDQ",
    authDomain: "trp-electronics-site.firebaseapp.com",
    projectId: "trp-electronics-site",
    storageBucket: "trp-electronics-site.firebasestorage.app",
    messagingSenderId: "98457306751",
    appId: "1:98457306751:web:43540ea4e0c510ad9ca14a",
    measurementId: "G-X9ZCTX55DK"
  };
// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Update likes
window.likeProject = function(id) {
  const projectRef = ref(db, 'projects/' + id);
  get(projectRef).then(snapshot => {
    let likes = snapshot.exists() ? snapshot.val().likes + 1 : 1;
    update(projectRef, { likes });
  });
};

// 🔹 Update views
window.viewProject = function(id) {
  const projectRef = ref(db, 'projects/' + id);
  get(projectRef).then(snapshot => {
    let views = snapshot.exists() ? snapshot.val().views + 1 : 1;
    update(projectRef, { views });
  });
};

// 🔹 Auto update (real-time)
onValue(ref(db, 'projects'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    Object.keys(data).forEach(id => {
      const card = document.querySelector(.project-card[data-id="${id}"]);
      if (card) {
        card.querySelector('.likes .count').textContent = data[id].likes || 0;
        card.querySelector('.views .count').textContent = data[id].views || 0;
      }
    });
  }
});
</script>
