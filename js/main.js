(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById("siteNav");
  function onScroll() {
    if (window.scrollY > 12) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", function () {
    var expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("menu-open", !expanded);
  });
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("menu-open");
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add("is-visible");
            }, (i % 4) * 90);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Portfolio video playback ---------- */
  document.querySelectorAll(".portfolio-card").forEach(function (card) {
    var playBtn = card.querySelector(".play-btn");
    var media = card.querySelector(".portfolio-media");
    var img = card.querySelector("img");

    playBtn.addEventListener("click", function () {
      var src = card.getAttribute("data-video");
      var poster = card.getAttribute("data-poster");
      if (!src) return;

      var video = document.createElement("video");
      video.src = src;
      video.poster = poster;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;

      media.innerHTML = "";
      media.appendChild(video);
      video.play().catch(function () { /* user can press play manually */ });
    });
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  var defaultNote = formNote ? formNote.innerHTML : "";

  function setError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + "-error");
    var wrapper = field.closest(".form-field");
    if (message) {
      wrapper.classList.add("has-error");
      if (errorEl) errorEl.textContent = message;
    } else {
      wrapper.classList.remove("has-error");
      if (errorEl) errorEl.textContent = "";
    }
  }

  function validate() {
    var valid = true;
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var message = document.getElementById("message");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.value.trim()) {
      setError("name", "Please enter your name.");
      valid = false;
    } else {
      setError("name", "");
    }

    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    } else {
      setError("email", "");
    }

    if (!message.value.trim()) {
      setError("message", "Let us know a bit about what you need.");
      valid = false;
    } else {
      setError("message", "");
    }

    return valid;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var company = document.getElementById("company").value.trim();
      var interest = document.getElementById("interest").value;
      var message = document.getElementById("message").value.trim();

      var subject = "Waller Media Inquiry — " + interest;
      var bodyLines = [
        "Name: " + name,
        "Email: " + email,
        "Company/Firm: " + (company || "—"),
        "Interested In: " + interest,
        "",
        "Message:",
        message
      ];
      var mailto =
        "mailto:derick@derickwaller.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      window.location.href = mailto;

      if (formNote) {
        formNote.innerHTML = "Your email app should be opening now with this inquiry addressed to <a href=\"mailto:derick@derickwaller.com\">derick@derickwaller.com</a>. Just hit send.";
        formNote.classList.add("success");
      }
    });

    form.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        var wrapper = field.closest(".form-field");
        if (wrapper.classList.contains("has-error")) {
          setError(field.id, "");
        }
        if (formNote && formNote.classList.contains("success")) {
          formNote.classList.remove("success");
          formNote.innerHTML = defaultNote;
        }
      });
    });
  }
})();
