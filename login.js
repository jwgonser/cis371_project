function create(){
    var email = document.getElementById("emailin").value
    console.log(email)
    var password = document.getElementById("passwordin").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error: ") + errorMessage
    // ...
});
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
        window.location="https://cis.gvsu.edu/~gonserj/project/cis371_project/main.html";
      } else {
        console.log("womp womp womp")
      }
}