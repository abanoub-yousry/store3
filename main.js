// admin.js
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const IMGBB_API_KEY = "1b6a202851bd8f1860a6f253bc75bb02";

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
      return data.data.url;
    } else {
      throw new Error("فشل رفع الصورة إلى imgBB");
    }
  } catch (error) {
    console.error("خطأ أثناء رفع الصورة:", error);
    alert("حدث خطأ أثناء رفع الصورة.");
    throw error;
  }
};

const addProductToFirebase = async (product) => {
  try {
    await db.ref("products").push(product);
    alert("✅ تم إضافة المنتج بنجاح!");
  } catch (error) {
    console.error("خطأ أثناء إرسال المنتج إلى Firebase:", error);
    alert("❌ فشل إرسال المنتج!");
  }
};

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

    const product = {
      name,
      price,
      category,
      imageUrl,
    };

    await addProductToFirebase(product);
    document.getElementById("productForm").reset();
  } catch (error) {
    console.error("خطأ شامل:", error);
    alert("❌ حدث خطأ أثناء معالجة المنتج.");
  }
});

// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const proContainer = document.querySelector(".pro-container");

async function requestAndBuild(category = "all") {
  proContainer.innerHTML = "";

  let q = category === "all" ? collection(db, "products") : query(collection(db, "products"), where("category", "==", category));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const product = doc.data();
    createProductCard(product);
  });
}

function createProductCard(product) {
  const { name, price, imageUrl, category } = product;

  const whatsappLink = `https://wa.me/?text=أنا%20مهتم%20بشراء%20هذا%20المنتج%3A%20${encodeURIComponent(imageUrl)}`;

  const productHTML = `
    <div class="pro">
      <a href="${whatsappLink}" target="_blank">
        <img src="${imageUrl}" alt="${name}" onerror="this.src='placeholder-image.jpg';">
      </a>
      <div class="description">
        <h3>${name}</h3>
        <h4>${category}</h4>
        <h4>$${price}</h4>
      </div>
      <button class="add-to-cart">Add to Cart</button>
    </div>
  `;

  proContainer.innerHTML += productHTML;
}

requestAndBuild();

const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.classList.contains("all-btn") ? "all" : button.classList[1].replace("-btn", "");
    requestAndBuild(category);
  });
});
