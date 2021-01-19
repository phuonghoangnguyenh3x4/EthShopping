window.onload = main;

let image;

async function main() {
    await App.load();
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

async function saveProductToDatabase(product) {
    let callback = async function (image_name) {
        product.image = image_name;
        const uploadUrl = "/create";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        await xhr.send(JSON.stringify(product));
    }
    uploadImage(callback);   
}