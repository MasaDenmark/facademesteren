function toggle(e) {
  document.getElementById(e).classList.toggle("active");
}

//Rewritten JS starting
function toggleClass(e, c) {
  document.getElementById(e).classList.toggle(c);
}

function popup(e, des) {
  document.getElementById(e).classList.toggle("active");
  let destination = des;
  if (destination) {
    let popup_place = document.getElementById("popup_place");
    popup_place.value = destination;
  } else {
    popup_place.value = "";
  }
}

function toggleBody() {
  // document.body.classList.toggle("overflow-hidden");
}

/*
 * Menu functionality for phone
 */

const toggleMenus = document.querySelectorAll("li.menu-item-has-children .toggle-submenu");

toggleMenus.forEach((el) =>
  el.addEventListener("click", (event) => {
    el.parentNode.classList.toggle("open");
    //event.preventDefault();
    return false;
  })
);

function playVideo(wrapper, video) {
  //this.classList.toggle("playing");
  //document.getElementById(e).classList.toggle("playing");

  var video = document.getElementById(video);
  video.play();
  var wrapper = document.getElementById(wrapper);
  wrapper.classList.toggle("playing");
  //console.log(video.play());
}

function loadPosts() {
  var button = document.getElementById("loadmore_ajax");

  var paged = parseInt(button.getAttribute("data-page"));
  var max_pages = parseInt(button.getAttribute("data-max-pages"));

  var formData = new FormData();

  formData.append("action", "lazyload");
  formData.append("paged", paged);

  var xhttp = new XMLHttpRequest();
  xhttp.open(
    "POST",
    window.location.protocol + "//" + window.location.hostname + "/wp-admin/admin-ajax.php"
  );

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = this.responseText;

      var data = JSON.parse(response);

      if (data.status === true) {
        var posts = data.posts;

        posts.forEach((el) =>
          document.getElementById("lazyload_to_here").insertAdjacentHTML("beforeend", el)
        );

        if (data.paged === max_pages) {
          button.remove();
        } else {
          button.setAttribute("data-page", data.paged);
        }
      } else {
      }
      xhttp.abort();
    }
  };
  xhttp.send(formData);
}

function singup_newsletter(e) {
  var email = document.getElementById(e).value;

  if (email.indexOf("@") == -1) {
    document.getElementById("signup-error").classList.add("show");

    setTimeout(() => {
      document.getElementById("signup-error").classList.remove("show");
    }, 2000);

    return false;
  }

  var formData = new FormData();

  formData.append("action", "ajax_newsletter");
  formData.append("email", email);

  var xhttp = new XMLHttpRequest();
  xhttp.open(
    "POST",
    window.location.protocol + "//" + window.location.hostname + "/wp-admin/admin-ajax.php"
  );

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = this.responseText;

      var data = JSON.parse(response);

      if (data.status === true) {
        document.getElementById("signup-succes").classList.add("show");

        setTimeout(() => {
          document.getElementById("signup-succes").classList.remove("show");
        }, 4000);
      }
      xhttp.abort();
    }
  };

  xhttp.send(formData);
}

async function lead_signup(form, c) {
  //Select form
  let formFields = form.closest("form");

  //Add id
  let uniqID = "id-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
  formFields.querySelector("#unid-id").value = uniqID;

  //Form data
  let count = c;

  let errorMessage = formFields.querySelector(".error-message");
  let hasErrors = false;

  const requiredInputs = formFields.querySelectorAll("input[required], textarea[required]");
  let addressInput = formFields.querySelector('input[placeholder="Adresse"]');

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      input.parentElement.classList.add("invalid");
      hasErrors = true;
    } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
      input.parentElement.classList.add("invalid");
      hasErrors = true;
    } else {
      input.parentElement.classList.remove("invalid");
    }
  });


  if (hasErrors) {
    requiredInputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value.trim() && input.parentElement.classList.contains("invalid")) {
          input.parentElement.classList.remove("invalid");
          errorMessage.classList.contains("show") ? errorMessage.classList.remove("show") : false;
        }
      });
    });
    errorMessage.classList.add("show");
    return;
  }

  // Collect selected tags
  const selectedTags = [];
  const checkboxes = formFields.querySelectorAll('input[type="checkbox"]:checked');

  checkboxes.forEach((checkbox) => {
    selectedTags.push(checkbox.name.split("[")[1].split("]")[0]);
  });


  // Store tags in a cookie
  if (selectedTags.length > 0) {
    document.cookie = `selectedTags=${encodeURIComponent(
      selectedTags.join(",")
    )}; path=/; max-age=3600`; // Cookie expires in 1 hour
  }

  addressInput = addressInput.value == '' ? undefined : addressInput.value;

  const apiUrl = 'http://localhost:8000/client/new';
  const jsonData = { name: requiredInputs[0].value, postNumber: requiredInputs[1].value, phone: requiredInputs[2].value, email: requiredInputs[3].value, address: addressInput, services: selectedTags };

  const headers = {
    'Content-Type': 'application/json',
  };

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(jsonData),
  };

  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json(); // Parse the response data as JSON
  let succes = document.getElementById("mail-succes-" + count);
  succes.classList.toggle("show");


  setTimeout(() => {
    succes.classList.toggle("show");
  }, 5000);
  form.form.reset();
  return false;
}

