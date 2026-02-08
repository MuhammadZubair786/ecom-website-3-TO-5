function checkAuth() {
  var name = document.getElementById("name");
    var userimage = document.getElementById("userimage");

    
  var userId = localStorage.getItem("UserId");


  if (userId == undefined || userId == null) { //not user login =>access dashboard
    window.location.href = "../login.html";
  } else {
    name.innerText = localStorage.getItem("Username");
    userimage.src=localStorage.getItem("userImageUrl")
  }
}
checkAuth();

function logout(){
    // localStorage.removeItem("UserId")
    // localStorage.removeItem("name")
    firebase.auth().signout()

    localStorage.clear()

    window.location.href="../login.html"
}
