window.onload = main;

let image;

async function main() {
    await App.load();
    displayProduct();
}

function displayProduct() {
    let product = JSON.parse(localStorage["product"]);
    $('#name').val(product.name);
    $('#type').val(product.type);
    $('#producer').val(product.producer);
    $('#remains').val(product.remains);
    $('#price').val(product.price);
    $('#origin').val(product.origin_link);
    $('#phone').val(product.phone);
    $('#email').val(product.email);
    $('#description').val(product.description);
    $('#upload_img').attr("src", product.image);
}

function onClickHandler(ev) {
    var el = window._protected_reference = document.createElement("INPUT");
    el.type = "file";
    el.accept = "image/*";
    el.multiple = "multiple";

    el.addEventListener('change', function (ev2) {
        if (el.files.length) {
            image = el.files[0];
            
            document.getElementById('upload_img').src = URL.createObjectURL(image);
        }
    });
    el.click(); 
}

async function uploadImage(callback) {
    const uploadImageUrl = "/upload";
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            callback(xhr.responseText);
        }
    }

    xhr.open("POST", uploadImageUrl, true);
    
    var formData = new FormData();
    formData.append("image", image);
    xhr.send(formData);
}

async function editProductToDatabase(product) {
    let callback = async function (image_name) {
        product.image = image_name;
        const editUrl = "/edit";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", editUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        await xhr.send(JSON.stringify(product));
    }
    uploadImage(callback);   
}