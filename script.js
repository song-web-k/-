const revealItems = document.querySelectorAll(".reveal");
const countItems = document.querySelectorAll(".count");
const statsBoard = document.querySelector(".stats-board");
const starCards = Array.from(document.querySelectorAll(".star-card"));
const prevButton = document.querySelector(".carousel-btn.prev");
const nextButton = document.querySelector(".carousel-btn.next");
const popover = document.querySelector("#playerPopover");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const numberObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = "true";
      animateNumber(entry.target, Number(entry.target.dataset.target || 0), 1100);
    });
  },
  { threshold: 0.6 }
);

countItems.forEach((item) => numberObserver.observe(item));

function animateNumber(element, target, duration) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || statsBoard.dataset.done) return;
      statsBoard.dataset.done = "true";
      document.querySelectorAll(".stat-row").forEach((row) => {
        const value = Number(row.dataset.value || 0);
        row.querySelector("i").style.width = `${value}%`;
        animateNumber(row.querySelector("strong"), value, 1200);
      });
    });
  },
  { threshold: 0.35 }
);

if (statsBoard) statsObserver.observe(statsBoard);

let activeCard = 0;
function setActiveCard(index) {
  activeCard = (index + starCards.length) % starCards.length;
  starCards.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === activeCard);
  });
}

prevButton?.addEventListener("click", () => setActiveCard(activeCard - 1));
nextButton?.addEventListener("click", () => setActiveCard(activeCard + 1));
setInterval(() => setActiveCard(activeCard + 1), 3200);

document.querySelectorAll(".player-dot").forEach((button) => {
  button.addEventListener("click", () => {
    const stats = [
      ["Goals", button.dataset.goals],
      ["Speed", button.dataset.speed],
      ["Dribbling", button.dataset.dribbling],
      ["Overall", button.dataset.overall],
    ];

    popover.innerHTML = `
      <h3>${button.dataset.name}</h3>
      <p>${button.dataset.role}</p>
      ${stats
        .map(
          ([label, value]) => `
            <div class="mini-stat">
              <span>${label}</span>
              <i style="width:${value}%"></i>
              <strong>${value}</strong>
            </div>
          `
        )
        .join("")}
    `;
    popover.classList.add("show");
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") popover?.classList.remove("show");
});
