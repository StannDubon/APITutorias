import { Router } from "express";
import {getTiposTutoria, getTipoTutoriabyId , addTipoTutoria, updateTipoTutoria, deleteTipoTutoria} from "../controladores/tiposTutoria.js"

const router = Router()

router.get("/tiposTutoria", getTiposTutoria)

router.get("/tipoTutoria/:id", getTipoTutoriabyId)

router.post("/newTipoTutoria", addTipoTutoria)

router.put("/actuTipoTutoria/:id", updateTipoTutoria)

router.delete("/deleteTipoTutoria/:id", deleteTipoTutoria)

export default router;
