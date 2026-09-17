const form = document.getElementById("love-form");
const name1 = document.getElementById("name1");
const name2 = document.getElementById("name2");
const calcBtn = document.getElementById("calc-btn");
const result = document.getElementById("result");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loader-text");
const resultContent = document.getElementById("result-content");
const scoreNum = document.getElementById("score-num");
const ringFill = document.getElementById("ring-fill");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const starsEl = document.getElementById("stars");
const toast = document.getElementById("toast");
const confetti = document.getElementById("confetti");

let currentMood = "dreamy";
let currentScore = 0;
let currentNames = "";

const RING_CIRCUMFERENCE = 2 * Math.PI * 88;

/* ---------------- Mood picker ---------------- */
document.getElementById("moods").addEventListener("click", (e) => {
  const btn = e.target.closest(".mood");
  if (!btn) return;
  document.querySelectorAll(".mood").forEach((m) => m.classList.remove("active"));
  btn.classList.add("active");
  currentMood = btn.dataset.mood;
});

/* ---------------- Floating hearts background ---------------- */
const heartGlyphs = ["❤", "💖", "💕", "💗", "💘", "🌸", "✨"];

function spawnHeart() {
  const bg = document.getElementById("hearts-bg");
  const h = document.createElement("span");
  h.className = "floaty";
  h.textContent = heartGlyphs[Math.floor(Math.random() * heartGlyphs.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 24 + "px";
  const duration = 7 + Math.random() * 8;
  h.style.animationDuration = duration + "s";
  bg.appendChild(h);
  setTimeout(() => h.remove(), duration * 1000);
}

setInterval(spawnHeart, 550);
for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 220);

/* ---------------- The "science" ---------------- */
const moodBoost = { shy: 4, bold: 7, dreamy: 9, silly: 6 };

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function countSharedLetters(a, b) {
  const setB = new Set(b.replace(/\s/g, "").toLowerCase());
  let shared = 0;
  for (const ch of new Set(a.replace(/\s/g, "").toLowerCase())) {
    if (setB.has(ch)) shared++;
  }
  return shared;
}

function calculateLove(a, b) {
  const clean = (s) => s.trim().toLowerCase();
  const x = clean(a);
  const y = clean(b);

  if (!x || !y) return 0;

  const base = hashString([x, y].sort().join("+")) % 101;
  const shared = countSharedLetters(x, y);
  const lengthBonus = Math.max(0, 8 - Math.abs(x.length - y.length)) * 2;
  const mood = moodBoost[currentMood] || 0;
  const magic = (x.length * y.length * 7) % 11;

  let score = base * 0.62 + shared * 3 + lengthBonus + mood + magic;
  score = Math.round(Math.min(100, Math.max(1, score)));
  return score;
}

/* ---------------- Result copy ---------------- */
function getVerdict(score) {
  if (score >= 95) return { title: "Soulmates! 💞", msg: "The universe literally wrote your names in the stars. This is the kind of love they make movies about. Do not mess this up!", stars: 5 };
  if (score >= 85) return { title: "True Love! 💖", msg: "Absolutely electric. You finish each other's sentences and probably each other's snacks. Cherish this one.", stars: 5 };
  if (score >= 70) return { title: "Great Match! 💕", msg: "Strong vibes detected! There's real chemistry here — a little effort and this could be legendary.", stars: 4 };
  if (score >= 55) return { title: "Sweet Potential 💗", msg: "There's a spark worth fanning into a flame. Plan a fun date and see where it goes!", stars: 3 };
  if (score >= 40) return { title: "Friendship Zone 🌸", msg: "Wonderful humans, questionable romance. You'd make an amazing duo on a trivia team, though.", stars: 2 };
  if (score >= 25) return { title: "Bumpy Road 🚧", msg: "The stars are... skeptical. But hey, opposites attract, right? Right?", stars: 2 };
  if (score >= 12) return { title: "A Wild Experiment 🧪", msg: "This could go either way, and honestly that's exciting. Proceed with snacks and low expectations.", stars: 1 };
  return { title: "Yikes! 💔", msg: "The calculator needed a nap after computing this one. Maybe just stay friends... or become pen pals.", stars: 1 };
}

/* ---------------- Loading theatre ---------------- */
const loadingLines = [
  "Consulting the stars...",
  "Analyzing butterflies per minute...",
  "Measuring heartbeats...",
  "Cross-referencing constellations...",
  "Bribing Cupid for a good score...",
  "Polishing the results..."
];

function runLoader() {
  return new Promise((resolve) => {
    let i = 0;
    loaderText.textContent = loadingLines[0];
    const tick = setInterval(() => {
      i++;
      if (i < loadingLines.length) {
        loaderText.textContent = loadingLines[i];
      } else {
        clearInterval(tick);
        resolve();
      }
    }, 520);
  });
}

/* ---------------- Confetti ---------------- */
function launchConfetti() {
  const pieces = ["❤", "💖", "💕", "✨", "💘", "🎉", "💗"];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("span");
    p.className = "confetti-piece";
    p.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = 14 + Math.random() * 22 + "px";
    const dur = 2.2 + Math.random() * 2.2;
    p.style.animationDuration = dur + "s";
    p.style.animationDelay = Math.random() * 0.6 + "s";
    confetti.appendChild(p);
    setTimeout(() => p.remove(), (dur + 0.8) * 1000);
  }
}

