import { Router } from "express";
import {getEstados, getEstadoById, insertEstado, deleteEstado, updateEstado} from "../controladores/nivelesUsuarios.controladores.js"

const router = Router()

router.get("/estados", getEstados)

router.get("/estado/:id", getEstadoById)

router.post("/newEstado", insertEstado)

router.put("/actuEstado/:id", updateEstado)

router.delete("/deleteEstado/:id", deleteEstado)


export default router;