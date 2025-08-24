// copy-link.js

document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn'); 
  const input = document.getElementById('imdbInput'); 

  /* <-- Whats is this for --> Copy IMDb/movie link to clipboard when button is clicked */
  if(copyBtn && input){
    copyBtn.addEventListener('click', async () => {
      const imdbID = input.value.trim();
      if(!imdbID){
        alert("Pangita sag salida dawg"); // Mobile-friendly alert
        return;
      }

      // Construct shareable link
      const shareURL = `${window.location.origin}${window.location.pathname}?imdb=${encodeURIComponent(imdbID)}`;

      try {
        // Use modern Clipboard API
        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText(shareURL);
        } else {
          // fallback for older browsers
          const tempInput = document.createElement("input");
          tempInput.value = shareURL;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }

        alert("Link copied! ✅"); /* <-- Notify user link is copied */
      } catch (err) {
        console.error("Copy failed", err);
        alert("Failed to copy link. Try manually.");
      }
    });
  }
});
