window.onload = main;

let mainProduct;

async function main() {
    mainProduct = JSON.parse(localStorage["product"]);
    await App.load();
    await showOrigin();
}

async function showOrigin() {
    const originList = document.getElementById("origin");
    let origin = mainProduct.origin_link;
    let tempProduct = mainProduct;

    while (origin.length == 32 * 2) {
        origin = "0x" + origin;

        let index = await App.getIndexByHash(origin);

        let product = await App.marketplace.products(index);
        let originProduct = {};
        originProduct['id'] = product[0].toNumber()
        originProduct['name'] = product[1]
        originProduct['price'] = product[2]
        originProduct['owner'] = product[3]
        originProduct['remains'] = product[4].toNumber()
        originProduct['origin_link'] = product[5]

        let row = document.createElement("li");
        row.innerHTML = "<strong>" + tempProduct.owner + "</strong> mua lại từ <strong>" + originProduct.owner + "</strong>";
        originList.appendChild(row);

        tempProduct = originProduct;

        origin = tempProduct.origin_link;
    }
    
    let showButton = document.getElementById("show_btn");
    if (tempProduct.origin_link == "") {
        showButton.style.display = 'none';
    } 
    showButton.setAttribute("href", "http://localhost:50230/ipfs/" + tempProduct.origin_link)
}