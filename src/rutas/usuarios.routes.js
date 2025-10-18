import {Router} from "express";
import {getUsuarios, getUsuarioById, addUsuario, updateUsuario, deleteUsuario, getVistaUsuariosBasicos, getVistaTutoriaUsuario, getVistaUsuariosAcademicos} from "../controladores/usuarios.js"
import {validate} from "../middlewares/validacion.js"
import {crearUsuario, actualizarUsuario} from "../middlewares/scheme/usuariosScheme.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/usuarios", verificarToken, verificarNivel(['admin']), getUsuarios)
router.get("/usuario/:id", verificarToken, verificarNivel(['admin', 'profesor']), getUsuarioById)
router.post("/newUsuario", validate(crearUsuario), addUsuario)
router.put("/actuUsuario/:id", verificarToken, verificarNivel(['admin']), validate(actualizarUsuario), updateUsuario)
router.delete("/deleteUsuario/:id", verificarToken, verificarNivel(['admin']), deleteUsuario)

router.get("/getVistaUsuariosBasicos", verificarToken, verificarNivel(['admin', 'profesor']), getVistaUsuariosBasicos)
router.get("/getVistaUsuariosAcademicos", verificarToken, verificarNivel(['admin', 'profesor']), getVistaUsuariosAcademicos)
router.get("/getVistaTutoriaUsuario/:id", verificarToken, verificarNivel(['admin', 'profesor']), getVistaTutoriaUsuario)

export default router
