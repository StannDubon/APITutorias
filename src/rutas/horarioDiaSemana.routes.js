import {Router } from "express";
import {getHorarioDiaSemana,getHorarioDiaSemanaId,updateHorarioDiaSemana,insertHorarioDiaSemana,deleteHorarioDiaSemana} from "../controladores/horarioDiaSemana.js"
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/GEThorarioDiaSemana", verificarToken, verificarNivel(['admin', 'profesor']), getHorarioDiaSemana)
router.get("/GEThorarioDiaSemana/:id", verificarToken, verificarNivel(['admin', 'profesor']), getHorarioDiaSemanaId)
router.put("/PUThorarioDiaSemana/:id", verificarToken, verificarNivel(['admin', 'profesor']), updateHorarioDiaSemana)
router.post("/POSThorarioDiaSemana", verificarToken, verificarNivel(['admin', 'profesor']), insertHorarioDiaSemana)
router.delete("/DELETEhorarioDiaSemana/:id", verificarToken, verificarNivel(['admin', 'profesor']), deleteHorarioDiaSemana)

export default router
