import { Router } from 'express';
import AuthController from '../controllers/authController';
import { validateUserRegistration, validateUserLogin } from '../middleware/validationMiddleware';

const router = Router();


router.post('/register',  (req, res, next) => {validateUserRegistration(req, res, next); },
(req, res, next) => { AuthController.register(req, res).catch(next);
  }
);

router.post('/login', (req, res, next) => { validateUserLogin(req, res, next)},
(req, res, next) => { AuthController.login(req, res).catch(next);
});

// Add the new routes for email verification
router.post('/verify-email/:userId', (req, res, next) => {  AuthController.verifyEmail(req, res).catch(next);
  });

router.post('/resend-verification/:userId', (req, res, next) => { AuthController.resendVerificationOTP(req, res).catch(next);
  });

export default router;