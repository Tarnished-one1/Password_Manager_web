(function () {
    "use strict";

    var list     = document.getElementById("list");
    var searchEl = document.getElementById("search");
    var pwdEl    = document.getElementById("password");
    var toggleEl = document.getElementById("toggle-password");

    var toastWrap = document.createElement("div");
    toastWrap.className = "toast-wrap";
    document.body.appendChild(toastWrap);

    function toast(message, type, ms) {
        type = type || "info";
        var el = document.createElement("div");
        el.className = "toast " + type;
        el.textContent = message;
        toastWrap.appendChild(el);

        setTimeout(function () {
            el.style.transition = "opacity .25s ease, transform .25s ease";
            el.style.opacity = "0";
            el.style.transform = "translateY(10px)";
            setTimeout(function () { el.remove(); }, 260);
        }, ms || 2600);
    }

    var originalAddPassword = window.addPassword;

    if (typeof originalAddPassword === "function") {
        window.addPassword = async function () {
            var website = document.getElementById("website").value.trim();
            var password = document.getElementById("password").value;

            if (!website) {
                toast("Please enter a website name.", "error");
                document.getElementById("website").focus();
                return;
            }
            if (!password) {
                toast("Please enter a password.", "error");
                document.getElementById("password").focus();
                return;
            }

            try {
                await originalAddPassword();

                ["website", "url", "password", "email"].forEach(function (id) {
                    document.getElementById(id).value = "";
                });
                if (toggleEl) {
                    pwdEl.type = "password";
                    toggleEl.textContent = "Show";
                }
                toast("Entry added successfully.", "success");
            } catch (err) {
                toast("Could not reach the server.", "error");
            }
        };
    }

    function parseEntry(text) {
        var parts = String(text).split(" — ");
        return {
            website: (parts[0] || "").trim(),
            url: (parts[1] || "").replace(/^\(/, "").replace(/\)$/, "").trim(),
            email: (parts[2] || "").trim()
        };
    }

    function enhanceEntries() {
        var rows = list.querySelectorAll(":scope > p:not([data-enhanced])");

        Array.prototype.forEach.call(rows, function (p) {
            var raw = p.textContent;
            p.setAttribute("data-enhanced", "1");
            p.setAttribute("data-raw", raw);

            var entry = parseEntry(raw);

            /* Avatar */
            var avatar = document.createElement("span");
            avatar.className = "avatar";
            avatar.textContent = (entry.website || "?").charAt(0);

            /* Meta block */
            var meta = document.createElement("span");
            meta.className = "meta";

            var site = document.createElement("span");
            site.className = "site";
            site.textContent = entry.website || "Untitled";
            meta.appendChild(site);

            var sub = document.createElement("span");
            sub.className = "sub";

            if (entry.url) {
                var u = document.createElement("span");
                u.className = "url";
                u.textContent = entry.url;
                sub.appendChild(u);
            }
            if (entry.email) {
                var e = document.createElement("span");
                e.className = "email";
                e.textContent = entry.email;
                sub.appendChild(e);
            }
            if (sub.childNodes.length) meta.appendChild(sub);

            /* Copy button */
            var copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "copy-btn";
            copyBtn.textContent = "Copy";

            copyBtn.addEventListener("click", function (ev) {
                ev.stopPropagation();
                var payload = [entry.website, entry.url, entry.email]
                    .filter(Boolean)
                    .join("\n");

                function done() {
                    copyBtn.textContent = "Copied";
                    copyBtn.classList.add("copied");
                    setTimeout(function () {
                        copyBtn.textContent = "Copy";
                        copyBtn.classList.remove("copied");
                    }, 1400);
                }

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(payload).then(done, function () {
                        toast("Copy failed.", "error");
                    });
                } else {
                    var ta = document.createElement("textarea");
                    ta.value = payload;
                    ta.style.position = "fixed";
                    ta.style.opacity = "0";
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand("copy"); done(); }
                    catch (e) { toast("Copy failed.", "error"); }
                    ta.remove();
                }
            });

            p.textContent = "";
            p.appendChild(avatar);
            p.appendChild(meta);
            p.appendChild(copyBtn);
        });

        applyFilter();
    }

    function applyFilter() {
        if (!searchEl) return;
        var q = searchEl.value.trim().toLowerCase();

        Array.prototype.forEach.call(list.querySelectorAll(":scope > p"), function (p) {
            var haystack = (p.getAttribute("data-raw") || p.textContent || "").toLowerCase();
            p.style.display = (!q || haystack.indexOf(q) !== -1) ? "" : "none";
        });
    }

    if (searchEl) {
        searchEl.addEventListener("input", applyFilter);
    }

    if (window.MutationObserver) {
        new MutationObserver(function () {
            enhanceEntries();
        }).observe(list, { childList: true });
    }

    enhanceEntries();

    if (toggleEl && pwdEl) {
        toggleEl.addEventListener("click", function () {
            var show = pwdEl.type === "password";
            pwdEl.type = show ? "text" : "password";
            toggleEl.textContent = show ? "Hide" : "Show";
            toggleEl.setAttribute("aria-label", show ? "Hide password" : "Show password");
            pwdEl.focus();
        });
    }

    ["website", "url", "password", "email"].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("keydown", function (ev) {
            if (ev.key === "Enter") {
                ev.preventDefault();
                window.addPassword();
            }
        });
    });

    document.addEventListener("keydown", function (ev) {
        var tag = (ev.target.tagName || "").toLowerCase();
        if (ev.key === "/" && tag !== "input" && tag !== "textarea" && searchEl) {
            ev.preventDefault();
            searchEl.focus();
        }
    });
})();