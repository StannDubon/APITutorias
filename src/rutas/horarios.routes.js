import { Router } from "express";
import {getHoraio,getHoraioId,updateHorario,insertHorario,deleteHorario} from "../controladores/horarios.js"
import { validate } from "../middlewares/validacion.js";
import { Horarios } from "../middlewares/scheme/horariosScheme.js";

const router = Router() 
//
router.get("/GEThorarios", getHoraio) //CONVERTIR HORARIOS A FORMATO A LA HORA DE PROGRAMAR

router.get("/GEThorarios/:id", getHoraioId)//CONVERTIR HORARIOS A FORMATO A LA HORA DE PROGRAMAR

router.put("/PUThorarios/:id", validate(Horarios), updateHorario)

router.post("/POSThorarios", validate(Horarios), insertHorario)

router.delete("/DELETEhorarios/:id", deleteHorario)


export default router;

