import express from 'express';
import { 
  createQRCode, 
  getUserQRCodes, 
  getQRCodeById,
  updateQRCode,
  deleteQRCode
} from '../controllers/qrController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createQRCode)
  .get(protect, getUserQRCodes);

router.route('/:id')
  .get(protect, getQRCodeById)
  .put(protect, updateQRCode)
  .delete(protect, deleteQRCode);

export default router;