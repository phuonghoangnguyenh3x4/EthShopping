pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint public productCount = 0;
    mapping(uint => Product) public products;
    mapping(bytes32 => uint) public hashToIndex;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        uint remains;
        string origin;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        uint remains,
        string origin
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        uint remains,
        string origin
    );

    event EditPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        uint remains,
        string origin
    );

    constructor() public {
        name = "Eth shopping";
    }

    function createProduct(string memory _name, uint _price, uint _remains, string memory _origin) public {
        require(bytes(_name).length > 0);

        require(_remains > 0);

        require(_price > 0);

        productCount++;

        address payable _owner = msg.sender;

        products[productCount] = Product(productCount, _name, _price, _owner, _remains, _origin);

        hashToIndex[sha256(abi.encodePacked(_name,_owner))] = productCount;

        emit ProductCreated(productCount, _name, _price, _owner, _remains, _origin);
    }

    function purchaseProduct(uint _id, uint amount) public payable {
        Product memory _product = products[_id];

        address payable _seller = _product.owner;

        require(_product.id > 0 && _product.id <= productCount);

        require(msg.value >= _product.price*amount);

        require(_product.remains > 0);

        require(_product.remains > amount);

        require(_seller != msg.sender);

        _product.remains -= amount;

        products[_id] = _product;

        address(_seller).transfer(msg.value);

        emit ProductPurchased(_id, _product.name, _product.price, msg.sender, _product.remains, _product.origin);
    }

    function editProduct(uint _id, string memory _name, uint _price, uint _remains, string memory _origin) public payable {
        Product memory _product = products[_id];

        address payable _seller = _product.owner;

        require(_product.id > 0 && _product.id <= productCount);

        require(_remains >= 0);

        require(_price >= 0);

        require(_seller == msg.sender);

        _product.name = _name;
        _product.price = _price;
        _product.remains = _remains;
        _product.origin = _origin;

        products[_id] = _product;

        address payable _owner = msg.sender;

        hashToIndex[sha256(abi.encodePacked(_name,_owner))] = productCount;

        emit EditPurchased(_id, _product.name, _product.price, _owner, _product.remains, _product.origin);
    }
}
