const path = require("path");
const { version } = require(path.join(__dirname, "..", "..", "package.json"));

const getApiDocsHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NDS DB API Documentation</title>
  <style>
    :root {
      --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --primary-color: #0d6efd;
      --primary-hover: #0b5ed7;
      --bg-color: #f8f9fa;
      --bg-secondary: #ffffff;
      --text-color: #212529;
      --border-color: #dee2e6;
      --input-bg: #ffffff;
    }

    body.dark-mode {
      --bg-color: #121212;
      --bg-secondary: #1e1e1e;
      --text-color: #e0e0e0;
      --border-color: #444444;
      --input-bg: #2a2a2a;
    }

    body {
      font-family: var(--font-sans);
      line-height: 1.6;
      background-color: var(--bg-color);
      color: var(--text-color);
      margin: 0;
      padding: 0;
      transition: background-color 0.2s, color 0.2s;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    header h1 {
      color: var(--primary-color);
      margin: 0;
      font-size: 1.75rem;
    }

    .nav-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .nav-tab {
      padding: 0.75rem 1.25rem;
      font-size: 1rem;
      font-weight: 500;
      background: none;
      border: 2px solid transparent;
      border-bottom: 2px solid transparent;
      color: var(--text-color);
      cursor: pointer;
      border-radius: 6px 6px 0 0;
      transition: all 0.2s ease;
    }

    .nav-tab:hover {
      background-color: var(--input-bg);
    }

    .nav-tab.active {
      color: var(--primary-color);
      border-color: var(--border-color);
      border-bottom-color: var(--bg-secondary);
      background-color: var(--bg-secondary);
      transform: translateY(2px);
    }

    .theme-toggle {
      padding: 0.5rem;
      background: none !important;
      border: none !important;
      color: var(--text-color);
      cursor: pointer;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .theme-toggle:hover {
      background-color: var(--input-bg) !important;
    }

    .theme-toggle svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
    .theme-toggle .icon-moon {
      display: block;
    }
    .theme-toggle .icon-sun {
      display: none;
    }
    body.dark-mode .theme-toggle .icon-sun {
      display: block;
    }
    body.dark-mode .theme-toggle .icon-moon {
      display: none;
    }

    .page-content {
      display: none;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-top: none;
      border-radius: 0 0 8px 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .page-content.active {
      display: block;
    }

    #search-bar {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem;
      font-size: 1rem;
      margin-bottom: 1rem;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      background-color: var(--input-bg);
      color: var(--text-color);
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      background-color: var(--input-bg);
      font-weight: 600;
    }

    tr:hover {
      background-color: var(--input-bg);
    }

    .view-button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .view-button:hover {
      background-color: var(--primary-hover);
    }

    .endpoint-group { margin-bottom: 2rem; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; }
    .endpoint-group h3 { color: var(--primary-color); margin-top: 0; padding-bottom: 0.5rem; border-bottom: 2px solid var(--border-color); }
    .endpoint { background: var(--input-bg); padding: 1rem; margin: 1rem 0; border-radius: 4px; }
    .method { color: var(--primary-color); font-weight: bold; }
    code { 
      background: var(--input-bg); 
      border: 1px solid var(--border-color);
      padding: 0.2rem 0.4rem; 
      border-radius: 4px;
      word-break: break-word;
      white-space: pre-wrap;
    }
    details { margin-bottom: 1rem; }
    summary { cursor: pointer; padding: 0.5rem; background: var(--input-bg); border-radius: 4px; user-select: none; }
    summary:hover { opacity: 0.8; }
    .endpoint-details { padding: 1rem; border-left: 3px solid var(--border-color); margin-left: 1rem; }
    .parameters { margin-top: 0.5rem; }
    .parameter { margin-left: 1rem; }
    .response { margin-top: 0.5rem; }

    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.6);
    }
    .modal-content {
      background-color: var(--bg-secondary);
      margin: 10% auto;
      padding: 20px;
      border: 1px solid var(--border-color);
      width: 80%;
      max-width: 700px;
      border-radius: 8px;
      position: relative;
    }
    .modal-close {
      color: #aaa;
      position: absolute;
      top: 10px;
      right: 20px;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
    }
    .modal-close:hover,
    .modal-close:focus {
      color: var(--text-color);
    }
    .modal-body {
      display: flex;
      gap: 20px;
    }
    .modal-body img {
      width: 128px;
      height: 128px;
      object-fit: contain;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      flex-shrink: 0;
    }
    .modal-info h2 { margin-top: 0; color: var(--primary-color); }
    .modal-info p { margin: 5px 0; }
    .modal-info strong { color: var(--text-color); }

  </style>
