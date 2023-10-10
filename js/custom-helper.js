function getUser() {
  if (localStorage.getItem('myUserData') === "" || localStorage.getItem('myUserData') < 3) {
    fetch('data/users.json')
      .then(response => response.json())
      .then(dt => {
        localStorage.setItem('myUserData', JSON.stringify(dt));
      })
      .catch(error => {
        console.error('Error fetching or parsing data:', error);
      });
  }
  data = localStorage.getItem('myUserData');
  data = data !== "" ? JSON.parse(data) : [];
  return data;
}

function getCatalog() {
  if (localStorage.getItem('myCatalog') === "" || localStorage.getItem('myCatalog') < 3) {
    fetch('data/library.json')
      .then(response => response.json())
      .then(dt => {
        localStorage.setItem('myCatalog', JSON.stringify(dt));
      })
      .catch(error => {
        console.error('Error fetching or parsing data:', error);
      });
  }
  data = localStorage.getItem('myCatalog');
  data = data !== "" ? JSON.parse(data) : [];
  return data;
}

function getEvents() {
  if (localStorage.getItem('myEvent') === "" || localStorage.getItem('myEvent') < 3) {
    fetch('data/events.json')
      .then(response => response.json())
      .then(dt => {
        localStorage.setItem('myEvent', JSON.stringify(dt));
      })
      .catch(error => {
        console.error('Error fetching or parsing data:', error);
      });
  }
  data = localStorage.getItem('myEvent');
  data = data !== "" ? JSON.parse(data) : [];
  return data;
}

function getFeedback() {
  if (localStorage.getItem('myFeedback') === "" || localStorage.getItem('myFeedback') < 3) {
    fetch('data/feedback.json')
      .then(response => response.json())
      .then(dt => {
        localStorage.setItem('myFeedback', JSON.stringify(dt));
      })
      .catch(error => {
        console.error('Error fetching or parsing data:', error);
      });
  }
  data = localStorage.getItem('myFeedback');
  data = data !== "" ? JSON.parse(data) : [];
  return data;
}

function getTransaction() {
  if (localStorage.getItem('myTransaction') === "" || localStorage.getItem('myTransaction') < 3) {
    fetch('data/transaction.json')
      .then(response => response.json())
      .then(dt => {
        localStorage.setItem('myTransaction', JSON.stringify(dt));
      })
      .catch(error => {
        console.error('Error fetching or parsing data:', error);
      });
  }
  data = localStorage.getItem('myTransaction');
  data = data !== "" ? JSON.parse(data) : [];
  return data;
}

getUser();
getCatalog();
getEvents();
getFeedback();
getTransaction();

function resetLocalData() {
  localStorage.setItem('myUserData', "");
  localStorage.setItem('myCatalog', "");
  localStorage.setItem('myEvent', "");
  localStorage.setItem('myFeedback', "");
  localStorage.setItem('myTransaction', "");
  getUser();
  getCatalog();
  getEvents();
  getFeedback();
  getTransaction();
  initialData();
}

//resetLocalData();


function showHide(id, act) {
  el = document.getElementById(id);
  if (act === 'show') {
    el.classList.remove('d-none');
    el.style.display = 'block';
  } else {
    const newLocal = 'd-none';
    el.classList.add(newLocal);
    el.style.display = 'none';
  }
}

