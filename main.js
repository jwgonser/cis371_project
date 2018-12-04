function create(){
    var email = document.getElementById("emailin").value
    console.log(email)
    var errNum = 0;
    var password = document.getElementById("passwordin").value;
    var userRef = firebase.database().ref().child("users")
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    errNum++;
    window.alert("Error: ") + errorMessage

    // ...
});
    if (errNum == 0){
        userRef.push().set({"user_email" : email})
    }
}

function login(){
    var email = document.getElementById("emailin").value
    console.log(email)
    var password = document.getElementById("passwordin").value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: " + errorMessage)
        // ...
      });
      var user = firebase.auth().currentUser;

      if (user) {
        console.log(user.email);
		
		hidePage("login-page");
		showPage("inventory-page");
		
      } else {
        console.log("womp womp womp")
      }
}

function logout(){
	
	//TODO: IMPLEMENT LOGGING OUT
	
	// hide both inventory and chckout, show login
	hidePage("inventory-page");
	hidePage("checkout-page");
	showPage("login-page");
	document.getElementById("passwordin").value = "";
}

function populateInventoryTable(){
	//TODO: POPULATE THE INVENTORY SCREEN TABLE WITH ITEMS FROM PUBLIC INVENTORY TABLE
}

function populateCheckoutTable(){
	//TODO: POPULATE THE CHECKOUT SCREEN TABLE WITH ITEMS FROM THE USER'S CART
}

function purchase(){
	//TODO: IMPLEMENT ANY PURCHASING LOGIC
}

function addItemToCart(itemId) {
	//TODO: ADD LOGIC TO ADD A CHOSEN ITEM TO USER'S CART
}

function removeItemFromCart(itemId) {
	//TODO: ADD LOGIC TO REMOVE A CHOSEN ITEM FROM USER'S CART
}

function checkout(){
	// navigate to checkout page from inventory
	hidePage("inventory-page");
	showPage("checkout-page");
}

function toInventory() {
	// navigate back to inventory from checkout page
	hidePage("checkout-page");
	showPage("inventory-page");
}

function hidePage(pageId){
	// get element identified by function call
	var element = document.getElementById(pageId);
	// add hidden class to element
	element.classList.add("hidden");
	console.log("hiding " + pageId);
}

function showPage(pageId){
	// get element identified by function call
	var element = document.getElementById(pageId);
	// remove hidden class from element
	element.classList.remove("hidden");
	console.log("showing " + pageId);
}