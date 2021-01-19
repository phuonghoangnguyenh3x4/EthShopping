let products = [];
let saved_extras;
async function main() {
    await App.load();
    products = await App.getProducts();
    products.sort(function (a, b) { return a.id - b.id });
    products = products.filter(function (el) { return el != null; });
    await getExtraDataFromDB(createGridView);
}

window.onload = main;

function onItemClick(product) {
    localStorage["product"] = JSON.stringify(product);
    window.location.href = "product_detail.html";
}

function createGridView(extras) {
    if (extras)
        saved_extras = extras;
    else
        extras = saved_extras;
    let input, filter;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();

    let productCol = document.getElementById("product_col");
    while (productCol.firstChild) {
        productCol.removeChild(productCol.lastChild);
    }

    let i = 0;
    while (i < products.length) {
        let col = document.createElement("div");
        col.classList.add("myCarousel");
        col.classList.add("carousel");
        col.classList.add("slide");
        col.classList.add("active");
        col.classList.add("item");
        col.classList.add("carousel-inner");

        let productRow = document.createElement("ul");
        productRow.setAttribute("style", "display: flex;");

        productRow.classList.add("thumbnails");


        let j = 0;
        while (i + j < products.length && j < 4) {
            let row = document.createElement("li");

            row.classList.add("span3");
            row.classList.add("product-box");
            row.setAttribute("style", "padding: 20px");

            let product = products[i + j];
            let extra = extras[i + j];
            row.addEventListener('click', function () {
                onItemClick(product);
            });

            row.appendChild(document.createElement("br"));
            let imgHolder = document.createElement("a");
            imgHolder.setAttribute("href", "product_detail.html");
            let img = document.createElement("img");
            img.setAttribute("src", extra.image);
            img.setAttribute("width", "250px");
            img.setAttribute("height", "250px");

            imgHolder.appendChild(img);

            row.appendChild(imgHolder);

            row.appendChild(document.createElement("br"));
            let nameText = document.createElement("a");
            nameText.classList.add("title");
            nameText.innerHTML = product.name;
            nameText.setAttribute("href", "product_detail.html");

            row.appendChild(nameText);

            row.appendChild(document.createElement("br"));

            let priceText = document.createElement("a");
            priceText.classList.add("category");
            priceText.innerHTML = currency_format(product.price) + " ETH";
            priceText.setAttribute("href", "product_detail.html");

            row.appendChild(priceText);

            if (product.name.toUpperCase().indexOf(filter) > -1) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }

            productRow.appendChild(row);

            j++;
        }
        i = j + i;
        col.appendChild(productRow);


        productCol.appendChild(document.createElement("br"));
        productCol.appendChild(col);
    }
}

async function getExtraDataFromDB(callback) {
    const getUrl = "/get";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", getUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4)  { 
            let serverResponse = xhr.response;
            let extras = JSON.parse(serverResponse);
            extras.sort(function (a, b) { return a.id - b.id });
            callback(extras);
        }
    };
    await xhr.send();
}