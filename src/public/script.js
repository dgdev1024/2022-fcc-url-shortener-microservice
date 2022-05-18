const URLForm = document.querySelector(".url-form");
const URLInput = document.getElementById("long-url");
const URLResult = document.querySelector(".result");

URLForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  URLResult.innerHTML = "<em>Generating Short URL...</em>";

  const result = await fetch("/api/shorturl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: URLInput.value,
    }),
  });

  const data = await result.json();

  if (data.error) {
    console.error(data.error);
    URLResult.innerHTML = "The URL you submitted is invalid.";
  } else {
    URLResult.innerHTML = `Your shortened URL is: <a href="${data.short_url_full}" target="_blank">${data.short_url_full}</a>.`;
  }
});
