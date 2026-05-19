import React from 'react';
import type { Student } from '../types';

interface DashboardStatsProps {
  students: Student[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ students }) => {
  const totalStudents = students.length;
  
  // Calculate total paid and total debt
  const totalPaid = students.reduce((acc, student) => {
    // Alonso was corrected, we read actual sum in student.total_pagado
    return acc + student.total_pagado;
  }, 0);

  const totalDebt = students.reduce((acc, student) => {
    return acc + student.deuda_actual;
  }, 0);

  // Polo stats
  const qualifiedForPolo = students.filter(s => s.premio_polo === '¡GANÓ POLO!').length;
  const polosDelivered = students.filter(s => s.premio_polo === '¡GANÓ POLO!' && s.polo_entregado).length;
  const polosPending = qualifiedForPolo - polosDelivered;

  // Percentage of qualified students who got their polo
  const polometroPercentage = qualifiedForPolo > 0 ? Math.round((polosDelivered / qualifiedForPolo) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="stats-grid">
        {/* KPI: Total Estudiantes */}
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Estudiantes</span>
            <span className="stat-value">{totalStudents}</span>
          </div>
          <div className="stat-icon-bg stat-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>

        {/* KPI: Total Recaudado */}
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Recaudado</span>
            <span className="stat-value">
              <span className="currency">S/.</span>
              {totalPaid.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="stat-icon-bg stat-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>

        {/* KPI: Deuda Pendiente */}
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Deuda Pendiente</span>
            <span className="stat-value" style={{ color: totalDebt > 0 ? '#ff8e8e' : '#fff' }}>
              <span className="currency">S/.</span>
              {totalDebt.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="stat-icon-bg stat-pink">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>

        {/* KPI: Control de Polos */}
        <div className="glass-panel stat-card">
          <div className="stat-info">
            <span className="stat-label">Polos Entregados</span>
            <span className="stat-value">
              {polosDelivered}
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                {' '}/ {qualifiedForPolo} ganados
              </span>
            </span>
          </div>
          <div className="stat-icon-bg stat-cyan">
            <span className="polo-icon">👕</span>
          </div>
        </div>
      </div>

      {/* El Polómetro */}
      <div className="glass-panel polometro-card" style={{ padding: '1.5rem' }}>
        <div className="polometro-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="polo-icon" style={{ fontSize: '1.25rem' }}>🔥</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
              El Polómetro Oficial de la Escuela
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {polosPending} alumnos pendientes de reclamar polo
          </span>
        </div>
        <div className="polometro-progress-container">
          <div className="polometro-bar-wrapper">
            <div 
              className="polometro-bar" 
              style={{ width: `${polometroPercentage}%` }} 
            />
          </div>
          <span className="polometro-text">{polometroPercentage}%</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Muestra el avance de la entrega física del polo de la institución a los estudiantes que ya abonaron su cuota mínima (S/. 150.00).
        </p>
      </div>
    </div>
  );
};
