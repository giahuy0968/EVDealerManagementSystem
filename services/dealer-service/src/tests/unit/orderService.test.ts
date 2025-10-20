import { OrderService } from '../../services/orderService';
import { Order } from '../../models/entities/order.entity';

describe('OrderService', () => {
    let orderService: OrderService;

    beforeEach(() => {
        orderService = new OrderService();
    });

    it('should create a new order', async () => {
        const orderData = { /* mock order data */ };
        const order = await orderService.createOrder(orderData);
        expect(order).toBeInstanceOf(Order);
        expect(order).toHaveProperty('id');
    });

    it('should retrieve an order by ID', async () => {
        const orderId = '1'; // mock order ID
        const order = await orderService.getOrderById(orderId);
        expect(order).toBeInstanceOf(Order);
        expect(order.id).toBe(orderId);
    });

    it('should update an existing order', async () => {
        const orderId = '1'; // mock order ID
        const updatedData = { /* mock updated data */ };
        const updatedOrder = await orderService.updateOrder(orderId, updatedData);
        expect(updatedOrder).toBeInstanceOf(Order);
        expect(updatedOrder).toHaveProperty('id', orderId);
    });

    it('should delete an order', async () => {
        const orderId = '1'; // mock order ID
        const result = await orderService.deleteOrder(orderId);
        expect(result).toBe(true);
    });
});