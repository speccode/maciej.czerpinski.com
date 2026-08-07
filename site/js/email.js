(function () {
  function decorate(el) {
    var user = el.getAttribute("data-email-user");
    var domain = el.getAttribute("data-email-domain");
    if (!user || !domain) return;
    var subject = el.getAttribute("data-email-subject");
    var addr = user + "@" + domain;
    el.href = "mailto:" + addr + (subject ? "?subject=" + subject : "");
    var textEl = el.querySelector("[data-email-text]");
    if (textEl) textEl.textContent = addr;
  }

  var links = document.querySelectorAll("[data-email-user]");
  for (var i = 0; i < links.length; i++) decorate(links[i]);
})();
