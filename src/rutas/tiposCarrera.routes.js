import {Router} from "express";
import {getTipoCarreras, getTipoCarreraById, addTipoCarrera, updateTipoCarrera, deleteTipoCarrera} from "../controladores/tipoCarrera.js"

const router = Router()

router.get("/getTipoCarreras", getTipoCarreras)

router.get("/getTipoCarreraById/:id", getTipoCarreraById)

router.post("/addTipoCarrera", addTipoCarrera)

router.put("/updateTipoCarrera/:id", updateTipoCarrera)

router.delete("/deleteTipoCarrera/:id", deleteTipoCarrera)

export default router
