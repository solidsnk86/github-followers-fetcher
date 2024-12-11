self.addEventListener("message", async (event) => {
  const data = event.data;
  const result = compute(data);
  const resultType = prubeTypes(data);
  self.postMessage(result);
  self.postMessage(resultType);
  const results = await getApiData(data);
  self.postMessage(results.message);
  const user = results.data.data.user.name;
  self.postMessage(`El nombre de usuario de ésta API es ${user}`);
});

function compute(data) {
  let sum = 0;

  for (let i = 0; i < data; i++) {
    sum += i;
  }
  return sum;
}

function prubeTypes(str) {
  let message = "Es de tipo ";
  if (typeof str === "string" || typeof str === "object") {
    message += typeof str;
  }
  if (typeof str === "number" || typeof str === "boolean") {
    message += typeof str;
  }
  if (typeof str === "function" || typeof str === "undefined") {
    message += typeof str;
  }
  return message;
}

const getApiData = async (user) => {
  let message = "Estado de la solicitud: ";
  const response = await fetch(
    `https://neotecs.vercel.app/api/github-stats?username=${user}`
  );
  const data = await response.json();
  if (!response.ok) message += `${response.status} (${response.statusText})`;
  if (response.ok) {
    message += `${response.status} ${response.headers}`;
    return { data, message };
  }
};
