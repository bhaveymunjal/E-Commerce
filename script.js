const bar = document.getElementById("nav-fold");
const nright = document.getElementById("navbar_right");
const close = document.getElementById("close");
const h = document.getElementsByTagName("header");

if (bar) {
  bar.addEventListener("click", () => {
    nright.style.right = "0px";
    nright.style.display = "flex";
    bar.style.display = "none";
    close.style.display = "block";
  });
}
if (close) {
  close.addEventListener("click", () => {
    nright.style.right = "-300px";
    nright.style.display = "none";
    bar.style.display = "inline-block";
    close.style.display = "none";
  });
}
const scrollToTopButton = document.getElementById("js-top");
const scrollFunc = () => {
  let y = window.scrollY;
  if (y > 0) {
    scrollToTopButton.className = "top-link show";
    h[0].style.boxShadow = "1px 5px 28px #5e5e5e";
    // h.style.box-shadow = " 1px 5px 18px #5e5e5e";
  } else {
    scrollToTopButton.className = "top-link hide";
    h[0].style.boxShadow = "0px 0px 0px #5e5e5e";
  }
};

window.addEventListener("scroll", scrollFunc);

const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 10);
  }
};
scrollToTopButton.onclick = function (e) {
  e.preventDefault();
  scrollToTop();
};
const validateEmail = (nemail) => {
  return nemail.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
let news1 = document.getElementById("news-letter");
function signUpNewsLetter() {
  let nemail = document.getElementById("news-email").value;
  // console.log(nemail);
  if (validateEmail(nemail)) {
    alert("You will be notified for further updates");
    document.getElementById("news-email").value = ""; 
  } else {
    alert("Please Enter your E-mail correctly");
  }
}
news1.addEventListener("click", signUpNewsLetter);
document.getElementById("news-email").addEventListener("keypress", (event) => {
  if (event.key == "Enter") signUpNewsLetter();
});
