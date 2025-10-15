import { Router } from "express";
import {getEstados, getEstadoById, insertEstado, deleteEstado, updateEstado} from "../controladores/nivelesUsuarios.js"
import {validate} from "../middlewares/validacion.js"
import {nivelUsuario} from "../middlewares/scheme/usuariosScheme.js"

const router = Router()

router.get("/estados", getEstados)

router.get("/estado/:id", getEstadoById)

router.post("/newEstado", validate(nivelUsuario), insertEstado)

router.put("/actuEstado/:id", validate(nivelUsuario), updateEstado)

router.delete("/deleteEstado/:id", deleteEstado)


export default router;