import { Request, Response, NextFunction } from 'express';
import { StockRequestService } from '../services/StockRequestService';

export class StockRequestController {
  private stockRequestService: StockRequestService;

  constructor() {
    this.stockRequestService = new StockRequestService();
  }

  getStockRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dealerId } = req.query;

      let requests;
      if (dealerId) {
        requests = await this.stockRequestService.getStockRequestsByDealerId(dealerId as string);
      } else {
        requests = await this.stockRequestService.getAllStockRequests();
      }

      res.json({
        success: true,
        data: requests,
      });
    } catch (error) {
      next(error);
    }
  };

  getStockRequestById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const request = await this.stockRequestService.getStockRequestById(id);

      if (!request) {
        res.status(404).json({
          success: false,
          error: {
            code: 'STOCK_REQUEST_NOT_FOUND',
            message: 'Stock request not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  createStockRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Get dealer name from dealer service or auth context
      const dealerName = req.body.dealerName || 'Dealer';
      
      const request = await this.stockRequestService.createStockRequest(req.body, dealerName);

      res.status(201).json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  updateStockRequestStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = await this.stockRequestService.updateStockRequestStatus(id, status);

      if (!request) {
        res.status(404).json({
          success: false,
          error: {
            code: 'STOCK_REQUEST_NOT_FOUND',
            message: 'Stock request not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteStockRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.stockRequestService.deleteStockRequest(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            code: 'STOCK_REQUEST_NOT_FOUND',
            message: 'Stock request not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Stock request deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
