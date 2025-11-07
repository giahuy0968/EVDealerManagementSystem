import { PaymentRepository } from '../repositories/PaymentRepository';
import { OrderRepository } from '../repositories/OrderRepository';
import { Payment } from '../models/Payment';
import { PaymentCreateDTO, PaymentResponseDTO, PaymentStatus } from '../types';
import { logger } from '../utils/logger';
import { publishEvent } from '../config/rabbitmq';

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private orderRepository: OrderRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.orderRepository = new OrderRepository();
  }

  async getAllPayments(): Promise<PaymentResponseDTO[]> {
    const payments = await this.paymentRepository.findAll();
    return payments.map(this.toResponseDTO);
  }

  async getPaymentById(id: string): Promise<PaymentResponseDTO | null> {
    const payment = await this.paymentRepository.findById(id);
    return payment ? this.toResponseDTO(payment) : null;
  }

  async getPaymentsByOrderId(orderId: string): Promise<PaymentResponseDTO[]> {
    const payments = await this.paymentRepository.findByOrderId(orderId);
    return payments.map(this.toResponseDTO);
  }

  async createPayment(data: PaymentCreateDTO): Promise<PaymentResponseDTO> {
    // Verify order exists
    const order = await this.orderRepository.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const payment = await this.paymentRepository.create({
      orderId: data.orderId,
      orderNumber: order.orderNumber,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference,
      note: data.note,
      status: PaymentStatus.PENDING,
    });

    logger.info(`Payment created: ${payment.id} for order ${order.orderNumber}`);

    // Publish event
    await publishEvent('payment.created', {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
    });

    return this.toResponseDTO(payment);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<PaymentResponseDTO | null> {
    const payment = await this.paymentRepository.updateStatus(id, status);
    if (payment) {
      logger.info(`Payment status updated: ${id} -> ${status}`);

      // Publish event
      await publishEvent('payment.status.updated', {
        paymentId: payment.id,
        orderId: payment.orderId,
        status,
      });

      // Check if order is fully paid
      if (status === PaymentStatus.COMPLETED) {
        const totalPaid = await this.paymentRepository.getTotalPaymentsByOrderId(payment.orderId);
        const order = await this.orderRepository.findById(payment.orderId);
        
        if (order && totalPaid >= Number(order.totalAmount)) {
          logger.info(`Order ${order.orderNumber} is fully paid`);
          await publishEvent('order.fully.paid', {
            orderId: order.id,
            orderNumber: order.orderNumber,
          });
        }
      }

      return this.toResponseDTO(payment);
    }
    return null;
  }

  async deletePayment(id: string): Promise<boolean> {
    const result = await this.paymentRepository.delete(id);
    if (result) {
      logger.info(`Payment deleted: ${id}`);
    }
    return result;
  }

  private toResponseDTO(payment: Payment): PaymentResponseDTO {
    return {
      id: payment.id,
      orderId: payment.orderId,
      orderNumber: payment.orderNumber,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      transactionReference: payment.transactionReference,
      status: payment.status,
      note: payment.note,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }
}
