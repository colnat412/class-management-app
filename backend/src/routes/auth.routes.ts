import express from 'express';
import {
  signInHandler,
  verifyCodeHandler,
} from '../controllers/auth.controller';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Auth
 */

/**
 * @swagger
 * /signIn:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign in a user
 *     responses:
 *       200:
 *         description: User signed in successfully
 */
router.post('/signIn', signInHandler);
/**
 * @swagger
 * /verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify the OTP code
 *     responses:
 *       200:
 *         description: Code verified successfully
 */
router.post('/verify', verifyCodeHandler);

export default router;
