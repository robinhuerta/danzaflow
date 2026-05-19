import React, { useState } from 'react';
import type { Student } from '../types';

interface ReceiptModalProps {
  student: Student;
  quotaType: 'Cuota 1' | 'Cuota 2';
  paymentNumber: 1 | 2;
  amount: number;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  student,
  quotaType,
  paymentNumber,
  amount,
  onClose
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'Yape' | 'Plin' | 'Transferencia' | 'Efectivo'>('Yape');
  const [receiptNumber] = useState(() => `REC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [currentDate] = useState(() => new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }));

  // Calculations for WhatsApp text
  const conceptName = `${quotaType} - Abono ${paymentNumber}`;
  const totalPaidSoFar = student.total_pagado;
  const remainingDebt = student.deuda_actual;
  const hasWonPolo = student.premio_polo === '¡GANÓ POLO!';
  
  // Format WhatsApp message
  const handleShareWhatsApp = () => {
    const phoneClean = student.telefono.replace(/\s+/g, '');
    // Peruvian country code is +51. If number starts with 9, add 51
    const finalPhone = phoneClean.startsWith('9') ? `51${phoneClean}` : phoneClean;
    
    let poloMessage = '';
    if (hasWonPolo) {
      poloMessage = `\n\n👕 *¡Felicidades! Has ganado tu Polo Institucional Oficial* 🎉\nTalla registrada: *${student.talla_polo || 'Pendiente por definir'}*.\n${student.polo_entregado ? 'Estado: *Entregado*' : 'Puedes reclamarlo en recepción en tu próxima clase. 🎁'}`;
    }

    const message = `*RECIBO DIGITAL - ACADEMIA DANZA & ESTILO* 💃✨

Estimado(a) *${student.integrante}*, te enviamos la confirmación de tu pago:

📄 *N° Recibo:* ${receiptNumber}
📅 *Fecha:* ${new Date().toLocaleDateString('es-PE')}
📌 *Concepto:* ${conceptName}
💰 *Monto:* S/. ${amount.toFixed(2)}
📱 *Medio de Pago:* ${paymentMethod === 'Yape' ? '⚡ YAPE' : paymentMethod}

-------------------------------
📊 *Estado de Cuenta:*
Total Abonado: S/. ${totalPaidSoFar.toFixed(2)}
Deuda Restante: S/. ${remainingDebt.toFixed(2)}
Sede: ${student.sede}
-------------------------------${poloMessage}

¡Gracias por bailar con nosotros y ser parte de nuestra familia! 💜🎶`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ maxWidth: '500px' }}>
        <button className="modal-close no-print" onClick={onClose}>&times;</button>
        
        <h2 className="no-print" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem', color: 'white' }}>
          Emisión de Recibo Digital
        </h2>
        <p className="no-print" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Configure el método de pago e imprima o envíe el recibo por WhatsApp.
        </p>

        {/* Configuration Bar */}
        <div className="form-group no-print">
          <label>Método de Pago (Predeterminado: Yape)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {(['Yape', 'Plin', 'Transferencia', 'Efectivo'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`btn ${paymentMethod === method ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.8rem',
                  background: paymentMethod === method && method === 'Yape' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : undefined,
                  boxShadow: paymentMethod === method && method === 'Yape' ? '0 0 10px rgba(124, 58, 237, 0.4)' : undefined,
                  border: paymentMethod === method && method === 'Yape' ? '1px solid #c084fc' : undefined
                }}
              >
                {method === 'Yape' ? '⚡ Yape' : method}
              </button>
            ))}
          </div>
        </div>

        {/* The Printable Ticket */}
        <div className="receipt-ticket-wrapper">
          <div className="receipt-header">
            <div className="receipt-logo">D</div>
            <h3>ACADEMIA DANZA & ESTILO</h3>
            <p>RUC: 10452395821<br />Calle Las Danzas 450, Lima<br />Telf: 987 654 321</p>
          </div>

          <div className="receipt-metadata">
            <span>N°: <strong>{receiptNumber}</strong></span>
            <span>{currentDate}</span>
          </div>

          <div className="receipt-body">
            <div className="receipt-row">
              <span className="receipt-row-label">Estudiante:</span>
              <span className="receipt-row-value">{student.integrante}</span>
            </div>
            
            {student.telefono && (
              <div className="receipt-row">
                <span className="receipt-row-label">Teléfono:</span>
                <span className="receipt-row-value">{student.telefono}</span>
              </div>
            )}

            <div className="receipt-row">
              <span className="receipt-row-label">Sede:</span>
              <span className="receipt-row-value">{student.sede}</span>
            </div>

            <div style={{ margin: '0.5rem 0', borderBottom: '1px dashed #cbd5e1' }} />

            <div className="receipt-row">
              <span className="receipt-row-label">Concepto:</span>
              <span className="receipt-row-value">{conceptName}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">Método de Pago:</span>
              <span className="receipt-row-value" style={{ 
                color: paymentMethod === 'Yape' ? '#7c3aed' : '#0f172a',
                fontWeight: paymentMethod === 'Yape' ? 700 : 600
              }}>
                {paymentMethod === 'Yape' ? '⚡ YAPE' : paymentMethod}
              </span>
            </div>

            <div className="receipt-amount-box">
              S/. {amount.toFixed(2)}
            </div>

            <div style={{ margin: '0.5rem 0', borderBottom: '1px dashed #cbd5e1' }} />

            <div className="receipt-row">
              <span className="receipt-row-label">Total Abonado:</span>
              <span className="receipt-row-value">S/. {totalPaidSoFar.toFixed(2)}</span>
            </div>

            <div className="receipt-row">
              <span className="receipt-row-label">Deuda Pendiente:</span>
              <span className="receipt-row-value" style={{ color: remainingDebt > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                S/. {remainingDebt.toFixed(2)}
              </span>
            </div>

            {hasWonPolo && (
              <div className="receipt-polo-banner">
                🎁 ¡GANÓ POLO INSTITUCIONAL! {student.talla_polo && `Talla: ${student.talla_polo}`}
                <div style={{ fontSize: '0.75rem', fontWeight: 500, marginTop: '2px', color: '#be185d' }}>
                  {student.polo_entregado ? '✓ Entrega Realizada' : '⌛ Pendiente de Entrega en Recepción'}
                </div>
              </div>
            )}
          </div>

          <div className="receipt-footer">
            <div className="receipt-qr-sim">QR</div>
            <p>¡Gracias por tu pago y confianza!<br />Baila, sueña y disfruta cada paso.</p>
          </div>
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }} className="no-print">
          <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Imprimir / Guardar PDF
          </button>
          
          <button 
            onClick={handleShareWhatsApp} 
            className="btn btn-success" 
            disabled={!student.telefono}
            style={{ 
              flex: 1, 
              opacity: student.telefono ? 1 : 0.6,
              cursor: student.telefono ? 'pointer' : 'not-allowed'
            }}
            title={student.telefono ? 'Compartir por WhatsApp' : 'El alumno no cuenta con teléfono registrado'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
