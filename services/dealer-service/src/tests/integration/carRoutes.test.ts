import request from 'supertest';
import app from '../app'; // Adjust the path as necessary

describe('Car Routes Integration Tests', () => {
    it('should create a new car', async () => {
        const response = await request(app)
            .post('/api/cars')
            .send({
                make: 'Toyota',
                model: 'Camry',
                year: 2021,
                price: 24000
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.make).toBe('Toyota');
    });

    it('should get a list of cars', async () => {
        const response = await request(app)
            .get('/api/cars');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a car by ID', async () => {
        const carId = 1; // Replace with a valid car ID
        const response = await request(app)
            .get(`/api/cars/${carId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', carId);
    });

    it('should update a car', async () => {
        const carId = 1; // Replace with a valid car ID
        const response = await request(app)
            .put(`/api/cars/${carId}`)
            .send({
                price: 23000
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('price', 23000);
    });

    it('should delete a car', async () => {
        const carId = 1; // Replace with a valid car ID
        const response = await request(app)
            .delete(`/api/cars/${carId}`);
        
        expect(response.status).toBe(204);
    });
});