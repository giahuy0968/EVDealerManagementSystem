import request from 'supertest';
import app from '../app'; // Adjust the path as necessary

describe('Order Routes Integration Tests', () => {
    it('should create a new order', async () => {
        const response = await request(app)
            .post('/orders') // Adjust the endpoint as necessary
            .send({
                // Add the necessary order data here
                item: 'Car',
                quantity: 1,
                price: 20000,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.item).toBe('Car');
    });

    it('should retrieve an order by ID', async () => {
        const orderId = 1; // Replace with a valid order ID

        const response = await request(app)
            .get(`/orders/${orderId}`); // Adjust the endpoint as necessary

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', orderId);
    });

    it('should update an existing order', async () => {
        const orderId = 1; // Replace with a valid order ID

        const response = await request(app)
            .put(`/orders/${orderId}`) // Adjust the endpoint as necessary
            .send({
                // Add the necessary updated order data here
                quantity: 2,
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('quantity', 2);
    });

    it('should delete an order', async () => {
        const orderId = 1; // Replace with a valid order ID

        const response = await request(app)
            .delete(`/orders/${orderId}`); // Adjust the endpoint as necessary

        expect(response.status).toBe(204);
    });
});