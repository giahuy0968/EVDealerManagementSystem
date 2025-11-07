import { Request, Response, NextFunction } from 'express';
import { QuotationService } from '../services/QuotationService';

export class QuotationController {
  private quotationService: QuotationService;

  constructor() {
    this.quotationService = new QuotationService();
  }

  getQuotations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { customerId } = req.query;

      let quotations;
      if (customerId) {
        quotations = await this.quotationService.getQuotationsByCustomerId(customerId as string);
      } else {
        quotations = await this.quotationService.getAllQuotations();
      }

      res.json({
        success: true,
        data: quotations,
      });
    } catch (error) {
      next(error);
    }
  };

  getQuotationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const quotation = await this.quotationService.getQuotationById(id);

      if (!quotation) {
        res.status(404).json({
          success: false,
          error: {
            code: 'QUOTATION_NOT_FOUND',
            message: 'Quotation not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  };

  createQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Get customer name from customer service or auth context
      const customerName = req.body.customerName || 'Customer';
      
      const quotation = await this.quotationService.createQuotation(req.body, customerName);

      res.status(201).json({
        success: true,
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  };

  updateQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const quotation = await this.quotationService.updateQuotation(id, req.body);

      if (!quotation) {
        res.status(404).json({
          success: false,
          error: {
            code: 'QUOTATION_NOT_FOUND',
            message: 'Quotation not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const quotation = await this.quotationService.updateQuotationStatus(id, status);

      if (!quotation) {
        res.status(404).json({
          success: false,
          error: {
            code: 'QUOTATION_NOT_FOUND',
            message: 'Quotation not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: quotation,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteQuotation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.quotationService.deleteQuotation(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            code: 'QUOTATION_NOT_FOUND',
            message: 'Quotation not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Quotation deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
