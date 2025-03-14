import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
  authDomain: "dora-store.firebaseapp.com",
  projectId: "dora-store",
  storageBucket: "dora-store.appspot.com",
  messagingSenderId: "331430680486",
  appId: "1:331430680486:web:bf9c5880015fde63496167",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// مفتاح API الخاص بـ imgBB
const IMGBB_API_KEY = "1b6a202851bd8f1860a6f253bc75bb02";

// دالة لرفع الصورة إلى imgBB
async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      return data.data.url; // رابط الصورة المباشر
    } else {
      throw new Error("فشل رفع الصورة إلى imgBB");
    }
  } catch (error) {
    console.error("خطأ أثناء رفع الصورة:", error);
    alert("❌ حدث خطأ أثناء رفع الصورة.");
    throw error;
  }
}

document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const category = document.getElementById("productCategory").value;
  const imageFile = document.getElementById("productImage").files[0];

  if (!imageFile) {
    alert("يرجى اختيار صورة المنتج.");
    return;
  }

  try {
    const imageUrl = await uploadImageToImgBB(imageFile);

    await addDoc(collection(db, "products"), {
      title: name,
      price: parseFloat(price),
      category,
      imageURL: imageUrl,
    });

    alert("✅ تم إضافة المنتج بنجاح!");
    document.getElementById("productForm").reset();
  } catch (error) {
    console.error("خطأ أثناء رفع المنتج:", error);
    alert("❌ حدث خطأ أثناء معالجة المنتج.");
  }
});
