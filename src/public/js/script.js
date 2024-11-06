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

function toggleSQL() {
  console.log("SQL injection protection toggled!");
  const checkbox = document.getElementById("sqlToggle");
  if (checkbox.checked) {
    console.log("SQL injection vulnerability enabled");
    document.cookie = "sql_injection_enabled=true; path=/";
  } else {
    console.log("SQL injection vulnerability disabled");
    document.cookie = "sql_injection_enabled=false; path=/";
  }
}

window.onload = function () {
  const enabled1 = document.cookie.includes("csrf_enabled=true");
  document.getElementById("csrfToggle").checked = enabled1;

  const enabled2 = document.cookie.includes("sql_injection_enabled=true");
  document.getElementById("sqlToggle").checked = enabled2;
};
