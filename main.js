var rootRef = firebase.database().ref();
users ={}
var inv = {"empty" : true}
times_run = 0
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
        generateUsers();
        userRef.push().set({"user_email" : email, "user_cart" : inv})
        console.log(users)
    }
}
function generateUsers(){
    users = {}
    rootRef.child('/users').once('value').then(function(snapshot){
        snapshot.forEach(function(ch){
            users[ch.child("user_email").val()] = ch.key
        })
    })
}
function generateInvPairs(){
    invPairs = {}
    rootRef.child('/inventory').once('value').then(function(snapshot){
        snapshot.forEach(function(ch){
            invPairs[ch.key] = ch.child("item_name").val()
        })
    })
}
function login(){
    email = document.getElementById("emailin").value
    var fubar = 0
    console.log(email)
    var password = document.getElementById("passwordin").value;
    generateUsers();
	generateInvPairs();
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
      console.log(users)
}

function logout(){
    
	firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        window.alert("you have been logged out.")
        // hide both inventory and chckout, show login
        hidePage("inventory-page");
	    hidePage("checkout-page");
		hidePage("purchase-page");
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
function populateCheckoutTable(snaps) {
    var pnode = document.getElementById("checkout-table");
    if(times_run == 0){
        console.log("KILL")
        while (pnode.firstChild) {
            pnode.removeChild(pnode.firstChild);
        }
    var tr1 = document.createElement("tr")
    var td1 = document.createElement("td")
    var td1t = document.createTextNode("item name")
    var td2 = document.createElement("td")
    var td2t = document.createTextNode("item quantity")
    var td3 = document.createElement("td")
    var td3t = document.createTextNode("Remove from cart")
    td1.appendChild(td1t)
    td2.appendChild(td2t)
    td3.appendChild(td3t)
    tr1.appendChild(td1)
    tr1.appendChild(td2)
    tr1.appendChild(td3)
    pnode.appendChild(tr1)
    times_run = 1
    console.log("KILLED")
    }
	if (snaps.key != "empty"){
		var itemName = invPairs[snaps.key];
		var itemQuan = snaps.val();
		var id = snaps.key + "2";
        var node2 = document.createElement("tr")
        node2.id = id;
		console.log(node2.id);
		var key = snaps.key
		var tdName = document.createElement("td");
		var tdQuan = document.createElement("td");
		var button = document.createElement("button");
		button.setAttribute("type", "button")
		button.setAttribute("onClick", "removeItemFromCart(this.id)");
		button.setAttribute("id", key);
		var txtName = document.createTextNode(itemName);
		var txtQuan = document.createTextNode(itemQuan);
		var butName = document.createTextNode("Remove");
		tdName.appendChild(txtName);
		tdQuan.appendChild(txtQuan);
		button.appendChild(butName);
		node2.appendChild(tdName);
		node2.appendChild(tdQuan);
			
		node2.appendChild(button);
		pnode.appendChild(node2);
	}
	
	console.log("INSIDE POPULATECHECKOUT");
}

function updateCheckoutTable(snap) {
	var id = snap.key + "2";
    var node = document.getElementById(id);
	var quan = snap.val();
	var itemName = invPairs[snap.key];
	
	while(node.firstChild){
		node.removeChild(node.firstChild);
	}
	
	var tdName = document.createElement("td");
	var tdQuan = document.createElement("td");
	var button = document.createElement("button");
	button.setAttribute("type", "button")
	button.setAttribute("onClick", "removeItemFromCart(this.id)");
	button.setAttribute("id", snap.key);
	
	var txtName = document.createTextNode(itemName);
	var txtQuan = document.createTextNode(quan);
	var butName = document.createTextNode("Remove");
	
	tdName.appendChild(txtName);
	tdQuan.appendChild(txtQuan);
	button.appendChild(butName);
	
	if (quan > 0) {
		node.appendChild(tdName);
		node.appendChild(tdQuan);
		node.appendChild(button);
	}
	else {
		node.parentNode.removeChild(node);
	}
	
} 

function removeCheckoutTable(snap) {
	var id = snap.key + "2";
    var node = document.getElementById(id);
	var quan = snap.val();
	var itemName = invPairs[snap.key];
	node.parentNode.removeChild(node);
}

function activateListeners() {


    rootRef.child("users").child(users[email]).child("user_cart").on("child_added", function(snaps) {
        populateCheckoutTable(snaps);
    })
	
	rootRef.child("users").child(users[email]).child("user_cart").on("child_changed", function(snaps) {
        updateCheckoutTable(snaps);
    })
    
	rootRef.child("users").child(users[email]).child("user_cart").on("child_removed", function(snaps) {
        removeCheckoutTable(snaps);
    })
    
}

function purchase(){
	rootRef.child("users").child(users[email]).child("user_cart").remove();
	rootRef.child("users").child(users[email]).update({"user_cart" : {"empty" : true}});
	hidePage("checkout-page");
	showPage("purchase-page");
}

function addItemToCart(itemId) {
    var cart = {}
    var changed = 0
    var inStock = 1


    rootRef.child('/inventory').once('value').then(function(snapshot){
        snapshot.forEach(function(invent){
            if(invent.key == itemId){
                var tempo = invent.child('item_quantity').val()
                if(tempo != 0){
                    rootRef.child('/inventory').child(invent.key).child('item_quantity').set(tempo - 1)
                }else{
                    inStock = 0
                    window.alert("out of stock")
                }
            }
        })
    })
    if(inStock = 1){
        rootRef.child('/users').once('value').then(function(snapshot){
            snapshot.forEach(function(ch){
                ch.child("user_cart").forEach(function(ca){
                    if(ch.child("user_email").val() == email){

                        var temp = ca.val()
                        if(ca.key == itemId){
                            changed = 1
                            rootRef.child('/users').child(ch.key).child('user_cart').child(ca.key).set(temp +1);
                        }
                    }
                })
                if(ch.child("user_email").val() == email && changed == 0){
                    rootRef.child('/users').child(ch.key).child('user_cart').update({[itemId] : 1})
                }
                changed = 0
            })
        })
    }
}

function removeItemFromCart(itemId) {
    times_run = 0
    rootRef.child('/inventory').once('value').then(function(snapshot){
        snapshot.forEach(function(invent){
            if(invent.key == itemId){
                var tempo = invent.child('item_quantity').val()
                rootRef.child('/inventory').child(invent.key).child('item_quantity').set(tempo + 1)
            }
        })
    })
        rootRef.child('/users').once('value').then(function(snapshot){
            snapshot.forEach(function(ch){
                ch.child("user_cart").forEach(function(ca){
                    if(ch.child("user_email").val() == email){

                        var temp = ca.val()
                        if(temp != 1 ){
                            if(ca.key == itemId){
                                rootRef.child('/users').child(ch.key).child('user_cart').child(ca.key).set(temp - 1);
                            }
                        }
						else {
							if(ca.key == itemId){
								rootRef.child('/users').child(ch.key).child('user_cart').child(ca.key).set(null);
							}
						}
                    }
                })
                
            })
        })
    
}

function checkout(){
	// navigate to checkout page from inventory
	hidePage("inventory-page");
    showPage("checkout-page");
    times_run= 0
    activateListeners();
}

function toInventory() {
	// navigate back to inventory from checkout page
	hidePage("checkout-page");
	hidePage("purchase-page");
	showPage("inventory-page");
}

function hidePage(pageId){
	// get element identified by function call
	var element = document.getElementById(pageId);
	// add hidden class to element
	element.classList.add("hidden")
}

function showPage(pageId){
	// get element identified by function call
	var element = document.getElementById(pageId);
	// remove hidden class from element
	element.classList.remove("hidden");
}