document.body.appendChild(
  (function () {
    const n = document.createElement("div");
    return (n.innerHTML = "Yo what's poppin?"), n;
  })()
);
