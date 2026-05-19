import React, { useState } from 'react';
import type { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onAddStudent: () => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  onSelectStudent,
  onAddStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSede, setSelectedSede] = useState('');
  const [selectedFinances, setSelectedFinances] = useState('');
  const [selectedPolo, setSelectedPolo] = useState('');

  // Sede options
  const sedes = Array.from(new Set(students.map(s => s.sede).filter(Boolean)));

  // Filter students based on all states
  const filteredStudents = students.filter(student => {
    // 1. Search term
    const matchesSearch = student.integrante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.telefono.includes(searchTerm);
    
    // 2. Sede
    const matchesSede = selectedSede === '' || student.sede === selectedSede;

    // 3. Finances
    const matchesFinances = selectedFinances === '' || 
      (selectedFinances === 'LIQUIDADO' && student.total_pagado >= 300) ||
      (selectedFinances === 'EN ACUENTAS' && student.total_pagado > 0 && student.total_pagado < 300) ||
      (selectedFinances === 'DEUDA TOTAL' && student.total_pagado === 0);

    // 4. Polo
    let matchesPolo = true;
    if (selectedPolo === 'CALIFICA_PENDIENTE') {
      matchesPolo = student.premio_polo === '¡GANÓ POLO!' && !student.polo_entregado;
    } else if (selectedPolo === 'ENTREGADO') {
      matchesPolo = student.premio_polo === '¡GANÓ POLO!' && student.polo_entregado;
    } else if (selectedPolo === 'NO_GANO') {
      matchesPolo = student.premio_polo === 'NO GANÓ';
    }

    return matchesSearch && matchesSede && matchesFinances && matchesPolo;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Search and Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem' }}>
          Lista de Alumnos
        </h2>
        <button onClick={onAddStudent} className="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nuevo Alumno
        </button>
      </div>

      <div className="search-filter-bar">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por nombre o teléfono..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by Sede */}
        <select 
          className="filter-select"
          value={selectedSede}
          onChange={(e) => setSelectedSede(e.target.value)}
        >
          <option value="">Todas las Sedes</option>
          {sedes.map(sede => (
            <option key={sede} value={sede}>{sede}</option>
          ))}
        </select>

        {/* Filter by Financial Status */}
        <select 
          className="filter-select"
          value={selectedFinances}
          onChange={(e) => setSelectedFinances(e.target.value)}
        >
          <option value="">Todos los Estados Financieros</option>
          <option value="LIQUIDADO">Liquidado (S/. 300)</option>
          <option value="EN ACUENTAS">En Cuentas (Abonado)</option>
          <option value="DEUDA TOTAL">Deuda Total (S/. 0)</option>
        </select>

        {/* Filter by Polo */}
        <select 
          className="filter-select"
          value={selectedPolo}
          onChange={(e) => setSelectedPolo(e.target.value)}
        >
          <option value="">Todos los Polos</option>
          <option value="CALIFICA_PENDIENTE">★ Califica - Pendiente de Entrega</option>
          <option value="ENTREGADO">✓ Califica - Entregado</option>
          <option value="NO_GANO">✗ No Califica (NO GANÓ)</option>
        </select>
      </div>

      {/* Roster Table */}
      <div className="data-table-container">
        {filteredStudents.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Integrante</th>
                <th>Teléfono (Yape)</th>
                <th>Sede</th>
                <th>Cuota 1 (S/.)</th>
                <th>Cuota 2 (S/.)</th>
                <th>Total Pago</th>
                <th>Saldo Pend.</th>
                <th>Premio Polo</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const totalPaid = student.total_pagado;
                const debt = student.deuda_actual;

                return (
                  <tr key={student.id}>
                    <td data-label="ID" style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      #{student.id}
                    </td>
                    <td data-label="Nombre Integrante" className="student-name-cell">
                      {student.integrante}
                    </td>
                    <td data-label="Teléfono" className="student-phone-cell">
                      {student.telefono ? `⚡ ${student.telefono}` : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                    </td>
                    <td data-label="Sede" className="student-sede-cell">
                      {student.sede}
                    </td>
                    <td data-label="Cuota 1">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>S/. {student.c1.abono_1 + student.c1.abono_2}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{student.c1.estado}</span>
                      </div>
                    </td>
                    <td data-label="Cuota 2">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>S/. {student.c2.abono_1 + student.c2.abono_2}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{student.c2.estado}</span>
                      </div>
                    </td>
                    <td data-label="Total Pago">
                      <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                        S/. {totalPaid}
                      </span>
                    </td>
                    <td data-label="Saldo Pend.">
                      <span style={{ 
                        color: debt > 0 ? '#ff8e8e' : 'var(--color-success)', 
                        fontWeight: 700 
                      }}>
                        S/. {debt}
                      </span>
                    </td>
                    <td data-label="Premio Polo">
                      {student.premio_polo === '¡GANÓ POLO!' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span className="badge badge-polo-si">🎁 GANÓ POLO</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: student.polo_entregado ? '#10b981' : '#ff4fa8' }}>
                            {student.polo_entregado ? `✓ Entregado (${student.talla_polo})` : `⌛ Pendiente (${student.talla_polo || '?'})`}
                          </span>
                        </div>
                      ) : (
                        <span className="badge badge-polo-no">No Ganó</span>
                      )}
                    </td>
                    <td data-label="Acciones" style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => onSelectStudent(student)} 
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                      >
                        Gestionar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
            No se encontraron alumnos que coincidan con los filtros de búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};
