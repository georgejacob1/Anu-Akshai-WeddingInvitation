let currentWidth = window.innerWidth;
function setViewportHeight() {
    let newWidth = window.innerWidth;
    // Only update --vh on initial call or when window width changes (orientation change or desktop resize)
    if (newWidth !== currentWidth || !document.documentElement.style.getPropertyValue('--vh')) {
        currentWidth = newWidth;
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', function () {
    currentWidth = 0;
    setViewportHeight();
});

document.addEventListener("DOMContentLoaded", function () {
    // -------------------------------------------------------------
    // 1. Handwriting Animation Setup for Main Names ("Akshai & Anu")
    // -------------------------------------------------------------
    const akshaiEl = document.getElementById("name-akshai");
    const ampersandEl = document.getElementById("name-ampersand");
    const anuEl = document.getElementById("name-anu");
    const heartLeft = document.querySelector(".dec-heart-left");
    const heartRight = document.querySelector(".dec-heart-right");

    function createLetterSpans(element) {
        if (!element) return [];
        const text = element.textContent.trim();
        element.innerHTML = "";
        const spans = [];
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement("span");
            span.className = "letter-span";
            span.textContent = text[i];
            element.appendChild(span);
            spans.push(span);
        }
        return spans;
    }

    const akshaiSpans = createLetterSpans(akshaiEl);
    const ampersandSpans = createLetterSpans(ampersandEl);
    const anuSpans = createLetterSpans(anuEl);

    function triggerLetterWriting() {
        // Start writing after quote and couple photo finish entering (~1.4s after doors open)
        const delayStart = 1400;
        const letterSpeed = 110; // 110ms per letter

        // 1. Write "Akshai"
        akshaiSpans.forEach(function (span, index) {
            setTimeout(function () {
                span.classList.add("write-in");
            }, delayStart + (index * letterSpeed));
        });

        const akshaiEndTime = delayStart + (akshaiSpans.length * letterSpeed);

        // Pop left heart when Akshai completes
        setTimeout(function () {
            if (heartLeft) heartLeft.classList.add("heart-pop");
        }, akshaiEndTime);

        // 2. Write "&" ampersand
        const ampersandTime = akshaiEndTime + 150;
        ampersandSpans.forEach(function (span, index) {
            setTimeout(function () {
                span.classList.add("write-in");
            }, ampersandTime + (index * letterSpeed));
        });

        // 3. Write "Anu"
        const anuStartTime = ampersandTime + 200;
        anuSpans.forEach(function (span, index) {
            setTimeout(function () {
                span.classList.add("write-in");
            }, anuStartTime + (index * letterSpeed));
        });

        const anuEndTime = anuStartTime + (anuSpans.length * letterSpeed);

        // Pop right heart when Anu completes
        setTimeout(function () {
            if (heartRight) heartRight.classList.add("heart-pop");
        }, anuEndTime);
    }

    // -------------------------------------------------------------
    // 2. Splash Screen Door Opening Sequence (3 Seconds Display)
    // -------------------------------------------------------------
    const splashScreen = document.getElementById("splash-screen");

    if (splashScreen) {
        document.body.classList.add("splash-active");

        // Wait 3 seconds before opening the door split
        setTimeout(function () {
            splashScreen.classList.add("open");
            document.body.classList.add("splash-opened");
            document.body.classList.remove("splash-active");

            // Trigger letter writing animation for names
            triggerLetterWriting();

            // Hide overlay completely after door transition & handwriting animation completes
            setTimeout(function () {
                splashScreen.classList.add("finished");
            }, 3500);
        }, 1000);
    } else {
        // If no splash screen, trigger writing animation directly
        setTimeout(triggerLetterWriting, 500);
    }

    // -------------------------------------------------------------
    // 2. Scroll & Reveal Animations for Home Screen Elements
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll(".reveal-on-scroll");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        revealElements.forEach(function (el) {
            el.classList.add("is-visible");
        });
    }

    // -------------------------------------------------------------
    // 3. Countdown Timer Logic
    // -------------------------------------------------------------
    const targetDate = new Date("August 17, 2026 11:00:00").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("mins");
    const secsEl = document.getElementById("secs");

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Event has passed
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minsEl) minsEl.innerText = "00";
            if (secsEl) secsEl.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days.toString().padStart(2, "0");
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, "0");
        if (minsEl) minsEl.innerText = minutes.toString().padStart(2, "0");
        if (secsEl) secsEl.innerText = seconds.toString().padStart(2, "0");
    }

    // Initial call
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);

    // -------------------------------------------------------------
    // 4. Scroll Down Indicator Behavior
    // -------------------------------------------------------------
    const scrollDownBtn = document.getElementById("scroll-down-btn");

    if (scrollDownBtn) {
        scrollDownBtn.addEventListener("click", function () {
            const target = document.querySelector(".invitation-container");
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });

        window.addEventListener("scroll", function () {
            if (window.scrollY > 40) {
                scrollDownBtn.classList.add("is-hidden");
            } else {
                scrollDownBtn.classList.remove("is-hidden");
            }
        }, { passive: true });
    }
});

