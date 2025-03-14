// إعدادات
const IMGBB_API_KEY = 'ضع_مفتاح_ImgBB_هنا';
const FIREBASE_URL = 'https://your-firebase-url.firebaseio.com/products.json';

// دالة لإضافة المنتج
async function addProduct() {
    const productName = document.getElementById('productName').value.trim();
    const price = document.getElementById('price').value.trim();
    const imageInput = document.getElementById('imageInput').files[0];
    const productType = document.getElementById('productType').value;

    // تحقق من أن جميع الحقول ممتلئة
    if (!productName || !price || !imageInput) {
        alert('يجب ملء جميع الحقول!');
        return;
    }

    try {
        // رفع الصورة إلى ImgBB
        const imageUrl = await uploadImageToImgBB(imageInput);

        // إرسال البيانات إلى Firebase
        await sendDataToFirebase(productName, price, imageUrl, productType);

        alert('تمت إضافة المنتج بنجاح!');
        clearForm();
    } catch (error) {
        alert('حدث خطأ أثناء إضافة المنتج!');
        console.error('خطأ:', error);
    }
}

// دالة لرفع الصورة إلى ImgBB
async function uploadImageToImgBB(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) throw new Error('فشل رفع الصورة!');

    const data = await response.json();
    return data.data.url; // رابط الصورة
}

// دالة لإرسال البيانات إلى Firebase
async function sendDataToFirebase(name, price, imageUrl, type) {
    const productData = {
        name,
        price,
        imageUrl,
        type
    };

    const response = await fetch(FIREBASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error('فشل إرسال البيانات إلى Firebase!');
}

// دالة لتفريغ النموذج
function clearForm() {
    document.getElementById('productName').value = '';
    document.getElementById('price').value = '';
    document.getElementById('imageInput').value = '';
    document.getElementById('productType').selectedIndex = 0;
}
