import {Router} from "express";
import {getTipoCarreras, getTipoCarreraById, addTipoCarrera, updateTipoCarrera, deleteTipoCarrera} from "../controladores/tipoCarrera.js"
import {validate} from "../middlewares/validacion.js"
import {TipoCarrera} from "../middlewares/scheme/carreraScheme.js"
const router = Router()

router.get("/getTipoCarreras", getTipoCarreras)

router.get("/getTipoCarreraById/:id", getTipoCarreraById)

router.post("/addTipoCarrera", validate(TipoCarrera), addTipoCarrera)

router.put("/updateTipoCarrera/:id", validate(TipoCarrera), updateTipoCarrera)

router.delete("/deleteTipoCarrera/:id", deleteTipoCarrera)

export default router
