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
		window.location="https://cis.gvsu.edu/~gonserj/project/cis371_project/main.html";
      } else {
        console.log("womp womp womp")
      }
}