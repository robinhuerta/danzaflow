import type { Student } from './types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    integrante: 'Alexander Cahuana',
    telefono: '990523793',
    sede: 'Santa Anita - Varones',
    talla_polo: 'M',
    c1: {
      abono_1: 150,
      abono_2: 0,
      fecha: '2026-05-01',
      estado: 'Liquidado'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 150,
    deuda_actual: 150,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: false
  },
  {
    id: 2,
    integrante: 'Albert Diaz',
    telefono: '934582413',
    sede: 'Santa Anita - Varones',
    talla_polo: '',
    c1: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 0,
    deuda_actual: 300,
    estado_financiero: 'DEUDA TOTAL',
    premio_polo: 'NO GANÓ',
    polo_entregado: false
  },
  {
    id: 3,
    integrante: 'Alonso Llauce',
    telefono: '940755194',
    sede: 'Santa Anita - Varones',
    talla_polo: 'S',
    c1: {
      abono_1: 150,
      abono_2: 100,
      fecha: '2026-05-05',
      estado: 'Liquidado'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 250,
    deuda_actual: 50,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: false
  },
  {
    id: 4,
    integrante: 'Amir',
    telefono: '980088691',
    sede: 'Santa Anita - Varones',
    talla_polo: 'S',
    c1: {
      abono_1: 70,
      abono_2: 0,
      fecha: '2026-05-01',
      estado: 'En Acuentas'
    },
    c2: {
      abono_1: 80,
      abono_2: 0,
      fecha: '2026-06-15',
      estado: 'Liquidado'
    },
    total_pagado: 150,
    deuda_actual: 150,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: true,
    fecha_entrega_polo: '2026-06-16'
  },
  {
    id: 5,
    integrante: 'Angel Rivas',
    telefono: '963039563',
    sede: 'Santa Anita - Varones',
    talla_polo: '',
    c1: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 0,
    deuda_actual: 300,
    estado_financiero: 'DEUDA TOTAL',
    premio_polo: 'NO GANÓ',
    polo_entregado: false
  },
  {
    id: 6,
    integrante: 'Antonella',
    telefono: '940071250',
    sede: 'Santa Anita - Mujeres',
    talla_polo: 'S',
    c1: {
      abono_1: 150,
      abono_2: 0,
      fecha: '2026-05-10',
      estado: 'Liquidado'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 150,
    deuda_actual: 150,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: false
  },
  {
    id: 7,
    integrante: 'Belinda',
    telefono: '921493248',
    sede: 'Santa Anita - Mujeres',
    talla_polo: '',
    c1: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 0,
    deuda_actual: 300,
    estado_financiero: 'DEUDA TOTAL',
    premio_polo: 'NO GANÓ',
    polo_entregado: false
  },
  {
    id: 8,
    integrante: 'Marielita',
    telefono: '989729776',
    sede: 'Santa Anita - Mujeres',
    talla_polo: 'XS',
    c1: {
      abono_1: 150,
      abono_2: 0,
      fecha: '2026-06-03',
      estado: 'Liquidado'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 150,
    deuda_actual: 150,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: false
  },
  {
    id: 9,
    integrante: 'Keila Contreras',
    telefono: '',
    sede: 'San Miguel',
    talla_polo: 'M',
    c1: {
      abono_1: 150,
      abono_2: 0,
      fecha: '2026-05-15',
      estado: 'Liquidado'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 150,
    deuda_actual: 150,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: true,
    fecha_entrega_polo: '2026-05-18'
  },
  {
    id: 10,
    integrante: 'Jhonatan',
    telefono: '',
    sede: 'San Miguel',
    talla_polo: 'L',
    c1: {
      abono_1: 150,
      abono_2: 0,
      fecha: '2026-05-15',
      estado: 'Liquidado'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 150,
    deuda_actual: 150,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: false
  },
  {
    id: 11,
    integrante: 'Renzo',
    telefono: '',
    sede: 'San Miguel',
    talla_polo: 'L',
    c1: {
      abono_1: 150,
      abono_2: 0,
      fecha: '2026-05-11',
      estado: 'Liquidado'
    },
    c2: {
      abono_1: 0,
      abono_2: 0,
      fecha: '',
      estado: 'Pendiente'
    },
    total_pagado: 150,
    deuda_actual: 150,
    estado_financiero: 'EN ACUENTAS',
    premio_polo: '¡GANÓ POLO!',
    polo_entregado: false
  }
];
