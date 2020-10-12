module.exports = class OrderModel {
    constructor({productId, quantity}){
        this.productId = productId;
        this.quantity = quantity;
    }
};