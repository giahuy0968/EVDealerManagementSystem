import { Router } from 'express';
import { CarController } from '../controllers/CarController';
import { QuotationController } from '../controllers/QuotationController';
import { OrderController } from '../controllers/OrderController';
import { StockRequestController } from '../controllers/StockRequestController';
import { ContractController } from '../controllers/ContractController';
import { PaymentController } from '../controllers/PaymentController';
import { validateRequest } from '../middlewares/validation';
import { generalRateLimit } from '../middlewares/rateLimiter';
import {
  createCarSchema,
  createQuotationSchema,
  createOrderSchema,
  createStockRequestSchema,
  createContractSchema,
  createPaymentSchema,
} from '../utils/validation';

const router = Router();

// Initialize controllers
const carController = new CarController();
const quotationController = new QuotationController();
const orderController = new OrderController();
const stockRequestController = new StockRequestController();
const contractController = new ContractController();
const paymentController = new PaymentController();

// Apply rate limiting to all routes
router.use(generalRateLimit);

// ==================== CAR ROUTES ====================
router.get('/cars', carController.getCars);
router.get('/cars/:id', carController.getCarById);
router.post('/cars/compare', carController.compareCars);
router.post('/cars', validateRequest(createCarSchema), carController.createCar);
router.put('/cars/:id', carController.updateCar);
router.delete('/cars/:id', carController.deleteCar);
router.put('/cars/:id/stock', carController.updateStock);

// ==================== QUOTATION ROUTES ====================
router.get('/quotations', quotationController.getQuotations);
router.get('/quotations/:id', quotationController.getQuotationById);
router.post('/quotations', validateRequest(createQuotationSchema), quotationController.createQuotation);
router.put('/quotations/:id', quotationController.updateQuotation);
router.put('/quotations/:id/status', quotationController.updateStatus);
router.delete('/quotations/:id', quotationController.deleteQuotation);

// ==================== ORDER ROUTES ====================
router.get('/orders', orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.get('/orders/:id/tracking', orderController.trackOrder);
router.post('/orders', validateRequest(createOrderSchema), orderController.createOrder);
router.put('/orders/:id/status', orderController.updateOrderStatus);
router.delete('/orders/:id', orderController.deleteOrder);

// ==================== STOCK REQUEST ROUTES ====================
router.get('/stock-requests', stockRequestController.getStockRequests);
router.get('/stock-requests/:id', stockRequestController.getStockRequestById);
router.post('/stock-requests', validateRequest(createStockRequestSchema), stockRequestController.createStockRequest);
router.put('/stock-requests/:id/status', stockRequestController.updateStockRequestStatus);
router.delete('/stock-requests/:id', stockRequestController.deleteStockRequest);

// ==================== CONTRACT ROUTES ====================
router.get('/contracts', contractController.getContracts);
router.get('/contracts/:id', contractController.getContractById);
router.post('/contracts', validateRequest(createContractSchema), contractController.createContract);
router.put('/contracts/:id', contractController.updateContract);
router.put('/contracts/:id/status', contractController.updateContractStatus);
router.delete('/contracts/:id', contractController.deleteContract);

// ==================== PAYMENT ROUTES ====================
router.get('/payments', paymentController.getPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.post('/payments', validateRequest(createPaymentSchema), paymentController.createPayment);
router.put('/payments/:id/status', paymentController.updatePaymentStatus);
router.delete('/payments/:id', paymentController.deletePayment);

export default router;
