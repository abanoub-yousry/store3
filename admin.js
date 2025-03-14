// ✅ استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

// ✅ بيانات التهيئة (غيرها ببيانات مشروعك من Firebase Console)
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// ✅ تهيئة Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// ✅ التعامل مع النموذج
const productForm = document.getElementById('productForm');

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // جمع البيانات من النموذج
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productType = document.getElementById('productType').value;
    const productImage = document.getElementById('productImage').files[0];

    if (!productName || !productPrice || !productType || !productImage) {
        alert("يجب ملء جميع الحقول!");
        return;
    }

    try {
        // ✅ رفع الصورة إلى Firebase Storage
        const imageRef = storageRef(storage, `products/${Date.now()}_${productImage.name}`);
        await uploadBytes(imageRef, productImage);

        // ✅ الحصول على رابط الصورة
        const imageUrl = await getDownloadURL(imageRef);

        // ✅ تخزين البيانات في Firebase Realtime Database
        const productRef = ref(database, 'products');
        await push(productRef, {
            name: productName,
            price: productPrice,
            type: productType,
            imageUrl: imageUrl
        });

        alert("تمت إضافة المنتج بنجاح!");
        productForm.reset();
    } catch (error) {
        console.error("حدث خطأ أثناء رفع المنتج: ", error);
        alert("فشل في إضافة المنتج!");
    }
});
