// Firebase Config & Init
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIXpXQ2bZewn8aFLilngsJu453UCirwVg",
  authDomain: "cuocthisacdep-8536d.firebaseapp.com",
  databaseURL: "https://cuocthisacdep-8536d-default-rtdb.firebaseio.com",
  projectId: "cuocthisacdep-8536d",
  storageBucket: "cuocthisacdep-8536d.firebasestorage.app",
  messagingSenderId: "590245990634",
  appId: "1:590245990634:web:a97607314242227ea2c793",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

// DOM Elements
const formSignIn = document.getElementById("formsignin");
const maTruyCap = document.getElementById("maTruyCap");
const btnSignIn = formSignIn.querySelector(".btn-signin");
const backgroundsignIn = document.querySelector(".backgroundsingin");
const errText = document.getElementById("errText");
const cardsList = document.getElementById("cards-list");
const ranking = document.querySelector(".ranking");

// Utility
function setCookie(key, value) {
  document.cookie = `${key}=${value}`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : "";
}

function FormatSBD(sbd) {
  return sbd.toString().padStart(3, "0");
}

function showNotification(text) {
  const container = document.getElementById("notification-container");
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = text;
  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Auth
btnSignIn.addEventListener("click", async () => {
  const accessCode = maTruyCap.value.trim();
  try {
    const snapshot = await get(child(ref(db), "/dsbinhchon"));
    let found = false;
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().id === accessCode) {
        setCookie("datalogin", childSnapshot.key);
        found = true;
      }
    });

    if (found) {
      backgroundsignIn.style.display = "none";
    } else {
      errText.innerText = "Mã truy cập không đúng";
      errText.style.display = "block";
    }
  } catch (err) {
    console.error("Đăng nhập lỗi:", err);
    errText.innerText = "Đã xảy ra lỗi, vui lòng thử lại.";
    errText.style.display = "block";
  }
});

// Data Fetching
async function fetchThiSinh() {
  const snapshot = await get(ref(db, "/dsthisinh"));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val()).map((data) => ({ ...data, sophieu: 0 }));
}

async function fetchVotes() {
  const snapshot = await get(ref(db, "/chitietvotes"));
  return snapshot.exists() ? snapshot.val() : {};
}

// Vote Count and Ranking
async function processData() {
  try {
    const [thiSinhList, voteData] = await Promise.all([
      fetchThiSinh(),
      fetchVotes(),
    ]);

    thiSinhList.forEach((ts) => {
      Object.values(voteData).forEach((vote) => {
        if (vote.idmiss == ts.id) ts.sophieu++;
      });
    });

    thiSinhList.sort((a, b) => b.sophieu - a.sophieu);
    const top3 = thiSinhList.slice(0, 3);
    top3.forEach((ts, idx) => {
      ranking.appendChild(createCard(ts, idx + 1));
    });
  } catch (err) {
    console.error("Lỗi xử lý dữ liệu:", err);
  }
}

// Render Cards
async function renderCards() {
  const snapshot = await get(ref(db, "/dsthisinh"));
  if (!snapshot.exists()) return;

  cardsList.innerHTML = "";
  Object.values(snapshot.val()).forEach((item) => {
    cardsList.appendChild(createCard(item));
  });
}

function createCard({ id, sbd, name }, rank = null) {
  const card = document.createElement("div");
  card.className = "card";
  if (rank) card.classList.add(`top${rank}`);

  const imageLogo = new Image();
  imageLogo.className = "logo";
  imageLogo.src = "img/logo/logo1.png";

  const imageMiss = new Image();
  imageMiss.className = "miss";
  imageMiss.src =
    "https://png.pngtree.com/png-clipart/20230220/original/pngtree-beautiful-girl-png-image_8960812.png";

  const effect = document.createElement("div");
  effect.className = "effect";

  const info = document.createElement("div");
  info.className = "info";

  const sbdEl = document.createElement("span");
  sbdEl.className = "sbd";
  sbdEl.innerText = `SBD ${FormatSBD(sbd)}`;

  const nameEl = document.createElement("span");
  nameEl.className = "name";
  nameEl.innerText = name.toUpperCase();

  if (!rank) {
    const btnVote = document.createElement("button");
    btnVote.className = "btn-vote";
    btnVote.setAttribute("index", id);
    // btnVote.disabled = true;
    btnVote.innerText = "Bình Chọn";
    btnVote.addEventListener("click", handleVote);
    info.appendChild(btnVote);
  }

  info.append(nameEl, sbdEl);
  card.append(imageLogo, imageMiss, effect, info);
  return card;
}

// Voting
async function handleVote(e) {
  const idmiss = e.target.getAttribute("index");
  const user = getCookie("datalogin");
  if (!user) return showNotification("Vui lòng đăng nhập lại!");
  const AllBtnVote = document.querySelectorAll(".btn-vote");

  AllBtnVote.forEach((el) => (el.disabled = true));

  await votePerDay(user).then((rs) => {
    if (rs) {
      set(ref(db, `/chitietvotes/${Date.now()}`), {
        idbinhchon: user,
        idmiss,
      }).catch((err) => {
        console.error("Lỗi bình chọn:", err);
      });
    }
  });

  AllBtnVote.forEach((el) => el.removeAttribute("disabled"));
}
async function votePerDay(userId) {
  const todayObj = new Date();
  const today = `${String(todayObj.getDate()).padStart(2, "0")}-${String(
    todayObj.getMonth() + 1
  ).padStart(2, "0")}-${todayObj.getFullYear()}`;
  const votePath = `dsbinhchon/${userId}/votes/${today}`;
  const voteRef = ref(db, votePath);

  try {
    const snapshot = await get(voteRef);
    const data = snapshot.val();

    if (data && data.count >= 5) {
      showNotification("Đã vote đủ 5 lần hôm nay!");
      return false;
    }

    const newCount = data ? data.count + 1 : 1;

    await set(voteRef, {
      count: newCount,
    });

    showNotification(`Vote thành công! (${newCount}/5 lần hôm nay)`);
    return true;
  } catch (error) {
    console.error("Lỗi khi ghi vote:", error);
    showNotification("Lỗi khi ghi vote.");
    return false;
  }
}
// UI Control
window.addEventListener("load", async () => {
  const loadingScreen = document.getElementById("loading-screen");
  await renderCards();
  loadingScreen.classList.add("hidden");

  setTimeout(() => (loadingScreen.style.display = "none"), 500);
  processData();
});

document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("gesturestart", (e) => e.preventDefault());
document.addEventListener("wheel", (e) => {
  if (e.ctrlKey || e.metaKey) e.preventDefault();
});
