function header() {
  var x = document.getElementById("navID");
  if (x.className === "nav") {
    x.className += " responsive";
  } else {
    x.className = "nav";
  }
}

document
  .getElementById("copyrightYear")
  .appendChild(document.createTextNode(new Date().getFullYear()));

// When the user scrolls down 1000px from the top of the document, show the button
goToTopFun();
function goToTopFun() {
  var top = document.getElementById("goToTop");

  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 800 ||
      document.documentElement.scrollTop > 800
    ) {
      top.style.display = "block";
    } else {
      top.style.display = "none";
    }
  }
}

// When the user clicks on the button, scroll to the top of the document
function goToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
