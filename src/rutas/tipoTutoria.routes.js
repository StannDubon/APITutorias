import { Router } from "express";
import {getTiposTutoria, getTipoTutoriabyId , addTipoTutoria, updateTipoTutoria, deleteTipoTutoria} from "../controladores/tiposTutoria.js"
import {validate} from "../middlewares/validate.js"
import {crearTipoTutoriaTipoTutoria} from "../middlewares/scheme/tutoriasScheme.js"
const router = Router()

router.get("/tiposTutoria", getTiposTutoria)

router.get("/tipoTutoria/:id", getTipoTutoriabyId)

router.post("/newTipoTutoria", validate(crearTipoTutoriaTipoTutoria), addTipoTutoria)

router.put("/actuTipoTutoria/:id", validate(crearTipoTutoriaTipoTutoria), updateTipoTutoria)

router.delete("/deleteTipoTutoria/:id", deleteTipoTutoria)

export default router;
