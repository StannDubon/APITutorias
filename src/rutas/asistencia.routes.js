import {Router } from "express";
import {getAsistencia,getAsistenciaById,updateAsistencia,insertAsistencia,deleteAsistencia} from "../controladores/asistencia.js"
import { asistenciaTutoria } from "../middlewares/scheme/tutoriasScheme.js";
import { validate } from "../middlewares/validacion.js";
const router = Router()

router.get("/GETasistencia", getAsistencia)
router.get("/GETasistencia/:id", getAsistenciaById)
router.put("/PUTasistencia/:id", validate(asistenciaTutoria),updateAsistencia)
router.post("/POSTasistencia", validate(asistenciaTutoria),insertAsistencia)
router.delete("/DELETEasistencia/:id", deleteAsistencia)

export default router
