import {Router} from "express";
import {getUsuarios, getUsuarioById, addUsuario, updateUsuario, deleteUsuario} from "../controladores/usuarios.js"
import {validate} from "../middlewares/validacion.js"
import {crearUsuario, actualizarUsuario} from "../middlewares/scheme/usuariosScheme.js"
const router = Router()

router.get("/usuarios", getUsuarios)

router.get("/usuario/:id", getUsuarioById)

router.post("/newUsuario", validate(crearUsuario), addUsuario)

router.put("/actuUsuario/:id", validate(actualizarUsuario), updateUsuario)

router.delete("/deleteUsuario/:id", deleteUsuario)

export default router
