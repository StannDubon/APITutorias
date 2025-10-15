import {Router } from "express";
import {getHorarioDiaSemana,getHorarioDiaSemanaId,updateHorarioDiaSemana,insertHorarioDiaSemana,deleteHorarioDiaSemana} from "../controladores/horarioDiaSemana.js"
import { validate } from "../middlewares/validacion.js";
import { HorarioDiaSemana } from "../middlewares/scheme/horariosScheme.js";
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/GEThorarioDiaSemana", verificarToken, verificarNivel(['admin', 'profesor']), getHorarioDiaSemana)
router.get("/GEThorarioDiaSemana/:id", verificarToken, verificarNivel(['admin', 'profesor']), getHorarioDiaSemanaId)
router.put("/PUThorarioDiaSemana/:id", verificarToken, verificarNivel(['admin', 'profesor']), validate(HorarioDiaSemana), updateHorarioDiaSemana)
router.post("/POSThorarioDiaSemana", verificarToken, verificarNivel(['admin', 'profesor']), validate(HorarioDiaSemana), insertHorarioDiaSemana)
router.delete("/DELETEhorarioDiaSemana/:id", verificarToken, verificarNivel(['admin', 'profesor']), deleteHorarioDiaSemana)

export default router
