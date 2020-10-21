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
    document.getElementById("app_search").style.display = "grid";

    var user = firebase.auth().currentUser.uid;

  } else {
    // No user is signed in.
    document.getElementById("app_search").style.display = "none";
    document.getElementById("container").style.display = "block";
    document.getElementById("app_cart").style.display = "none";
  }
});


function addProduct() { 
  var user = firebase.auth().currentUser.uid; 
  var productName = document.getElementById("productName").innerHTML;

  firebase.database().ref('carts').child(user).child(productName).once("value",snapshot => {
    if (snapshot.exists()){
      var qty = fixQuantity(snapshot)
      initAdd(qty)
    } else {
      addInitialProduct()
    }
  });
} 

function removeProduct() { 
  var user = firebase.auth().currentUser.uid; 
  var productName = document.getElementById("productName").innerHTML;

  firebase.database().ref('carts').child(user).child(productName).once("value",snapshot => {
    if (snapshot.exists()){
      var qty = fixQuantity(snapshot)
      initRemove(qty)
    } else {
    }
  });
} 

function fixQuantity(snapshot) {
  var snap = snapshot.val();
  var qty = snap.quantity;
  if (qty === undefined) {
    qty = 0;
  }
  return qty;
}

function initAdd(quantity) {
  var user = firebase.auth().currentUser.uid;
  var productName = document.getElementById("productName").innerHTML; 
  var ref = firebase.database().ref("products");
  var quantity = quantity; 

  ref.orderByChild("name").equalTo(productName).once("value",snapshot => {
    if (snapshot.exists()){
      
      return firebase.database().ref('/products/' + productName).once('value').then(function(snapshot) {
        var price = (snapshot.val() && snapshot.val().price);
        var name = (snapshot.val() && snapshot.val().name);
        var picture = (snapshot.val() && snapshot.val().picture);
        var qty = (snapshot.val() && quantity+1);
        firebase.database().ref('carts/' + user + '/' + productName).update({
          name: name,
          picture: picture,
          price : price,
          quantity: qty
        });
        document.getElementById("productQuantity").innerHTML = qty;
      });
    } else {
      console.log("Error adding product to cart");
    }
  });
}
function addInitialProduct() {
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
          quantity: 1
        });
      });
    } else {
      console.log("Error adding product to cart");
    }
  });
}

function initRemove(quantity) {
  var productName = document.getElementById("productName").innerHTML;
  var user = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref("products");
  var quantity = quantity;

  ref.orderByChild("name").equalTo(productName).once("value",snapshot => {
    if (snapshot.exists()){
      return firebase.database().ref('/products/' + productName).once('value').then(function(snapshot) {
        var price = (snapshot.val() && snapshot.val().price);
        var name = (snapshot.val() && snapshot.val().name);
        var picture = (snapshot.val() && snapshot.val().picture);
        var qty = (snapshot.val() && quantity-1);

        if(qty === 0) {
          firebase.database().ref().child('carts/' + user + '/' + productName).remove();
        } else {
          firebase.database().ref('carts/' + user + '/' + productName).update({
            name: name,
            picture: picture,
            price : price,
            quantity: qty
          });
        }
        document.getElementById("productQuantity").innerHTML = qty;
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
      range.selectNode(document.getElementById('final_span'));
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
    final_span.innerHTML = interim_transcript;

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
  // interim_span.innerHTML = '';
  start_img.src = 'mic-slash.gif';
  start_timestamp = event.timeStamp;
}

function searchProduct(searchInput) {
  var ref = firebase.database().ref("products");
  var user = firebase.auth().currentUser.uid;

  firebase.database().ref('carts').child(user).child(searchInput).once("value",snapshot => {
    if (snapshot.exists()){
      var qty = fixQuantity(snapshot)
      document.getElementById("productQuantity").innerHTML = qty;
    }
  });


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
    if (snapshot){
      return firebase.database().ref('/carts/' + user).once('value',snapshot=> {
        var cartProducts = snapshot.val();
        

        const array = Object.keys(cartProducts).map(i => cartProducts[i])
        console.log(array)

        renderElement(array)
    
      });
    } else {
      console.log("Error retrieving cart information");
    }
  }); 

  
}

function goToCart() {
  document.getElementById("app_search").style.display = "none"; 
  document.getElementById("app_cart").style.display = "grid";
  retrieveCart()
}

function goToSearch() {
  document.getElementById("app_search").style.display = "grid"; 
  document.getElementById("app_cart").style.display = "none";
  
}

var voiceButton = document.getElementById("start_button");

body.addEventListener("keyup", function (event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 186) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("start_button").click();
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





function renderElement(array) {

  document.getElementById('cart').innerHTML = "";
  // turn string response to JSON array
  var responseArray = array;
  // make sure there is a response
  if (responseArray.length > 0) {

      // get container
      var container = document.getElementById("cart");

      // iterate over each response
      for (var i = 0; i < responseArray.length; i += 1) {
          
              // create the elems needed
              var element = document.createElement("div");
              element.className = "cartproduct";
  
              var name= document.createElement("h2");
              name.className = "productname";
              name.innerHTML = responseArray[i].name;

              var quantity= document.createElement("p");
              quantity.className = "productquantity";
              quantity.innerHTML = "quantity: " + responseArray[i].quantity;

              var price= document.createElement("p");
              price.className = "productprice";
              price.innerHTML = responseArray[i].price;

              var image = document.createElement("img");
              image.id = "productimage"
              image.src = responseArray[i].picture;
              image.className = "productimage";

              var addbutton = document.createElement("button");
              addbutton.className = "add_button";
              // addbutton.onclick = addProduct();
              addbutton.innerHTML = "+";

              // document.getElementById("productimage").replaceChild(image, document.getElementById("productimage").childNodes[0]);


              image.className = "productimage";
              image.innerHTML = responseArray[i].picture;
              // append them all to player wrapper
              element.appendChild(name);
              element.appendChild(quantity);
              element.appendChild(price);
              element.appendChild(image);
              element.appendChild(addbutton);
              // append player to container
              container.appendChild(element);
      }
  } 
} 