document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript is working!");
  //alert("Welcome to ticket QR code generator!");
});

function toggleCSRF() {
  const checkbox = document.getElementById("csrfToggle");
  if (checkbox.checked) {
    console.log("CSRF vulnerability enabled");
    document.cookie = "csrf_enabled=true; path=/";
  } else {
    console.log("CSRF vulnerability disabled");
    document.cookie = "csrf_enabled=false; path=/";
  }
}

window.onload = function () {
  const enabled = document.cookie.includes("csrf_enabled=true");
  document.getElementById("csrfToggle").checked = enabled;
};
