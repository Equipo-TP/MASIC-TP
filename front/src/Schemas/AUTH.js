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

