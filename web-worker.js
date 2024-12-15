onmessage = async (event) => {
  const { user, token } = event.data;

  const [followers, following] = await Promise.all([
    getDataFollow(user, "followers", token),
    getDataFollow(user, "following", token),
  ]);

  postMessage([followers, following]);
};

async function getDataFollow(user, type, GITHUB_TOKEN) {
  const headers = GITHUB_TOKEN
    ? {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      }
    : {
        Accept: "application/vnd.github.v3+json",
      };

  let page = 1;
  const url = `https://api.github.com/users/${user}/${type}`;
  let allData = [];

  while (true) {
    try {
      const response = await fetch(`${url}?per_page=100&page=${page}`, {
        headers,
      });

      const rateLimit = response.headers.get("X-RateLimit-Limit");
      const rateRemaing = response.headers.get("X-RateLimit-Remaining");

      if (!response.ok) {
        console.error(
          `HTTP error! status: ${response.status}, Límite API: ${rateLimit} peticiones por hora. Peticiones restantes: ${rateRemaing}.`
        );
      }

      const data = await response.json();

      if (data.length === 0) break;

      allData.push(data);

      const linkHeader = response.headers.get("link");

      if (linkHeader) {
        const links = linkHeader.split(",").map((link) => link.trim());
        const nextLink = links.find((link) => link.includes('rel="next"'));
        if (!nextLink) break;
      } else {
        break;
      }

      page++;
    } catch (err) {
      console.error("Error en la petición de la API", err);
      throw err;
    }
  }

  return allData;
}
