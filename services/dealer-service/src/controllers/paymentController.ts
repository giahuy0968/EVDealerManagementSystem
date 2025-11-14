import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId } = req.query;

      let payments;
      if (orderId) {
        payments = await this.paymentService.getPaymentsByOrderId(orderId as string);
      } else {
        payments = await this.paymentService.getAllPayments();
      }

      res.json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  };

  getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const payment = await this.paymentService.getPaymentById(id);

      if (!payment) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: 'Payment not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  createPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payment = await this.paymentService.createPayment(req.body);

      res.status(201).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  updatePaymentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const payment = await this.paymentService.updatePaymentStatus(id, status);

      if (!payment) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: 'Payment not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  deletePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.paymentService.deletePayment(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PAYMENT_NOT_FOUND',
            message: 'Payment not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Payment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
