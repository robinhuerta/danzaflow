import { useState, useEffect } from 'react';
import type { Student } from './types';
import { INITIAL_STUDENTS } from './mockData';
import { DashboardStats } from './components/DashboardStats';
import { StudentList } from './components/StudentList';
import { StudentDetail } from './components/StudentDetail';
import { ReceiptModal } from './components/ReceiptModal';
import { BackupPanel } from './components/BackupPanel';

interface Toast {
  id: number;
  message: string;
}

interface ActiveReceiptConfig {
  student: Student;
  quotaType: 'Cuota 1' | 'Cuota 2';
  paymentNumber: 1 | 2;
  amount: number;
}

function App() {
  // 1. Core state with LocalStorage persistence
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('danzaflow_students');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading students from localStorage:', e);
    }
    return INITIAL_STUDENTS;
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('danzaflow_students', JSON.stringify(students));
  }, [students]);

  // 2. Modals state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<ActiveReceiptConfig | null>(null);

  // 3. Toast alerts state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  const showToast = (message: string) => {
    const id = toastCounter;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // 4. Student operations
  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    
    // If the student currently open in detail modal was saved, update it in local state too
    if (selectedStudent && selectedStudent.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
    
    showToast(`¡Se guardaron los cambios de ${updatedStudent.integrante}!`);
  };

  const handleAddStudent = () => {
    // Determine next unique ID
    const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    const newStudent: Student = {
      id: nextId,
      integrante: '',
      telefono: '',
      sede: 'Santa Anita - Varones',
      talla_polo: '',
      c1: { abono_1: 0, abono_2: 0, fecha: '', estado: 'Pendiente' },
      c2: { abono_1: 0, abono_2: 0, fecha: '', estado: 'Pendiente' },
      total_pagado: 0,
      deuda_actual: 300,
      estado_financiero: 'DEUDA TOTAL',
      premio_polo: 'NO GANÓ',
      polo_entregado: false
    };

    setStudents(prev => [...prev, newStudent]);
    setSelectedStudent(newStudent);
    showToast('Nuevo estudiante creado. Complete sus datos.');
  };

  // Import list from backup
  const handleImportStudents = (imported: Student[]) => {
    setStudents(imported);
    showToast('Base de datos restaurada correctamente.');
  };

  // Trigger individual abono receipt
  const handleEmitReceipt = (
    student: Student,
    quotaType: 'Cuota 1' | 'Cuota 2',
    paymentNumber: 1 | 2,
    amount: number
  ) => {
    setActiveReceipt({
      student,
      quotaType,
      paymentNumber,
      amount
    });
  };

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="glass-panel app-header no-print">
        <div className="app-brand">
          <div className="brand-icon">D</div>
          <div className="brand-info">
            <h1>DanzaFlow</h1>
            <p>Control de Cuotas, Recibos y Polos • Academia de Danza</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Moneda: <strong>Soles (S/.)</strong>
          </span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Pagos rápidos: <strong>⚡ YAPE</strong>
          </span>
        </div>
      </header>

      {/* Cloud & Backup Synchronization Panel */}
      <div className="no-print">
        <BackupPanel 
          students={students} 
          onImport={handleImportStudents} 
          onShowToast={showToast} 
        />
      </div>

      {/* KPI Cards & Polometro Dashboard */}
      <div className="no-print">
        <DashboardStats students={students} />
      </div>

      {/* Main Student Directory Table */}
      <div className="no-print">
        <StudentList 
          students={students} 
          onSelectStudent={setSelectedStudent} 
          onAddStudent={handleAddStudent} 
        />
      </div>

      {/* FOOTER */}
      <footer className="no-print" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 DanzaFlow. Desarrollado con 💜 para Academias de Baile.</p>
      </footer>

      {/* ============================================================== */}
      {/* MODAL: STUDENT DETAILS & PAYMENT FORM */}
      {selectedStudent && (
        <div className="no-print">
          <StudentDetail 
            student={selectedStudent}
            onSave={handleSaveStudent}
            onClose={() => setSelectedStudent(null)}
            onEmitReceipt={handleEmitReceipt}
          />
        </div>
      )}

      {/* MODAL: DIGITAL RECEIPT TICKET (PRINTABLE & SHAREABLE) */}
      {activeReceipt && (
        <ReceiptModal 
          student={activeReceipt.student}
          quotaType={activeReceipt.quotaType}
          paymentNumber={activeReceipt.paymentNumber}
          amount={activeReceipt.amount}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {/* TOAST SYSTEM ALERTS */}
      <div className="toast-container no-print">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <span style={{ color: 'var(--color-accent)' }}>⚡</span>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
