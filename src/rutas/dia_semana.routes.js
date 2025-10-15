import { Router } from "express";
import {get_dia_semana,get_dia_seamana_id,update_dia_semana,insert_dia_seamana,delete_dia_semana} from "../controladores/dia_semana.js"
import { validate } from "../middlewares/validacion.js";
import { DiasSemana  } from "../middlewares/scheme/horariosScheme.js";
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router()

router.get("/GETdia_seamana", verificarToken, verificarNivel(['admin', 'profesor']), get_dia_semana)

router.get("/GETdia_seamana/:id", verificarToken, verificarNivel(['admin', 'profesor']), get_dia_seamana_id)

router.post("/POSTdia_semana", verificarToken, verificarNivel(['admin']), validate(DiasSemana), insert_dia_seamana)

router.put("/PUTdia_semana/:id", verificarToken, verificarNivel(['admin']), validate(DiasSemana), update_dia_semana)

router.delete("/DELETEdia_semana/:id", verificarToken, verificarNivel(['admin']), delete_dia_semana)

export default router;