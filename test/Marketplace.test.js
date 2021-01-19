const Marketplace = artifacts.require('./Marketplace.sol')
const BigNumber = require("bignumber.js")

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace

  before(async () => {
    marketplace = await Marketplace.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await marketplace.name()
      assert.equal(name, 'Eth shopping')
    })
  })

  describe('products', async () => {
    let result, productCount

    before(async () => {
      result = await marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), 10, { from: seller })
      productCount = await marketplace.productCount()
    })

    it('creates products', async () => {
      // SUCCESS
      assert.equal(productCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.remains, 10, 'remains correct')

      // FAILURE: Product must have a name
      await await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), 10, { from: seller }).should.be.rejected;

      // FAILURE: Product must have a price
      await await marketplace.createProduct('iPhone X', 0, 10, { from: seller }).should.be.rejected;

      // FAILURE: Product must have remains
      await await marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), 0, { from: seller }).should.be.rejected;
    })

    it('lists products', async () => {
      const product = await marketplace.products(productCount)
      assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(product.name, 'iPhone X', 'name is correct')
      assert.equal(product.price, '1000000000000000000', 'price is correct')
      assert.equal(product.owner, seller, 'owner is correct')
      assert.equal(product.remains, 10, 'remains correct')
    })

    it('sells products', async () => {
      // Track the seller balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new BigNumber(oldSellerBalance)

      // SUCCESS: Buyer makes purchase
      result = await marketplace.purchaseProduct(productCount, 5, { from: buyer, value: web3.utils.toWei('5', 'Ether')})

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.remains, 5, 'remains correct')      

      // Check that seller received funds
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new BigNumber(newSellerBalance)

      let price
      price = web3.utils.toWei('1', 'Ether')
      let amount = 5;
      let real_price = new BigNumber(price*amount)

      const exepectedBalance = oldSellerBalance.plus(real_price)
      

      assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

      // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
      await marketplace.purchaseProduct(99, 5, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
      // FAILURE: Buyer tries to buy without enough ether
      await marketplace.purchaseProduct(productCount, 5, { from: buyer, value: web3.utils.toWei('4', 'Ether') }).should.be.rejected;
      // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
      await marketplace.purchaseProduct(productCount, 5, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })
  })
})
