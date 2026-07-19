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

  var FORM_ENDPOINT = "https://formsubmit.co/ajax/derick@derickwaller.com";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var submitBtn = document.getElementById("submitBtn");
      var btnLabel = submitBtn.querySelector(".btn-label");
      var originalLabel = btnLabel.textContent;

      submitBtn.disabled = true;
      btnLabel.textContent = "Sending…";
      if (formNote) formNote.classList.remove("success", "error");

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Submission failed");
          form.reset();
          if (formNote) {
            formNote.textContent = "Thank you — your message has been sent. We'll be in touch soon.";
            formNote.classList.add("success");
          }
        })
        .catch(function () {
          if (formNote) {
            formNote.innerHTML = "Something went wrong sending your message. Please email us directly at <a href=\"mailto:derick@derickwaller.com\">derick@derickwaller.com</a>.";
            formNote.classList.add("error");
          }
        })
        .finally(function () {
          submitBtn.disabled = false;
          btnLabel.textContent = originalLabel;
        });
    });

    form.querySelectorAll(".form-field input, .form-field textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        var wrapper = field.closest(".form-field");
        if (wrapper.classList.contains("has-error")) {
          setError(field.id, "");
        }
        if (formNote && (formNote.classList.contains("success") || formNote.classList.contains("error"))) {
          formNote.classList.remove("success", "error");
          formNote.innerHTML = defaultNote;
        }
      });
    });
  }
})();
