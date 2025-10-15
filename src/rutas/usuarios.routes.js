import {Router} from "express";
import {getUsuarios, getUsuarioById, addUsuario, updateUsuario, deleteUsuario} from "../controladores/usuarios.js"
import {validate} from "../middlewares/validacion.js"
import {crearUsuario, actualizarUsuario} from "../middlewares/scheme/usuariosScheme.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/usuarios", verificarToken, verificarNivel(['admin']), getUsuarios)

router.get("/usuario/:id", verificarToken, verificarNivel(['admin', 'profesor']), getUsuarioById)

router.post("/newUsuario", validate(crearUsuario), addUsuario)

router.put("/actuUsuario/:id", verificarToken, verificarNivel(['admin']), validate(actualizarUsuario), updateUsuario)

router.delete("/deleteUsuario/:id", verificarToken, verificarNivel(['admin']), deleteUsuario)

export default router
