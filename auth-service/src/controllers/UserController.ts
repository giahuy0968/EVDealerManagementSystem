import { Request, Response, NextFunction } from 'express';
import { User } from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/models';
import {
  UserPublicDTO,
  UpdateUserDTO,
  ChangeRoleDTO,
  ChangeStatusDTO,
  PaginatedResponse,
  ApiResponse,
  UserRole
} from 'c:/OOP-BUILD/EVDealerManagementSystem/auth-service/src/types';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export class UserController {
  /**
   * Get all users with filtering and pagination
   * GET /api/v1/auth/users
   */
  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        role,
        isActive,
        dealerId,
        manufacturerId,
        search
      } = req.query as any;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Apply filters
      if (role) {
        whereClause.role = role;
      }

      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      if (dealerId) {
        whereClause.dealerId = dealerId;
      }

      if (manufacturerId) {
        whereClause.manufacturerId = manufacturerId;
      }

      if (search) {
        whereClause[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { fullName: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Role-based access control
      const currentUser = req.user;
      if (!currentUser) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: { code: 'USER_NOT_AUTHENTICATED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Apply role-based filtering
      if (currentUser.role === UserRole.DEALER_MANAGER) {
        whereClause.dealerId = currentUser.dealerId;
      } else if (currentUser.role === UserRole.DEALER_STAFF) {
        whereClause.id = currentUser.id; // Can only see own profile
      }

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset,
        order: [[sortBy, sortOrder]],
        attributes: { exclude: ['passwordHash'] }
      });

      const totalPages = Math.ceil(count / limit);

      const response: PaginatedResponse<UserPublicDTO> = {
        data: rows.map(user => user.toPublicJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: response,
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/v1/auth/users/:id
   */
  static async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: { code: 'USER_NOT_AUTHENTICATED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Role-based access control
      if (currentUser.role === UserRole.DEALER_STAFF && currentUser.id !== id) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: { code: 'ACCESS_DENIED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const user = await User.findByPk(id, {
        attributes: { exclude: ['passwordHash'] }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          error: { code: 'USER_NOT_FOUND' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Additional role-based checks
      if (currentUser.role === UserRole.DEALER_MANAGER && user.dealerId !== currentUser.dealerId) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: { code: 'ACCESS_DENIED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: { user: user.toPublicJSON() },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * PUT /api/v1/auth/users/:id
   */
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const { id } = req.params;
      const updateData: UpdateUserDTO = req.body;
      const currentUser = req.user;

      if (!currentUser) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: { code: 'USER_NOT_AUTHENTICATED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          error: { code: 'USER_NOT_FOUND' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Role-based access control
      const canUpdate = 
        currentUser.role === UserRole.ADMIN ||
        (currentUser.role === UserRole.DEALER_MANAGER && user.dealerId === currentUser.dealerId) ||
        currentUser.id === id; // Can update own profile

      if (!canUpdate) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: { code: 'ACCESS_DENIED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Update user
      await user.update(updateData);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user: user.toPublicJSON() },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user (soft delete)
   * DELETE /api/v1/auth/users/:id
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const currentUser = req.user;

      if (!currentUser) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: { code: 'USER_NOT_AUTHENTICATED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Only admins and dealer managers can delete users
      if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DEALER_MANAGER) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: { code: 'ACCESS_DENIED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          error: { code: 'USER_NOT_FOUND' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Dealer manager can only delete users in their dealer
      if (currentUser.role === UserRole.DEALER_MANAGER && user.dealerId !== currentUser.dealerId) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: { code: 'ACCESS_DENIED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Can't delete yourself
      if (user.id === currentUser.id) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete your own account',
          error: { code: 'CANNOT_DELETE_SELF' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Soft delete by deactivating
      await user.update({ isActive: false });

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user role
   * PUT /api/v1/auth/users/:id/role
   */
  static async changeUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const { id } = req.params;
      const { role, dealerId, manufacturerId }: ChangeRoleDTO = req.body;
      const currentUser = req.user;

      if (!currentUser) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: { code: 'USER_NOT_AUTHENTICATED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Only admins can change roles
      if (currentUser.role !== UserRole.ADMIN) {
        res.status(403).json({
          success: false,
          message: 'Only admins can change user roles',
          error: { code: 'ADMIN_REQUIRED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          error: { code: 'USER_NOT_FOUND' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Update role and associated fields
      const updateData: any = { role };

      if (role === UserRole.DEALER_MANAGER || role === UserRole.DEALER_STAFF) {
        if (!dealerId) {
          res.status(400).json({
            success: false,
            message: 'Dealer ID is required for dealer roles',
            error: { code: 'DEALER_ID_REQUIRED' },
            timestamp: new Date().toISOString()
          } as ApiResponse);
          return;
        }
        updateData.dealerId = dealerId;
        updateData.manufacturerId = null;
      } else if (role === UserRole.EVM_STAFF) {
        if (!manufacturerId) {
          res.status(400).json({
            success: false,
            message: 'Manufacturer ID is required for EVM staff role',
            error: { code: 'MANUFACTURER_ID_REQUIRED' },
            timestamp: new Date().toISOString()
          } as ApiResponse);
          return;
        }
        updateData.manufacturerId = manufacturerId;
        updateData.dealerId = null;
      } else {
        updateData.dealerId = null;
        updateData.manufacturerId = null;
      }

      await user.update(updateData);

      res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        data: { user: user.toPublicJSON() },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change user status (activate/deactivate)
   * PUT /api/v1/auth/users/:id/status
   */
  static async changeUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            details: errors.array()
          },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const { id } = req.params;
      const { isActive }: ChangeStatusDTO = req.body;
      const currentUser = req.user;

      if (!currentUser) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
          error: { code: 'USER_NOT_AUTHENTICATED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Only admins and dealer managers can change status
      if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.DEALER_MANAGER) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: { code: 'ACCESS_DENIED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      const user = await User.findByPk(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
          error: { code: 'USER_NOT_FOUND' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Dealer manager can only change status for users in their dealer
      if (currentUser.role === UserRole.DEALER_MANAGER && user.dealerId !== currentUser.dealerId) {
        res.status(403).json({
          success: false,
          message: 'Access denied',
          error: { code: 'ACCESS_DENIED' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      // Can't deactivate yourself
      if (user.id === currentUser.id && !isActive) {
        res.status(400).json({
          success: false,
          message: 'Cannot deactivate your own account',
          error: { code: 'CANNOT_DEACTIVATE_SELF' },
          timestamp: new Date().toISOString()
        } as ApiResponse);
        return;
      }

      await user.update({ isActive });

      res.status(200).json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: { user: user.toPublicJSON() },
        timestamp: new Date().toISOString()
      } as ApiResponse);
    } catch (error) {
      next(error);
    }
  }
}