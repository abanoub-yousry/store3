// ✅ تحميل الصورة إلى Firebase Storage
function uploadImageAndGetURL(file) {
    return new Promise((resolve, reject) => {
        const storageRef = firebase.storage().ref('images/' + file.name);
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // تقدم التحميل (اختياري)
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => reject(error),
            async () => {
                // بعد اكتمال التحميل، نحصل على الرابط
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                resolve(downloadURL);
            }
        );
    });
}

// ✅ التأكد من ملء جميع الحقول وإرسال المنتج
document.getElementById('productForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const productName = document.getElementById('productName').value.trim();
    const productPrice = document.getElementById('productPrice').value.trim();
    const productType = document.getElementById('productType').value;
    const imageFile = document.getElementById('productImage').files[0];

    if (!productName || !productPrice || !imageFile) {
        alert('يجب ملء جميع الحقول!');
        return;
    }

    try {
        const imageUrl = await uploadImageAndGetURL(imageFile);

        // إرسال البيانات إلى Realtime Database
        firebase.database().ref('products').push({
            name: productName,
            price: productPrice,
            type: productType,
            imageUrl: imageUrl
        });

        alert('تمت إضافة المنتج بنجاح!');
        document.getElementById('productForm').reset(); // إعادة تعيين النموذج
    } catch (error) {
        console.error('حدث خطأ أثناء تحميل الصورة:', error);
        alert('حدث خطأ أثناء تحميل الصورة!');
    }
});
