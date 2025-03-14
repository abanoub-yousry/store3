// ربط Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
    authDomain: "dora-store.firebaseapp.com",
    databaseURL: "https://dora-store-default-rtdb.firebaseio.com", // ✅ أضف هذا السطر
    projectId: "dora-store",
    storageBucket: "dora-store.firebasestorage.app",
    messagingSenderId: "331430680486",
    appId: "1:331430680486:web:bf9c5880015fde63496167",
    measurementId: "G-YF9G38JB8V"
};
  

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// إضافة منتج
const form = document.getElementById("productForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").value;

    db.ref("products").push({
        name: name,
        price: price,
        image: image
    });

    alert("تمت إضافة المنتج بنجاح!");
    form.reset();
});
