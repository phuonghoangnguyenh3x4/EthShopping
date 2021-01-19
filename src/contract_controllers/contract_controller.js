App = {
    contracts: {},

    load: async () => {
        await App.loadWeb3()
        await App.loadContract()
    },

    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({
                    /* ... */
                })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({
                /* ... */
            })
        }
        // Non-dapp browsers...
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadContract: async () => {
        const marketplace = await $.getJSON('Marketplace.json')
        App.contracts.Marketplace = TruffleContract(marketplace)
        App.contracts.Marketplace.setProvider(App.web3Provider)

        App.marketplace = await App.contracts.Marketplace.deployed()
    },

    onUploadProductClick: async () => {
        try {
            const name = $('#name').val()
            const price = $('#price').val()
            const remains = $('#remains').val()
            const origin = $('#origin').val()

            await App.marketplace.createProduct(name, price, remains, origin);

            const type = $('#type').val()
            const producer = $('#producer').val()
            const description = $('#description').val()
            const phone = $('#phone').val()
            const email = $('#email').val()
            const id = await App.marketplace.productCount();
            const image = $('#upload_img').attr('src');

            const product = {
                id: id,
                type: type,
                producer: producer,
                description: description,
                email: email,
                phone: phone,
                image: image
            }
            await saveProductToDatabase(product);
            alert("Đăng thành công");
        } catch (err) {
            alert("Đăng thất bại");
        }
    },

    onEditProductClick: async () => {
        try {

            const old_product = JSON.parse(localStorage["product"]);
            const id = old_product.id;
            const name = $('#name').val()
            const price = $('#price').val()
            const remains = $('#remains').val()
            const origin = $('#origin').val()

            await App.marketplace.editProduct(id, name, price, remains, origin);

            const type = $('#type').val()
            const producer = $('#producer').val()
            const description = $('#description').val()
            const phone = $('#phone').val()
            const email = $('#email').val()
            const image = $('#upload_img').attr('src')

            const product = {
                id: id,
                type: type,
                producer: producer,
                description: description,
                email: email,
                phone: phone,
                image: image
            }

            if (old_product.type != type || old_product.producer != producer || old_product.image != image || old_product.description != description || old_product.phone != phone || old_product.email != email) {
                await editProductToDatabase(product);
            }
            alert("Sửa thành công");
        } catch (err) {
            alert("Sửa thất bại");
        }
    },

    getProducts: async () => {
        let productCount = await App.marketplace.productCount()
        productCount = productCount.toNumber()

        const products = []

        for (let i = 1; i <= productCount; i++) {
            const product = await App.marketplace.products(i)
            products[i] = {}
            products[i]['id'] = product[0].toNumber()
            products[i]['name'] = product[1]
            products[i]['price'] = product[2]
            products[i]['owner'] = product[3]
            products[i]['remains'] = product[4].toNumber()
            products[i]['origin_link'] = product[5]
        }

        return products
    },

    onBuyButtonClick: async () => {
        try {
            let product = JSON.parse(localStorage["product"]);
            let amount = $('#sl').val()
            if (!amount)
                amount = 1

            total_price = product['price'] * amount;

            await App.marketplace.purchaseProduct(product['id'], amount, {
                value: web3.toWei(total_price, 'ether')
            });
            alert("Mua thành công");
        } catch (err) {
            alert("Mua thất bại");
        }
    },

    getIndexByHash: async (hash) => {
        let index = await App.marketplace.hashToIndex(hash);
        return index.toNumber()
    },
}