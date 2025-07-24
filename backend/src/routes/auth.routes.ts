import express from 'express';
import {
  createPasswordHandler,
  loginHandler,
  signInHandler,
  verifyCodeHandler,
  checkVerificationStatusHandler,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/sign-in-otp', signInHandler);
router.post('/verify', verifyCodeHandler);
router.post('/create-password', createPasswordHandler);
router.post('/login', loginHandler);
router.post('/check-verification-status', checkVerificationStatusHandler);

export default router;
