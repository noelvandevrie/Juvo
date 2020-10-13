
  firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    document.getElementById("container").style.display = "none";
    document.getElementById("application").style.display = "block";


    var user = firebase.auth().currentUser.uid;



  } else {
    // No user is signed in.

    document.getElementById("application").style.display = "none";
    document.getElementById("container").style.display = "block";
  }
});

function searchProduct() {
  var searchInput = document.getElementById("search_field").value;
  console.log(searchInput);

  return firebase.database().ref('/products/' + searchInput).once('value').then(function(snapshot) {
    var price = (snapshot.val() && snapshot.val().price) || 'Anonymous';
    console.log(price);
    var name = (snapshot.val() && snapshot.val().name) || 'Anonymous';
    console.log(price);
    var picture = (snapshot.val() && snapshot.val().picture) || 'Anonymous';
    console.log(price);

    document.getElementById("productName").innerHTML = name;
    document.getElementById("productPrice").innerHTML = price;

    var image = document.createElement("img");
    image.src = picture;

    document.getElementById("productImage").appendChild(image);


  });

  
}

function addProduct() {
  var user = firebase.auth().currentUser.uid;
  var product = "test123123";
  firebase.database().ref('carts/' + user + '/' + product).set({
    name: 'test22',
    picture: 'test',
    price : '2.00$'
  });
}

function removeProduct() {
  var user = firebase.auth().currentUser.uid;
  var product = "test123123";

  firebase.database().ref().child('carts/' + user + '/' + product).remove();
}


function switchSignup() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "flex";
}
function switchLogin() {
  document.getElementById("login-form").style.display = "flex";
  document.getElementById("signup-form").style.display = "none";
}
function login() {
  var userEmail = document.getElementById("email_login_field").value;
  var userPass = document.getElementById("password_login_field").value;

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
function SignUp() {
  var userEmail = document.getElementById("email_signup_field").value;
  var userPass = document.getElementById("password_signup_field").value;
  var address = document.getElementById("address_signup_field").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(userEmail, userPass)
    .then(userCredential => {
      firebase.database().ref('users/' + userCredential.user.uid).set({
        email: userEmail,
        address: address
      });
    })
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















// var body = document.getElementById("body");

// body.addEventListener("keyup", function (event) {
//   // Number 13 is the "Enter" key on the keyboard
//   if (event.keyCode === 13) {
//     // Cancel the default action, if needed
//     event.preventDefault();
//     // Trigger the button element with a click
//     document.getElementById("loginbutton").click();
//   }
// });
