class Product {
  constructor(producer, name, type, views, remains, sold, price, origin, points, images, description) {
    this.producer = producer;
    this.name = name;
    this.type = type;
    this.views = views; 
    this.remains = remains; 
    this.sold = sold;
    this.price = price;
    this.origin = origin;
    this.points = points;
    this.images = images;
    this.description = description;
  }

  isRemain() {
      return remains > 0;
  }
}