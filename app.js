var firebaseConfig = {
  apiKey: "AIzaSyC9CpENXN25PjdqqwYwlaLshKGst2o3gcg",
  authDomain: "juvo-app.firebaseapp.com",
  databaseURL: "https://juvo-app.firebaseio.com",
  projectId: "juvo-app",
  storageBucket: "juvo-app.appspot.com",
  messagingSenderId: "293449225332",
  appId: "1:293449225332:web:99d40aab2780e327b66d21",
  measurementId: "G-H1KKBECR0V"
};
firebase.initializeApp(firebaseConfig);

  firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    document.getElementById("container").style.display = "none";
    document.getElementById("application").style.display = "grid";

    var user = firebase.auth().currentUser.uid;

  } else {
    // No user is signed in.
    document.getElementById("application").style.display = "none";
    document.getElementById("container").style.display = "block";
  }
});

function retrieveUpdateQuantity() { 
  var user = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref("/carts/" + user);
  var productName = document.getElementById("productName").innerHTML;
  ref.orderByChild("name").equalTo(productName).once("value",snapshot => {
    if (snapshot.exists()){
      return firebase.database().ref('/carts/' + user + '/' + productName).once('value').then(function(snapshot) {
        var quantity = (snapshot.val() && snapshot.val().quantity);
          console.log(quantity)
      });
    } else {
    }
  }); 
}

function addProduct() {
  var user = firebase.auth().currentUser.uid;
  var productName = document.getElementById("productName").innerHTML;
  var ref = firebase.database().ref("products");
  ref.orderByChild("name").equalTo(productName).once("value",snapshot => {
    if (snapshot.exists()){

      return firebase.database().ref('/products/' + productName).once('value').then(function(snapshot) {
        var price = (snapshot.val() && snapshot.val().price);
        var name = (snapshot.val() && snapshot.val().name);
        var picture = (snapshot.val() && snapshot.val().picture);

        firebase.database().ref('carts/' + user + '/' + productName).update({
          name: name,
          picture: picture,
          price : price,
        });
      });
    } else {
      console.log("Error adding product to cart");
    }
  });
}
function removeProduct() {
  var productName = document.getElementById("productName").innerHTML;
  var user = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref("products");

  ref.orderByChild("name").equalTo(productName).once("value",snapshot => {
    if (snapshot.exists()){
      return firebase.database().ref('/products/' + productName).once('value').then(function(snapshot) {
        var price = (snapshot.val() && snapshot.val().price);
        var name = (snapshot.val() && snapshot.val().name);
        var picture = (snapshot.val() && snapshot.val().picture);

        firebase.database().ref().child('carts/' + user + '/' + productName).remove();
      });
    } else {
      console.log("Error removing product from cart");
    }
  });
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
      var errorCode = error.code;
      var errorMessage = error.message;

      window.alert("Error : " + errorMessage);
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

var langs = [['English',['en-US', 'United States']],['Nederlands',['nl-NL']]];
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = function() {
    recognizing = true;
    start_img.src = 'mic-animate.gif';
  };


  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'mic.gif';
    if (!final_transcript) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('productName'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = final_transcript;
    final_span.innerHTML = final_transcript;
    interim_span.innerHTML = interim_transcript;

    searchProduct(final_transcript)
  };
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = 'nl-NL';
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  start_timestamp = event.timeStamp;
}

function searchProduct(searchInput) {
  var ref = firebase.database().ref("products");

  ref.orderByChild("name").equalTo(searchInput).once("value",snapshot => {
    if (snapshot.exists()){
      return firebase.database().ref('/products/' + searchInput).once('value').then(function(snapshot) {
        var price = (snapshot.val() && snapshot.val().price);
        var name = (snapshot.val() && snapshot.val().name);
        var picture = (snapshot.val() && snapshot.val().picture);

        document.getElementById("productName").innerHTML = name;

        var image = document.createElement("img"); 
        image.src = picture;
    
        document.getElementById("productImage").replaceChild(image, document.getElementById("productImage").childNodes[0]);
        document.getElementById("productPrice").innerHTML = price;
        toggleAddRemoveOn();
      });
    } else {
      console.log("Error searching for product");
    }
  }); 
}

function toggleAddRemoveOn() { 
  document.getElementById("addProduct").style.display = "flex";
  document.getElementById("removeProduct").style.display = "flex";
}

function retrieveCart() {
  var ref = firebase.database().ref("carts");
  var user = firebase.auth().currentUser.uid;

  ref.once("value",snapshot => {
    if (snapshot.exists()){
      return firebase.database().ref('/carts/' + user).once('value').then(function(snapshot) {
        var cartProducts = snapshot.val();

        Object.keys(cartProducts).forEach(function(key) {
          console.log(key, cartProducts[key]);
        });

      });
    } else {
      console.log("Error retrieving cart information");
    }
  }); 
}

var voiceButton = document.getElementById("start_button");

body.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 71) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("start_button").click();
  }
});

var logoutButton = document.getElementById("logout_button");

body.addEventListener("keyup", function (event) {
  if (event.keyCode === 76) {
    event.preventDefault();
    document.getElementById("logout_button").click();
  }
});

var count = 0;

body.addEventListener("keyup", function (event) {
  if (event.keyCode === 37) {
    event.preventDefault();
    count -= 1;
    console.log(count)
  }
  if (event.keyCode === 39) {
    event.preventDefault();
    count += 1;
    console.log(count)
  }
});

var addButon = document.getElementById("add_button");

body.addEventListener("keyup", function (event) {
  if (event.keyCode === 187) {
    event.preventDefault();
    document.getElementById("add_buton").click();
  }
});