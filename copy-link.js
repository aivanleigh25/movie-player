// copy-link.js
document.addEventListener('DOMContentLoaded', () => {
  const copyBtn = document.getElementById('copyBtn'); 
  const input = document.getElementById('imdbInput'); 

  if(copyBtn && input){
    copyBtn.addEventListener('click', async () => {
      const imdbID = input.value.trim();
      if(!imdbID){
        alert("Pangita sag salida dawg");
        return;
      }

      // Include IMDb ID as query parameter
      const shareURL = `${window.location.origin}${window.location.pathname}?imdb=${encodeURIComponent(imdbID)}`;

      try {
        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText(shareURL);
        } else {
          const tempInput = document.createElement("input");
          tempInput.value = shareURL;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }
        alert("Link copied! ✅");
      } catch (err) {
        console.error("Copy failed", err);
        alert("Failed to copy link. Try manually.");
      }
    });
  }
});
