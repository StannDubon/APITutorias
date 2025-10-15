import { Router } from "express";
import {getNivelesUsuarios, getNivelUsuarioById, insertNivelUsuario, deleteNivelUsuario, updateNivelUsuario} from "../controladores/nivelesUsuarios.js"
import {validate} from "../middlewares/validacion.js"
import {nivelUsuario} from "../middlewares/scheme/usuariosScheme.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/nivelesUsuario", verificarToken, verificarNivel(['admin']), getNivelesUsuarios)

router.get("/nivelesUsuario/:id", verificarToken, verificarNivel(['admin']), getNivelUsuarioById)

router.post("/newNivelUsuario", verificarToken, verificarNivel(['admin']), validate(nivelUsuario), insertNivelUsuario)

router.put("/actuNivelUsuario/:id", verificarToken, verificarNivel(['admin']), validate(nivelUsuario), updateNivelUsuario)

router.delete("/deleteNivelUsuario/:id", verificarToken, verificarNivel(['admin']), deleteNivelUsuario)


export default router;