// partner-ads.js

// partner-ads.js

function getURLParameterPartnerAds(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function setCookiePartnerAds(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Extract 'paid' and 'pacid' from URL and save them in cookies for 40 days
var paid = getURLParameterPartnerAds("paid");
var pacid = getURLParameterPartnerAds("pacid");

if (paid && pacid) {
  setCookiePartnerAds("paid", paid, 40);
  setCookiePartnerAds("pacid", pacid, 40);
  console.log("paid cookie set with value --> " + paid);
  console.log("pacid cookie set with value --> " + pacid);
}

function pingURLWithCookieValues(uniqId, callback) {
  var paid = getCookiePartnerAds("paid");
  var pacid = getCookiePartnerAds("pacid");

  console.log("got value paid --> " + paid);
  console.log("got value pacid --> " + pacid);

  if (paid && pacid) {
    var PROGRAM_ID = "10863"; // Replace with your program ID
    var VARIABEL = uniqId; // Use the passed unique ID

    console.log("PROGRAM_ID --> " + PROGRAM_ID);
    console.log("VARIABEL --> " + VARIABEL);

    var url =
      "https://www.partner-ads.com/dk/leadtracks2s.php?programid=" +
      encodeURIComponent(PROGRAM_ID) +
      "&type=lead&partnerid=" +
      encodeURIComponent(paid) +
      "&pacid=" +
      encodeURIComponent(pacid) +
      "&uiv=" +
      encodeURIComponent(VARIABEL);

    var xhttpPing = new XMLHttpRequest();
    xhttpPing.open("GET", url, true);
    xhttpPing.onreadystatechange = function () {
      if (this.readyState == 4) {
        console.log("Attempted to ping URL with ID:", uniqId);
        if (callback) callback();
      }
    };
    xhttpPing.onerror = function () {
      // If an error occurs, still proceed with the callback
      console.error("Error pinging URL");
      if (callback) callback();
    };
    xhttpPing.send();
  } else if (callback) {
    // If the cookies are not set, still proceed with the callback
    callback();
  }
}

function getCookiePartnerAds(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
