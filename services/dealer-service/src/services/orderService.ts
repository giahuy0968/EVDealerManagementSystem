import { OrderRepository } from '../repositories/OrderRepository';
import { CarRepository } from '../repositories/CarRepository';
import { Order } from '../models/Order';
import { OrderCreateDTO, OrderResponseDTO, OrderStatus, OrderItemDTO, OrderTrackingDTO } from '../types';
import { logger } from '../utils/logger';
import { publishEvent } from '../config/rabbitmq';

export class OrderService {
  private orderRepository: OrderRepository;
  private carRepository: CarRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.carRepository = new CarRepository();
  }

  async getAllOrders(): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.findAll();
    return orders.map(this.toResponseDTO);
  }

  async getOrderById(id: string): Promise<OrderResponseDTO | null> {
    const order = await this.orderRepository.findById(id);
    return order ? this.toResponseDTO(order) : null;
  }

  async getOrdersByCustomerId(customerId: string): Promise<OrderResponseDTO[]> {
    const orders = await this.orderRepository.findByCustomerId(customerId);
    return orders.map(this.toResponseDTO);
  }

  async createOrder(data: OrderCreateDTO, customerName: string): Promise<OrderResponseDTO> {
    // Validate and prepare items
    const items: OrderItemDTO[] = [];
    let totalAmount = 0;

    for (const item of data.items) {
      const car = await this.carRepository.findById(item.carModelId);
      if (!car) {
        throw new Error(`Car not found: ${item.carModelId}`);
      }

      // Check stock
      if (car.stock < item.quantity) {
        throw new Error(`Insufficient stock for car: ${car.name}`);
      }

      const unitPrice = Number(car.basePrice);
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      items.push({
        carModelId: item.carModelId,
        carModelName: car.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });

      // Reserve stock
      await this.carRepository.decrementStock(item.carModelId, item.quantity);
    }

    // Create order
    const order = await this.orderRepository.create({
      customerId: data.customerId,
      customerName,
      itemsJson: JSON.stringify(items),
      totalAmount,
      paymentMethod: data.paymentMethod,
      note: data.note,
      status: OrderStatus.PENDING,
    });

    logger.info(`Order created: ${order.orderNumber} for customer ${customerName}`);

    // Publish event
    await publishEvent('order.created', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      totalAmount: order.totalAmount,
      items,
    });

    return this.toResponseDTO(order);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderResponseDTO | null> {
    const order = await this.orderRepository.updateStatus(id, status);
    if (order) {
      logger.info(`Order status updated: ${order.orderNumber} -> ${status}`);

      // Publish event
      await publishEvent('order.status.updated', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status,
      });

      return this.toResponseDTO(order);
    }
    return null;
  }

  async trackOrder(id: string): Promise<OrderTrackingDTO | null> {
    const order = await this.orderRepository.findById(id);
    if (!order) return null;

    // Build timeline based on status
    const timeline = this.buildTimeline(order);

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      currentStatus: order.status,
      timeline,
      estimatedDeliveryDate: this.calculateEstimatedDelivery(order),
    };
  }

  async deleteOrder(id: string): Promise<boolean> {
    // TODO: Restore stock before deleting
    const result = await this.orderRepository.delete(id);
    if (result) {
      logger.info(`Order deleted: ${id}`);
    }
    return result;
  }

  private toResponseDTO(order: Order): OrderResponseDTO {
    let items: OrderItemDTO[] = [];
    try {
      items = JSON.parse(order.itemsJson);
    } catch (e) {
      logger.error('Failed to parse order items JSON', e);
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      items,
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      status: order.status,
      note: order.note,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  private buildTimeline(order: Order): Array<{ status: string; description: string; timestamp: string }> {
    const timeline: Array<{ status: string; description: string; timestamp: string }> = [];

    timeline.push({
      status: 'PENDING',
      description: 'Order created and pending confirmation',
      timestamp: order.createdAt.toISOString(),
    });

    if (order.status !== OrderStatus.PENDING) {
      timeline.push({
        status: order.status,
        description: `Order is ${order.status.toLowerCase()}`,
        timestamp: order.updatedAt.toISOString(),
      });
    }

    return timeline;
  }

  private calculateEstimatedDelivery(order: Order): string | undefined {
    if (order.status === OrderStatus.DELIVERING) {
      const estimatedDate = new Date(order.updatedAt);
      estimatedDate.setDate(estimatedDate.getDate() + 7); // 7 days from delivery start
      return estimatedDate.toISOString();
    }
    return undefined;
  }
}
