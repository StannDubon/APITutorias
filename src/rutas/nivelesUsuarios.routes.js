import { Router } from "express";
import {getEstados, getEstadoById, insertEstado, deleteEstado, updateEstado} from "../controladores/nivelesUsuarios.js"
import {validate} from "../middlewares/validacion.js"
import {nivelUsuario} from "../middlewares/scheme/usuariosScheme.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/estados", verificarToken, verificarNivel(['admin']), getEstados)

router.get("/estado/:id", verificarToken, verificarNivel(['admin']), getEstadoById)

router.post("/newEstado", verificarToken, verificarNivel(['admin']), validate(nivelUsuario), insertEstado)

router.put("/actuEstado/:id", verificarToken, verificarNivel(['admin']), validate(nivelUsuario), updateEstado)

router.delete("/deleteEstado/:id", verificarToken, verificarNivel(['admin']), deleteEstado)


export default router;