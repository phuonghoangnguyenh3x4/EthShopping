window.onload = main;

let products = [];
let product;

async function main() {
    await App.load();
    products = await App.getProducts();    
    await getExtraDataFromDB(showProduct);
    await getLink();
}

async function getLink() {
    const getUrl = "/get_link?name=" + product.name + "&owner=" + product.owner;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", getUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4)  { 
            let link = xhr.response;

            sha256(link, async function (hash) {
                document.getElementById("origin").innerHTML = hash;
            });
        }
    };
    await xhr.send();
}

function showProduct(extra) {
    product = JSON.parse(localStorage["product"]);
    product = {... product, ...extra }
    localStorage["product"] = JSON.stringify(product);
    
    let mainImageA = document.getElementById("main_image_a")
    mainImageA.setAttribute("href", product.image)

    let mainImageImg = document.getElementById("main_image_img")
    mainImageImg.setAttribute("src", product.image)

    document.getElementById("name").innerHTML = product["name"];

    document.getElementById("producer").innerHTML = product["producer"];

    document.getElementById("type").innerHTML = product.type;

    document.getElementById("phone").innerHTML = product.phone;
    document.getElementById("email").innerHTML = product.email;


    document.getElementById("stt").innerHTML = product["remains"] > 0 ? "Còn hàng" : "Hết hàng";

    document.getElementById("price").innerHTML += currency_format(product["price"]) + " ETH";

    document.getElementById("description").innerHTML = product["description"];
}

(function($) {
    $.rand = function(arg) {
        if ($.isArray(arg)) {
            return arg[$.rand(arg.length)];
        } else if (typeof arg === "number") {
            return Math.floor(Math.random() * arg - 1) + 1;
        }
    };
})(jQuery);

function addCart(product, sl) {
    let cart = [];

    if (document.cookie) {
        cart = JSON.parse(document.cookie);
    }

    if (sl == '')
        sl = 1;
    cart.push([product, sl]);

    document.cookie = JSON.stringify(cart);

    alert("Thêm vào giỏ thành công");
}

async function getExtraDataFromDB(callback) {
    product = JSON.parse(localStorage["product"]);

    const getUrl = "/get?id=" + product.id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", getUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4)  { 
            let serverResponse = xhr.response;
            let extras = JSON.parse(serverResponse);
            callback(extras[0]);
        }
    };
    await xhr.send();
}

function onEditButtonClick() {
    window.location = "/product_edit.html";
}