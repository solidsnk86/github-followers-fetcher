const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRh_8-s9C7TJhwkud-t5WEbqQJ4f54sHcL9qVRCGQaJL4SPROJOpqm7XvHhRGU_h_pl-Brq-lwKlGiV/pub?gid=1442110193&single=true&output=csv";
/**
 * @Columns
 * Movie Title
 * Release Date
 * Wikipedia URL
 * Genre (1)
 * Genre (2)
 * Director (1)
 * Director (2)
 * Cast (1)
 * Cast (2)
 * Cast (3)
 * Cast (4)
 * Cast (5)
 * Budget ($)
 * Box Office
 * Revenue ($)
 */
let error = TypeError;
async function getData() {
  const response = await fetch(url);
  const data = await response.text();
  if (!response.ok) {
    document.body.innerHTML = response.statusText;
  }
  const formattedData = data
    .split("\n")
    .slice(1)
    .map((row) => {
      const [
        movieTitle,
        releaseDate,
        wikiUrl,
        genre_1,
        genre_2,
        director_1,
        director_2,
        cast_1,
        cast_2,
        cast_3,
        cast_4,
        cast_5,
        budget,
        boxOffice,
        revenue,
      ] = row.split(",");
      return {
        movieTitle,
        releaseDate,
        wikiUrl,
        genre_1,
        genre_2,
        director_1,
        director_2,
        cast_1,
        cast_2,
        cast_3,
        cast_4,
        cast_5,
        budget,
        boxOffice,
        revenue,
      };
    });
  return formattedData;
}

const generateHTML = (
  movieTitle,
  releaseDate,
  wikiUrl,
  genre_1,
  genre_2,
  director_1,
  director_2,
  cast_1,
  cast_2,
  cast_3,
  cast_4,
  cast_5,
  budget,
  boxOffice,
  revenue
) => {
  return `
     <tr>
        <td>${movieTitle}</td>
        <td>${releaseDate}</td>
         <td><a href="${wikiUrl}" target="_blank">${wikiUrl}</a></td>
         <td>${genre_1}</td>
         <td>${genre_2}</td>
         <td>${director_1}</td>
         <td>${director_2}</td>
         <td>${cast_1}</td>
         <td>${cast_2}</td>
         <td>${cast_3}</td>
         <td>${cast_4}</td>
         <td>${cast_5}</td>
         <td>${budget}</td>
         <td>${boxOffice}</td>
         <td>${revenue}</td>
    </tr>
`;
};

document.addEventListener("DOMContentLoaded", async () => {
  const movies = await getData();
  const tbody = document.querySelector("tbody");
  const result = document.getElementById("results");
  const revenues = movies.map((movie) => {
    const revenue = movie.revenue.replace(/"/, "").replace(/\./g, "");
    return Number(revenue);
  });
  const maxRevenue = Math.max(...revenues);
  const minRevenue = Math.min(...revenues);
  const totalRevenue = revenues.reduce((acc, current) => acc + current, 0);
  const averageRevenue = totalRevenue / revenues.length;

  if (movies.length === 0) {
    tbody.innerHTML = `<h1>Cargando...</h1>`;
  } else {
    tbody.innerHTML = movies
      .map((movie) =>
        generateHTML(
          movie.movieTitle.trim(),
          movie.releaseDate.trim(),
          movie.wikiUrl.trim(),
          movie.genre_1.trim(),
          movie.genre_2.trim(),
          movie.director_1.trim(),
          movie.director_2.trim(),
          movie.cast_1.trim(),
          movie.cast_2.trim(),
          movie.cast_3.trim(),
          movie.cast_4.trim(),
          movie.cast_5.trim(),
          movie.budget.trim().replace(/"/, ""),
          movie.boxOffice.trim().replace(/"/, ""),
          movie.revenue.trim().replace(/"/, "")
        )
      )
      .join("");
  }

  result.innerHTML = `
  <p>Cantidad de películas: ${movies.length}</p>
  <p>Ingreso más alto: U$D ${maxRevenue}</p> 
  <p>Ingreso más bajo: U$D ${minRevenue}</p>
  <p>Ingreso promedio: U$D ${averageRevenue.toFixed(0)}</p>
  `;
});
