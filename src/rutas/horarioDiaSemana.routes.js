import {Router } from "express";
import {getHorarioDiaSemana,getHorarioDiaSemanaId,updateHorarioDiaSemana,insertHorarioDiaSemana,deleteHorarioDiaSemana} from "../controladores/horarioDiaSemana.js"
import { validate } from "../middlewares/validate.js";
import { HorarioDiaSemana } from "../middlewares/scheme/horariosScheme.js";

const router = Router()

router.get("/GEThorarioDiaSemana", getHorarioDiaSemana)
router.get("/GEThorarioDiaSemana/:id", getHorarioDiaSemanaId)
router.put("/PUThorarioDiaSemana/:id", validate(HorarioDiaSemana), updateHorarioDiaSemana)
router.post("/POSThorarioDiaSemana", insertHorarioDiaSemana)
router.delete("/DELETEhorarioDiaSemana/:id", deleteHorarioDiaSemana)

export default router
