const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(
    ".content-card, .project-card, .metric-card, .timeline-item, .contact-card"
);
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const setFormStatus = (message, state = "") => {
    if (!formStatus) {
        return;
    }

    formStatus.textContent = message;
    formStatus.className = "form-status";

    if (state) {
        formStatus.classList.add(`is-${state}`);
    }
};

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
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const message = document.getElementById("message")?.value.trim();
        const recipientEmail = contactForm.dataset.recipientEmail?.trim();

        if (!name || !email || !message) {
            setFormStatus("Please fill in all the fields.", "error");
            return;
        }

        if (!recipientEmail || recipientEmail === "YOUR_EMAIL@example.com") {
            setFormStatus("Add your real recipient email in the contact form before using this button.", "error");
            return;
        }

        const formData = new FormData(contactForm);

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            setFormStatus("Sending your message...", "success");

            const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: formData
            });

            const result = await response.json();

            if (!response.ok || result.success !== "true") {
                throw new Error("Message delivery failed.");
            }

            setFormStatus(`Thanks ${name}, your message was sent successfully.`, "success");
            contactForm.reset();
        } catch (error) {
            setFormStatus("Message could not be sent right now. Please try again in a moment.", "error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        }
    });
}
