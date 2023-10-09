
(function ($) {

  "use strict";

  // MENU
  $('.navbar-collapse a').on('click', function () {
    $(".navbar-collapse").collapse('hide');
  });
  $(document).ready(function () {
    $("#profileToggle").click(function () {
      if (localStorage.getItem("isVerified") === "Yes") {
        $("#profileContent").collapse("toggle");
      }
    });
  });

  // CUSTOM LINK
  $('.smoothscroll').click(function () {
    var el = $(this).attr('href');
    var elWrapped = $(el);
    var header_height = $('.navbar').height();

    scrollToDiv(elWrapped, header_height);
    return false;

    function scrollToDiv(element, navheight) {
      var offset = element.offset();
      if (offset.top !== undefined) {
        var offsetTop = offset.top;
        var totalScroll = offsetTop - navheight;

        $('body,html').animate({
          scrollTop: totalScroll
        }, 300);
      }
    }
  });

  $(window).on('scroll', function () {
    function isScrollIntoView(elem, index) {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();
      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(window).height() * .5;
      if (elemBottom <= docViewBottom && elemTop >= docViewTop) {
        $(elem).addClass('active');
      }
      if (!(elemBottom <= docViewBottom)) {
        $(elem).removeClass('active');
      }
      var MainTimelineContainer = $('#vertical-scrollable-services')[0];
      var MainTimelineContainerBottom = MainTimelineContainer.getBoundingClientRect().bottom - $(window).height() * .5;
      $(MainTimelineContainer).find('.inner').css('height', MainTimelineContainerBottom + 'px');
    }
    var timeline = $('#vertical-scrollable-services li');
    Array.from(timeline).forEach(isScrollIntoView);
  });

})(window.jQuery);

const app = document.getElementById("app");

