import { Router } from "express";
import {getHoraio,getHoraioId,updateHorario,insertHorario,deleteHorario} from "../controladores/horarios.js"

const router = Router() 
//
router.get("/GEThorarios", getHoraio) //CONVERTIR HORARIOS A FORMATO A LA HORA DE PROGRAMAR

router.get("/GEThorarios/:id", getHoraioId)//CONVERTIR HORARIOS A FORMATO A LA HORA DE PROGRAMAR

router.put("/PUThorarios/:id", updateHorario)

router.post("/POSThorarios", insertHorario)

router.delete("/DELETEhorarios/:id", deleteHorario)


export default router;

