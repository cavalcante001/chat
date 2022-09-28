import { Router } from "express";
import * as HomeController from '../controller/HomeController';

const router = Router();

router.get('/', HomeController.home);  

export default router;