import { Router } from "express";
import {getHoraio,getHoraioId,updateHorario,insertHorario,deleteHorario} from "../controladores/horarios.js"
import { validate } from "../middlewares/validacion.js";
import {verificarToken, verificarNivel} from "../middlewares/authMiddleware.js"
const router = Router() 
//
router.get("/GEThorarios", verificarToken, verificarNivel(['admin', 'profesor']), getHoraio) //CONVERTIR HORARIOS A FORMATO A LA HORA DE PROGRAMAR

router.get("/GEThorarios/:id", verificarToken, verificarNivel(['admin', 'profesor']), getHoraioId)//CONVERTIR HORARIOS A FORMATO A LA HORA DE PROGRAMAR

router.put("/PUThorarios/:id", verificarToken, verificarNivel(['admin']), updateHorario)

router.post("/POSThorarios", verificarToken, verificarNivel(['admin']), insertHorario)

router.delete("/DELETEhorarios/:id", verificarToken, verificarNivel(['admin']), deleteHorario)


export default router;

