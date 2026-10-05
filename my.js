document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Functionality
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  // Load stored theme or default to dark
  if (localStorage.theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  themeToggleBtn.addEventListener("click", () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  });

  // Filter Cards Logic
  const cards = document.querySelectorAll(".card-item");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const searchInputDesktop = document.getElementById("searchInputDesktop");
  const searchInputMobile = document.getElementById("searchInputMobile");
  const noResultsState = document.getElementById("noResultsState");
  const matchingCount = document.getElementById("matchingCount");

  let currentCategory = "all";
  let currentQuery = "";

  function filterCards() {
    let visibleCount = 0;

    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const cardSearchText = card.getAttribute("data-name").toLowerCase();

      const matchesCategory =
        currentCategory === "all" || cardCategory === currentCategory;
      const matchesSearch = cardSearchText.includes(currentQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("hidden");
        card.classList.add("flex");
        visibleCount++;
      } else {
        card.classList.add("hidden");
        card.classList.remove("flex");
      }
    });

    // Update counts and empty state
    matchingCount.textContent = `Showing ${visibleCount} portal${visibleCount === 1 ? "" : "s"}`;
    if (visibleCount === 0) {
      noResultsState.classList.remove("hidden");
      noResultsState.classList.add("flex");
    } else {
      noResultsState.classList.add("hidden");
      noResultsState.classList.remove("flex");
    }
  }

  // Filter Tab Click Events
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove(
          "bg-brand-600",
          "text-white",
          "shadow-md",
          "shadow-brand-500/20",
        );
        b.classList.add(
          "bg-slate-200/80",
          "dark:bg-slate-900",
          "text-slate-600",
          "dark:text-slate-400",
        );
      });

      btn.classList.remove(
        "bg-slate-200/80",
        "dark:bg-slate-900",
        "text-slate-600",
        "dark:text-slate-400",
      );
      btn.classList.add(
        "bg-brand-600",
        "text-white",
        "shadow-md",
        "shadow-brand-500/20",
      );

      currentCategory = btn.getAttribute("data-category");
      filterCards();
    });
  });

  // Sync Search Inputs
  function handleSearchInput(e) {
    currentQuery = e.target.value.trim().toLowerCase();
    if (e.target === searchInputDesktop) {
      searchInputMobile.value = e.target.value;
    } else {
      searchInputDesktop.value = e.target.value;
    }
    filterCards();
  }

  searchInputDesktop.addEventListener("input", handleSearchInput);
  searchInputMobile.addEventListener("input", handleSearchInput);

  // Keyboard shortcut for search focus
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInputDesktop.focus();
    }
  });

  const protectedCards = document.querySelectorAll(".protected-card");
  const modal = document.getElementById("passwordModal");
  const modalCard = document.getElementById("modalCard");
  const lockBadge = document.getElementById("lockBadge");
  const passInput = document.getElementById("cardPassword");
  const errorMsg = document.getElementById("errorMsg");
  const submitBtn = document.getElementById("submitPassBtn");
  const cancelBtn = document.getElementById("cancelPassBtn");

  let targetUrl = "";

  function openModal(url) {
    targetUrl = url;
    passInput.value = "";
    errorMsg.classList.add("hidden");
    modalCard.classList.remove("animate-shake");

    // Show Modal with smooth animation
    modal.classList.remove("pointer-events-none", "opacity-0");
    modal.classList.add("opacity-100");
    modalCard.classList.remove("scale-95");
    modalCard.classList.add("scale-100");

    setTimeout(() => passInput.focus(), 100);
  }

  function closeModal() {
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.classList.remove("opacity-100");
    modalCard.classList.add("scale-95");
    modalCard.classList.remove("scale-100");
  }

  protectedCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const url = card.getAttribute("data-url");
      openModal(url);
    });
  });

  function verifyPassword() {
    const password = passInput.value.trim();
    if (password === "147539") {
      // Success State Feedback
      lockBadge.classList.remove("from-amber-500", "to-orange-500");
      lockBadge.classList.add("from-emerald-500", "to-teal-500");
      lockBadge.innerHTML = '<i class="fa-solid fa-lock-open text-2xl"></i>';

      setTimeout(() => {
        closeModal();
        window.open(targetUrl, "_blank");
        // Reset badge icon
        setTimeout(() => {
          lockBadge.classList.remove("from-emerald-500", "to-teal-500");
          lockBadge.classList.add("from-amber-500", "to-orange-500");
          lockBadge.innerHTML = '<i class="fa-solid fa-lock text-2xl"></i>';
        }, 300);
      }, 350);
    } else {
      // Error Trigger Shake Effect
      errorMsg.classList.remove("hidden");
      modalCard.classList.remove("animate-shake");
      void modalCard.offsetWidth; // Force reflow
      modalCard.classList.add("animate-shake");
      passInput.value = "";
      passInput.focus();
    }
  }

  submitBtn.addEventListener("click", verifyPassword);

  passInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      verifyPassword();
    }
  });

  cancelBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside background overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
});