function lead_signup_no_redirect(form, c) {
  let count = c;
  let formData = new FormData(form.form);

  let xhttp = new XMLHttpRequest();
  xhttp.open(
    "POST",
    window.location.protocol + "//" + window.location.hostname + "/wp-admin/admin-ajax.php"
  );

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = this.responseText;
      let data = JSON.parse(response);
      let succes = document.getElementById("mail-succes-" + count);

      if (data.status === true) {
        succes.classList.toggle("show");
      }

      setTimeout(() => {
        succes.classList.toggle("show");
      }, 5000);
    }
  };

  xhttp.send(formData);
  form.form.reset();
  return false;
}

async function send_mail(form, c) {
  //Select form
  let formFields = form.closest("form");

  //Form data
  let count = c;
  let formData = new FormData(form.form);

  let errorMessage = formFields.querySelector(".error-message");
  let hasErrors = false;

  const requiredInputs = formFields.querySelectorAll("input[required], textarea[required]");
  let phoneInput = formFields.querySelector('input[placeholder="Telefon"]');
  let questionInput = formFields.querySelector('textarea[name="besked"]');

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      input.parentElement.classList.add("invalid");
      hasErrors = true;
    } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
      input.parentElement.classList.add("invalid");
      hasErrors = true;
    } else {
      input.parentElement.classList.remove("invalid");
    }
  });

  if (hasErrors) {
    requiredInputs.forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value.trim() && input.parentElement.classList.contains("invalid")) {
          input.parentElement.classList.remove("invalid");
          errorMessage.classList.contains("show") ? errorMessage.classList.remove("show") : false;
        }
      });
    });
    errorMessage.classList.add("show");
    return;
  }

  phoneInput = phoneInput.value == '' ? undefined : phoneInput.value;
  questionInput = questionInput.value == '' ? undefined : questionInput.value;

  const apiUrl = 'http://localhost:8000/question/add';
  const jsonData = { name: requiredInputs[0].value, email: requiredInputs[1].value, phone: phoneInput, question: questionInput };

  const headers = {
    'Content-Type': 'application/json',
  };

  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(jsonData),
  };

  const response = await fetch(apiUrl, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json(); // Parse the response data as JSON
  let succes = document.getElementById("mail-succes-" + count);
  succes.classList.toggle("show");


  setTimeout(() => {
    succes.classList.toggle("show");
  }, 5000);
  form.form.reset();
  return false;
}

const URL = 'https://facademesteren-back.onrender.com/plan/get?service='

const getPlans = async (service, selected) => {
  try {
    const response = await fetch(`${URL}${service}`)
    const result = await response.json();
    displayPlans(result.plans, selected)
    document.querySelector(`.${selected} .plan-page-loader`).classList.replace('d-flex', 'd-none')
  } catch (error) {
    console.log('There was an error connecting to the server. Please try again later');
  }
}

const displayPlans = async (plans, selected) => {
  let plansCartona = '';

  for (let index = 0; index < plans.length; index++) {
    const element = plans[index];
    let featuresList = '';

    for (let index = 0; index < element.features.length; index++) {
      const feature = element.features[index];
      featuresList += `<li>${feature}</li>`
    }

    plansCartona += `<div class="price-boks">
    <div class="top">
        <!-- Inner -->
        <p class="title bold ">${element.name}</p>

        <p class="price-wrapper">
            <span class="from">${element.price}</span>
        </p>
    </div>

    <ul class="inner-boks reset-ul checklist">
      ${featuresList}
    </ul>
    <div class="bottom-tekst">
    ${selected == 'algebehandlinger' ? '<p class="">*Prisen vurderes ud fra antal m2 tag, type hus og kloakering. Ikke 2 huse er ens.</p>' : ''}
    ${selected == 'algebehandlinger-priser' ? '<p class="">*Prisen vurderes ud fra antal m2 tag, type hus og kloakering. Ikke 2 huse er ens.</p>' : ''}
    </div>
    <div class="bottom-boks">
        <p onclick="popup('popup-contact', 'Popup - Fliserens uden imprægnering'); return false;"
            class="btn primary submit">
            INDHENT TILBUD </p>
    </div>
</div>`
  }
  document.querySelector(`.${selected} .price-wrapper`).innerHTML = plansCartona;
}

