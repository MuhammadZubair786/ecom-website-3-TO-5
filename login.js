var googleSignup = document.getElementById("googleSignup");

// mobile =>

// googleSignup.addEventListener("click", function () {}); es5
// react => simple arrow
googleSignup.addEventListener("click", async () => {
  var auth = new firebase.auth.GoogleAuthProvider(); //constrctuor

  await firebase
    .auth()
    .signInWithPopup(auth)
    .then(async (res) => {
      console.log(res.user);
      console.log(res.user.email);
      console.log(res.user.photoURL);
      console.log(res.user.displayName);
      console.log(res.user.uid);
      var userAccount = await CheckUserAccount(res.user.email);
      if (userAccount == true) {
        console.log("acount add alreay");

        localStorage.setItem("UserId", res.user.uid);
        localStorage.setItem("Username",res.user.displayName);
        localStorage.setItem("Email", res.user.email);
        localStorage.setItem("userImageUrl",res.user.photoURL);

        window.location.href = "./ecom-user-panel/home.html";
      } else {
        console.log("not found");
        var object = {
          name: res.user.displayName,
          email: res.user.email,
          userImageUrl: res.user.photoURL,
          uid: res.user.uid,
        };
        console.log(object);
        await firebase.database().ref("users").child(res.user.uid).set(object);
        alert("acoount add");
         localStorage.setItem("UserId", res.user.uid);
        localStorage.setItem("Username",res.user.displayName);
        localStorage.setItem("Email", res.user.email);
        localStorage.setItem("userImageUrl",res.user.photoURL);

        window.location.href = "./ecom-user-panel/home.html";
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

// of,in
// of=>value
// in=>index number

// var array =[asad,ali,omer]

// data is :asad
// data is :ali
// data is :asad

// data of index 1  is :asad

async function CheckUserAccount(email) {
  var check = false;
  await firebase
    .database()
    .ref("users")
    .get()
    .then((snap) => {
      console.log(snap.val());
      var data = Object.values(snap.val()); //user id =>
      for (var value of data) {
        console.log(value);
        if (value["email"] == email) {
          check = true;
          break;
        }
      }
    })
    .catch((e) => {
      console.log(e);
    });
  console.log(check);
  return check;
}

function signIn() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var loadingimg = document.getElementById("loadingimg");
  var signUp = document.getElementById("signUp");

  if (email == "" || password == "") {
    alert("please enter correct data");
  } else {
    const auth = firebase.auth();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (data) => {
        console.log(data.user.uid);
        await firebase
          .database()
          .ref("users")
          .child(data.user.uid)
          .get()
          .then((db) => {
            console.log(db.val());
            localStorage.setItem("UserId", data.user.uid);
            localStorage.setItem("Username", db.val()["name"]);
            localStorage.setItem("Email", db.val()["email"]);
            localStorage.setItem("userImageUrl", db.val()["userImageUrl"]);

            window.location.href = "./ecom-user-panel/home.html";
          });
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}

function checkAuth() {
  //login => access login
  var userId = localStorage.getItem("UserId");
  if (userId != undefined || userId != null) {
    window.location.href = "./ecom-user-panel/home.html";
  }
}
checkAuth();