// Function to load content dynamically
function loadContent(page) {
  page = page.split('?');

  if (page[0] === 'logout') {
    initialData();
    $('#myLogoutModal').modal('toggle');
    $("#profileContent").collapse("hide");
    $('#pleaseWaitDialog').attr("style", "display:none;");
  }
  else if (page[0] === 'admin') {
    window.location.href = "admin/index.html";
  }
  else if (page[0] === 'borrow') {
    controller(page);
  }
  else {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${page[0]}.html`, true);
    xhr.onload = function () {
      $('#pleaseWaitDialog').attr("style", "display:block;");
      if (xhr.status === 200) {
        app.innerHTML = xhr.responseText;
        controller(page);
      }
      $('#pleaseWaitDialog').attr("style", "display:none;");
    };
    xhr.send();
  }
  var elements = document.querySelectorAll('.nav-link.click-scroll');
  for (var i = 0; i < elements.length; i++) {
    link = elements[i].getAttribute("data-target");
    if (link === page[0]) {
      elements[i].classList.add('active');
    } else {
      elements[i].classList.remove('active');
    }
  }
}

function controller(page) {
  switch (page[0]) {
    case 'login':
      mybread.innerHTML = `<li class="breadcrumb-item"> Login</li>`;
      showHide('loginErrorMessage', 'hide');
      showHide('loginSuccessMessage', 'hide');
      showHide('loginInfoMessage', 'show');
      break;
    case 'home':
      mybread.innerHTML = `<li class="breadcrumb-item"> Home</li>`;
      if (page[1] !== undefined) {
        $(document).ready(function () {
          $("#keyword").attr("value", page[1]);
        });
      }
      break;
    case 'faq':
      mybread.innerHTML = `<li class="breadcrumb-item"> FAQ</li>`;
      load_faq();
      break;
    case 'services':
      mybread.innerHTML = `<li class="breadcrumb-item"> Services</li>`;
      load_services();
      break;
    case 'event':
      mybread.innerHTML = `<li class="breadcrumb-item"> Event</li>`;
      load_events();
      break;
    case 'contact':
      mybread.innerHTML = `<li class="breadcrumb-item"> Contact</li>`;
      load_about();
      break;
    case 'catalog':
      mybread.innerHTML = `<li class="breadcrumb-item"> Catalog</li>`;
      if (page[1] !== undefined) {
        load_catalog(page[1]);
      } else {
        load_catalog("analytics");
      }
      break;
    case 'catalogList':
      cat = page[1].split(':')[0];
      sub = page[1].split(':')[1];
      load_subcatalog(cat, sub);
      break;
    case 'catalogDetail':
      cat = page[1].split(':')[0];
      sub = page[1].split(':')[1];
      book = page[1].split(':')[2];
      load_book(cat, sub, book);
      break;
    case 'search':
      load_search(page[1]);
      break;
    case 'searchDetail':
      cat = page[1].split(':')[0];
      sub = page[1].split(':')[1];
      book = page[1].split(':')[2];
      key = page[1].split(':')[3];
      mybread.innerHTML = `<li class="breadcrumb-item"> <a href="#" data-target="home?${key}">Home</a></li>
                        <li class="breadcrumb-item"><a href="#" data-target="search?${key}">Search</a></li>
                        `;
      load_searchDetail(cat, sub, book);
      break;
    case 'borrow':
      if (localStorage.getItem('id') === "") {
        showHide("btnOk_myBorrow", 'hide');
        document.getElementById("notes").innerHTML = "Please login before you eligible to borrow the book and Lets Register as member if currently not a member";
      } else {
        showHide("btnLogin_myBorrow", 'hide');
        document.getElementById("notes").innerHTML = "Please paynow 1$ to UN32938 then click continue, Thank you";
      }
      $('#myBorrow').modal('show');
      break;
    default:
      mybread.innerHTML = `<li class="breadcrumb-item">Home</li>`;
      break;
  }

}
// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  loadContent("home");
  mybread = document.getElementById('myBread').innerHTML = `<li class="breadcrumb-item"> Home</li>`;
});

// Event listener for navigation links
document.addEventListener("click", function (e) {
  mybread = document.getElementById('myBread');
  if (e.target.tagName === "A" || e.target.tagName === "H5" || e.target.tagName === "P") {
    page = e.target.getAttribute("data-target");
    if (page !== null && page !== undefined) {
      loadContent(page);
    }
  }
  else if (e.target.tagName === "BUTTON") {
    action = e.target.getAttribute("id");
    e.preventDefault();
    switch (action) {
      case 'btn_home_search':
        keyword = document.getElementById('keyword').value;
        mybread.innerHTML = `<li class="breadcrumb-item"> <a href="#" data-target="home?${keyword}">Home</a></li>
        <li class="breadcrumb-item">Search</li>
        `;
        loadContent("search?" + keyword);
        break;
      case 'btn_login':
        email = document.getElementById('loginEmail');
        password = document.getElementById('loginPassword').value;
        emailError = document.getElementById('loginEmailBlank');
        emailFormat = document.getElementById('loginEmailFormat');
        passwordError = document.getElementById('loginPasswordBlank');
        error = false;
        if (email.value === "") {
          emailError.classList.remove('d-none');
          emailError.style.display = 'block';
          error = true;
        } else {
          emailError.classList.add('d-none');
          emailError.style.display = 'none';
          const pattern = new RegExp(/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i);
          if (pattern.test(email.value)) {
            emailFormat.classList.add('d-none');
            emailFormat.style.display = 'none';
          } else {
            emailFormat.classList.remove('d-none');
            emailFormat.style.display = 'block';
            error = true
          }
        }

        if (password === "") {
          passwordError.classList.remove('d-none');
          passwordError.style.display = 'block';
          error = true;
        } else {
          passwordError.classList.add('d-none');
          passwordError.style.display = 'none';
        }

        if (!error)
          login(email.value, password);

        break;
      case 'btn_register':
        var form = document.querySelector('.needs-validation');

        if (!form.checkValidity()) {
          e.preventDefault(); // Prevent form submission if it's invalid
          e.stopPropagation();
          var invalidOptions = document.querySelectorAll(".form-control:invalid");

          invalidOptions.forEach(function (element) {
            element.parentNode.childNodes.forEach(function (node) {
              if (node.className == 'valid-feedback') {
                node.classList.add('d-none');
              }
            });
          });

          var validOptions = document.querySelectorAll(".form-control:valid");
          invalidOptions.forEach(function (element) {
            element.parentNode.childNodes.forEach(function (node) {
              if (node.className == 'invalid-feedback') {
                node.classList.remove('d-none');
              }

            });
          });
        }
        else {
          namex = document.getElementById("name");
          email = document.getElementById("email");
          password = document.getElementById("password");
          age = document.getElementById("age");
          sex = document.getElementById("sex");
          residence = document.getElementById("residence");
          mobilePhone = document.getElementById("mobilePhone");
          block = document.getElementById("block");
          floorNumber = document.getElementById("floorNumber");
          address = document.getElementById("address");
          postalCode = document.getElementById("postalCode");
          register(
            namex.value,
            email.value,
            password.value,
            age.value,
            sex.value,
            residence.value,
            mobilePhone.value,
            block.value,
            floorNumber.value,
            address.value,
            postalCode.value
          );
        }
        form.classList.add('was-validated');

        break;
      case 'btnClose_myWelcomeModal':
        $('#myWelcomeModal').modal('hide');
        window.location.href = "index.html";
        break;
      case 'btnClose_myVerifiedModal':
        $('#myVerifiedModal').modal('hide');
        loadContent('home');
        window.location.href = "index.html";
        break;
      case 'btnClose_myLogoutModal':
        $('#myLogoutModal').modal('hide');
        window.location.href = "index.html";
        break;
      case 'btn_feedback':
        var form = document.querySelector('.needs-validation');

        if (!form.checkValidity()) {
          e.preventDefault(); // Prevent form submission if it's invalid
          e.stopPropagation();
          var invalidOptions = document.querySelectorAll(".form-control:invalid");

          invalidOptions.forEach(function (element) {
            element.parentNode.childNodes.forEach(function (node) {
              if (node.className == 'valid-feedback') {
                node.classList.add('d-none');
              }
            });
          });

          var validOptions = document.querySelectorAll(".form-control:valid");
          invalidOptions.forEach(function (element) {
            element.parentNode.childNodes.forEach(function (node) {
              if (node.className == 'invalid-feedback') {
                node.classList.remove('d-none');
              }

            });
          });
        }
        else {
          namex = document.getElementById("name").value;
          email = document.getElementById("email").value;
          satisfaction = document.getElementById("satisfaction").value;
          recomend = document.getElementById("recomend").value;
          comment = document.getElementById("message").value;
          addFeedback(
            namex,
            email,
            satisfaction,
            recomend,
            comment
          );
          $('#myFeedback').modal('show');
        }
        form.classList.add('was-validated');
        break;
      case "btnClose_myFeedback":
        $('#myFeedback').modal('hide');
        loadContent('contact');
        break;
      case 'btnClose_myBorrow':
        $('#myBorrow').modal('hide');
        break;
      case 'btnLogin_myBorrow':
        $('#myBorrow').modal('hide');
        loadContent('login');
        break;
      case 'btnOk_myBorrow':
        id = document.getElementById('rID').value;
        title = document.getElementById('rTitle').value;
        author = document.getElementById('rAuthor').value;
        transactionAdd(id, title, author);
        $('#myBorrow').modal('hide');
        break;
      default:
        break;
    }
  }
});


function load_catalog(catid) {
  cat = getCatalog();
  categories = Object.values(cat.categories);

  // Get the container element to display the library category tasks
  const container = document.getElementById('myTab');
  list = "";
  // Iterate through each categories
  categories.forEach(cat => {
    // Access category properties
    const id = cat.rID;
    const name = cat.categoryName;
    li = `
          <li class="nav-item" role="presentation">
                  <button class="nav-link ${(id === catid ? "active" : "")}" id="${id}-tab" data-bs-toggle="tab"
                      data-bs-target="#${id}-tab-pane" type="button" role="tab" aria-controls="${id}-tab-pane"
                      aria-selected="${(id === catid ? "true" : "false")}">${name}</button>
              </li>
              `;
    list = list + li;
  });
  container.innerHTML = list;
  const container2 = document.getElementById('myTabContent');
  list = "";

  categories.forEach(cat => {
    list = list + `
        <div class="tab-pane fade show ${(cat.rID === catid ? "active" : "")}" id="${cat.rID}-tab-pane" role="tabpanel"
        aria-labelledby="design-tab" tabindex="0">
        <div class="row">
        `;
    const subCategories = Object.values(cat.subcategories);
    subCategories.forEach(sub => {
      li = ` 
                 <div class="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
                    <div class="custom-block bg-white shadow-lg">
                        <a href="#">
                            <div class="d-flex">
                                <div>
                                    <h5 class="mb-2" data-target="catalogList?${cat.rID}:${sub.rID}">${sub.subcategoryName}</h5>
                                    <p class="mb-0" data-target="catalogList?${cat.rID}:${sub.rID}">${sub.shortDescription}</p>
                                </div>
                                <span class="badge bg-design rounded-pill ms-auto">${sub.books.length}</span>
                            </div>
                            <img src="images/category/${sub.image}"
                                class="custom-block-image img-fluid" alt="">
                        </a>
                    </div>
                </div>
                `;
      list = list + li;
    });
    list = list + `</div>
              </div>
              `;
  });
  container2.innerHTML = list;
}

function load_subcatalog(catid, subid) {
  cat = getCatalog();
  categories = Object.values(cat.categories);
  const container = document.getElementById('myList');
  list = "";
  categories.filter(cat => cat.rID === catid).forEach(cat => {
    const sub = Object.values(cat.subcategories).filter(subcat => subcat.rID === subid);
    document.getElementById('subCategoryName').innerHTML = sub[0].subcategoryName;
    document.getElementById('subCategoryDescription').innerHTML = sub[0].longDescription;
    list = `<div class="row">`;
    mybread = document.getElementById('myBread');
    mybread.innerHTML = `<li class="breadcrumb-item"> <a href="#" data-target="catalog?${catid}">Catalog</a></li>
                            <li class="breadcrumb-item">${sub[0].subcategoryName}</li>`;
    Object.values(sub[0].books).slice(0, 9).forEach(book => {

      li = ` 
                 <div class="col-lg-4 col-md-6 col-12 mb-4 mb-lg-4">
                    <div class="custom-block bg-white shadow-lg">
                        <a href="#">
                            <div class="d-flex">
                            
                                <div>
                                <img src="https://raw.githubusercontent.com/rulyjf/library/main/books/${book.rID}.png"
                            class="custom-block-image img-fluid" alt="">
                                    <h5 class="mb-2" data-target="catalogDetail?${catid}:${subid}:${book.rID}">${book.title}</h5>
                                    <p class="mb-0" data-target="catalogDetail?${catid}:${subid}:${book.rID}">${book.description}</p>
                                </div>
                                
                            </div>
                            
                        </a>
                    </div>
                </div>
                `;
      list = list + li;
    });
    list = list + `</div>`;
  });
  container.innerHTML = list;


}


function load_book(catid, subid, bookid) {
  cat = getCatalog();
  categories = Object.values(cat.categories);

  list = "";
  categories.filter(cat => cat.rID === catid).forEach(cat => {
    const sub = Object.values(cat.subcategories).filter(subcat => subcat.rID === subid);
    list = `<div class="row">`;
    const book = Object.values(sub[0].books).filter(book => book.rID === bookid);
    document.getElementById('title').innerHTML = book[0].title;
    document.getElementById('bookDescription').innerHTML = book[0].description;
    document.getElementById('author').innerHTML = ' by ' + book[0].author;
    document.getElementById('publish').innerHTML = ' in ' + book[0].publicationYear;
    document.getElementById('isbn').innerHTML = ' isbn( ' + book[0].isbn + ' )';
    document.getElementById('lang').innerHTML = ' language ' + book[0].language;
    document.getElementById('borrow').innerHTML = '<a href="#" data-target="borrow" class="btn custom-btn custom-border-btn smoothscroll me-4">Borrow</a>';
    mybread = document.getElementById('myBread');
    document.getElementById('rID').value = book[0].rID;
    document.getElementById('rTitle').value = book[0].title;
    document.getElementById('rAuthor').value = book[0].author;
    mybread.innerHTML = `<li class="breadcrumb-item"> <a href="#" data-target="catalog?${catid}">Catalog</a></li>
                            <li class="breadcrumb-item"><a href="#" data-target="catalogList?${catid}:${subid}">${sub[0].subcategoryName}</a></li>
                            `;
    myImage = document.getElementById('img');
    myImage.innerHTML = '<img src="https://raw.githubusercontent.com/rulyjf/library/main/books/' + book[0].rID + '.png" class="topics-detail-block-image img-fluid">';

  });

}

function load_search(key) {
  cat = getCatalog();
  categories = Object.values(cat.categories);

  const container = document.getElementById('myList');
  found = 0;
  document.getElementById('searchKey').innerHTML = "Search : " + key;

  list = `<div class="row">`;
  categories.forEach(cat => {
    const subc = Object.values(cat.subcategories);
    subc.forEach(sub => {
      const books = Object.values(sub.books);
      books.filter(a => a.title.indexOf(key) !== -1).forEach(book => {
        li = ` 
                 <div class="col-lg-4 col-md-6 col-12 mb-4 mb-lg-4">
                    <div class="custom-block bg-white shadow-lg">
                        <a href="#">
                            <div class="d-flex">
                            
                                <div>
                                <img src="https://raw.githubusercontent.com/rulyjf/library/main/books/${book.rID}.png" class="custom-block-image img-fluid" alt="">
                                    <h5 class="mb-2" data-target="searchDetail?${cat.rID}:${sub.rID}:${book.rID}:${key}">${book.title}</h5>
                                    <p class="mb-0" data-target="searchDetail?${cat.rID}:${sub.rID}:${book.rID}:${key}">${book.description}</p>
                                </div>
                            </div>
                            
                        </a>
                    </div>
                </div>
                `;
        list = list + li;
        found = found + 1;
      });
    });
  });

  if (found === 0) {
    list = list = "<h4> Search not Found</h4>";
  }
  list = list + `</div>`;
  container.innerHTML = list;


}

function load_searchDetail(catid, subid, bookid) {
  cat = getCatalog();
  categories = Object.values(cat.categories);

  list = "";
  categories.filter(cat => cat.rID === catid).forEach(cat => {
    const sub = Object.values(cat.subcategories).filter(subcat => subcat.rID === subid);
    list = `<div class="row">`;
    const book = Object.values(sub[0].books).filter(book => book.rID === bookid);
    document.getElementById('title').innerHTML = book[0].title;
    document.getElementById('bookDescription').innerHTML = book[0].description;
    document.getElementById('author').innerHTML = ' by ' + book[0].author;
    document.getElementById('publish').innerHTML = ' in ' + book[0].publicationYear;
    document.getElementById('isbn').innerHTML = ' isbn( ' + book[0].isbn + ' )';
    document.getElementById('lang').innerHTML = ' language ' + book[0].language;
    document.getElementById('borrow').innerHTML = '<a href="#" data-target="borrow" class="btn custom-btn custom-border-btn smoothscroll me-4">Borrow</a>';
    myImage = document.getElementById('img');
    document.getElementById('rID').value = book[0].rID;
    document.getElementById('rTitle').value = book[0].title;
    document.getElementById('rAuthor').value = book[0].author;
    myImage.innerHTML = '<img src="https://raw.githubusercontent.com/rulyjf/library/main/books/' + book[0].rID + '.png" class="topics-detail-block-image img-fluid">';
  });
}

function load_services() {
  fetch('data/services.json')
    .then(response => response.json())
    .then(data => {
      // Access the 'library categories' array from the JSON data
      const services = data.membershipProcedure;
      const container = document.getElementById('myServices');
      list = "";
      Object.values(services).forEach(srv => {
        const steps = Object.values(srv.steps);
        list = list + `<div class="col-12 text-center mt-6">
        <h2 class="text-white mb-4 mt-4">${srv.name}</h1>
        </div>
        <div class="col-lg-10 col-12 mx-auto">
          <div class="services-container">
            <ul class="vertical-scrollable-services" id="vertical-scrollable-services">
                <div class="list-progress">
                    <div class="inner"></div>
                </div>
        `;
        Object.values(steps).forEach(step => {

          li = ` 
                <li>
                  <h4 class="text-white mb-3">${step.title}</h4>
                  <p class="text-white">${step.description}</p>
                  <div class="icon-holder">
                      <i class="${step.icon}"></i>
                  </div>
                </li>
                `;
          list = list + li;
        });
        list = list + `
          </ul>
         </div>
        </div>       
        `;
      });
      container.innerHTML = list + `
      <div class="col-12 text-center mt-5">
          <p class="text-white">
              Let's join and visit 
              <a href="#" class="btn custom-btn custom-border-btn ms-3">Check out Youtube</a>
          </p>
      </div>        
      `;
    })
    .catch(error => {
      console.error('Error fetching or parsing data:', error);
    });

}

function load_events() {
  ev = getEvents();
  libraryEvents = Object.values(ev.libraryEvents);

  const container = document.getElementById('myEvent');
  list = `<div class="col-12 text-center mt-6">
        <h2 class="text-white mb-4 mt-4">Our Events</h1>
        </div>
        <div class="col-lg-10 col-12 mx-auto">
          <div class="services-container">
            <ul class="vertical-scrollable-services" id="vertical-scrollable-services">
                <div class="list-progress">
                    <div class="inner"></div>
                </div>
        `;
  libraryEvents.forEach(even => {
    li = ` 
                <li>
                  <h4 class="text-white mb-3">${even.eventName}</h4>
                  <p class="text-white">${even.date} ${even.time}</p>
                  <p class="text-white">${even.description}</p>
                  <p class="text-white">${even.location}</p>
                  <div class="icon-holder">
                      <i class="${even.icon}"></i>
                  </div>
                </li>
                `;
    list = list + li;
  });
  list = list + `
          </ul>
         </div>
        </div>       
        `;

  container.innerHTML = list + `
      <div class="col-12 text-center mt-5">
          <p class="text-white">
              Let's join and visit 
              <a href="#" class="btn custom-btn custom-border-btn ms-3">Check out Youtube</a>
          </p>
      </div>        
      `;


}


function load_faq() {
  fetch('data/faq.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('myFaq');
      list = "";
      Object.values(data.faqCategories).forEach(cat => {
        const faqs = Object.values(cat.faqs);
        list = `${list}
                    <h4 style="color:white;margin-top:10px;">${cat.categoryName}</h4>
                      <div class="accordion" id="${cat.rID}">
                         
            `;
        Object.values(faqs).forEach(faq => {
          li = ` 
                <div class="accordion-item">
                  <h3 class="accordion-header" id="heading${faq.rID}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapse${faq.rID}" aria-expanded="false" aria-controls="collapseOne">
                        ${faq.question}
                    </button>
                  </h3>
                  <div id="collapse${faq.rID}" class="accordion-collapse collapse" aria-labelledby="heading${faq.rID}"
                  data-bs-parent="#${cat.rID}">
                    <div class="accordion-body">
                        ${faq.answer}
                    </div>
                  </div>
                </div>
                `;
          list = list + li;
        });
        list = list + `                        
                      </div>      
                    `;
      });
      container.innerHTML = list;
    })
    .catch(error => {
      console.error('Error fetching or parsing data:', error);
    });

}

function load_about() {
  fetch('data/aboutus.json')
    .then(response => response.json())
    .then(data => {
      const about = Object.values(data.aboutUs);
      const container = document.getElementById('myAbout');

      list = `<div class="col-12 text-center mt-6">
        <h2 class="text-white mb-4 mt-4">Our Events</h1>
        </div>
        <div class="col-lg-10 col-12 mx-auto">
          <div class="services-container">
            <ul class="vertical-scrollable-services" id="vertical-scrollable-services">
                <div class="list-progress">
                    <div class="inner"></div>
                </div>
        `;
      li = ` 
                <li>
                  <h4 class="text-white mb-3">Vision</h4>
                  <p class="text-white">${data.aboutUs.vision}</p>
                  <div class="icon-holder">
                      <i class="bi-bank"></i>
                  </div>
                </li>
                `;
      list = list + li;
      li = ` 
                <li>
                  <h4 class="text-white mb-3">Mission</h4>
                  <p class="text-white">${data.aboutUs.mission}</p>
                  <div class="icon-holder">
                      <i class="bi-bank"></i>
                  </div>
                </li>
                `;
      list = list + li;
      li = ` 
                <li>
                  <h4 class="text-white mb-3">History</h4>
                  <p class="text-white">${data.aboutUs.history}</p>
                  <div class="icon-holder">
                      <i class="bi-bank"></i>
                  </div>
                </li>
                `;
      list = list + li;
      Object.values(data.aboutUs.yearlyReport).forEach(even => {
        li = ` 
                <li>
                  <h4 class="text-white mb-3">${even.year}</h4>
                  <p class="text-white">${even.highlights}</p>
                  <p class="text-white">${even.challenges}</p>
                  <div class="icon-holder">
                      <i class="bi-bank"></i>
                  </div>
                </li>
                `;
        list = list + li;
      });
      list = list + `
          </ul>
         </div>
        </div>       
        `;
      container.innerHTML = list + `
      <div class="col-12 text-center mt-5">
          <p class="text-white">
              Let's join and visit 
             
          </p>
      </div>        
      `;
    })
    .catch(error => {
      console.error('Error fetching or parsing data:', error);
    });

}

function login(email, password) {
  const users = getUser();
  localStorage.setItem("name", "");
  localStorage.setItem("id", "");
  localStorage.setItem("icon", "");
  localStorage.setItem("role", "");
  localStorage.setItem("basket", "");
  showHide('loginErrorMessage', 'hide');
  showHide('loginSuccessMessage', 'hide');
  showHide('loginInfoMessage', 'hide');

  Object.values(users).filter(l => l.email === email && l.password === hashPassword(password)).forEach(log => {
    showHide('loginSuccessMessage', 'show');
    if (log.isVerified === "Yes") {
      localStorage.setItem("name", log.name);
      localStorage.setItem("id", log.id);
      if (log.avatar.length > 1) {
        localStorage.setItem("icon", log.avatar);
      } else if (log.avatar.length > 1 && log.isVerified === "Yes") {
        localStorage.setItem("icon", "avatar.png");
      } else {
        localStorage.setItem("icon", "guest.png");
      }
      localStorage.setItem("isVerified", log.isVerified);
      localStorage.setItem("role", log.role);
      localStorage.setItem("basket", "");
      role();
      $('#myWelcomeModal').modal('show');
    } else {
      initialData();
      $('#myVerifiedModal').modal('show');
    }
  }
  );

  if (localStorage.getItem("id") === "") {
    showHide('loginErrorMessage', 'show');
  }
}

function register(
  namex,
  email,
  password,
  age,
  sex,
  residence,
  mobilePhone,
  block,
  floorNumber,
  address,
  postalCode
) {

  // Get current user daa
  var users = getUser();
  // Create a new record to add to the JSON data
  newID = (Object.keys(users).length + 1).toString().padStart(3, '0');
  var today = new Date();

  var year = today.getFullYear(); // Get the current year (four digits)
  var month = String(today.getMonth() + 1).padStart(2, '0'); // Get the current month (zero-based) and add leading zero if needed
  var day = String(today.getDate()).padStart(2, '0'); // Get the current day of the month and add leading zero if needed

  var dateString = `${year}-${month}-${day}`;
  var newRecord = {
    "id": newID,
    "name": namex,
    "age": age,
    "identification": "001H",
    "email": email,
    "block": block,
    "address": address,
    "floorNumber": floorNumber,
    "postal_code": postalCode,
    "phone": mobilePhone,
    "avatar": "E",
    "sex": sex,
    "residence": residence,
    "password": hashPassword(password),
    "role": "member",
    "isVerified": "No",
    "registrationDate": dateString
  };

  // Add the new record to the JSON data array
  users.push(newRecord);

  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myUserData', JSON.stringify(users));

  login(email, password);
}

function addFeedback(
  namex,
  email,
  satisfaction,
  recomend,
  comment
) {
  // Get current user daa
  var obj = getFeedback();
  // Create a new record to add to the JSON data
  newID = (Object.keys(obj.feedback).length + 1);
  var today = new Date();

  var year = today.getFullYear(); // Get the current year (four digits)
  var month = String(today.getMonth() + 1).padStart(2, '0'); // Get the current month (zero-based) and add leading zero if needed
  var day = String(today.getDate()).padStart(2, '0'); // Get the current day of the month and add leading zero if needed

  var dateString = `${year}-${month}-${day}`;
  var newRecord = {
    "id": newID,
    "name": namex,
    "email": email,
    "date": dateString,
    "satisfaction": satisfaction,
    "recomend": recomend,
    "comment": comment
  };

  // Add the new record to the JSON data array
  obj.feedback.push(newRecord);

  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myFeedback', JSON.stringify(obj));

}

function transactionAdd(
  itemId,
  title,
  author
) {
  const obj = getTransaction();
  var today = new Date();
  var year = today.getFullYear(); // Get the current year (four digits)
  var month = String(today.getMonth() + 1).padStart(2, '0'); // Get the current month (zero-based) and add leading zero if needed
  var day = String(today.getDate()).padStart(2, '0'); // Get the current day of the month and add leading zero if needed
  var todayString = `${year}-${month}-${day}`;
  var yeardue = today.getFullYear(); // Get the current year (four digits)
  var monthdue = String(today.getMonth() + 1).padStart(2, '0'); // Get the current month (zero-based) and add leading zero if needed
  var daydue = String(today.getDate()).padStart(2, '0'); // Get the current day of the month and add leading zero if needed
  var dueString = `${yeardue}-${monthdue}-${daydue}`;
  var newRecord = {
    "transactionID": "BT" + (obj.borrowTransactions.length + 1).toString().padStart(3),
    "memberID": localStorage.getItem("id"),
    "itemID": itemId,
    "title": title,
    "author": author,
    "dueDate": dueString,
    "transactionDate": todayString,
    "fine": 0.0,
    "returnDate": null,
    "status": "Borrowed"
  }
  obj.borrowTransactions.push(newRecord);
  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myTransaction', JSON.stringify(obj));
}






