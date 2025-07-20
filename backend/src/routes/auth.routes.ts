import express from 'express';
import {
  signInHandler,
  verifyCodeHandler,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signIn', signInHandler);
router.post('/verify', verifyCodeHandler);

export default router;