/* ---------------- Render result ---------------- */
function renderStars(count) {
  starsEl.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const s = document.createElement("span");
    s.textContent = i < count ? "⭐" : "☆";
    s.style.animationDelay = i * 0.08 + "s";
    starsEl.appendChild(s);
  }
}

function animateScore(target) {
  const duration = 1400;
  const start = performance.now();
  const circumference = RING_CIRCUMFERENCE;

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.round(target * eased);
    scoreNum.textContent = val;
    ringFill.style.strokeDashoffset = circumference - (target / 100) * circumference * eased;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------------- Submit ---------------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const a = name1.value.trim();
  const b = name2.value.trim();
  if (!a || !b) {
    showToast("Please enter both names 💌");
    return;
  }

  calcBtn.disabled = true;
  calcBtn.textContent = "Calculating...";
  result.classList.add("show");
  loader.classList.add("show");
  resultContent.classList.remove("show");

  await runLoader();

  currentScore = calculateLove(a, b);
  currentNames = a + " & " + b;
  const verdict = getVerdict(currentScore);

  scoreNum.textContent = "0";
  ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE;
  resultTitle.textContent = verdict.title;
  resultMessage.textContent = verdict.msg;
  renderStars(verdict.stars);

  loader.classList.remove("show");
  resultContent.classList.add("show");

  animateScore(currentScore);

  if (currentScore >= 70) launchConfetti();

  calcBtn.disabled = false;
  calcBtn.textContent = "Calculate Love";

  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

/* ---------------- Share / Again ---------------- */
document.getElementById("share-btn").addEventListener("click", () => {
  const text = `${currentNames} = ${currentScore}% love match! ${getVerdict(currentScore).title}`;
  navigator.clipboard.writeText(text).then(
    () => showToast("Result copied! 💘"),
    () => showToast("Couldn't copy, but you're cute anyway 😅")
  );
});

document.getElementById("again-btn").addEventListener("click", () => {
  form.reset();
  document.querySelectorAll(".mood").forEach((m) => m.classList.remove("active"));
  currentMood = "dreamy";
  result.classList.remove("show");
  resultContent.classList.remove("show");
  loader.classList.remove("show");
  name1.focus();
});

/* ---------------- Toast ---------------- */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------------- Fun extras ---------------- */
document.getElementById("heart-divider").addEventListener("click", (e) => {
  const h = e.currentTarget.querySelector(".pulse-heart");
  h.style.fontSize = "2.4rem";
  setTimeout(() => (h.style.fontSize = ""), 220);
  showToast("Sending love your way 💌");
});

name1.focus();
