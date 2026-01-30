const EMAIL_TO = "Jay.Yim.25@dartmouth.edu"; // TODO: change to your email

function $(selector, root = document) {
  return root.querySelector(selector);
}

function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch (_) {}
}

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (_) {}

  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  window.clearTimeout(toast._t);
  toast._t = window.setTimeout(() => el.classList.remove("show"), 1400);
}

function setupHeaderElevation() {
  const header = $(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.dataset.elevated = window.scrollY > 8 ? "true" : "false";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupNavMenu() {
  const toggle = $(".nav-toggle");
  const links = $("#navLinks");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close on link click (mobile)
  links.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) close();
  });

  // Close on escape / outside click
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.addEventListener("click", (e) => {
    const withinNav = e.target.closest(".nav");
    if (!withinNav) close();
  });
}

function setupThemeToggle() {
  const btn = $(".theme-toggle");
  if (!btn) return;

  const apply = (theme) => {
    setTheme(theme);
    const pressed = theme === "dark";
    btn.setAttribute("aria-pressed", String(pressed));
    btn.title = pressed ? "Switch to light" : "Switch to dark";
  };

  apply(getInitialTheme());

  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    apply(current === "dark" ? "light" : "dark");
  });
}

function setupYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupRevealAnimations() {
  const items = $$(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
}

function setupToastButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-toast]");
    if (!btn) return;
    toast(btn.getAttribute("data-toast") || "Done");
  });
}

function setupContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      toast("Please fill out all fields.");
      return;
    }

    const subject = encodeURIComponent(`Website inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`
    );

    // Opens the user's default mail app with a prefilled email.
    window.location.href = `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${subject}&body=${body}`;
    toast("Opening your email app…");
  });
}

setupHeaderElevation();
setupNavMenu();
setupThemeToggle();
setupYear();
setupRevealAnimations();
setupToastButtons();
setupContactForm();

