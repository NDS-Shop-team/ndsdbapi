const getErrorHtml = (status, message, details) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${status} - ${message}</title>
  <style>
    :root {
      --bg-color: #f8f9fa;
      --text-color: #212529;
      --error-color: #ef4444;
      --primary-color: #2563eb;
      --card-bg: #f8fafc;
      --card-border: #e5e7eb;
    }
    body.dark-mode {
      --bg-color: #121212;
      --text-color: #e0e0e0;
      --card-bg: #1e1e1e;
      --card-border: #444444;
    }
    body { 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
      max-width: 800px; 
      margin: 0 auto;
      padding: 1rem; 
      text-align: center;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: var(--bg-color);
      color: var(--text-color);
      transition: background-color 0.2s, color 0.2s;
    }
    @media (min-width: 768px) {
      body {
        padding: 2rem;
      }
    }
    .error-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
    }
    .error-code { 
      font-size: clamp(4rem, 15vw, 8rem);
      color: var(--error-color); 
      margin: 0;
      line-height: 1;
      text-shadow: 2px 2px 4px rgba(239, 68, 68, 0.2);
    }
    .error-message { 
      font-size: clamp(1.25rem, 4vw, 2rem);
      color: var(--text-color); 
      margin: 1rem 0 2rem;
      line-height: 1.2;
    }
    .details { 
      background: var(--card-bg); 
      padding: 1rem; 
      border-radius: 8px; 
      text-align: left;
      border: 1px solid var(--card-border);
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      margin: 1rem 0;
      font-size: clamp(14px, 2vw, 16px);
    }
    .details h3 {
      margin-top: 0;
      color: var(--text-color);
      font-size: 1.25rem;
    }
    .details ul {
      margin: 0;
      padding-left: 1.5rem;
    }
    .details li {
      margin: 0.5rem 0;
      line-height: 1.4;
    }
    .details li ul {
      margin-top: 0.5rem;
    }
    .suggestion { 
      margin-top: 2rem; 
      color: #4b5563;
	  /* Note : la classe dark-mode est ajoutée via JS */
      padding: 1.5rem;
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      font-size: clamp(14px, 2vw, 16px);
    }
    .suggestion.dark-mode {
        color: #9ca3af;
    }
    .suggestion a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
    }
    .suggestion a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="error-container">
  <h1 class="error-code">${status}</h1>
  <h2 class="error-message">${message}</h2>
  
  ${
  details && Object.keys(details).length > 0
    ? `
  <div class="details">
    <h3>What happened?</h3>
    <ul>
      ${Object.entries(details)
        .map(
          ([key, value]) =>
            `<li><strong>${key}:</strong> ${
              Array.isArray(value)
                ? `<ul>${value.map((item) => `<li>${item}</li>`).join("")}</ul>`
                : value
            }</li>`
        )
        .join("")}
    </ul>
  </div>
  `
    : ""
}
  
  <p class="suggestion">
    💡 Need help? Check out our <a href="/docs/">API documentation</a> for the correct endpoints and usage.
  </p>
  </div>
  <script>
    // Applique le thème sombre/clair en se basant sur le localStorage
    if (localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.body.classList.add("dark-mode");
      const suggestionEl = document.querySelector('.suggestion');
	  if (suggestionEl) {
		suggestionEl.classList.add("dark-mode");
	  }
    }
  </script>
</body>
</html>
`;

module.exports = { getErrorHtml };
