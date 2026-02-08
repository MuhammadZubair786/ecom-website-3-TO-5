console.log(firebase.database());

var stats_categories = document.getElementById("stats-categories");
var stats_products =  document.getElementById("stats-products") 
var loading = document.getElementById("loading");
var cards = document.getElementById("cards");

async function geAllCounts() {

  //for category
  await firebase
    .database()
    .ref("CATGEORY")
    .get()
    .then((snap) => {
      var data = snap.val();
      if (data == null) {
        stats_categories.innerText = 0;
        // loading.setAttribute("class", "hide");
        // cards.setAttribute("class", "stats-grid");
      } else {
        var getLength = Object.values(data); //convert data into array
        stats_categories.innerText = getLength.length;
        // loading.setAttribute("class", "hide");
        // cards.setAttribute("class", "stats-grid");
      }
    })
    .catch((E) => {
      console.log(E);
    });

    //for products
    await firebase.database().ref("Products").get().then((Snap)=>{
      var data = Snap.val()
      console.log(data)
      if(data==null){
         loading.setAttribute("class", "hide");
        cards.setAttribute("class", "stats-grid");
         stats_products.innerText=0

        return null

      }
      var object = Object.values(data)
      console.log(object)
      stats_products.innerText=object.length
               loading.setAttribute("class", "hide");
        cards.setAttribute("class", "stats-grid");
     
    })
    .catch((E)=>{
      console.log(E)
    })
}

geAllCounts();