const API = 'https://facademesteren-back.onrender.com/portfolio/get?service='

const getImgs = async (service, selected) => {
  try {
    const response = await fetch(`${API}${service}`)
    const result = await response.json();
    displayImgs(result.portfolio, selected)
    document.querySelector(`.${selected} .plan-page-loader`).classList.replace('d-flex', 'd-none')
  } catch (error) {
    console.log('There was an error connecting to the server. Please try again later');
  }
}

const displayImgs = async (imgs, selected) => {
  let imgCartona = '';

  for (let index = 0; index < imgs.length; index++) {
    const element = imgs[index];

    imgCartona += `<div class="before-and-after">
    <div class="before">
      <span>Før behandling</span>
    </div>
    <div class="after">
      <span>Efter behandling</span>
    </div>
  
    <div class="cocoen">
      <div>
        <img src=${element.beforImgURL} alt="" style="width: 595px;">
      </div>
      <img src=${element.afterImgURL} alt="img">
    </div>
  </div>`
  }
  document.querySelector(`.${selected} .list`).innerHTML = imgCartona;
  let script = document.createElement('script');
  script.src = '/wp-content/themes/facademesteren/assets/js/before_and_afterdef8.js';
  document.body.appendChild(script);
}

if (window.location.pathname == "/fliserens/index.html") {
  getPlans('Facaderenovering', 'facaderenovering')
} else if (window.location.pathname == "/fliserens-priser/index.html") {
  getPlans('Facaderenovering', 'facaderenovering-price')
} else if (window.location.pathname == "/traerens-med-garanti/index.html") {
  getPlans('Vandblæsning', 'vandblæsning')
} else if (window.location.pathname == "/traerens-priser/index.html") {
  getPlans('Vandblæsning', 'vandblæsning-priser')
} else if (window.location.pathname == "/algebehandling/index.html") {
  getPlans('Algebehandlinger', 'algebehandlinger')
} else if (window.location.pathname == "/algebehandling-priser/index.html") {
  getPlans('Algebehandlinger', 'algebehandlinger-priser')
} else if (window.location.pathname == "/facaderens/index.html") {
  getPlans('Facaderens', 'facaderens')
} else if (window.location.pathname == "/facaderens-priser/index.html") {
  getPlans('Facaderens', 'facaderens-priser')
} else if (window.location.pathname == "/erhverv/index.html" || window.location.pathname == "/") {
  getPlans('Mureropgaver', 'mureropgaver')
} else if (window.location.pathname == "/maling-af-tag/index.html") {
  getPlans('Maling af tag', 'maling-af-tag')
} else if (window.location.pathname == "/maling-af-tag-priser/index.html") {
  getPlans('Maling af tag', 'maling-af-tag-priser')
} else if (window.location.pathname == "/Loftisolering/index.html") {
  getPlans('Loftisolering', 'loftisolering')
} else if (window.location.pathname == "/referencer/fliserens/index.html") {
  getImgs('Facaderenovering', 'sub-facaderenovering')
} else if (window.location.pathname == "/referencer/traerens/index.html") {
  getImgs('Vandblæsning', 'sub-vandblæsning')
} else if (window.location.pathname == "/referencer/tag/index.html") {
  getImgs('Tag', 'tag')
} else if (window.location.pathname == "/tagrens-priser/index.html") {
  getPlans('Tagrens', 'tagrens-priser')
} else if (window.location.pathname == "/forEfterGalleri/index.html") {
  getImgs('Fliserens-Før-efter-galleri', 'forEfterGalleri')
}  else if (window.location.pathname == "/tagrens/index.html") {
  getPlans('Tagrens', 'tagrens')
} else if (window.location.pathname == "/tagrenderens/index.html") {
  getPlans('Hulmursisolering', 'hulmursisolering')
}