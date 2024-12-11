const $errors = document.querySelector("#errors");
const dialog = document.querySelector("dialog");
const options = document.getElementById("options");
const toGithub = document.getElementById("github");
const toShare = document.getElementById("share");
const personalWeb = document.getElementById("personal-web");
const x = document.getElementById("x");
const dialogMessage = document.querySelector(".dialog.message");

let apiStats = {
  rateLimit: "",
  remaingLimit: "",
};

const imgStyles = [
  "border: 2px solid #f0f0f0",
  "width: 45px",
  "height: 45px",
].join(";");

const anchorStyles = ["display: flex", "align-items: center"].join(";");

const createHTML = (user, avatar) => `
<a class="avatars" href="https://github.com/${user}/" target="_blank" title="${user}" style="${anchorStyles}">
  <img src="${avatar}" style="${imgStyles}" alt="Avatar de ${user}" />
</a>
`;

function clickSound() {
  const audio = new Audio("public/button-click.mp3");
  if (audio) {
    audio.volume = 0.1;
    audio
      .play()
      .catch((err) => console.error("Error al reproducir el audio", err));
  }
}

const formatTime = (str) => {
  const time = new Date(str).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return time;
};

const createLoader = () => `
<div class="loader">
  <div class="spinner"></div>
</div>
`;

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
        <span id="x">X</span>
        </header>
        <p style="padding: 16px;">El límite de la API es ${rateLimit} peticiones por hora. 
        Peticiones restantes: ${rateRemaing}. Deberás hacer uso de tu token!
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

options.onclick = (event) => {
  event.stopPropagation();
  dialog.show();
};

document.addEventListener("keydown", (event) => {
  event.stopPropagation();
  if (event.ctrlKey && event.key === "i") {
    dialog.show();
  } else if (event.key === "Escape") {
    dialog.close();
  }
});

document.addEventListener("click", (event) => {
  if (dialog.open && !dialog.contains(event.target)) {
    dialog.close();
  }
});

x.onclick = () => {
  dialog.close();
};

toGithub.onclick = () => {
  window.open("https://github.com/solidsnk86/", "_blank");
};

toShare.onclick = () => {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      text: "Descubre quien no te sigue de vuelta en Github 🐱‍🚀",
      url: location.href,
    });
  }
};

personalWeb.onclick = () => {
  window.open("https://personal-portfolio-mgc.vercel.app", "_blank");
};

const createDialog = (type, message) => `
<dialog>
      <header>
        <span>${type}</span>
        <span id="x">X</span>
      </header>
      <div>
        <p>${message}<p>
      </div>
    </dialog>
`;

document.addEventListener("DOMContentLoaded", () => {
  const $article = document.querySelector("article");
  const followersPlaceholder = document.getElementById("followers");
  const followingPlaceholder = document.getElementById("following");
  const nonFollowingPlaceholder = document.getElementById("non-following");
  const inputUser = document.querySelector("#user");
  const inputToken = document.querySelector("#token");
  const form = document.querySelector("form");
  const stats = document.querySelector("#api-stats");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = inputUser.value;
    const token = inputToken.value;

    $article.innerHTML = createLoader();
    followersPlaceholder.textContent = "0";
    followingPlaceholder.textContent = "0";
    nonFollowingPlaceholder.textContent = "0";

    try {
      const [followers, following] = await Promise.all([
        getDataFollow(user, "followers", token),
        getDataFollow(user, "following", token),
      ]);

      $article.innerHTML = "";

      if (followers.length === 0) {
        $errors.innerHTML = `
          <h1 style="
            width: 100%; 
            text-align: center; 
            color: var(--text-color);
            padding: 20px;
          ">
            No se encontraron seguidores para este usuario.
          </h1>
        `;
        return;
      }

      const followersUsers = new Set(followers.map((user) => user.login));
      const followingUsers = new Set(following.map((user) => user.login));
      const nonFollowing = Array.from(followingUsers).filter(
        (login) => !followersUsers.has(login)
      );
      const nonFollowingAvatars = new Set(
        following.map((user) => user.avatar_url)
      );
      const nonFollowersAvatars = new Set(
        followers.map((user) => user.avatar_url)
      );
      const nonFollowingAvatar = Array.from(nonFollowingAvatars).filter(
        (avatar_url) => !nonFollowersAvatars.has(avatar_url)
      );

      nonFollowing.forEach((user, i) => {
        $article.innerHTML += createHTML(user, nonFollowingAvatar[i]);
      });

      window.scrollTo({
        top: document.body.scrollHeight * 0.9,
        behavior: "smooth",
      });

      document.querySelectorAll(".avatars img").forEach((avatar) => {
        avatar.onmouseenter = (event) => {
          event.preventDefault();
          clickSound();
        };
      });

      followersPlaceholder.textContent = followers.length;
      followingPlaceholder.textContent = following.length;
      nonFollowingPlaceholder.textContent = nonFollowing.length;
      stats.textContent = `${apiStats.rateLimit} | ${apiStats.remaingLimit}`;
    } catch (err) {
      console.error("Error al inicializar la aplicación", err);
      $article.innerHTML = "";
      $errors.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          margin: 20px auto;
          width: 100%; 
        ">
        <h1 style="
          text-align: center; 
          color: var(--text-color);
          padding: 20px;
        ">
          Error
        </h1>
        <p style="
          width: 100%; 
          text-align: center; 
          color: tomato;
          padding: 10px;
        ">
          No se pudo cargar los datos. Por favor revise su usuario y/o su token, si es que lo ha ingresado.
        </p>
        </div>
      `;
    }
  });
});
