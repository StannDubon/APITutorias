import { Router } from "express";
import { login, renovarToken, logout, logoutTodos } from "../controladores/auth.js";

const router = Router();

router.post("/login", login);

router.post("/renovar-token", renovarToken);

router.post("/logout", logout);

router.post("/logout-todos", logoutTodos);

export default router;