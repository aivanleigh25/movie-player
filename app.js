const API_KEY = "YOUR_TMDB_API_KEY"; // replace with TMDB key
const PROXY = "https://your-proxy.com/embed?url="; // VidSrc-NoAds proxy

async function searchMovies() {
  const q = document.getElementById("query").value;
  if (!q) return;
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}`);
  const data = await res.json();
  renderResults(data.results);
}

function renderResults(movies) {
  const grid = document.getElementById("results");
  grid.innerHTML = "";
  movies.forEach(m => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${m.poster_path}" alt="${m.title}">
      <div class="meta">
        <div class="title">${m.title}</div>
        <div>${m.release_date?.slice(0,4) || ""}</div>
      </div>
    `;
    card.onclick = () => playMovie(m.id);
    grid.appendChild(card);
  });
}

async function playMovie(tmdbId) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${API_KEY}`);
    const ids = await res.json();
    const imdb = ids.imdb_id;
    if (!imdb) return alert("No IMDb ID found.");

    const embedUrl = `https://vidsrc.dev/embed/movie/${imdb}`;
    const proxyUrl = `${PROXY}${encodeURIComponent(embedUrl)}`;

    const frame = document.getElementById("movieFrame");
    frame.src = proxyUrl;
    document.getElementById("player").style.display = "block";

    // fallback after 5s
    setTimeout(() => {
      if (!frame.contentWindow) frame.src = embedUrl;
    }, 5000);
  } catch (e) {
    console.error(e);
  }
}
