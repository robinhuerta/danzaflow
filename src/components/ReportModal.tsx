import React from 'react';
import type { Student } from '../types';

interface ReportModalProps {
  students: Student[];
  onClose: () => void;
}

const SEDES = ['Santa Anita', 'San Miguel', 'San Borja'];

const semaforo = (estado: Student['estado_financiero']) => {
  if (estado === 'LIQUIDADO')   return { color: '#166534', bg: '#dcfce7', dot: '#22c55e', label: 'PAGADO' };
  if (estado === 'EN ACUENTAS') return { color: '#92400e', bg: '#fef3c7', dot: '#f59e0b', label: 'EN PROCESO' };
  return { color: '#991b1b', bg: '#fee2e2', dot: '#ef4444', label: 'SIN ABONAR' };
};

const estadoOrder = { 'DEUDA TOTAL': 0, 'EN ACUENTAS': 1, 'LIQUIDADO': 2 };

const CuotaBadge: React.FC<{ suma: number; vencimiento?: string }> = ({ suma, vencimiento }) => {
  const vencida = vencimiento && new Date(vencimiento) < new Date() && suma < 75;
  if (suma >= 75) return <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.78rem' }}>🟢 Pagado</span>;
  if (suma > 0)   return <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.78rem' }}>🟡 Parcial{vencida ? ' ⚠️' : ''}</span>;
  return <span style={{ color: vencida ? '#dc2626' : '#94a3b8', fontWeight: vencida ? 700 : 400, fontSize: '0.78rem' }}>{vencida ? '🔴 Vencida' : '🔴 Pendiente'}</span>;
};

const th: React.CSSProperties = {
  padding: '0.45rem 0.6rem', textAlign: 'left', fontWeight: 700,
  fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em'
};
const td: React.CSSProperties = { padding: '0.4rem 0.6rem', verticalAlign: 'middle' };

export const ReportModal: React.FC<ReportModalProps> = ({ students, onClose }) => {
  const today = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

  const liquidados = students.filter(s => s.estado_financiero === 'LIQUIDADO').length;
  const enCuentas  = students.filter(s => s.estado_financiero === 'EN ACUENTAS').length;
  const sinAbonar  = students.filter(s => s.estado_financiero === 'DEUDA TOTAL').length;

  return (
    <div className="modal-overlay">
      <div
        className="glass-panel modal-content"
        style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Controles — no se imprimen */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'white', margin: 0 }}>
              📋 Reporte por Sedes
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>{today}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => window.print()} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
              🖨️ Imprimir / PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>✕</button>
          </div>
        </div>

        {/* ── ÁREA IMPRIMIBLE ── */}
        <div id="report-print-area">

          {/* Cabecera */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>PERU INKA</h1>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.2rem 0 0' }}>
              Relación de Alumnos por Sede — {today}
            </p>
          </div>

          {/* Resumen de semáforo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Total Alumnos', value: students.length, color: '#1e40af', bg: '#eff6ff' },
              { label: '🟢 Pagados',    value: liquidados,       color: '#166534', bg: '#dcfce7' },
              { label: '🟡 En Proceso', value: enCuentas,        color: '#92400e', bg: '#fef3c7' },
              { label: '🔴 Sin Abonar', value: sinAbonar,        color: '#991b1b', bg: '#fee2e2' },
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.bg, borderRadius: 8, padding: '0.6rem', textAlign: 'center', border: `1px solid ${stat.color}30` }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.68rem', color: stat.color, fontWeight: 600 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tablas por sede */}
          {SEDES.map(sede => {
            const lista = students
              .filter(s => s.sede === sede)
              .sort((a, b) => estadoOrder[a.estado_financiero] - estadoOrder[b.estado_financiero]);

            if (lista.length === 0) return null;

            const pagados   = lista.filter(s => s.estado_financiero === 'LIQUIDADO').length;
            const proceso   = lista.filter(s => s.estado_financiero === 'EN ACUENTAS').length;
            const sinPago   = lista.filter(s => s.estado_financiero === 'DEUDA TOTAL').length;

            return (
              <div key={sede} style={{ marginBottom: '1.75rem', pageBreakInside: 'avoid' }}>
                {/* Cabecera de sede */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', color: 'white', borderRadius: '6px 6px 0 0', padding: '0.5rem 0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>📍 {sede}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                    {lista.length} alumno{lista.length !== 1 ? 's' : ''} &nbsp;|&nbsp;
                    🟢 {pagados} &nbsp; 🟡 {proceso} &nbsp; 🔴 {sinPago}
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', color: '#0f172a', border: '1px solid #e2e8f0', borderTop: 'none' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={th}>#</th>
                      <th style={th}>Alumno</th>
                      <th style={{ ...th, textAlign: 'center' }}>Cuota 1</th>
                      <th style={{ ...th, textAlign: 'center' }}>Cuota 2</th>
                      <th style={{ ...th, textAlign: 'center' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((s, i) => {
                      const sem  = semaforo(s.estado_financiero);
                      const c1   = s.c1.abono_1 + s.c1.abono_2;
                      const c2   = s.c2.abono_1 + s.c2.abono_2;
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                          <td style={{ ...td, color: '#94a3b8', width: 30 }}>{i + 1}</td>
                          <td style={{ ...td, fontWeight: 600 }}>{s.integrante || '—'}</td>
                          <td style={{ ...td, textAlign: 'center' }}>
                            <CuotaBadge suma={c1} vencimiento={s.c1.fecha_vencimiento} />
                          </td>
                          <td style={{ ...td, textAlign: 'center' }}>
                            <CuotaBadge suma={c2} vencimiento={s.c2.fecha_vencimiento} />
                          </td>
                          <td style={{ ...td, textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: sem.bg, color: sem.color, borderRadius: 999,
                              padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
                              border: `1px solid ${sem.dot}50`
                            }}>
                              <span style={{ width: 7, height: 7, borderRadius: '50%', background: sem.dot, display: 'inline-block' }} />
                              {sem.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}

          {students.length === 0 && (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>No hay alumnos registrados.</p>
          )}

          {/* Pie */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
            <span>PERU INKA — Control de Cuotas</span>
            <span>{today}</span>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-print-area, #report-print-area * { visibility: visible; }
          #report-print-area { position: fixed; top: 0; left: 0; width: 100%; padding: 1.5rem; background: white; }
        }
      `}</style>
    </div>
  );
};