</head>
<body>

  <div class="container">
    <header>
      <h1>NDS DB API Documentation</h1>
      
      <button id="theme-toggle" class="theme-toggle" title="Toggle theme">
        <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
        <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
      </button>
      
    </header>

    <nav class="nav-tabs">
      <button class="nav-tab active" data-page="game-browser-page">Game Database</button>
      <button class="nav-tab" data-page="api-docs-page">API Documentation</button>
    </nav>

    <section id="game-browser-page" class="page-content active">
      <input type="text" id="search-bar" placeholder="Search by Serial or Name...">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Serial</th>
              <th>Name</th>
              <th>Region</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody id="game-table-body">
          </tbody>
        </table>
      </div>
    </section>

    <section id="api-docs-page" class="page-content">
      <p style="margin-top:0;"><strong>API Version:</strong> ${version}</p>
      <h2>Database Structure</h2>
      <p>The API serves content from a structured database located at <code>public/db/nds/</code></p>
      <h2>Categories</h2>
      <ul>
        <li>base - Base game content</li>
      </ul>

      <h2>API Endpoints</h2>
      
      <div id="metadata" class="endpoint-group">
        <h3>Metadata Endpoints</h3>
        <p>Endpoints for retrieving title metadata and specific metadata fields.</p>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/metadata/:serial</code>
          </summary>
          <div class="endpoint-details">
            <p>Retrieve title metadata in JSON format along with all available media URLs</p>
            <div class="parameters">
              <strong>Parameters:</strong>
              <div class="parameter">
                <code>serial</code> - Game Serial (e.g., NTR-ADME-USA)
              </div>
            </div>
            <div class="response">
              <strong>Response:</strong> JSON object containing title metadata and media URLs
            </div>
          </div>
        </details>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/metadata/:serial/meta/:meta</code>
          </summary>
          <div class="endpoint-details">
            <p>Retrieve a specific metadata field</p>
            <div class="parameters">
              <strong>Parameters:</strong>
              <div class="parameter">
                <code>serial</code> - Game Serial (e.g., NTR-ADME-USA)
              </div>
              <div class="parameter">
                <code>meta</code> - Metadata field name (e.g., name, description, release_date)
              </div>
            </div>
            <div class="response">
              <strong>Response:</strong> Single metadata value
            </div>
          </div>
        </details>
      </div>

      <div id="media" class="endpoint-group">
        <h3>Media Asset Endpoints</h3>
        <p>Endpoints for accessing title banners, icons, and other media assets.</p>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/images/:serial/banner</code>
          </summary>
          <div class="endpoint-details">
            <p>Get the title's banner image</p>
          </div>
        </details>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/images/:serial/icon</code>
          </summary>
          <div class="endpoint-details">
            <p>Get the title's icon image</p>
          </div>
        </details>
      </div>

      <div id="screenshots" class="endpoint-group">
        <h3>Screenshot Endpoints</h3>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/screenshots/:serial/screen/:num</code>
          </summary>
          <div class="endpoint-details">
            <p>Get a specific compiled screenshot</p>
          </div>
        </details>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/screenshots/:serial/screen_u</code>
          </summary>
          <div class="endpoint-details">
            <p>Get a list of all available uncompiled screenshots (upper and lower screens)</p>
          </div>
        </details>
      </div>

      <div id="system" class="endpoint-group">
        <h3>System Information Endpoints</h3>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/uptimes/uptime</code>
          </summary>
          <div class="endpoint-details">
            <p>Get server uptime information</p>
          </div>
        </details>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/stats/stats</code>
          </summary>
          <div class="endpoint-details">
            <p>Get statistics about titles in each category</p>
          </div>
        </details>
        <details>
          <summary class="endpoint">
            <span class="method">GET</span> <code>/api/v1/stats/category/:category</code>
          </summary>
          <div class="endpoint-details">
            <p>List all Serials in a specific category (e.g., <code>base</code>)</p>
          </div>
        </details>
      </div>
    </section>
  </div>

  <div id="game-modal" class="modal">
    <div class="modal-content">
      <span class="modal-close" id="modal-close-button">&times;</span>
      <div id="modal-body-content">
        <p>Loading details...</p>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      let allGames = [];
      
      const themeToggle = document.getElementById("theme-toggle");
      const tabButtons = document.querySelectorAll(".nav-tab");
      const pages = document.querySelectorAll(".page-content");
      const searchBar = document.getElementById("search-bar");
      const tableBody = document.getElementById("game-table-body");
      const modal = document.getElementById("game-modal");
      const modalCloseButton = document.getElementById("modal-close-button");
      const modalBody = document.getElementById("modal-body-content");

      function setMode(isDark) {
        if (isDark) {
          document.body.classList.add("dark-mode");
          localStorage.setItem("theme", "dark");
        } else {
          document.body.classList.remove("dark-mode");
          localStorage.setItem("theme", "light");
        }
      }

      themeToggle.addEventListener("click", () => {
        setMode(!document.body.classList.contains("dark-mode"));
      });

      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(savedTheme ? savedTheme === "dark" : prefersDark);

      tabButtons.forEach(button => {
        button.addEventListener("click", () => {
          const targetPageId = button.dataset.page;
          
          pages.forEach(page => {
            page.classList.toggle("active", page.id === targetPageId);
          });
          
          tabButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.page === targetPageId);
          });
        });
      });

      async function openGameModal(serial) {
        modal.style.display = "block";
        modalBody.innerHTML = "<p>Loading details...</p>";

        try {
          const response = await fetch(\`/api/v1/metadata/\${serial}\`);
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error.message);
          }
          const game = await response.json();
          
          modalBody.innerHTML = \`
            <div class="modal-body">
              <img src="\${game.media.icon}" alt="Icon">
              <div class="modal-info">
                <h2>\${game.name || 'Unknown Title'}</h2>
                <p><strong>Serial:</strong> \${game.product_code}</p>
                <p><strong>Region:</strong> \${game.region}</p>
                <p><strong>Publisher:</strong> \${game.publisher || 'N/A'}</p>
                <p><strong>Developer:</strong> \${game.developer || 'N/A'}</p>
                <p><strong>Genres:</strong> \${game.genres ? game.genres.join(', ') : 'N/A'}</p>
                <hr style="border:0; border-top: 1px solid var(--border-color);">
                <p>\${game.description || 'No description available.'}</p>
              </div>
            </div>
          \`;

        } catch (error) {
          modalBody.innerHTML = \`<p style="color: #dc3545;">Failed to load data: \${error.message}</p>\`;
        }
      }

      function closeGameModal() {
        modal.style.display = "none";
      }

      modalCloseButton.addEventListener("click", closeGameModal);
      window.addEventListener("click", (event) => {
        if (event.target == modal) {
          closeGameModal();
        }
      });

      function populateTable(games) {
        tableBody.innerHTML = "";
        if (games.length === 0) {
           tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No games found.</td></tr>';
           return;
        }
        
        const rowsHtml = games.map(game => \`
          <tr>
            <td><img src="\${game.iconUrl}" alt="icon" style="width: 40px; height: 40px; border-radius: 4px;"></td>
            <td>\${game.serial}</td>
            <td>\${game.name}</td>
            <td>\${game.region}</td>
            <td>
              <button class="view-button" data-serial="\${game.serial}">View</button>
            </td>
          </tr>
        \`).join("");
        tableBody.innerHTML = rowsHtml;
      }

      tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("view-button")) {
          const serial = event.target.dataset.serial;
          openGameModal(serial);
        }
      });

      searchBar.addEventListener("input", (event) => {
        const query = event.target.value.toLowerCase();
        const filteredGames = allGames.filter(game => 
          game.serial.toLowerCase().includes(query) ||
          game.name.toLowerCase().includes(query)
        );
        populateTable(filteredGames);
      });

      async function loadGameList() {
        try {
          const response = await fetch("/api/v1/stats/category/base");
          if (!response.ok) throw new Error("Could not fetch game list from stats.");
          
          const data = await response.json();
          const serials = data.serials || [];
          
          const gamePromises = serials.map(async (serial) => {
            try {
              const metaRes = await fetch(\`/db/nds/base/\${serial}/meta.json\`);
              if (!metaRes.ok) return { serial, name: "N/A", region: "N/A", iconUrl: "" };

              const meta = await metaRes.json();
              return {
                serial: serial,
                name: meta.name || "Unknown Title",
                region: meta.region || "Unknown",
                iconUrl: \`/api/v1/images/\${serial}/icon\` 
              };
            } catch (e) {
              return { serial, name: "Error loading", region: "N/A", iconUrl: "" };
            }
          });
          
          allGames = await Promise.all(gamePromises);
          populateTable(allGames);

        } catch (error) {
          console.error("Failed to initialize game list:", error);
          tableBody.innerHTML = \`<tr><td colspan="5" style="text-align: center; color: #dc3545;">\${error.message}</td></tr>\`;
        }
      }

      loadGameList();
    });
  </script>
</body>
</html>
`;

const getErrorHtml = (status, message, details) => `
<!DOCTYPE html>
<html lang="en">
<head>
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
      font-family: system-ui; 
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
    💡 Need help? Check out our <a href="/">API documentation</a> for the correct endpoints and usage.
  </p>
  </div>
  <script>
    if (localStorage.getItem("theme") === "dark" || (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.body.classList.add("dark-mode");
      document.querySelector('.suggestion').classList.add("dark-mode");
    }
  </script>
</body>
</html>
`;

module.exports = { getApiDocsHtml, getErrorHtml };
