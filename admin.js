import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// تهيئة Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
    authDomain: "dora-store.firebaseapp.com",
    databaseURL: "https://dora-store-default-rtdb.firebaseio.com",
    projectId: "dora-store",
    storageBucket: "dora-store.appspot.com",
    messagingSenderId: "331430680486",
    appId: "1:331430680486:web:bf9c5880015fde63496167",
    measurementId: "G-YF9G38JB8V"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// التحقق من الاتصال بقاعدة البيانات
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === true) {
        console.log("✅ متصل بقاعدة البيانات");
    } else {
        console.error("❌ غير متصل بقاعدة البيانات");
    }
});

// إضافة منتج
const form = document.getElementById("productForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const imageFile = document.getElementById("productImage").files[0];
    const type = document.getElementById("productType").value;

    if (!imageFile) {
        alert("يرجى اختيار صورة للمنتج.");
        return;
    }

    try {
        // تحميل الصورة إلى Firebase Storage
        const imageRef = storageRef(storage, `products/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);

        // الحصول على رابط الصورة
        const imageURL = await getDownloadURL(imageRef);

        // إضافة المنتج إلى قاعدة البيانات
        push(ref(db, "products"), {
            name: name,
            price: price,
            image: imageURL,
            type: type
        }).then(() => {
            alert("تمت إضافة المنتج بنجاح!");
            form.reset();
        }).catch((error) => {
            console.error("Error adding product: ", error);
        });
    } catch (error) {
        console.error("Error uploading image: ", error);
    }
});
