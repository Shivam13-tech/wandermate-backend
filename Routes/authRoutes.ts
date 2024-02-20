import express from 'express';
import {signup} from '../Controllers/authController';
import {login} from '../Controllers/authController';

const router = express.Router();

router
    .route('/signup')
    .post(signup)

router
    .route('/login')
    .post(login)

export default router;