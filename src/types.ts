export interface Payment {
  abono_1: number;
  abono_2: number;
  fecha: string; // Formato YYYY-MM-DD
  fecha_vencimiento?: string; // Fecha límite de pago YYYY-MM-DD
  estado: 'Liquidado' | 'En Acuentas' | 'Pendiente';
}

export interface Student {
  id: number;
  integrante: string;
  telefono: string;
  sede: string;
  talla_polo: string; // 'XS' | 'S' | 'M' | 'L' | 'XL' | ''
  c1: Payment;
  c2: Payment;
  total_pagado: number;
  deuda_actual: number;
  estado_financiero: 'LIQUIDADO' | 'EN ACUENTAS' | 'DEUDA TOTAL';
  premio_polo: '¡GANÓ POLO!' | 'NO GANÓ';
  polo_entregado: boolean; // Si ya se le entregó físicamente
  fecha_entrega_polo?: string; // Fecha de entrega física del polo
}

export interface PaymentReceipt {
  id: string; // Formato REC-XXXXXX
  studentId: number;
  studentName: string;
  sede: string;
  quotaType: 'Cuota 1' | 'Cuota 2';
  paymentNumber: 1 | 2; // Abono 1 o Abono 2
  amount: number;
  date: string;
  paymentMethod: 'Yape' | 'Plin' | 'Transferencia' | 'Efectivo';
  poloStatus: '¡GANÓ POLO!' | 'NO GANÓ';
  poloTalla: string;
}
