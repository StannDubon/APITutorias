import {Router} from "express";
import {getTipoCarreras, getTipoCarreraById, addTipoCarrera, updateTipoCarrera, deleteTipoCarrera} from "../controladores/tipoCarrera.js"
import {validate} from "../middlewares/validacion.js"
import {TipoCarrera} from "../middlewares/scheme/carreraScheme.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/getTipoCarreras", verificarToken, verificarNivel(['admin']), getTipoCarreras)

router.get("/getTipoCarreraById/:id", verificarToken, verificarNivel(['admin']), getTipoCarreraById)

router.post("/addTipoCarrera", verificarToken, verificarNivel(['admin']), validate(TipoCarrera), addTipoCarrera)

router.put("/updateTipoCarrera/:id", verificarToken, verificarNivel(['admin']), validate(TipoCarrera), updateTipoCarrera)

router.delete("/deleteTipoCarrera/:id", verificarToken, verificarNivel(['admin']), deleteTipoCarrera)

export default router
