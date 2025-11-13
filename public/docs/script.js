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

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetPageId = button.dataset.page;

      pages.forEach((page) => {
        page.classList.toggle("active", page.id === targetPageId);
      });

      tabButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.page === targetPageId);
      });
    });
  });

  // === Chargement de la version de l’API ===
  async function loadVersion() {
    try {
      const response = await fetch("/api/v1/version");
      const data = await response.json();

      const versionElement = document.getElementById("api-version");
      if (versionElement) versionElement.textContent = data.version;
    } catch (e) {
      console.error("Could not load API version", e);
      const versionElement = document.getElementById("api-version");
      if (versionElement) versionElement.textContent = "N/A";
    }
  }

  // === Modale de détails d’un jeu ===
  async function openGameModal(serial) {
    modal.style.display = "block";
    modalBody.innerHTML = "<p>Loading details...</p>";

    try {
      const response = await fetch(`/api/v1/metadata/${serial}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP ${response.status}`);
      }

      const game = await response.json();

      // Helper pour créer une galerie d'images
      const createGallery = (title, urls) => {
        if (!urls || urls.length === 0) return "";
        const imagesHtml = urls
          .map(
            (url) =>
              `<img src="${url}" alt="screenshot" onclick="window.open('${url}', '_blank')">`
          )
          .join("");
        return `
          <div class="modal-screenshots">
            <h4>${title}</h4>
            <div class="screenshot-gallery">${imagesHtml}</div>
          </div>`;
      };

      const compiledGallery = createGallery(
        "Screenshots Compilés",
        game?.media?.screenshots?.compiled
      );
      const upperGallery = createGallery(
        "Screenshots Non-Compilés (Haut)",
        game?.media?.screenshots?.uncompiled?.upper
      );
      const lowerGallery = createGallery(
        "Screenshots Non-Compilés (Bas)",
        game?.media?.screenshots?.uncompiled?.lower
      );

      modalBody.innerHTML = `
        <div class="modal-body">
          <div class="modal-media-column">
            <img src="${game?.media?.icon || ""}" alt="Icon" class="modal-icon">
            <img src="${
              game?.media?.boxart || ""
            }" alt="Boxart" class="modal-boxart">
          </div>
          <div class="modal-info">
            <h2>${game?.name || "Unknown Title"}</h2>
            <p><strong>Serial:</strong> ${game?.product_code || serial}</p>
            <p><strong>Region:</strong> ${game?.region || "N/A"}</p>
            <p><strong>Publisher:</strong> ${game?.publisher || "N/A"}</p>
            <p><strong>Developer:</strong> ${game?.developer || "N/A"}</p>
            <p><strong>Genres:</strong> ${
              game?.genres?.length ? game.genres.join(", ") : "N/A"
            }</p>
            <hr style="border:0; border-top: 1px solid var(--border-color);">
            <p>${game?.description || "No description available."}</p>
          </div>
        </div>
        ${compiledGallery}
        ${upperGallery}
        ${lowerGallery}
      `;
    } catch (error) {
      modalBody.innerHTML = `<p style="color: #dc3545;">Failed to load data: ${error.message}</p>`;
    }
  }

  // === Fermeture de la modale ===
  function closeGameModal() {
    modal.style.display = "none";
  }

  modalCloseButton.addEventListener("click", closeGameModal);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeGameModal();
  });

  // === Table des jeux ===
  function populateTable(games) {
    tableBody.innerHTML = "";
    if (games.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" style="text-align: center;">No games found.</td></tr>';
      return;
    }

    const rowsHtml = games
      .map(
        (game) => `
        <tr>
          <td><img src="${game.iconUrl}" alt="icon" style="width: 40px; height: 40px; border-radius: 4px;"></td>
          <td>${game.serial}</td>
          <td>${game.name}</td>
          <td>${game.region}</td>
          <td><button class="view-button" data-serial="${game.serial}">View</button></td>
        </tr>`
      )
      .join("");

    tableBody.innerHTML = rowsHtml;
  }

  // === Ouverture du détail d’un jeu ===
  tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-button")) {
      const serial = event.target.dataset.serial;
      openGameModal(serial);
    }
  });

  // === Recherche dynamique ===
  searchBar.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredGames = allGames.filter(
      (game) =>
        game.serial.toLowerCase().includes(query) ||
        game.name.toLowerCase().includes(query)
    );
    populateTable(filteredGames);
  });

  // === Chargement de la liste des jeux ===
  async function loadGameList() {
    try {
      const response = await fetch("/api/v1/stats/category/base");
      if (!response.ok)
        throw new Error("Could not fetch game list from stats.");

      const data = await response.json();
      const serials = data.serials || [];

      const gamePromises = serials.map(async (serial) => {
        try {
          const metaRes = await fetch(`/db/nds/base/${serial}/meta.json`);
          if (!metaRes.ok)
            return { serial, name: "N/A", region: "N/A", iconUrl: "" };

          const meta = await metaRes.json();
          return {
            serial: serial,
            name: meta.name || "Unknown Title",
            region: meta.region || "Unknown",
            iconUrl: `/api/v1/images/${serial}/icon`,
          };
        } catch {
          return { serial, name: "Error loading", region: "N/A", iconUrl: "" };
        }
      });

      allGames = await Promise.all(gamePromises);
      populateTable(allGames);
    } catch (error) {
      console.error("Failed to initialize game list:", error);
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #dc3545;">
            ${error.message}
          </td>
        </tr>`;
    }
  }

  // === Initialisation ===
  loadVersion();
  loadGameList();
});
