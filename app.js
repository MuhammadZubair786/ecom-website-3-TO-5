var userImage = document.getElementById("userImage");
var userImageUrl = "";

async function signUp() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var contactNo = document.getElementById("contactNo").value;
  var name = document.getElementById("name").value;
  var age = document.getElementById("age").value;

  var loadingimg = document.getElementById("loadingimg");
  var signUp = document.getElementById("signUp");

  //   password = "ashfjhasjfh"
  var passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (email == "" || password == "") {
    alert("enter your Email or Password");
  } else if (email.toString().includes("@") != true) {
    alert("please enter corret email");
  } else if (password.length < 8) {
    alert("please enter password must be greater then 8 letter ");
  } else if (passwordRegex.test(password) == false) {
    alert("please enter strong password");
  } else {
    loadingimg.style.display = "inline";
    signUp.style.display = "none";
    const auth = firebase.auth();
    const db = firebase.database();

    var imageUplaod =await  uploadImage()



    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (userData) => {
        console.log(userData.user.uid);
        loadingimg.style.display = "none";
        signUp.style.display = "inline";

        var userObject = {
          name: name,
          email: email,
          password: password,
          age: age,
          contactNo: contactNo,
          userImageUrl:userImageUrl
        };
        console.log(userObject)

        await db.ref("users").child(userData.user.uid).set(userObject);

        window.location.href = "./login.html";
      })
      .catch((e) => {
        alert(e.message.split("(")[0]);
        loadingimg.style.display = "none";
        signUp.style.display = "inline";
      });
  }
}

async function uploadImage() {
  console.log(userImage.files);

  console.log(userImage.files[0].size);
  var checkSize = userImage.files[0].size / 1024 / 1024;
  console.log(checkSize);
  if (checkSize > 2) {
    alert("please select image less then 2 mb");
  } else {
    const formdata = new FormData();
    formdata.append("file", userImage.files[0]);
    formdata.append("upload_preset", "CLASS_3_5_STORAGE ");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

   await fetch(
      "https://api.cloudinary.com/v1_1/dgbkoycyp/image/upload",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.secure_url);
        userImageUrl = data.secure_url;
      })
      .catch((error) => console.error(error));
  }
}
