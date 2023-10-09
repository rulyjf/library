function loadContent(page) {
  page = page.split('?');

  if (page[0] !== 'logout') {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${page[0]}.html`, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        app.innerHTML = xhr.responseText;
        controller(page);

        var scriptTags = app.getElementsByTagName('script');
        //alert(scriptTags);
        for (var i = 0; i < scriptTags.length; i++) {
          var scriptSrc = scriptTags[i].getAttribute('src');
          if (scriptSrc) {
            // Load and execute the JavaScript file using a new script element
            var scriptElement = document.createElement('script');
            scriptElement.src = scriptSrc;
            document.body.appendChild(scriptElement);
          } else {
            // Inline JavaScript code (you can also execute it directly here)
            var scriptContent = scriptTags[i].textContent;
            eval(scriptContent);
          }
        }
      }
    };
    xhr.send();
  } else {
    $('#myLogoutModal').modal('toggle');
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
    case 'users':
      loadUsers();
      break;
    case 'usersform':
      loadUsersEdit(page[1]);
      break;
    case 'users_roles':
      loadUsersRole();
      break;
    case 'usersform_roles':
      loadUsersEditRole(page[1]);
      break;
    case 'profiles':
      loadProfiles();
      break;
    case 'catalog_list':
      cat = page[1].split(':')[0];
      sub = page[1].split(':')[1];
      loadCatalog(cat, sub)
      break;
    case 'catalog_form':
      cat = page[1].split(':')[0];
      sub = page[1].split(':')[1];
      book = page[1].split(':')[2];
      loadCatalogForm(cat, sub, book);
      break;
    case 'catalog_new':
      cat = page[1].split(':')[0];
      sub = page[1].split(':')[1];
      loadCatalogNew(cat, sub);
      break;
    case 'event_list':
      loadEvent();
      break;
    case 'event_edit':
      loadEventForm(page[1]);
      break;
    case 'feedback':
      loadFeedback();
      break;
    case 'transaction_current':
      loadTransaction();
      break;
    case 'transaction_history':
      loadTransactionHistory();
      break;
    default:
      break;
  }

}
// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("role") === "member") {
    loadContent("profiles");
  } else if ((localStorage.getItem("role") === "admin") ||
    (localStorage.getItem("role") === "officer")
  ) {
    loadContent("dashboard");
  } else {
    this.location.href = "../index.html";
  }
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
      case "btn_verified":
        id = document.getElementById("userid").value;
        updateVerified(id, "Yes");
        loadContent('users');
        break;
      case "btn_not_verified":
        id = document.getElementById("userid").value;
        updateVerified(id, "No");
        loadContent('users');
        break;
      case "btn_back_user":
        loadContent('users');
        break;
      case "btn_back_userrole":
        loadContent('users_roles');
        break;
        break;
      case "btn_roles_member":
        id = document.getElementById("userid").value;
        updateRole(id, "member");
        loadContent('users_roles');
        break;
      case "btn_roles_officer":
        id = document.getElementById("userid").value;
        updateRole(id, "officer");
        loadContent('users_roles');
        break;
      case "btn_roles_admin":
        id = document.getElementById("userid").value;
        updateRole(id, "admin");
        loadContent('users_roles');
        break;
      case 'btn_profileSave':
        form = document.forms[0];
        var validator = new FormValidator({
          "events": ['blur', 'input', 'change']
        }, form);
        if (validator.checkAll(form).valid) {
          namex = document.getElementById("name");
          email = document.getElementById("email");
          age = document.getElementById("age");
          sex = document.getElementById("sex");
          residence = document.getElementById("residence");
          mobilePhone = document.getElementById("mobilePhone");
          block = document.getElementById("block");
          floorNumber = document.getElementById("floorNumber");
          address = document.getElementById("address");
          postalCode = document.getElementById("postal_code");
          id = document.getElementById("userid");
          profileUpdate(
            namex.value,
            email.value,
            age.value,
            sex.value,
            residence.value,
            mobilePhone.value,
            block.value,
            floorNumber.value,
            address.value,
            postalCode.value,
            id.value
          );
          $('#myProfileUpdated').modal('show');
        }
        break;
      case "btnClose_myProfileUpdated":
        $('#myProfileUpdated').modal('hide');
        break;
      case "btn_passwordSave":
        old = document.getElementById("oldPassword").value;
        password = document.getElementById("password").value;
        if (updatePassword(old, password)) {
          $('#myPasswordUpdated').modal('show');
        } else {
          $('#myPasswordNotUpdated').modal('show');
        }
        break;
      case "btnClose_myPasswordUpdated":
        $('#myPasswordUpdated').modal('hide');
        break;
      case "btnClose_myPasswordNotUpdated":
        $('#myPasswordNotUpdated').modal('hide');
        break;
      case "btn_catalogBack":
        cat = document.getElementById("cat").value;
        sub = document.getElementById("subcat").value;
        loadContent("catalog_list?" + cat + ":" + sub);
        break;
      case "btn_catalogSave":
        form = document.forms[0];
        var validator = new FormValidator({
          "events": ['blur', 'input', 'change']
        }, form);
        if (validator.checkAll(form).valid) {
          title = document.getElementById("title").value;
          author = document.getElementById("author").value;
          isbn = document.getElementById("isbn").value;
          language = document.getElementById("language").value;
          publicationYear = document.getElementById("publicationYear").value;
          totalCopies = document.getElementById("totalCopies").value;
          category = document.getElementById("cat").value;
          subcategory = document.getElementById("subcat").value;
          book = document.getElementById("book").value;
          description = document.getElementById("description").value;
          catalogUpdate(
            title,
            author,
            isbn,
            language,
            publicationYear,
            totalCopies,
            description,
            category,
            subcategory,
            book
          );
          $('#myCatalogUpdated').modal('show');
        }
        break;
      case "btnClose_myCatalogUpdated":
        cat = document.getElementById("cat").value;
        sub = document.getElementById("subcat").value;
        $('#myCatalogUpdated').modal('hide');
        loadContent("catalog_list?" + cat + ":" + sub)
        break;
      case "btn_catalogNew":
        cat = document.getElementById("cat").value;
        sub = document.getElementById("subcat").value;
        loadContent("catalog_new?" + cat + ":" + sub);
        break;
      case "btn_catalogSaveNew":
        title = document.getElementById("title").value;
        author = document.getElementById("author").value;
        isbn = document.getElementById("isbn").value;
        language = document.getElementById("language").value;
        publicationYear = document.getElementById("publicationYear").value;
        totalCopies = document.getElementById("totalCopies").value;
        category = document.getElementById("cat").value;
        subcategory = document.getElementById("subcat").value;
        description = document.getElementById("description").value;
        catalogNew(
          title,
          author,
          isbn,
          language,
          publicationYear,
          totalCopies,
          description,
          category,
          subcategory
        );
        $('#myCatalogNew').modal('show');
        break;
      case "btnClose_myCatalogNew":
        cat = document.getElementById("cat").value;
        sub = document.getElementById("subcat").value;
        $('#myCatalogNew').modal('hide');
        loadContent("catalog_list?" + cat + ":" + sub);
        break;
      case "btn_updateEvent":
        form = document.forms[0];
        var validator = new FormValidator({
          "events": ['blur', 'input', 'change']
        }, form);
        if (validator.checkAll(form).valid) {
          id = document.getElementById("id").value;
          eventName = document.getElementById("eventName").value;
          date = document.getElementById("date").value;
          time_from = document.getElementById("time_from").value;
          time_to = document.getElementById("time_to").value;
          loca = document.getElementById("location1").value;
          description = document.getElementById("description").value;
          eventUpdate(
            id,
            eventName,
            date,
            time_from,
            time_to,
            loca,
            description
          )
          $('#myEventUpdated').modal('show');
        }
        break;
      case "btnClose_myEventUpdated":
        $('#myEventUpdated').modal('hide');
        loadContent("event_list");
        break;
      case "btn_newEvent":
        form = document.forms[0];
        var validator = new FormValidator({
          "events": ['blur', 'input', 'change']
        }, form);
        if (validator.checkAll(form).valid) {
          id = "";
          eventName = document.getElementById("eventName").value;
          date = document.getElementById("date").value;
          time_from = document.getElementById("time_from").value;
          time_to = document.getElementById("time_to").value;
          loca = document.getElementById("location1").value;
          description = document.getElementById("description").value;
          eventUpdate(
            id,
            eventName,
            date,
            time_from,
            time_to,
            loca,
            description
          )
          $('#myEventAdded').modal('show');
        }
        break;
      case "btnClose_myEventAdded":
        $('#myEventAdded').modal('hide');
        loadContent("event_list");
        break;
      case "btn_return":
        document.getElementById("id").value = e.target.getAttribute("data-target");
        bill = fineByID(e.target.getAttribute("data-target"));

        if (parseFloat(bill) > 0.0) {
          document.getElementById("notes").innerHTML = "Your fine is SGD:" + bill + " , Please paynow to UN32938 then click return, thank you";
        }
        else {
          document.getElementById("notes").innerHTML = "Thank you, please come back again later and keep reading";
          transactionUpdate(e.target.getAttribute("data-target"));
          document.getElementById("btnClose_myReturn").innerHTML = "Ok";
          showHide("btnReturn_myReturn", "hide");
        }
        $('#myReturn').modal('show');
        break;
      case "btnReturn_myReturn":
        transactionUpdate(document.getElementById("id").value);
        $('#myReturn').modal('hide');
        loadContent('transaction_current');
        break;
      case "btnClose_myReturn":
        $('#myReturn').modal('hide');
        loadContent('transaction_current');
        break;
      default:
        break;
    }
  }
});

function hideshow(nm, sl, ey) {
  var password = document.getElementById(nm);
  var slash = document.getElementById(sl);
  var eye = document.getElementById(ey);

  if (password.type === 'password') {
    password.type = "text";
    slash.style.display = "block";
    eye.style.display = "none";
  }
  else {
    password.type = "password";
    slash.style.display = "none";
    eye.style.display = "block";
  }

}

function loadUsers() {
  const users = getUser();
  table = document.getElementById("usersTable");
  list = "";
  Object.values(users).forEach(usr => {
    li = ` 
      <tr>
          <td>${usr.name}</td>
          <td>${usr.age}</td>
          <td>${usr.sex}</td>
          <td>${usr.email}</td>
          <td>${usr.block} ${usr.address} ${usr.floorNumber} ${usr.postal_code}</td>  
          <td>${usr.residence}</td>
          <td>${usr.registrationDate}</td> 
          <td>${usr.isVerified}</td> 
          <td><a href="#" data-target="usersform?${usr.id}">Edit</a></td>         
      </tr>
    `;
    list = list + li;
  }
  );

  table.innerHTML = list;
}

function loadUsersEdit(id) {
  const users = getUser();
  table = document.getElementById("usersTable");
  list = "";
  Object.values(users).filter(f => f.id === id).forEach(usr => {
    document.getElementById("name").value = usr.name;
    document.getElementById("age").value = usr.age;
    document.getElementById("sex").value = usr.sex;
    document.getElementById("email").value = usr.email;
    document.getElementById("block").value = usr.block;
    document.getElementById("address").value = usr.address + ' ' + usr.floorNumber;
    document.getElementById("postalCode").value = usr.postal_code;
    document.getElementById("phone").value = usr.phone;
    document.getElementById("residence").value = usr.residence;
    document.getElementById("registrationDate").value = usr.registrationDate;
    document.getElementById("isVerified").value = usr.isVerified;
    document.getElementById("userid").value = usr.id;
    if (usr.isVerified === "Yes") {
      $("#btn_verified").hide();
    }
    if (usr.isVerified === "No") {
      $("#btn_not_verified").hide();
    }

  }
  );
}

function updateVerified(id, isVerified) {
  var users = getUser();
  Object.values(users).filter(f => f.id === id).forEach(usr => {
    usr.isVerified = isVerified;
  });
  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myUserData', JSON.stringify(users));
}

function loadUsersRole() {
  const users = getUser();
  table = document.getElementById("usersTable");
  list = "";
  Object.values(users).forEach(usr => {
    li = ` 
      <tr>
          <td>${usr.name}</td>
          <td>${usr.age}</td>
          <td>${usr.sex}</td>
          <td>${usr.email}</td>
          <td>${usr.block} ${usr.address} ${usr.floorNumber} ${usr.postal_code}</td>          
          <td>${usr.role.toUpperCase()}</td>
          <td>${usr.residence}</td>
          <td>${usr.registrationDate}</td> 
          <td>${usr.isVerified}</td> 
          <td><a href="#" data-target="usersform_roles?${usr.id}">Edit</a></td>         
      </tr>
    `;
    list = list + li;
  }
  );

  table.innerHTML = list;
}

function loadUsersEditRole(id) {
  const users = getUser();
  table = document.getElementById("usersTable");
  list = "";
  Object.values(users).filter(f => f.id === id).forEach(usr => {
    document.getElementById("name").value = usr.name;
    document.getElementById("age").value = usr.age;
    document.getElementById("sex").value = usr.sex;
    document.getElementById("email").value = usr.email;
    document.getElementById("block").value = usr.block;
    document.getElementById("address").value = usr.address + ' ' + usr.floorNumber;
    document.getElementById("postalCode").value = usr.postal_code;
    document.getElementById("roles").value = usr.role.toUpperCase();
    document.getElementById("registrationDate").value = usr.registrationDate;
    document.getElementById("isVerified").value = usr.isVerified;
    document.getElementById("userid").value = usr.id;
    if (usr.role === "member") {
      $("#btn_roles_member").hide();
    }
    if (usr.role === "officer") {
      $("#btn_roles_officer").hide();
    }
    if (usr.role === "admin") {
      $("#btn_roles_admin").hide();
    }

  }
  );
}

function updateRole(id, role) {
  var users = getUser();
  Object.values(users).filter(f => f.id === id).forEach(usr => {
    usr.role = role;
  });
  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myUserData', JSON.stringify(users));
}

function updatePassword(oldPassword, password) {

  var users = getUser();
  var id = localStorage.getItem("id");
  found = false;
  Object.values(users).filter(f => f.id === id && f.password === hashPassword(oldPassword)).forEach(usr => {
    usr.password = hashPassword(password);
    found = true
  });
  // Step 3: Update local storage with the modified JSON data
  if (found) {
    localStorage.setItem('myUserData', JSON.stringify(users));
  }
  return found
}

function profileUpdate(
  namex,
  email,
  age,
  sex,
  residence,
  mobilePhone,
  block,
  floorNumber,
  address,
  postalCode,
  id
) {
  var users = getUser();
  Object.values(users).filter(f => f.id === id).forEach(usr => {
    usr.role = role;
    usr.name = namex;
    usr.email = email;
    usr.age = age;
    usr.sex = sex;
    usr.residence = residence;
    usr.mobilePhone = mobilePhone;
    usr.block = block;
    usr.floorNumber = floorNumber;
    usr.address = address;
    usr.postal_code = postalCode;
  });
  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myUserData', JSON.stringify(users));

}

function loadProfiles() {
  var users = getUser();
  var id = localStorage.getItem("id");
  Object.values(users).filter(f => f.id === id).forEach(usr => {
    document.getElementById("name").value = usr.name;
    document.getElementById("age").value = usr.age;
    document.getElementById("sex").value = usr.sex;
    document.getElementById("email").value = usr.email;
    document.getElementById("confirm_email").value = usr.email;
    document.getElementById("block").value = usr.block;
    document.getElementById("floorNumber").value = usr.floorNumber
    document.getElementById("address").value = usr.address;
    document.getElementById("postal_code").value = usr.postal_code;
    document.getElementById("mobilePhone").value = usr.phone;
    document.getElementById("residence").value = usr.residence;
    document.getElementById("userid").value = usr.id;
  });
}

function loadCatalog(cati, subi) {
  const cat = getCatalog();
  table = document.getElementById("usersTable");
  list = "";
  Object.values(cat.categories).filter(c => c.rID === cati).forEach(c => {
    Object.values(c.subcategories).filter(sub => sub.rID === subi).forEach(sub => {
      document.getElementById("title").innerHTML = (c.categoryName + " :: " + sub.subcategoryName + "");
      document.getElementById("description").innerHTML = sub.shortDescription;
      document.getElementById("cat").value = cati;
      document.getElementById("subcat").value = subi;
      Object.values(sub.books).forEach(book => {
        li = ` 
      <tr>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.isbn}</td>
          <td>${book.publicationYear}</td>
          <td><a href="#" data-target="catalog_form?${cati}:${subi}:${book.rID}">Edit</a></td>         
      </tr>
    `;
        list = list + li;
      }
      );
    }
    );
  }
  );

  table.innerHTML = list;
}

function loadCatalogForm(cati, subi, booki) {
  const cat = getCatalog();
  Object.values(cat.categories).filter(c => c.rID === cati).forEach(c => {
    Object.values(c.subcategories).filter(sub => sub.rID === subi).forEach(sub => {
      document.getElementById("category").value = c.categoryName
      document.getElementById("subcategory").value = sub.subcategoryName;
      Object.values(sub.books).filter(b => b.rID === booki).forEach(book => {
        document.getElementById("title").value = book.title;
        document.getElementById("author").value = book.author;
        document.getElementById("isbn").value = book.isbn;
        document.getElementById("language").value = book.language;
        document.getElementById("publicationYear").value = book.publicationYear;
        document.getElementById("totalCopies").value = book.totalCopies;
        document.getElementById("description").value = book.description;
        document.getElementById("cat").value = cati;
        document.getElementById("subcat").value = subi;
        document.getElementById("book").value = booki;
      }
      );
    }
    );
  }
  );

}

function catalogUpdate(
  title,
  author,
  isbn,
  language,
  publicationYear,
  totalCopies,
  description,
  cati,
  subi,
  booki
) {

  var cat = getCatalog();
  Object.values(cat.categories).filter(c => c.rID === cati).forEach(c => {
    Object.values(c.subcategories).filter(sub => sub.rID === subi).forEach(sub => {
      document.getElementById("category").value = c.categoryName
      document.getElementById("subcategory").value = sub.subcategoryName;
      Object.values(sub.books).filter(b => b.rID === booki).forEach(book => {
        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.language = language;
        book.publicationYear = publicationYear;
        book.description = description;
        book.totalCopies = totalCopies;
      }
      );
    }
    );
  }
  );
  // Step 3: Update local storage with the modified JSON data

  localStorage.setItem('myCatalog', JSON.stringify(cat));

}

function loadCatalogNew(cati, subi) {
  const cat = getCatalog();
  Object.values(cat.categories).filter(c => c.rID === cati).forEach(c => {
    Object.values(c.subcategories).filter(sub => sub.rID === subi).forEach(sub => {
      document.getElementById("category").value = c.categoryName
      document.getElementById("subcategory").value = sub.subcategoryName;
      document.getElementById("cat").value = cati;
      document.getElementById("subcat").value = subi;
    }
    );
  }
  );

}

function newCatalogID(cati, subi) {
  const cat = getCatalog();
  Object.values(cat.categories).filter(c => c.rID === cati).forEach(c => {
    Object.values(c.subcategories).filter(sub => sub.rID === subi).forEach(sub => {
      return (subi + (Object.values(sub.books).length + 1).toString().padStart(3));
    }
    );
  }
  );

}

function catalogNew(
  title,
  author,
  isbn,
  language,
  publicationYear,
  totalCopies,
  description,
  cati,
  subi
) {

  // Get current user daa
  var cat = getCatalog();
  // Create a new record to add to the JSON data
  newID = newCatalogID(cati, subi);

  var newRecord = {
    "rID": newID,
    "title": title,
    "author": author,
    "publicationYear": publicationYear,
    "description": description,
    "isbn": isbn,
    "coverImageURL": "https://example.com/images/design-of-everyday-things.jpg",
    "language": language,
    "totalCopies": totalCopies,
    "availableCopies": totalCopies,
    "location": "Mystery Section, Shelf 1",
    "borrowers": []
  };

  Object.values(cat.categories).filter(c => c.rID === cati).forEach(c => {
    Object.values(c.subcategories).filter(sub => sub.rID === subi).forEach(sub => {
      sub.books.push(newRecord);
    }
    );
  }
  );
  // Add the new record to the JSON data array


  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myCatalog', JSON.stringify(cat));

}

function loadEvent() {

  const event = getEvents();
  var today = new Date();
  var year = today.getFullYear(); // Get the current year (four digits)
  var month = String(today.getMonth() + 1).padStart(2, '0'); // Get the current month (zero-based) and add leading zero if needed
  var day = String(today.getDate()).padStart(2, '0'); // Get the current day of the month and add leading zero if needed
  var dateString = `${year}-${month}-${day}`;

  table = document.getElementById("usersTable");
  list = "";
  Object.values(event.libraryEvents).sort((a, b) => (new Date(b.date)) - (new Date(a.date))).forEach(ev => {
    li = ` 
      <tr>
          <td>${ev.date}</td>
          <td>${ev.time}</td>
          <td>${ev.eventName}</td>
          <td>${ev.location}</td>
         `;
    if ((new Date(ev.date)) > (new Date(dateString))) {
      li = li + `<td><a href="#" data-target="event_edit?${ev.id}">Edit</a></td>`;
    } else {
      li = li + `<td>&nbsp</td>`;
    }

    li = li + `
          </tr>
    `;
    list = list + li;
  }
  );

  table.innerHTML = list;
}


function loadEventForm(id) {
  var event = getEvents();
  event.libraryEvents.filter(a => parseInt(a.id) === parseInt(id)).forEach(ev => {
    document.getElementById("id").value = ev.id;
    document.getElementById("eventName").value = ev.eventName;
    document.getElementById("date").value = ev.date;
    time_from = ev.time.split('-')[0].trim();
    time_to = ev.time.split('-')[1].trim();
    document.getElementById("time_from").value = convertTo24HourFormat(time_from);
    document.getElementById("time_to").value = convertTo24HourFormat(time_to);
    document.getElementById("location1").value = ev.location;
    document.getElementById("description").value = ev.description;

  });
}

function eventUpdate(
  id,
  eventName,
  date,
  time_from,
  time_to,
  loca,
  description
) {

  var event = getEvents();
  if (id != "") {
    event.libraryEvents.filter(a => parseInt(a.id) === parseInt(id)).forEach(ev => {
      ev.eventName = eventName;
      ev.date = date;
      ev.time = convertTo12HourFormat(time_from) + ' - ' + convertTo12HourFormat(time_to);
      ev.location = loca;
      ev.description = description;
    });
  } else {
    var newId = event.libraryEvents.length + 1;
    var newRecord = {
      "id": newId,
      "eventName": eventName,
      "date": date,
      "icon": "bi-pencil",
      "time": convertTo12HourFormat(time_from) + ' - ' + convertTo12HourFormat(time_to),
      "location": loca,
      "description": description
    };
    event.libraryEvents.push(newRecord);
  }
  localStorage.setItem("myEvent", JSON.stringify(event));
}

function loadFeedback() {
  const obj = getFeedback();

  table = document.getElementById("usersTable");
  list = "";
  Object.values(obj.feedback).sort((a, b) => (new Date(b.date)) - (new Date(a.date))).forEach(ev => {
    li = ` 
      <tr>
          <td>${ev.date}</td>
          <td>${ev.satisfaction}</td>
          <td>${ev.recomend}</td>
          <td>${ev.name}</td>
          <td>${ev.email}</td>
          <td>${ev.comment}</td>
         `;
    li = li + `
          </tr>
    `;
    list = list + li;
  }
  );

  table.innerHTML = list;

}

function avgSatisfaction() {
  const obj = getFeedback();
  let sum = 0;

  Object.values(obj.feedback).forEach(f => {
    sum += parseInt(f.satisfaction);

  });

  const average = (sum / obj.feedback.length).toFixed(2);
  document.getElementById("satisfaction").innerHTML = average;
}

function avgRecomendation() {
  const obj = getFeedback();
  const sum = Object.values(obj.feedback).reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.recomend), 0);
  // Calculate the average
  const average = (sum / obj.feedback.length).toFixed(2);
  document.getElementById("recomendation").innerHTML = average;
}
avgSatisfaction();
avgRecomendation();

const fineDaily = 0.5;

function fine(dueDate) {
  const dateStr1 = '2023-10-10';
  const dateStr2 = '2023-11-15';
  var today = new Date();
  var year = today.getFullYear(); // Get the current year (four digits)
  var month = String(today.getMonth() + 1).padStart(2, '0'); // Get the current month (zero-based) and add leading zero if needed
  var day = String(today.getDate()).padStart(2, '0'); // Get the current day of the month and add leading zero if needed
  var dateString = `${year}-${month}-${day}`;

  // Create Date objects from the date strings
  const date1 = new Date(dueDate);
  const date2 = new Date(dateString);

  if (date1 < date2) {
    // Calculate the time difference in milliseconds
    const timeDifferenceMs = date2 - date1;

    // Convert milliseconds to days
    return (fineDaily * (Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24)))).toFixed(2);
  } else {
    return 0.0
  }
}

function fineByID(id) {
  const obj = getTransaction();
  var bilfine = 0.0
  obj.borrowTransactions.filter(f => f.transactionID === id).forEach(tr => {
    return bilfine = fine(tr.dueDate);
  });
  return bilfine;
}

function loadTransaction() {
  const obj = getTransaction();
  transaction = Object.values(obj.borrowTransactions).filter(t => t.status === "Borrowed");
  table = document.getElementById("usersTable");
  list = "";
  if (localStorage.getItem("role") === "member") {
    transaction = transaction.filter(t => t.memberID === localStorage.getItem("id"));
  }
  transaction.sort((a, b) => (new Date(b.date)) - (new Date(a.date))).forEach(ev => {
    theFine = fine(ev.dueDate);
    li = ` 
      <tr>
          <td>${ev.transactionID}</td>
          <td>${ev.memberID}</td>
          <td>${ev.title}</td>
          <td>${ev.author}</td>
          <td>${ev.transactionDate}</td>
          <td>${ev.dueDate}</td>
          <td>SGD ${theFine}</td>
          <td>
            <button type='submit' class="btn btn-primary" id="btn_return" data-target="${ev.transactionID}">Return</button>
          </td>
         `;
    li = li + `
          </tr>
    `;
    list = list + li;
  }
  );

  table.innerHTML = list;

}

function loadTransactionHistory() {
  const obj = getTransaction();
  transaction = Object.values(obj.borrowTransactions).filter(t => t.status === "Returned");
  table = document.getElementById("usersTable");
  list = "";
  if (localStorage.getItem("role") === "member") {
    transaction = transaction.filter(t => t.memberID === localStorage.getItem("id"));
  }
  transaction.sort((a, b) => (new Date(b.date)) - (new Date(a.date))).forEach(ev => {
    theFine = fine(ev.dueDate);
    li = ` 
      <tr>
          <td>${ev.transactionID}</td>
          <td>${ev.memberID}</td>
          <td>${ev.title}</td>
          <td>${ev.author}</td>
          <td>${ev.transactionDate}</td>
          <td>${ev.dueDate}</td>
          <td>${ev.returnDate}</td>
          <td>SGD ${ev.fine}</td>
         `;
    li = li + `
          </tr>
    `;
    list = list + li;
  }
  );

  table.innerHTML = list;

}

function transactionUpdate(
  id
) {
  const obj = getTransaction();
  var today = new Date();
  var year = today.getFullYear(); // Get the current year (four digits)
  var month = String(today.getMonth() + 1).padStart(2, '0'); // Get the current month (zero-based) and add leading zero if needed
  var day = String(today.getDate()).padStart(2, '0'); // Get the current day of the month and add leading zero if needed
  var dateString = `${year}-${month}-${day}`;

  Object.values(obj.borrowTransactions).filter(f => f.transactionID === id).forEach(tr => {
    tr.fine = fine(tr.dueDate);
    tr.returnDate = dateString;
    tr.status = "Returned";
  });
  // Step 3: Update local storage with the modified JSON data
  localStorage.setItem('myTransaction', JSON.stringify(obj));

}




