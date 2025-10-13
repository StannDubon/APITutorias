import {Router } from "express";
import {getAsistencia,getAsistenciaById,updateAsistencia,insertAsistencia,deleteAsistencia} from "../controladores/asistencia.js"

const router = Router()

router.get("/GETasistencia", getAsistencia)
router.get("/GETasistencia/:id", getAsistenciaById)
router.put("/PUTasistencia/:id", updateAsistencia)
router.post("/POSTasistencia", insertAsistencia)
router.delete("/DELETEasistencia/:id", deleteAsistencia)

export default router
