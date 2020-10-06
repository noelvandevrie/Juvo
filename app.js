firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.

    document.getElementById("application").style.display = "block";
    document.getElementById("container").style.display = "none";

    var user = firebase.auth().currentUser;

    if (user != null) {
      var email_id = user.email;
      document.getElementById("user_para").innerHTML =
        "Welcome User : " + email_id;
    }
  } else {
    // No user is signed in.

    document.getElementById("application").style.display = "none";
    document.getElementById("container").style.display = "block";
  }
});

function switchSignup() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "flex";
}

function switchLogin() {
  document.getElementById("login-form").style.display = "flex";
  document.getElementById("signup-form").style.display = "none";
}

function login() {
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPass)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert("Error : " + errorMessage);

      // ...
    });
}

function signup() {
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPass)
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert("Error : " + errorMessage);

      // ...
    });
}

function logout() {
  firebase.auth().signOut();
}

var database = firebase.database();

function writeUserData(userId, name, email, address) {
  firebase
    .database()
    .ref("users/" + userId)
    .set({
      username: name,
      email: email,
      address: address,
    });
}
