const calendarContainer = document.getElementById("calendar");

function ramdomGift(gifts) {
  const randomIndex = Math.floor(Math.random() * gifts.length);
  return gifts[randomIndex];
}

function saveToLocalStorage(key, value) {
  checkDuplicates(key);
  localStorage.setItem(key, value);
}

const gifts = [
  "🎁",
  "🍬",
  "🍭",
  "🍮",
  "🍰",
  "🍡",
  "🍫",
  "🍪",
  "🍩",
  "🎂",
  "🥞",
  "🧁",
  "🍧",
  "🍨",
  "🍦",
];

function checkDuplicates(item) {
  const items = localStorage.getItem(item);
  const noDuplicate = new Set([items].sort()).has(item);
  return noDuplicate;
}

for (let i = 1; i <= 24; i++) {
  let box = document.createElement("li");
  box.classList.add("calendar-box");
  let number = document.createElement("p");
  number.innerHTML = i;
  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-gift");
  let description = document.createElement("p");
  description.innerHTML = "Open me!";
  box.appendChild(number);
  box.appendChild(icon);
  box.appendChild(description);
  calendarContainer.appendChild(box);
  const dialog = document.createElement("dialog");

  box.style.cursor = "pointer";
  box.title = `December ${i} - Click to recibe your gift!`;

  dialog.innerHTML = `
  <span class="close-button">❌</span>
  <h3>Welcome to JavaScriptmas ${new Date().getFullYear()}</h3>
  <p>December ${i}, 🎅 take your gift for this day: ${ramdomGift(gifts)}</p>
  `;

  document.body.appendChild(dialog);

  box.onclick = () => {
    dialog.show();
    saveToLocalStorage(
      JSON.stringify(`December ${i}`),
      dialog.textContent.replace("❌", "")
    );
  };

  const closeButton = dialog.querySelector(".close-button");
  closeButton.onclick = () => {
    dialog.close();
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dialog.close();
    }
  });
}
