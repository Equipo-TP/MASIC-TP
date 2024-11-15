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

// Esquema para la solicitud
export const solicitudSchema = z.object({
  caracteristicas_obra: z.string().min(1, { message: 'Características de obra obligatorios' }),
  descripcion_servicio: z.string().min(1, { message: 'Descripción de servicio obligatorio' }),
  observaciones: z.string().optional(),
  direccion: z.string().min(1, { message: 'La dirección es obligatoria' }).regex(/^[a-zA-Z0-9\s.,#-/]+$/, {
    message: "La dirección contiene caracteres inválidos.",
  }),
  distrito: z.string().min(1, { message: 'El distrito es obligatorio' }).regex(/^[a-zA-Z\s]+$/, {
    message: "El distrito debe contener solo letras y espacios.",
  }),
  imagenes: z.array(z.string()).optional(), // Array de imágenes en formato Base64
});

// Esquema para los datos de un nuevo cliente
export const nuevoClienteSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es obligatorio' }).regex(/^[A-Za-z\s]+$/, {
    message: "El nombre solo puede contener letras y espacios",
  }),
  apellidos: z.string().regex(/^[A-Za-z\s]+$/, {
    message: "El apellido solo puede contener letras y espacios",
  }).optional(),
  tipo: z.enum(['Persona Natural', 'Empresa']), // Enum para validar el tipo de cliente
  ruc: z.string().regex(/^\d{8}$|^\d{11}$/, {
    message: "Debe ser un DNI de 8 dígitos o un RUC de 11 dígitos",
  }).optional(),
  email: z.string().email({ message: 'El formato del email es incorrecto' }),
  telefono: z.string().regex(/^9\d{8}$/, {
    message: "Debe ser un número de teléfono válido de 9 dígitos que comience con 9",
  })
});

// Esquema de validación para "presupuesto"
export const presupuestoSchema = z.object({
  Tiempo: z.date().optional(), // Fecha opcional
  Transporte_Personal: z.string().min(1, { message: 'El transporte personal es obligatorio' }), // Campo requerido con al menos un carácter
  instalaciones: z.array(
    z.object({
      tipo_luminaria: z.string().min(1, { message: 'El tipo de luminaria es obligatorio' }), // ID como string
      cantidad: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }).max(99, { message: 'La cantidad no puede ser mayor a 99' }), // Campo numérico requerido
      costo_total: z.number().optional(), // Campo opcional
    })
  ).min(1, { message: 'Debe haber al menos una instalación' }), // Al menos un elemento en el array
  Materiales: z.string().min(1, { message: 'Los materiales son obligatorios' }), // Campo requerido
  Costo_Materiales: z.number().min(1, { message: 'El costo de materiales debe ser un número positivo' }), // Campo numérico requerido
  Costo_Transporte: z.number().min(1, { message: 'El costo de transporte debe ser un número positivo' }), // Campo numérico requerido
  Sub_Neto: z.number().optional(), // Campo opcional
  Pago_Total: z.number().optional(), // Campo opcional
});

