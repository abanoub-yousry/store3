// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsN3Nlx3TVxz4zrvY06NX9RR2DTVDCREU",
  authDomain: "dora-store.firebaseapp.com",
  databaseURL: "https://dora-store-default-rtdb.firebaseio.com",
  projectId: "dora-store",
  storageBucket: "dora-store.appspot.com",
  messagingSenderId: "331430680486",
  appId: "1:331430680486:web:bf9c5880015fde63496167",
  measurementId: "G-YF9G38JB8V",
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// مفتاح API الخاص بـ imgBB (استبدله بمفتاحك الخاص)
const IMGBB_API_KEY = "1b6a202851bd8f1860a6f253bc75bb02";

// دالة لرفع الصورة إلى imgBB
const uploadImageToImgBB = async (file) => {
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
    alert("حدث خطأ أثناء رفع الصورة.");
    throw error;
  }
};

// دالة لإضافة المنتج إلى Firebase
const addProductToFirebase = async (product) => {
  try {
    await db.ref("products").push(product);
    alert("✅ تم إضافة المنتج بنجاح!");
  } catch (error) {
    console.error("خطأ أثناء إرسال المنتج إلى Firebase:", error);
    alert("❌ فشل إرسال المنتج!");
  }
};

// التعامل مع الفورم عند الإرسال
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // قراءة البيانات من النموذج
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const category = document.getElementById("productCategory").value;
  const imageFile = document.getElementById("productImage").files[0];

  if (!imageFile) {
    alert("يرجى اختيار صورة المنتج.");
    return;
  }

  try {
    // رفع الصورة إلى imgBB والحصول على الرابط
    const imageUrl = await uploadImageToImgBB(imageFile);

    // تحضير بيانات المنتج
    const product = {
      name,
      price,
      category,
      imageUrl, // رابط الصورة
    };

    // إرسال المنتج إلى Firebase
    await addProductToFirebase(product);

    // تفريغ الفورم بعد الإرسال
    document.getElementById("productForm").reset();
  } catch (error) {
    console.error("خطأ شامل:", error);
    alert("❌ حدث خطأ أثناء معالجة المنتج.");
  }
});
