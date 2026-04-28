import { Pais } from "./pais";
import { Provincia } from "./provincia";

export interface Persona {
    id?: number;
    nombre: string;
    apellido: string;
    edad: number;
    pais: Pais;
    provincia: Provincia;
}
