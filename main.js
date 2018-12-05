var rootRef = firebase.database().ref();
users ={}
var inv = {"empty" : true}
email = ""
function create(){
    email = document.getElementById("emailin").value
    console.log(email)
    var errNum = 0;
    var password = document.getElementById("passwordin").value;
    var userRef = firebase.database().ref().child("users")
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    errNum = errNum +1;
    window.alert("Error: ") + errorMessage

    // ...
});
    if (errNum == 0){
        var userKey = userRef.push().key;
        users[email] = userKey;
        userRef.push().set({"user_email" : email, "user_cart" : inv})
        console.log(users)
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
    var key = snapshot.key
    if (itemQuan == 0){
        txtQuan = document.createTextNode("Out of stock");
    }else{
        txtQuan = document.createTextNode(itemQuan);
    }
    var node = document.createElement("tr");
    node.id = snapshot.key;
    var tdName = document.createElement("td");
    var tdQuan = document.createElement("td");
	var button = document.createElement("button");
	button.setAttribute("type", "button")
    button.setAttribute("onClick", "addItemToCart(this.id)");
    button.setAttribute("id", key);
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
    document.getElementById("inventory-table").appendChild(node);
}

function updateInventoryTable(snapshot){
    var node = document.getElementById(snapshot.key);
    var key = snapshot.key

	while (node.firstChild) {
		node.removeChild(node.firstChild);
	}
	
	var button = document.createElement("button");
	
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
    button.setAttribute("type", "button")
    button.setAttribute("onClick", "addItemToCart(this.id)");
    button.setAttribute("id", key);
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
/*
rootRef.child("users").child(users[email]).child("user_cart").on("child_added", function(snapshot){
    populateCheckoutTable(snapshot);
})
*/
function populateCheckoutTable(){
    var itemName = snapshot.child("item_name").val();
    var itemQuan = snapshot.child("item_quantity").val();
    var key = snapshot.key
    var txtQuan 
    if (itemQuan == 0){
        txtQuan = document.createTextNode("Out of stock");
    }else{
        txtQuan = document.createTextNode(itemQuan);
    }
    var node = document.createElement("tr");
    node.id = snapshot.key;
    var tdName = document.createElement("td");
    var tdQuan = document.createElement("td");
    var button = document.createElement("button");
    var txtName = document.createTextNode(itemName);
	var butName = document.createTextNode("Remove");
    tdName.appendChild(txtName);
    tdQuan.appendChild(txtQuan);
    button.appendChild(butName);
    button.setAttribute("type", "button")
    button.setAttribute("onClick", "removeItemFromCart(this.id)");
    button.setAttribute("id", key);
    node.appendChild(tdName);
    node.appendChild(tdQuan);
	if(itemQuan == 0){
		node.appendChild(document.createTextNode("Unavailable"));
	}
	else {
		node.appendChild(button);
	}
    document.getElementById("inventory-table").appendChild(node);
}

function purchase(){
	
}

function addItemToCart(itemId) {
    console.log(users)
    console.log(itemId)
    var ref = rootRef.child("users").child(users[email]).child("user_cart");
    ref.once("value", function(data){
        console.log(data.child(itemId).val());
    });
    /*
    if(ref.child(itemId)){
        ref.child(itemId).val() = ref.child(itemId).val() + 1;
    }else{
        ref.push().set({itemid : 1});
    }
    */
    
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