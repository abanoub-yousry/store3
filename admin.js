// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
    authDomain: "dora-store.firebaseapp.com",
    databaseURL: "https://dora-store-default-rtdb.firebaseio.com/",
    projectId: "dora-store",
    storageBucket: "dora-store.firebasestorage.app",
    messagingSenderId: "331430680486",
    appId: "1:331430680486:web:bf9c5880015fde63496167",
    measurementId: "G-YF9G38JB8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Check database connection
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
        console.log("✅ متصل بقاعدة البيانات");
    } else {
        console.error("❌ غير متصل بقاعدة البيانات");
    }
});

// Add product
const form = document.getElementById("productForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const image = document.getElementById("productImage").value;
    const type = document.getElementById("productType").value;

    push(ref(db, "products"), {
        name: name,
        price: price,
        image: image,
        type: type
    }).then(() => {
        alert("تمت إضافة المنتج بنجاح!");
        form.reset();
    }).catch((error) => {
        console.error("Error adding product: ", error);
    });
});
