document.getElementById("sidebar-container").innerHTML = getSidebar();
var modal = document.getElementById("modal");
var editmodal = document.getElementById("editmodal");

var file = document.getElementById("File");
var editFile = document.getElementById("editFile");

var imageShow = document.getElementById("imageShow");
var editimageShow = document.getElementById("editimageShow");

var table_body = document.getElementById("table-body");
var editproductCat = document.getElementById("editprod-cat");
var ProductImageUrl = "";

var selectedkey = ""; // for edit button set only for run time

var productName = document.getElementById("prod-name");
var productCat = document.getElementById("prod-cat");

var productPrice = document.getElementById("prod-price");

async function addProduct() {
  event.preventDefault();
  console.log(productName.value);
  console.log(productCat.value);
  console.log(productPrice.value);

  var imageCheck = await uploadImage();
  console.log(imageCheck);
  if (imageCheck == true) {
    var Productkey = await firebase.database().ref("Products").push().getKey();
    var object = {
      productName: productName.value,
      productCat: productCat.value,
      productPrice: productPrice.value,
      productImage: ProductImageUrl,
      Productkey: Productkey,
    };
    console.log(object);

    await firebase.database().ref("Products").child(Productkey).set(object);
    alert("add new product");

    // getAllProducts()
    closeModal();
    window.location.reload();
  }
}

file.addEventListener("change", function () {
  console.log(file.files[0]);
  if (file.files[0] != null) {
    imageShow.src = URL.createObjectURL(file.files[0]);

    imageShow.style.display = "inline";
    ProductImageUrl = "";
  }
});

editFile.addEventListener("change", function () {
  console.log(editFile.files[0]);
  if (editFile.files[0] != null) {
    editimageShow.src = URL.createObjectURL(editFile.files[0]);

    imageShow.style.display = "inline";
    ProductImageUrl = "";
  }
});

async function getAlLCategory() {
  await firebase
    .database()
    .ref("CATGEORY")
    .get()
    .then((snap) => {
      console.log(snap.val());
      if (snap.val() == null) {
        return;
      }
      var data = Object.values(snap.val());
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        productCat.innerHTML += `
           <option value=${data[i]["catName"]}>${data[i]["catName"]}</option>
           `;

        editproductCat.innerHTML += `
         <option value=${data[i]["catName"]}>${data[i]["catName"]}</option>
        `;
      }
    })
    .catch((E) => {
      console.log(E);
    });
}

getAlLCategory();

function openModal(id = null) {
  // document.getElementById("")
  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
}

//for cloundiary
async function uploadImage() {
  event.preventDefault(); // page refresh
  console.log(file.files); // line why

  if (file.files == null) {
    alert("select image");
    return;
  }

  console.log(file.files[0].size); //bhai nya consile ho rha ha
  var checkSize = file.files[0].size / 1024 / 1024; // SIZE (MB)
  console.log(checkSize); //
  if (checkSize > 2) {
    alert("please select image less then 2 mb");
    return false;
  } else {
    const formdata = new FormData();
    formdata.append("file", file.files[0]);
    formdata.append("upload_preset", "CLASS_3_5_STORAGE ");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    var status = false;

    await fetch(
      "https://api.cloudinary.com/v1_1/dgbkoycyp/image/upload",
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.secure_url);
        ProductImageUrl = data.secure_url; //url
        status = true;
        return true;
      })
      .catch((error) => console.error(error));
    return status;
  }
}


async function uploadeditImage() {
  event.preventDefault(); // page refresh
  console.log(editFile.files); // line why

  if (editFile.files == null) {
    alert("select image");
    return;
  }

  console.log(editFile.files[0].size); //bhai nya consile ho rha ha
  var checkSize = editFile.files[0].size / 1024 / 1024; // SIZE (MB)
  console.log(checkSize); //
  if (checkSize > 2) {
    alert("please select image less then 2 mb");
    return false;
  } else {
    const formdata = new FormData();
    formdata.append("file", editFile.files[0]);
    formdata.append("upload_preset", "CLASS_3_5_STORAGE ");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    var status = false;

    await fetch(
      "https://api.cloudinary.com/v1_1/dgbkoycyp/image/upload",
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.secure_url);
        ProductImageUrl = data.secure_url; //url
        status = true;
        return true;
      })
      .catch((error) => console.error(error));
    return status;
  }
}

// dgbkoycyp
// CLASS_3_5_STORAGE

async function getAllProducts() {
  await firebase
    .database()
    .ref("Products")
    .get()
    .then((db) => {
      console.log(db.val());
      if (db.val() == null) {
        table_body.innerHTML = `
      <tr>
      <td colspan="6" style="text-align:center">No products</td>
      </tr>
      `;

        return null;
      }
      var data = Object.values(db.val());
      console.log(data);
      table_body.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        table_body.innerHTML += `
      <tr>
      <td>${i + 1}</td>
      <td>${data[i]["productName"]}</td>
      <td>${data[i]["productCat"]}</td>
      <td>${data[i]["productPrice"]}</td>
      <td>
      <img class='img' src='${data[i]["productImage"]}'/>
      </td>
      <td>
      <button onclick="editProduct('${data[i]["Productkey"]}')">Edit</button>
      <button onclick="deleteProduct('${data[i]["Productkey"]}')">Delete</button>

      </td>

      </tr>
      `;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

async function editProduct(key) {
  console.log(key);
  // alert("edit product")
  editmodal.classList.add("active");
  await firebase
    .database()
    .ref("Products")
    .child(key)
    .get()
    .then((Snap) => {
      console.log(Snap.val());
      document.getElementById("editprod-name").value =
        Snap.val()["productName"];
      document.getElementById("editprod-cat").value = Snap.val()["productCat"];
      document.getElementById("editprod-price").value =
        Snap.val()["productPrice"];
      document.getElementById("editimageShow").src = Snap.val()["productImage"];
      document.getElementById("editimageShow").classList.add("img");
      selectedkey = key;
      ProductImageUrl=Snap.val()["productImage"]
      // console.log( document.getElementById("editimageShow"))
    })
    .catch((E) => {
      console.log(E);
    });
}

async function updateProduct() {
  var productName = document.getElementById("editprod-name").value;
  var productCat = document.getElementById("editprod-cat").value;
  var productPrice = document.getElementById("editprod-price").value;
  var productImage = document.getElementById("editimageShow").src;

  if (ProductImageUrl == "") {
    var imageCheck = await uploadeditImage();
    console.log(imageCheck);
    if (imageCheck == true) {
      var object = {
        productName,
        productCat,
        productPrice,
        productImage:ProductImageUrl,
        Productkey: selectedkey,
      };
      console.log(object);

      await firebase.database().ref("Products").child(selectedkey).set(object);
      closeEditModal()
    getAllProducts()

    }
  } else {
    var object = {
      productName,
      productCat,
      productPrice,
      productImage,
      Productkey: selectedkey,
    };
    console.log(object);

    await firebase.database().ref("Products").child(selectedkey).set(object);
    closeEditModal()
    getAllProducts()
  }
}

function closeEditModal() {
  editmodal.classList.remove("active");
}

async function deleteProduct(key) {
  console.log(key);
  await firebase.database().ref("Products").child(key).remove();
  alert("product delete successfully");
  getAllProducts();
}

getAllProducts();
