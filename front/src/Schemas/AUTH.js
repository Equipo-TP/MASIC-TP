import { colors } from "@mui/material";
import {z}   from "zod";
// Esquema para el inicio de sesión
export const loginSchema = z.object({
    email: z.string()
    .min(1, { message: 'No ha ingresado el email' }) // El email no puede estar vacío
    .email({ message: 'El formato del email es incorrecto, debe contener un @ y un dominio.' }), // Validar formato de email
   
  password: z.string()
    .min(1, { message: 'No ha ingresado la contraseña' }) // La contraseña no puede estar vacía
    .min(6, { message: 'La contraseña es incorrecta' }) // Validar longitud mínima de la contraseña
});

export const presupuestoSchema = z.object({
    Transporte_Personal: z
    .string()
    .min(1, { message: "El campo transporte personal es obligatorio." }).min(1)
    .refine(
      (value) => value.trim().length > 0,
      { message: "El campo transporte personal no puede estar vacío o solo tener espacios." }
    ).refine(
      (value) => /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(value),
      { message: "El campo transporte personal solo debe tener letras." }
    ),

    instalaciones: z.array(
      z.object({
        cantidad: z
        .number()
        .min(1, { message: "La cantidad debe ser al menos 1." })
        .int({ message: "La cantidad debe ser un número entero." }),
      })
    ),

    Materiales: z
    .string()
    .min(1, { message: "El campo de materiales es obligatorio." }).min(1)
    .refine(
      (value) => value.trim().length > 0,
      { message: "El material no puede estar vacío o solo tener espacios." }
    ).refine(
      (value) => !/^\d+$/.test(value),
      { message: "El campo materiales no puede contener solo números." }
    ),
    
    Costo_Materiales: z.number().min(1, { message: "El costo de materiales debe ser un valor positivo." }),
    Costo_Transporte: z.number().min(1, { message: "El costo de transporte debe ser un valor positivo." })
});
