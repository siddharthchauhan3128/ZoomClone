import {Router} from "express";
import {registerUser,LoginUser, getUserHistory, addToHistory} from "../controllers/user.controller.js";
const router = Router();

router.post('/register', registerUser);
router.post('/Login', LoginUser);
router.post('/addToActivity',addToHistory);
router.get('/getActivity',getUserHistory);
export default router;