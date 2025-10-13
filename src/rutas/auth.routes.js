import { Router } from "express";
import { login, renovarToken, logout, logoutTodos } from "../controladores/auth.js";
import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);

router.post("/renovar-token", renovarToken);

router.post("/logout", logout);

router.post("/logout-todos", verificarToken, logoutTodos);

export default router;