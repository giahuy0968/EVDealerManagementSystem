import { Request, Response, NextFunction } from "express";
import { stockService } from "../services/stockService";

export const createStockRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const s = await stockService.create(req.body);
    res.status(201).json(s);
  } catch (err) {
    next(err);
  }
};

export const approveStockRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const s = await stockService.approve(req.params.id);
    res.json(s);
  } catch (err) {
    next(err);
  }
};

export const listStockRequests = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await stockService.list();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getStockRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const s = await stockService.getById(req.params.id);
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) {
    next(err);
  }
};

export class StockController {
    // Method to get all stocks
    public async getAllStocks(req, res) {
        try {
            // Logic to retrieve all stocks
            res.status(200).json({ message: "Retrieved all stocks" });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while retrieving stocks" });
        }
    }

    // Method to get a stock by ID
    public async getStockById(req, res) {
        const { id } = req.params;
        try {
            // Logic to retrieve a stock by ID
            res.status(200).json({ message: `Retrieved stock with ID: ${id}` });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while retrieving the stock" });
        }
    }

    // Method to create a new stock
    public async createStock(req, res) {
        const stockData = req.body;
        try {
            // Logic to create a new stock
            res.status(201).json({ message: "Stock created successfully", data: stockData });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while creating the stock" });
        }
    }

    // Method to update a stock by ID
    public async updateStock(req, res) {
        const { id } = req.params;
        const stockData = req.body;
        try {
            // Logic to update a stock by ID
            res.status(200).json({ message: `Stock with ID: ${id} updated successfully`, data: stockData });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while updating the stock" });
        }
    }

    // Method to delete a stock by ID
    public async deleteStock(req, res) {
        const { id } = req.params;
        try {
            // Logic to delete a stock by ID
            res.status(200).json({ message: `Stock with ID: ${id} deleted successfully` });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while deleting the stock" });
        }
    }
}