let productImg = document.getElementById("product-img");
let productName = document.getElementById("name");
let productCategory = document.getElementById("brand");
let productPrice = document.getElementById("price");
let productPar = document.getElementById("par");

// الحصول على المعرف من رابط الصفحة
const id = new URLSearchParams(window.location.search).get("id");

// قراءة البيانات من ملف API/products.json
fetch(`API/products.json`)
  .then((res) => {
    if (!res.ok) {
      throw new Error("Failed to load API file");
    }
    return res.json();
  })
  .then((data) => {
    // البحث عن المنتج بناءً على المعرف
    const product = data.find((item) => item.id == id);
    if (product) {
      productImg.src = product.img;
      productName.innerHTML = product.name;
      productCategory.innerHTML = product.category;
      productPrice.innerHTML = `$${product.price}`;
      productPar.innerHTML = product.description;
    } else {
      console.error("Product not found");
    }
  })
  .catch((error) => {
    console.error("Error fetching the API:", error);
  });

/** ----------- Scroll to Top Button ----------- */
function scrollToTop() {
  document.documentElement.scrollTop = 0;
}

window.onscroll = function () {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
};

/** ----------- Navbar ----------- */
const bar = document.getElementById("bar");
const nav = document.getElementById("navbar");
const close = document.getElementById("close");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

/** ----------- Share via WhatsApp ----------- */
document.getElementById("share-button").addEventListener("click", function () {
  var pageUrl = window.location.href; // رابط الصفحة الحالية
  var phoneNumber = "201094146311"; // الرقم الذي تريد إرسال الرابط إليه
  var message = `Hi! Check out this product: ${pageUrl}`; // الرسالة المرسلة
  var whatsappURL = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank"); // فتح WhatsApp مع الرابط
});
