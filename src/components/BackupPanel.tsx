import React, { useState } from 'react';
import type { Student } from '../types';

interface BackupPanelProps {
  students: Student[];
  onImport: (importedStudents: Student[]) => void;
  onShowToast: (message: string) => void;
}

export const BackupPanel: React.FC<BackupPanelProps> = ({ students, onImport, onShowToast }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string>(() => new Date().toLocaleTimeString());

  // Handle cloud sync simulation
  const handleCloudSync = () => {
    setIsSyncing(true);
    onShowToast('Iniciando sincronización con la nube...');
    setTimeout(() => {
      setIsSyncing(false);
      const currentTime = new Date().toLocaleTimeString();
      setLastSync(currentTime);
      onShowToast('¡Datos sincronizados con éxito con Google Sheets!');
    }, 1500);
  };

  // Export to JSON file
  const handleExportJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `danzaflow_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onShowToast('Copia de seguridad JSON descargada.');
    } catch (e) {
      onShowToast('Error al exportar copia de seguridad.');
    }
  };

  // Export to CSV for easy import in Google Sheets
  const handleExportCSV = () => {
    try {
      // Create headers matching Google Sheet structure
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
        s.c1.abono_1,
        s.c1.abono_2,
        s.c1.fecha || '',
        s.c1.estado,
        s.c2.abono_1,
        s.c2.abono_2,
        s.c2.fecha || '',
        s.c2.estado,
        s.total_pagado,
        s.deuda_actual,
        s.estado_financiero,
        s.premio_polo,
        s.polo_entregado ? 'SÍ' : 'NO'
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' // UTF-8 BOM for Spanish accents
        + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodeURI(csvContent));
      downloadAnchor.setAttribute('download', `dansa_cuotas_reporte_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      onShowToast('Reporte CSV listo para Google Sheets descargado.');
    } catch (e) {
      onShowToast('Error al generar archivo CSV.');
    }
  };

  // Import JSON File
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    
    if (files && files.length > 0) {
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0 && 'integrante' in parsed[0]) {
            onImport(parsed);
            onShowToast(`Se importaron ${parsed.length} estudiantes correctamente.`);
          } else {
            onShowToast('Formato JSON no es válido.');
          }
        } catch (err) {
          onShowToast('Error al parsear el archivo JSON.');
        }
      };
      fileReader.readAsText(files[0]);
    }
  };

  return (
    <div className="glass-panel backup-panel">
      {/* Cloud Sync Status */}
      <div className="sync-status">
        <span className={`sync-dot ${isSyncing ? 'syncing' : ''}`} />
        <div>
          <span style={{ fontWeight: 600, display: 'block', color: 'white' }}>
            {isSyncing ? 'Sincronizando datos...' : 'Sincronizado en la Nube'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Último guardado: {lastSync} (Local & Cloud Backups)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="backup-buttons">
        {/* Sync Button */}
        <button 
          onClick={handleCloudSync} 
          disabled={isSyncing}
          className="btn btn-accent"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          Sincronizar Nube
        </button>

        {/* CSV Export */}
        <button onClick={handleExportCSV} className="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Descargar CSV (Excel / Sheets)
        </button>

        {/* JSON Export */}
        <button onClick={handleExportJSON} className="btn btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar Backup
        </button>

        {/* JSON Import */}
        <label className="btn btn-secondary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Restaurar Backup
          <input 
            type="file" 
            accept=".json" 
            onChange={handleImportJSON} 
            style={{ display: 'none' }} 
          />
        </label>
      </div>
    </div>
  );
};
