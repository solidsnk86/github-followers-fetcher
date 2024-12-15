onmessage = async (event) => {
  const { user, type, GITHUB_TOKEN } = event.data;

  async function getDataFollow() {
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

    $errors.textContent = "";
    apiStats.rateLimit = "";
    apiStats.remaingLimit = "";

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

        if (response.status === 403) {
          dialog.innerHTML = `
              <header>
              <span>Estado: ${response.status}</span>
              <span></span>
              </header>
              <p style="padding: 16px;">El límite de la API es ${rateLimit} peticiones por hora. 
              Peticiones restantes: ${rateRemaing}. Deberás hacer uso de tu token! Se recargará la página..
              </p>
              `;
          dialog.show();
          setTimeout(() => {
            location.reload();
          }, 9000);
          clearTimeout();
        }
        apiStats.rateLimit = `Límite de API ${rateLimit}`;
        apiStats.remaingLimit = `Peticiones restantes: ${rateRemaing}`;

        const data = await response.json();

        if (data.length === 0) break;

        allData.push(...data);

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

  const [followers, following] = await Promise.all([
    getDataFollow(user, "followers", token),
    getDataFollow(user, "following", token),
  ]);

  postMessage({ followers, following });
};
