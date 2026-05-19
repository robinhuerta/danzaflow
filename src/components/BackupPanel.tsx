import React, { useState } from 'react';
import type { Student } from '../types';

interface BackupPanelProps {
  students: Student[];
  onImport: (importedStudents: Student[]) => void;
  onShowToast: (message: string) => void;
}

export const BackupPanel: React.FC<BackupPanelProps> = ({ students, onImport, onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `peruinka_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      onShowToast('Copia de seguridad JSON descargada.');
    } catch {
      onShowToast('Error al exportar copia de seguridad.');
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        'ID', 'INTEGRANTE', 'TELEFONO', 'SEDE', 'TALLA POLO',
        'C1_ABONO_1', 'C1_ABONO_2', 'C1_FECHA', 'C1_ESTADO',
        'C2_ABONO_1', 'C2_ABONO_2', 'C2_FECHA', 'C2_ESTADO',
        'TOTAL_PAGADO', 'DEUDA_ACTUAL', 'ESTADO_FINANCIERO', 'PREMIO_POLO', 'POLO_ENTREGADO'
      ];
      const rows = students.map(s => [
        s.id,
        `"${s.integrante.replace(/"/g, '""')}"`,
        s.telefono || '',
        `"${s.sede}"`,
        s.talla_polo || '',
        s.c1.abono_1, s.c1.abono_2, s.c1.fecha || '', s.c1.estado,
        s.c2.abono_1, s.c2.abono_2, s.c2.fecha || '', s.c2.estado,
        s.total_pagado, s.deuda_actual, s.estado_financiero, s.premio_polo,
        s.polo_entregado ? 'SÍ' : 'NO'
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,﻿'
        + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const a = document.createElement('a');
      a.setAttribute('href', encodeURI(csvContent));
      a.setAttribute('download', `peruinka_reporte_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      onShowToast('Reporte CSV descargado.');
    } catch {
      onShowToast('Error al generar CSV.');
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && 'integrante' in parsed[0]) {
            onImport(parsed);
            onShowToast(`Se importaron ${parsed.length} alumnos correctamente.`);
            setIsOpen(false);
          } else {
            onShowToast('Formato JSON no válido.');
          }
        } catch {
          onShowToast('Error al leer el archivo JSON.');
        }
      };
      reader.readAsText(files[0]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1rem 0.5rem', position: 'relative' }}>
      <button
        className="btn btn-secondary"
        onClick={() => setIsOpen(o => !o)}
        style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
      >
        ⚙️ Opciones {isOpen ? '▲' : '▼'}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '1rem',
          zIndex: 100,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '0.75rem',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          minWidth: '220px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Descargar CSV
          </button>

          <button onClick={handleExportJSON} className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar Backup
          </button>

          <label className="btn btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.85rem', cursor: 'pointer' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Restaurar Backup
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>
        </div>
      )}
    </div>
  );
};
