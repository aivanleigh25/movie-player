// mobile-fix.js

const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
  console.log("Mobile detected: applying fixes"); 

  // 1️⃣ Sidebar fixes
  const sidebar = document.querySelector('.sidebar');
  const main = document.querySelector('.main');
  if (sidebar && main) {
    sidebar.style.position = "relative"; /* <-- Prevent fixed sidebar from overflowing */
    sidebar.style.width = "100%";        /* <-- Full width on top */
    sidebar.style.flexDirection = "row"; 
    sidebar.style.justifyContent = "space-around"; 
    sidebar.style.height = "auto"; 
    sidebar.style.padding = "10px 0"; 
    sidebar.style.borderRight = "none";  /* <-- remove right border for top bar */
    main.style.marginLeft = "0";         /* <-- Remove left margin caused by desktop sidebar */
  }

  // 2️⃣ Player size
  const player = document.getElementById('playerContainer');
  const frame = document.getElementById('movieFrame');
  if(player && frame){
    player.style.width = "100%";
    player.style.height = "auto";
    frame.style.width = "100%";
    frame.style.height = "56.25vw"; /* 16:9 aspect ratio */
    frame.style.position = "relative";
  }

  // 3️⃣ Toolbar adjustments
  const toolbar = document.querySelector('.toolbar');
  if(toolbar){
    toolbar.style.flexDirection = "column";
    toolbar.style.alignItems = "stretch";
    toolbar.style.gap = "8px";
  }

  // 4️⃣ Buttons sizing
  const buttons = document.querySelectorAll('.btn, .navbtn, .home-btn, .navlink');
  buttons.forEach(btn => {
    btn.style.padding = "10px 12px";
    btn.style.fontSize = "14px";
  });

  // 5️⃣ Results grid fix
  const results = document.getElementById('results');
  if(results){
    results.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 1fr))";
  }

  // 6️⃣ Prevent horizontal scrolling
  document.body.style.overflowX = "hidden";

  // 7️⃣ Auto-scroll to player when movie loads
  const _oldLoadMobile = window.loadFromFields;
  window.loadFromFields = async function(imdbIDOverride){
    await _oldLoadMobile(imdbIDOverride);
    if(player){
      player.scrollIntoView({behavior: "smooth", block: "start"});
    }
  }

  // 8️⃣ Copy link button (once)
  const copyBtn = document.getElementById('copyBtn'); 
  const input = document.getElementById('imdbInput'); 
  copyBtn.addEventListener('click', async () => {
    const imdbID = input.value.trim();
    if(!imdbID){
      alert("Pangita sag salida dawg");
      return;
    }
    const shareURL = `${window.location.origin}${window.location.pathname}?imdb=${encodeURIComponent(imdbID)}`;
    try { await navigator.clipboard.writeText(shareURL); alert("Link copied! ✅"); }
    catch(e){
      const tempInput = document.createElement("input");
      tempInput.value = shareURL;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      alert("Link copied! ✅");
    }
  });
}
  if(toolbar){
    toolbar.style.flexDirection = "column"; /* <-- Whats is this for --> Stack buttons and input vertically */
    toolbar.style.alignItems = "stretch";
  }

  // Increase touch targets
  const buttons = document.querySelectorAll('.btn, .navbtn, .home-btn');
  buttons.forEach(btn => {
    btn.style.padding = "12px 16px"; /* <-- Whats is this for --> Easier to tap on mobile */
    btn.style.fontSize = "16px";
  });

  // Fix results grid on mobile
  const results = document.getElementById('results');
  if(results){
    results.style.gridTemplateColumns = "repeat(auto-fill, minmax(120px, 1fr))"; /* <-- Whats is this for --> Fit small screens */
  }

  // Optional: Auto-scroll to player when a movie loads
  const _oldLoadMobile = window.loadFromFields;
  window.loadFromFields = async function(imdbIDOverride){
    await _oldLoadMobile(imdbIDOverride);
    if(player){
      player.scrollIntoView({behavior: "smooth", block: "start"}); /* <-- Whats is this for --> Bring the player into view on small screens */
    }
  }

  // ✅ Copy Link button logic (run once, not inside loadFromFields)
  const copyBtn = document.getElementById('copyBtn'); 
  const input = document.getElementById('imdbInput'); 

  /* <-- Whats is this for --> Copy IMDb/movie link to clipboard when button is clicked */
  copyBtn.addEventListener('click', async () => {
    const imdbID = input.value.trim();
    if(!imdbID){
      alert("Pangita sag salida dawg"); // Mobile-friendly alert
      return;
    }

    // Construct shareable link
    const shareURL = `${window.location.origin}${window.location.pathname}?imdb=${encodeURIComponent(imdbID)}`;

    try {
      // Use Clipboard API
      await navigator.clipboard.writeText(shareURL);
      alert("Na copy na ang link dawg ✅"); /* <-- Whats is this for --> Notify user link is copied */
    } catch (err) {
      // fallback if Clipboard API fails
      const tempInput = document.createElement("input");
      tempInput.value = shareURL;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      alert("Na copy na ang link dawg ✅");
    }
  });

}