function role() {
  var curLoc = window.location.href;
  if (curLoc.indexOf("admin") !== -1) {
    showHide("admProfile", 'hide');
    showHide("admDashboard", 'hide');
    showHide("admCatalog", 'hide');
    showHide("admUser", 'hide');
    showHide("admEvent", 'hide');
    showHide("admBorrow", 'hide');
    showHide("admFeedback", 'hide');
    showHide("admAudit", 'hide');
    showHide("dashTop", 'hide');
    

    if (localStorage.getItem("role") === "admin") {
      showHide("admProfile", 'show');
      showHide("admDashboard", 'show');
      showHide("admCatalog", 'show');
      showHide("admUser", 'show');
      showHide("admEvent", 'show');
      showHide("admBorrow", 'show');
      showHide("admFeedback", 'show');
      showHide("admAudit", 'show');
      showHide("dashTop", 'show');
    } else if (localStorage.getItem("role") === "officer") {
      showHide("admProfile", 'show');
      showHide("admDashboard", 'show');
      showHide("admCatalog", 'show');
      showHide("admEvent", 'show');
      showHide("admBorrow", 'show');
      showHide("dashTop", 'show');
    } else if (localStorage.getItem("role") === "member") {
      showHide("admProfile", 'show');
      showHide("admBorrow", 'show');
    }

  } else {
    showHide("navHistory", 'hide');
    showHide("navCurrent", 'hide');
    showHide("navListUser", 'hide');
    showHide("navListBook", 'hide');
    showHide("navTransaction", 'hide');
    showHide("navTransaction", 'hide');
    showHide("navLogin", 'hide');
    showHide("navLogout", 'hide');

    if (localStorage.getItem("role") === "") {
      showHide("navLogin", 'show');
    } else {
      showHide("navLogout", 'show');
    }

    if (localStorage.getItem("role") === "admin") {
      showHide("navListUser", 'show');
      showHide("navListBook", 'show');
      showHide("navTransaction", 'show');
    } else if (localStorage.getItem("role") === "officer") {
      showHide("navListBook", 'show');
      showHide("navTransaction", 'show');
    } else if (localStorage.getItem("role") === "member") {
      showHide("navHistory", 'show');
      showHide("navCurrent", 'show');
    }
  }
}

function initialData() {
  localStorage.setItem("name", "");
  localStorage.setItem("id", "");
  localStorage.setItem("icon", "guest.png");
  localStorage.setItem("role", "");
  //localStorage.setItem("myUserData", "");
  localStorage.setItem("isVerified", "No");

  role();
}

role();


// Hash a password and store it
function hashPassword(password) {
  const md5Hash = CryptoJS.MD5(password).toString();
  return md5Hash;
}


// Verify a user-entered password
function verifyPassword(enteredPassword, storedHashedPassword) {
  const enteredHashedPassword = hashPassword(enteredPassword);
  return enteredHashedPassword === storedHashedPassword;
}

//console.log("hash: ( " + hashPassword('Test123$') + " )");



function convertTo12HourFormat(time24) {
  // Split the input time at the colon to separate hours and minutes
  var [hours, minutes] = time24.split(':');

  // Parse the hours and minutes as integers
  var hoursInt = parseInt(hours, 10);
  var minutesInt = parseInt(minutes, 10);

  // Determine if it's AM or PM based on the hours
  let period = 'AM';
  if (hoursInt >= 12) {
    period = 'PM';
    if (hoursInt > 12) {
      // Convert 24-hour format to 12-hour format
      hoursInt = parseInt(hoursInt) - 12;
    }
  }

  // Format the result as "hh:mm AM/PM"
  const time12 = `${hoursInt}:${minutesInt < 10 ? '0' : ''}${minutesInt} ${period}`;

  return time12;
}

function convertTo24HourFormat(time12) {
  // Split the input time at the space to separate time and AM/PM
  var [time, period] = time12.split(' ');

  // Split the time into hours and minutes
  var [hours, minutes] = time.split(':');

  // Parse the hours and minutes as integers
  var hoursInt = parseInt(hours, 10);
  var minutesInt = parseInt(minutes, 10);

  // Determine if it's PM and adjust the hours accordingly
  if (period === 'PM' && parseInt(hoursInt) !== 12) {
    hoursInt = parseInt(hoursInt) + 12;
  } else if (period === 'AM' && parseInt(hoursInt) === 12) {
    // Handle midnight (12:00 AM) as 00:00
    hoursInt = 0;
  }

  // Format the result as "hh:mm"
  const time24 = `${hoursInt < 10 ? '0' : ''}${hoursInt}:${minutesInt < 10 ? '0' : ''}${minutesInt}`;

  return time24;
}
if( localStorage.getItem("name") === undefined || localStorage.getItem("name") === null){
  initialData();
}



