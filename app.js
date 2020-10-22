
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
        document.getElementById("productQuantity").innerHTML = 'Aantal: ' + qty;
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
        document.getElementById("productQuantity").innerHTML = 'Aantal: ' + 1;
      });
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
        document.getElementById("productQuantity").innerHTML = 'Aantal: ' + qty;
      });
    }
  });
}

function searchProduct(searchInput) {
  var ref = firebase.database().ref("products");
  var user = firebase.auth().currentUser.uid;
  document.getElementById("productQuantity").innerHTML = '';

  firebase.database().ref('carts').child(user).child(searchInput).once("value",snapshot => {
    if (snapshot.exists()){
      var qty = fixQuantity(snapshot)
      document.getElementById("productQuantity").innerHTML = 'Aantal: ' + qty;
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
        image.id = 'productimg';
        image.className ='productimg';
        document.getElementById("productImage").replaceChild(image, document.getElementById("productImage").childNodes[0]);
        document.getElementById("productPrice").innerHTML = 'Prijs:  €' + price;
        toggleAddRemoveOn();
      });
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
  document.getElementById('total_div').innerHTML = '';
  
  ref.once("value",snapshot => {
    if (snapshot){
      return firebase.database().ref('/carts/' + user).once('value',snapshot=> {
        var cartProducts = snapshot.val();
      
        if(cartProducts === null) {
          console.log("no products in cart yet")
        } else {
          var array = Object.keys(cartProducts).map(i => cartProducts[i])
          renderCart(array)
        }
      });
    }
  }); 
}

function calcTotal(array) {
  var total = 0;
  for (var i = 0; i < array.length; i += 1) { 
    total = total +  array[i].quantity * array[i].price; 
  }
  return total;
}

function goToCart() {
  document.getElementById("app_search").style.display = "none"; 
  document.getElementById("app_cart").style.display = "grid";
  document.getElementById("app_order").style.display = "none";
  retrieveCart()
}

function goToSearch() {
  document.getElementById("app_search").style.display = "grid"; 
  document.getElementById("app_cart").style.display = "none";
  document.getElementById("app_order").style.display = "none";
}

function goToOrder() { 
  document.getElementById("app_cart").style.display = "none";
  document.getElementById("app_search").style.display = "none";
  document.getElementById("app_order").style.display = "grid";
  orderProducts()
  retrieveOrder()
}

function renderCart(array) {
  document.getElementById('cart').innerHTML = "";
  var responseArray = array;
  if (responseArray.length > 0) {
    
    var container = document.getElementById("cart");

      for (var i = 0; i < responseArray.length; i += 1) {
              var numproduct = i + 1;
              // create the elems needed
              var element = document.createElement("div");
              element.className = "cartproduct " + "product" + numproduct;
              element.id = "product" + numproduct;
  
              var name= document.createElement("h2");
              name.className = "productname";
              name.innerHTML = responseArray[i].name;

              var quantity= document.createElement("h3");
              quantity.className = "productquantity";
              quantity.innerHTML = "Aantal: " + responseArray[i].quantity;

              var price= document.createElement("h3");
              price.className = "productprice";
              price.innerHTML = '€' + responseArray[i].price;

              var image = document.createElement("img");
              image.id = "productimage"
              image.src = responseArray[i].picture;
              image.className = "productimage";

              var product = responseArray[i].name;

              var addbutton = document.createElement("button");
              addbutton.className = "add_button_cart";
              addbutton.innerHTML = "+";
              addbutton.id = "add_button_cart";
              $('#add_button_cart').attr('onClick', "addProductCart(" + product +  ");");

              var removebutton = document.createElement("button");
              removebutton.className = "remove_button_cart";
              removebutton.innerHTML = "-";
              removebutton.id = "remove_button_cart"
              
              image.className = "productimage";
              image.innerHTML = responseArray[i].picture;

              element.appendChild(name);
              element.appendChild(quantity);
              element.appendChild(price);
              element.appendChild(image);
              element.appendChild(addbutton);
              element.appendChild(removebutton);
              // append player to container
              container.appendChild(element);
      }
      var div = document.getElementById('total_div');
      var totalprice = document.createElement("h2");
      totalprice.className = "total_cost";
      totalprice.id = "total_cost";
      totalprice.innerHTML = 'Totaal: €' + calcTotal(responseArray);
      div.appendChild(totalprice);
  } 
}   

function orderProducts() {
  var ref = firebase.database().ref("carts");
  var user = firebase.auth().currentUser.uid;

  firebase.database().ref('orders/').child(user).remove();

  ref.once("value",snapshot => {
    if (snapshot){
      return firebase.database().ref('/carts/' + user).once('value',snapshot=> {
        var cartProducts = snapshot.val();
      
        const array = Object.keys(cartProducts).map(i => cartProducts[i])
        console.log(array)

        for (var i = 0; i < array.length; i += 1) {
          firebase.database().ref('/orders/' + user + '/products/' + array[i].name).update({
            name: array[i].name,
            picture: array[i].picture,
            price : array[i].price,
            quantity: array[i].quantity
          });
        }
        addAddress()
        addDate()
      });
    }
  }); 
}

function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function addAddress() {
  var user = firebase.auth().currentUser.uid;
  firebase.database().ref('users').once("value",snapshot => {
    if (snapshot){
      return firebase.database().ref('/users/' + user).once('value',snapshot=> {
        var address = snapshot.val().address;
          firebase.database().ref('/orders/' + user + '/address/').update({
            address: address
          });
      });
    }
  }); 
}

function addDate() {
  var user = firebase.auth().currentUser.uid;
  firebase.database().ref('/orders/' + user + '/date/').update({
    date: getDate()
  });
}

function clearCart() {
  var user = firebase.auth().currentUser.uid;
  firebase.database().ref('carts/').child(user).remove();
  document.getElementById("productQuantity").innerHTML = '';
}

function retrieveOrder() {
  var ref = firebase.database().ref("orders");
  var user = firebase.auth().currentUser.uid;
  document.getElementById('total_div_order').innerHTML = '';

  ref.once("value",snapshot => {
    if (snapshot){
      return firebase.database().ref('/orders/' + user + '/products/').once('value',snapshot=> {
        var orderedProducts = snapshot.val();
      
        const array = Object.keys(orderedProducts).map(i => orderedProducts[i])
        renderOrder(array)
      });
    }
  }); 
}

function renderOrder(array) {

  document.getElementById('order').innerHTML = "";
  // turn string response to JSON array
  var responseArray = array;
  // make sure there is a response
  if (responseArray.length > 0) {
      // get container
      var container = document.getElementById("order");
      // iterate over each response
      for (var i = 0; i < responseArray.length; i += 1) {
              var numproduct = i + 1;
              // create the elems needed
              var element = document.createElement("div");
              element.className = "orderproduct " + "product" + numproduct;
              element.id = "product" + numproduct;
              // element.className = "product" + numproduct;
  
              var name= document.createElement("h2");
              name.className = "ordername";
              name.innerHTML = responseArray[i].name;

              var quantity= document.createElement("h3");
              quantity.className = "orderquantity";
              quantity.innerHTML = "Aantal: " + responseArray[i].quantity;

              var price= document.createElement("h3");
              price.className = "orderprice";
              price.innerHTML = '€' + responseArray[i].price;

              var image = document.createElement("img");
              image.id = "orderimage"
              image.src = responseArray[i].picture;
              image.className = "orderimage";

              element.appendChild(name);
              element.appendChild(quantity);
              element.appendChild(price);
              element.appendChild(image);

              container.appendChild(element);
      }

      var div = document.getElementById('total_div_order');
      var totalprice = document.createElement("h2");
      totalprice.className = "total_cost";
      totalprice.id = "total_cost";
      totalprice.innerHTML = 'Totaal: €' + calcTotal(responseArray);
      div.appendChild(totalprice);
  } 
}