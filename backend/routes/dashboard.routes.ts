import { Router, Request, Response } from 'express';
import UserModel from '../models/User';
import { authenticateToken } from '../middleware/jwt.middleware';

const router = Router();

/**
 * @route   GET /api/v1/dashboard/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId!);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/v1/dashboard/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    // Validate at least one field is provided
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name must be provided for update'
      });
    }

    await UserModel.update(req.userId!, { name });

    const updatedUser = await UserModel.findById(req.userId!);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/v1/dashboard/verify
 * @desc    Verify JWT token and get user data
 * @access  Private
 */
router.get('/verify', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId!);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
