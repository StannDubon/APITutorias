import {getTutoria,getTutoriaId,updateTutoria,insertTutoria,deleteTutoria} from "../controladores/tutorias.js"
import { Router } from "express";

const router = Router()

router.get("/GETtutorias", getTutoria)
router.get("/GETtutorias/:id", getTutoriaId)
router.put("/PUTtutorias/:id", updateTutoria)
router.post("/POSTtutorias", insertTutoria)
router.delete("/DELETEtutorias/:id", deleteTutoria)

export default router
