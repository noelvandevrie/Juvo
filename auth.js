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
        document.getElementById("container").style.display = "none";
        document.getElementById("app_search").style.display = "grid";
        
        var user = firebase.auth().currentUser.uid;
    } else {
        document.getElementById("app_search").style.display = "none";
        document.getElementById("container").style.display = "block";
        document.getElementById("app_cart").style.display = "none";
        document.getElementById("app_order").style.display = "none";
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