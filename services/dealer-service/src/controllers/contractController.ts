import { Request, Response, NextFunction } from 'express';
import { ContractService } from '../services/ContractService';

export class ContractController {
  private contractService: ContractService;

  constructor() {
    this.contractService = new ContractService();
  }

  getContracts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId, customerId } = req.query;

      let contracts;
      if (orderId) {
        contracts = await this.contractService.getContractsByOrderId(orderId as string);
      } else if (customerId) {
        contracts = await this.contractService.getContractsByCustomerId(customerId as string);
      } else {
        contracts = await this.contractService.getAllContracts();
      }

      res.json({
        success: true,
        data: contracts,
      });
    } catch (error) {
      next(error);
    }
  };

  getContractById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const contract = await this.contractService.getContractById(id);

      if (!contract) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CONTRACT_NOT_FOUND',
            message: 'Contract not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  };

  createContract = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // TODO: Get customer name from customer service or auth context
      const customerName = req.body.customerName || 'Customer';
      
      const contract = await this.contractService.createContract(req.body, customerName);

      res.status(201).json({
        success: true,
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  };

  updateContract = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const contract = await this.contractService.updateContract(id, req.body);

      if (!contract) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CONTRACT_NOT_FOUND',
            message: 'Contract not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  };

  updateContractStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const contract = await this.contractService.updateContractStatus(id, status);

      if (!contract) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CONTRACT_NOT_FOUND',
            message: 'Contract not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        data: contract,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteContract = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.contractService.deleteContract(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: {
            code: 'CONTRACT_NOT_FOUND',
            message: 'Contract not found',
          },
        });
        return;
      }

      res.json({
        success: true,
        message: 'Contract deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
