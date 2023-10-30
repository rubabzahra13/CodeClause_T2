function shortenURL(event) {
  event.preventDefault(); // Prevent the default form submission

  const urlInput = document.getElementById("urlInput");
  const shortenedURL = document.getElementById("shortenedURL");

  const longURL = urlInput.value;
  const serverURL = "http://localhost:3000";
  fetch(serverURL + "/api/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longURL }),
  })
    .then((response) => response.json())
    .then((data) => {
      shortenedURL.innerHTML = `<a href="${data.shortURL}" target="_blank">${data.shortURL}</a>`;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Add an event listener to the form
const shortenForm = document.querySelector("form");
shortenForm.addEventListener("submit", shortenURL);
