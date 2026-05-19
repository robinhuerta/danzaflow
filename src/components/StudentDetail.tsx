import React, { useState, useEffect } from 'react';
import type { Student } from '../types';

interface StudentDetailProps {
  student: Student;
  onSave: (updatedStudent: Student) => void;
  onClose: () => void;
  onEmitReceipt: (student: Student, quotaType: 'Cuota 1' | 'Cuota 2', paymentNumber: 1 | 2, amount: number) => void;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({
  student,
  onSave,
  onClose,
  onEmitReceipt
}) => {
  // Local state for forms
  const [integrante, setIntegrante] = useState(student.integrante);
  const [telefono, setTelefono] = useState(student.telefono);
  const [sede, setSede] = useState(student.sede);
  const [tallaPolo, setTallaPolo] = useState(student.talla_polo);
  
  // Quota 1 Local State
  const [c1Abono1, setC1Abono1] = useState(student.c1.abono_1);
  const [c1Abono2, setC1Abono2] = useState(student.c1.abono_2);
  const [c1Fecha, setC1Fecha] = useState(student.c1.fecha);
  
  // Quota 2 Local State
  const [c2Abono1, setC2Abono1] = useState(student.c2.abono_1);
  const [c2Abono2, setC2Abono2] = useState(student.c2.abono_2);
  const [c2Fecha, setC2Fecha] = useState(student.c2.fecha);

  // Polo Delivery Local State
  const [poloEntregado, setPoloEntregado] = useState(student.polo_entregado);
  const [fechaEntregaPolo, setFechaEntregaPolo] = useState(student.fecha_entrega_polo || '');

  // Keep track of student changing (reset form values if student id changes)
  useEffect(() => {
    setIntegrante(student.integrante);
    setTelefono(student.telefono);
    setSede(student.sede);
    setTallaPolo(student.talla_polo);
    
    setC1Abono1(student.c1.abono_1);
    setC1Abono2(student.c1.abono_2);
    setC1Fecha(student.c1.fecha);
    
    setC2Abono1(student.c2.abono_1);
    setC2Abono2(student.c2.abono_2);
    setC2Fecha(student.c2.fecha);

    setPoloEntregado(student.polo_entregado);
    setFechaEntregaPolo(student.fecha_entrega_polo || '');
  }, [student]);

  // Handle auto-calculation and saving
  const handleSave = () => {
    // 1. Calculate totals
    const sumC1 = c1Abono1 + c1Abono2;
    const sumC2 = c2Abono1 + c2Abono2;
    const totalPagado = sumC1 + sumC2;
    const totalQuotaCost = 300; // S/. 150 + S/. 150
    const deudaActual = Math.max(0, totalQuotaCost - totalPagado);

    // 2. Automate quota statuses
    const c1Estado = sumC1 >= 150 ? 'Liquidado' : sumC1 > 0 ? 'En Acuentas' : 'Pendiente';
    const c2Estado = sumC2 >= 150 ? 'Liquidado' : sumC2 > 0 ? 'En Acuentas' : 'Pendiente';

    // 3. Automate overall financial status
    let estadoFinanciero: 'LIQUIDADO' | 'EN ACUENTAS' | 'DEUDA TOTAL' = 'DEUDA TOTAL';
    if (totalPagado >= totalQuotaCost) {
      estadoFinanciero = 'LIQUIDADO';
    } else if (totalPagado > 0) {
      estadoFinanciero = 'EN ACUENTAS';
    }

    // 4. Polo Prize status (Qualified if they paid at least 150)
    const premioPolo = totalPagado >= 150 ? '¡GANÓ POLO!' : 'NO GANÓ';
    
    // Auto-adjust polo delivery status
    let finalPoloEntregado = poloEntregado;
    let finalFechaEntregaPolo = fechaEntregaPolo;
    if (premioPolo === 'NO GANÓ') {
      finalPoloEntregado = false;
      finalFechaEntregaPolo = '';
    }

    // Assemble updated student object
    const updatedStudent: Student = {
      ...student,
      integrante,
      telefono,
      sede,
      talla_polo: tallaPolo,
      c1: {
        abono_1: c1Abono1,
        abono_2: c1Abono2,
        fecha: c1Fecha,
        estado: c1Estado
      },
      c2: {
        abono_1: c2Abono1,
        abono_2: c2Abono2,
        fecha: c2Fecha,
        estado: c2Estado
      },
      total_pagado: totalPagado,
      deuda_actual: deudaActual,
      estado_financiero: estadoFinanciero,
      premio_polo: premioPolo,
      polo_entregado: finalPoloEntregado,
      fecha_entrega_polo: finalPoloEntregado ? finalFechaEntregaPolo : undefined
    };

    onSave(updatedStudent);
  };

  // Perform a quick delivery of the polo
  const deliverPoloNow = () => {
    const today = new Date().toISOString().split('T')[0];
    setPoloEntregado(true);
    setFechaEntregaPolo(today);
    
    // Construct immediately and trigger save
    const sumC1 = c1Abono1 + c1Abono2;
    const sumC2 = c2Abono1 + c2Abono2;
    const totalPagado = sumC1 + sumC2;
    const totalQuotaCost = 300;
    const deudaActual = Math.max(0, totalQuotaCost - totalPagado);
    const c1Estado = sumC1 >= 150 ? 'Liquidado' : sumC1 > 0 ? 'En Acuentas' : 'Pendiente';
    const c2Estado = sumC2 >= 150 ? 'Liquidado' : sumC2 > 0 ? 'En Acuentas' : 'Pendiente';
    let estadoFinanciero: 'LIQUIDADO' | 'EN ACUENTAS' | 'DEUDA TOTAL' = 'DEUDA TOTAL';
    if (totalPagado >= totalQuotaCost) estadoFinanciero = 'LIQUIDADO';
    else if (totalPagado > 0) estadoFinanciero = 'EN ACUENTAS';
    
    const premioPolo = totalPagado >= 150 ? '¡GANÓ POLO!' : 'NO GANÓ';

    const updatedStudent: Student = {
      ...student,
      integrante,
      telefono,
      sede,
      talla_polo: tallaPolo || 'M', // Default to M if empty
      c1: {
        abono_1: c1Abono1,
        abono_2: c1Abono2,
        fecha: c1Fecha,
        estado: c1Estado
      },
      c2: {
        abono_1: c2Abono1,
        abono_2: c2Abono2,
        fecha: c2Fecha,
        estado: c2Estado
      },
      total_pagado: totalPagado,
      deuda_actual: deudaActual,
      estado_financiero: estadoFinanciero,
      premio_polo: premioPolo,
      polo_entregado: true,
      fecha_entrega_polo: today
    };

    onSave(updatedStudent);
  };

  // Instant calculated preview
  const previewTotalPaid = c1Abono1 + c1Abono2 + c2Abono1 + c2Abono2;
  const previewDebt = Math.max(0, 300 - previewTotalPaid);
  const qualifiesForPolo = previewTotalPaid >= 150;

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {/* Profile Card Header */}
        <div className="student-profile-header">
          <div className="student-avatar">
            {integrante.charAt(0).toUpperCase()}
          </div>
          <div className="student-profile-info" style={{ flex: 1 }}>
            <h2>{integrante || 'Nuevo Estudiante'}</h2>
            <div className="student-profile-meta">
              <span>📍 {sede}</span>
              {telefono && <span>📞 {telefono}</span>}
              <span>ID: #{student.id}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
            <span className={`badge ${
              previewTotalPaid >= 300 ? 'badge-liquidado' : previewTotalPaid > 0 ? 'badge-en-acuentas' : 'badge-deuda-total'
            }`}>
              {previewTotalPaid >= 300 ? 'Liquidado' : previewTotalPaid > 0 ? 'En Cuentas' : 'Deuda Total'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Pagado: <strong>S/. {previewTotalPaid}</strong> / Deuda: <strong style={{ color: previewDebt > 0 ? '#ff8e8e' : '#10b981' }}>S/. {previewDebt}</strong>
            </span>
          </div>
        </div>

        {/* Edit Demographics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label>Nombre del Integrante</label>
            <input 
              type="text" 
              className="input-control" 
              value={integrante} 
              onChange={(e) => setIntegrante(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Teléfono (WhatsApp)</label>
            <input 
              type="text" 
              className="input-control" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Sede</label>
            <select 
              className="input-control" 
              value={sede} 
              onChange={(e) => setSede(e.target.value)}
            >
              <option value="Santa Anita - Varones">Santa Anita - Varones</option>
              <option value="Santa Anita - Mujeres">Santa Anita - Mujeres</option>
              <option value="San Miguel">San Miguel</option>
            </select>
          </div>
        </div>

        {/* Quotas Matrix */}
        <div className="payments-grid">
          {/* CUOTA 1 */}
          <div className="payment-card">
            <div className="payment-card-title">
              <span>Cuota 1 (S/. 150.00)</span>
              <span className={`badge ${c1Abono1 + c1Abono2 >= 150 ? 'badge-liquidado' : c1Abono1 + c1Abono2 > 0 ? 'badge-en-acuentas' : 'badge-deuda-total'}`}>
                {c1Abono1 + c1Abono2 >= 150 ? 'Liquidado' : c1Abono1 + c1Abono2 > 0 ? 'En Cuentas' : 'Pendiente'}
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Abono 1 (S/.)</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="input-control" 
                    value={c1Abono1 || ''} 
                    onChange={(e) => setC1Abono1(Number(e.target.value))} 
                    style={{ flex: 1 }}
                  />
                  {c1Abono1 > 0 && (
                    <button 
                      onClick={() => onEmitReceipt(student, 'Cuota 1', 1, c1Abono1)} 
                      className="btn btn-secondary btn-icon"
                      title="Emitir Recibo Abono 1"
                    >
                      📄
                    </button>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Abono 2 (S/.)</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="input-control" 
                    value={c1Abono2 || ''} 
                    onChange={(e) => setC1Abono2(Number(e.target.value))} 
                    style={{ flex: 1 }}
                  />
                  {c1Abono2 > 0 && (
                    <button 
                      onClick={() => onEmitReceipt(student, 'Cuota 1', 2, c1Abono2)} 
                      className="btn btn-secondary btn-icon"
                      title="Emitir Recibo Abono 2"
                    >
                      📄
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Fecha de Pago</label>
              <input 
                type="date" 
                className="input-control" 
                value={c1Fecha} 
                onChange={(e) => setC1Fecha(e.target.value)} 
              />
            </div>
          </div>

          {/* CUOTA 2 */}
          <div className="payment-card">
            <div className="payment-card-title">
              <span>Cuota 2 (S/. 150.00)</span>
              <span className={`badge ${c2Abono1 + c2Abono2 >= 150 ? 'badge-liquidado' : c2Abono1 + c2Abono2 > 0 ? 'badge-en-acuentas' : 'badge-deuda-total'}`}>
                {c2Abono1 + c2Abono2 >= 150 ? 'Liquidado' : c2Abono1 + c2Abono2 > 0 ? 'En Cuentas' : 'Pendiente'}
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Abono 1 (S/.)</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="input-control" 
                    value={c2Abono1 || ''} 
                    onChange={(e) => setC2Abono1(Number(e.target.value))} 
                    style={{ flex: 1 }}
                  />
                  {c2Abono1 > 0 && (
                    <button 
                      onClick={() => onEmitReceipt(student, 'Cuota 2', 1, c2Abono1)} 
                      className="btn btn-secondary btn-icon"
                      title="Emitir Recibo Abono 1"
                    >
                      📄
                    </button>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Abono 2 (S/.)</label>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <input 
                    type="number" 
                    className="input-control" 
                    value={c2Abono2 || ''} 
                    onChange={(e) => setC2Abono2(Number(e.target.value))} 
                    style={{ flex: 1 }}
                  />
                  {c2Abono2 > 0 && (
                    <button 
                      onClick={() => onEmitReceipt(student, 'Cuota 2', 2, c2Abono2)} 
                      className="btn btn-secondary btn-icon"
                      title="Emitir Recibo Abono 2"
                    >
                      📄
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Fecha de Pago</label>
              <input 
                type="date" 
                className="input-control" 
                value={c2Fecha} 
                onChange={(e) => setC2Fecha(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* POLO STATUS & TRACKING */}
        <div className="polo-prize-box">
          <div className="polo-box-header">
            <div className="polo-box-title">
              <span className="polo-icon">👕</span>
              <span>Premio Polo de la Institución</span>
            </div>
            
            {qualifiesForPolo ? (
              <span className="badge badge-polo-si">★ ¡CALIFICA AL POLO!</span>
            ) : (
              <span className="badge badge-polo-no">No califica aún (Debe abonar S/. 150 o más)</span>
            )}
          </div>

          {qualifiesForPolo && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                ¡Excelente! El estudiante ya abonó más de S/. 150.00 en total. Asigne una talla y registre la entrega física.
              </p>

              <div className="polo-delivery-actions">
                {/* Size Selector */}
                <div className="form-group" style={{ marginBottom: 0, minWidth: '120px' }}>
                  <label style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Talla del Polo</label>
                  <select 
                    className="input-control" 
                    value={tallaPolo} 
                    onChange={(e) => setTallaPolo(e.target.value)}
                    style={{ background: 'rgba(0, 0, 0, 0.3)', borderColor: 'rgba(255, 79, 168, 0.3)' }}
                  >
                    <option value="">Definir Talla...</option>
                    <option value="XS">Talla XS</option>
                    <option value="S">Talla S</option>
                    <option value="M">Talla M</option>
                    <option value="L">Talla L</option>
                    <option value="XL">Talla XL</option>
                  </select>
                </div>

                {/* Delivery Toggle Button */}
                {poloEntregado ? (
                  <div className="polo-delivery-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Entregado el {fechaEntregaPolo || 'Recientemente'}
                    <button 
                      onClick={() => setPoloEntregado(false)} 
                      style={{ 
                        marginLeft: '0.5rem', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'rgba(255,255,255,0.4)', 
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                      title="Revertir entrega"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={deliverPoloNow} 
                    className="btn btn-primary"
                    style={{ 
                      background: 'linear-gradient(135deg, #ff4fa8, #9f5ffd)',
                      boxShadow: '0 0 15px rgba(255, 79, 168, 0.4)',
                      padding: '0.75rem 1.5rem'
                    }}
                  >
                    🎁 Registrar Entrega de Polo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSave} className="btn btn-primary" style={{ minWidth: '120px' }}>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};
