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
      user = firebase.auth().currentUser;
	  console.log(user);
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

	firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        window.alert("you have been logged out.")
        // hide both inventory and chckout, show login
        hidePage("inventory-page");
	    hidePage("checkout-page");
        showPage("login-page");
        user = null;
      }, function(error) {
        console.error('Sign Out Error', error);
      });
	document.getElementById("passwordin").value = "";
}

function populateInventoryTable(snapshot){
    var itemName = snapshot.child("item_name").val();
    var itemQuan = snapshot.child("item_quantity").val();
    var txtQuan 
    if (itemQuan == 0){
        txtQuan = document.createTextNode("Out of stock");
    }else{
        txtQuan = document.createTextNode(itemQuan);
    }
    var node = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdQuan = document.createElement("td");
	var button = document.createElement("button");
	button.onclick = addItemToCart;
    var txtName = document.createTextNode(itemName);
	var butName = document.createTextNode("Add");
    tdName.appendChild(txtName);
    tdQuan.appendChild(txtQuan);
	button.appendChild(butName);
    node.appendChild(tdName);
    node.appendChild(tdQuan);
	if(itemQuan == 0){
		node.appendChild(document.createTextNode("Unavailable"));
	}
	else {
		node.appendChild(button);
	}
	node.id = snapshot.key;
    document.getElementById("inventory-table").appendChild(node);
}

function updateInventoryTable(snapshot){
	var node = document.getElementById(snapshot.key);

	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
	
	var button = document.createElement("button");
	button.onclick = addItemToCart;
	
	var itemName = snapshot.child("item_name").val();
    var itemQuan = snapshot.child("item_quantity").val();
    if (itemQuan == 0){
        txtQuan = document.createTextNode("Out of stock");
    }else{
        txtQuan = document.createTextNode(itemQuan);
    }
    var tdName = document.createElement("td");
    var tdQuan = document.createElement("td");
    var txtName = document.createTextNode(itemName);
    var butName = document.createTextNode("Add");
	tdName.appendChild(txtName);
    tdQuan.appendChild(txtQuan);
	button.appendChild(butName);
    node.appendChild(tdName);
    node.appendChild(tdQuan);
	if(itemQuan == 0){
		node.appendChild(document.createTextNode("Unavailable"));
	}
	else {
		node.appendChild(button);
	}
}

rootRef.child("inventory").on("child_added", function(snapshot){
    populateInventoryTable(snapshot);
})

rootRef.child("inventory").on("child_changed", function(snapshot){
    updateInventoryTable(snapshot);
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