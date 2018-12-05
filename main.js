var rootRef = firebase.database().ref();
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
    var fubar = 0
    console.log(email)
    var password = document.getElementById("passwordin").value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        fubar =1;
        window.alert("Error: " + errorMessage)
        
        // ...
      });
      var user = firebase.auth().currentUser;
      if (fubar){
          return 0;
      }
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
	firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        window.alert("you have been logged out.")
        // hide both inventory and chckout, show login
        hidePage("inventory-page");
	    hidePage("checkout-page");
        showPage("login-page");
        
      }, function(error) {
        console.error('Sign Out Error', error);
      });
	document.getElementById("passwordin").value = "";
}

function populateInventoryTable(snapshot){
    var itemName = snapshot.child("item_name").val();
    var itemQuan = snapshot.child("item_quantity").val();
    var node = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdQuan = document.createElement("td");
    var txtName = document.createTextNode(itemName);
    var txtQuan = document.createTextNode(itemQuan);
    tdName.appendChild(txtName);
    tdQuan.appendChild(txtQuan);
    node.appendChild(tdName);
    node.appendChild(tdQuan);
    document.getElementById("inventory-table").appendChild(node);
}

rootRef.child("inventory").on("child_added", function(snapshot){
    populateInventoryTable(snapshot);
})

rootRef.child("inventory").on("child_changed", function(snapshot){
    populateInventoryTable(snapshot);
})

function populateCheckoutTable(){
	//TODO: POPULATE THE CHECKOUT SCREEN TABLE WITH ITEMS FROM THE USER'S CART
}

function purchase(){
	
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