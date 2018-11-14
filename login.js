function create(){
    var email = document.getElementById("emailin").value
    console.log(email)
    var password = document.getElementById("passwordin").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});
}