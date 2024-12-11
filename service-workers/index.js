const worker = new Worker("worker.js");
const input = document.getElementById("input");
const form = document.querySelector("form");

const buffer = {
  title: "worms armageddon",
  age: 1998,
  type: "Pc game",
  oldGame: true,
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  worker.postMessage(input.value);
});

worker.addEventListener("message", (event) => {
  const result = event.data;

  document.body.innerHTML += `<p>${event.data}</p>`;
  console.log("Resultado del Worker:", result);
});
worker.addEventListener("error", (error) => {
  console.error("Error en el service worker", error.message);
});

function updateStatusOnline() {
  const status = navigator.onLine ? "En línea" : "Fuera de línea";
  const message = `Actualmente estás: ${status}`;
  return message;
}

const sendInformation = () => {
  return window.addEventListener("focus", () => {
    console.log("El usuario se fúe de la ventana");
  });
};
