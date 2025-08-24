// mobile-fix.js

// Detect mobile devices
const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/* <-- Whats is this for --> Detect if user is on a mobile device to apply specific fixes */

if(isMobile){
  console.log("Mobile detected: applying fixes"); 

  // Make sidebar horizontal on mobile (if necessary)
  const sidebar = document.querySelector('.sidebar');
  if(sidebar){
    sidebar.style.position = "static"; /* <-- Whats is this for --> Prevent fixed sidebar from breaking layout on small screens */
    sidebar.style.width = "100%";
    sidebar.style.flexDirection = "row";
    sidebar.style.justifyContent = "space-around";
    sidebar.style.height = "auto";
    sidebar.style.padding = "10px";
  }

  // Adjust player size
  const player = document.getElementById('playerContainer');
  if(player){
    player.style.width = "100%"; /* <-- Whats is this for --> Make player take full width on mobile */
    player.style.height = "auto";
  }

  const frame = document.getElementById('movieFrame');
  if(frame){
    frame.style.height = "56.25vw"; /* <-- Whats is this for --> Keep 16:9 aspect ratio on mobile */
    frame.style.position = "relative"; 
  }

  // Make toolbar elements wrap nicely
  const toolbar = document.querySelector('.toolbar');
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
