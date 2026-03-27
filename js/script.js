const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(
    ".content-card, .project-card, .metric-card, .timeline-item, .contact-card"
);
const contactForm = document.getElementById("contactForm");

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (!navMenu || !navToggle) {
            return;
        }

        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

const setActiveLink = () => {
    let currentSection = "";

    sections.forEach((section) => {
        const top = section.offsetTop - 140;
        const bottom = top + section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < bottom) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${currentSection}`;
        link.classList.toggle("active", isMatch);
    });
};

setActiveLink();
window.addEventListener("scroll", setActiveLink);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    revealItems.forEach((item) => {
        item.classList.add("reveal");
        observer.observe(item);
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const message = document.getElementById("message")?.value.trim();

        if (!name || !email || !message) {
            window.alert("Please fill in all the fields.");
            return;
        }

        window.alert(`Thanks ${name}, your message is ready to be shared.`);
        contactForm.reset();
    });
}
