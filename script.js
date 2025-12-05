document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const headerFooter = [...document.querySelectorAll(".headerBar, .footerBar")];
  const specialBackgrounds = [
    ...document.querySelectorAll(".scrollspyBG, .contactForm"),
  ];
  const allCards = [...document.querySelectorAll(".card")];
  const allLinks = [
    ...document.querySelectorAll("a, .nav-link, .btn, .btn-primary, .btn-lg"),
  ];
  const fadeElems = [
    ...document.querySelectorAll(
      ".fadeSlide, .card, .scrollspy-example-2 .card"
    ),
  ];
  const menuLinks = [...document.querySelectorAll(".menuScrollspy a.nav-link")];
  const scrollCards = [
    ...document.querySelectorAll(".scrollspy-example-2 .card"),
  ];

  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".headerNavLinks .nav-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
  });

  const contactForm = document.querySelector("form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const [nameInput, emailInput] = contactForm.querySelectorAll(
        'input[type="text"], input[type="email"]'
      );
      const messageInput = contactForm.querySelector("textarea");
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      if (!name || !email || !message)
        return alert("Please fill in all fields!");
      if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email))
        return alert("Please enter a valid email address.");
      alert(`Thank you, ${name}! Your message has been received.`);
      contactForm.reset();
    });
  }

  scrollCards.forEach((card) => {
    card.style.transition =
      "transform 0.4s cubic-bezier(0.68,-0.55,0.27,1.55), box-shadow 0.3s ease";
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-15px)";
      card.style.boxShadow = "0 15px 25px rgba(0,0,0,0.3)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    });
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetEl = document.getElementById(
        link.getAttribute("href").slice(1)
      );
      targetEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.transition =
            "opacity 0.8s ease-out, transform 0.8s ease-out";
          el.style.opacity = 1;
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElems.forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
    observer.observe(el);
  });

  function createButton({ text, bottom, left, right }) {
    const btn = document.createElement("button");
    btn.textContent = text;
    Object.assign(btn.style, {
      position: "fixed",
      bottom: bottom + "px",
      left: left !== undefined ? left + "px" : "",
      right: right !== undefined ? right + "px" : "",
      padding: "10px 15px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      zIndex: 9999,
      transition: "opacity 0.5s, background-color 0.3s",
    });
    document.body.appendChild(btn);
    return btn;
  }

  // ----- DARK MODE BUTTON -----
  const darkModeBtn = createButton({ text: "🌙", bottom: 70, left: 10 });
  darkModeBtn.style.backgroundColor = "#8c904d";
  darkModeBtn.style.color = "#f8f2ef";
  let darkMode = false;
  function toggleDarkMode() {
    darkMode = !darkMode;
    const bg = darkMode ? "#1c1c1c" : "#f8f2ef";
    const fg = darkMode ? "#f8f2ef" : "#5f524c";
    body.style.backgroundColor = bg;
    body.style.color = fg;
    headerFooter.forEach(
      (el) => (el.style.backgroundColor = darkMode ? "#333" : "#a77252")
    );
    specialBackgrounds.forEach(
      (el) => (el.style.backgroundColor = darkMode ? "#2c2c2c" : "#e9d0b9")
    );
    allCards.forEach((card) => {
      card.style.backgroundColor = darkMode ? "#2c2c2c" : "#fff";
      card.style.color = fg;
    });
    allLinks.forEach((el) => {
      el.style.color = darkMode ? "#f8f2ef" : "";
      if (el.classList.contains("btn"))
        el.style.backgroundColor = darkMode ? "#8c904d" : "";
    });
    darkModeBtn.textContent = darkMode ? "☀️" : "🌙";
  }
  darkModeBtn.addEventListener("click", toggleDarkMode);

  const backBtn = createButton({ text: "↑ Top", bottom: 70, right: 10 });
  backBtn.style.backgroundColor = "#8c904d";
  backBtn.style.color = "#f8f2ef";
  backBtn.style.opacity = 0;

  backBtn.addEventListener(
    "mouseenter",
    () => (backBtn.style.backgroundColor = darkMode ? "#6a8a3c" : "#5c7134")
  );
  backBtn.addEventListener(
    "mouseleave",
    () => (backBtn.style.backgroundColor = "#8c904d")
  );

  const sections = menuLinks.map((link) =>
    document.getElementById(link.getAttribute("href").slice(1))
  );

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        backBtn.style.opacity = scrollY > 300 ? "1" : "0";

        const middle = scrollY + window.innerHeight / 2;
        sections.forEach((section, idx) => {
          if (section) {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            menuLinks[idx].classList.toggle(
              "active",
              middle >= top && middle < bottom
            );
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll);
  onScroll();

  backBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
});
