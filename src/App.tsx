import { useState, useEffect, useRef } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { Student } from './types';
import { INITIAL_STUDENTS } from './mockData';
import { DashboardStats } from './components/DashboardStats';
import { StudentList } from './components/StudentList';
import { StudentDetail } from './components/StudentDetail';
import { ReceiptModal } from './components/ReceiptModal';
import { BackupPanel } from './components/BackupPanel';
import { ReportModal } from './components/ReportModal';

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

const CLOUD_DOC = 'academia/students';

function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('peruinka_students');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
    return INITIAL_STUDENTS;
  });

  const [cloudStatus, setCloudStatus] = useState<'synced' | 'syncing' | 'offline'>('syncing');
  const initialStudentsRef = useRef(students);

  // Firestore real-time listener — syncs across all devices
  useEffect(() => {
    const docRef = doc(db, CLOUD_DOC);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.list)) {
            setStudents(data.list);
            localStorage.setItem('peruinka_students', JSON.stringify(data.list));
          }
        } else if (initialStudentsRef.current.length > 0) {
          // Primera vez: sube los datos locales solo si hay datos reales
          setDoc(docRef, { list: initialStudentsRef.current });
        }
        setCloudStatus('synced');
      },
      (error) => {
        console.error('Firestore listener error:', error.code, error.message);
        setCloudStatus('offline');
      }
    );

    return () => unsubscribe();
  }, []);

  // Firestore no acepta undefined — limpia recursivamente antes de guardar
  const cleanUndefined = (obj: unknown): unknown => {
    if (Array.isArray(obj)) return obj.map(cleanUndefined);
    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj as Record<string, unknown>)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, cleanUndefined(v)])
      );
    }
    return obj;
  };

  const saveToCloud = async (updatedStudents: Student[]) => {
    localStorage.setItem('peruinka_students', JSON.stringify(updatedStudents));
    setCloudStatus('syncing');
    try {
      const clean = cleanUndefined(updatedStudents);
      await setDoc(doc(db, CLOUD_DOC), { list: clean });
      setCloudStatus('synced');
    } catch (error) {
      console.error('Cloud sync error:', error);
      setCloudStatus('offline');
      showToast('⚠️ Sin conexión — datos guardados localmente, se sincronizarán al reconectar.');
    }
  };

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pendingNew, setPendingNew] = useState<Student | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<ActiveReceiptConfig | null>(null);
  const [showReport, setShowReport] = useState(false);

  // Toast alerts state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  const showToast = (message: string) => {
    const id = toastCounter;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    const updated = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updated);
    if (selectedStudent?.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
    saveToCloud(updated);
    showToast(`¡Se guardaron los cambios de ${updatedStudent.integrante}!`);
  };

  const handleAddStudent = () => {
    const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    setPendingNew({
      id: nextId,
      integrante: '',
      telefono: '',
      sede: 'Santa Anita',
      talla_polo: '',
      c1: { abono_1: 0, abono_2: 0, fecha: '', estado: 'Pendiente' },
      c2: { abono_1: 0, abono_2: 0, fecha: '', estado: 'Pendiente' },
      total_pagado: 0,
      deuda_actual: 150,
      estado_financiero: 'DEUDA TOTAL',
      premio_polo: 'NO GANÓ',
      polo_entregado: false
    });
  };

  const handleConfirmNewStudent = (newStudent: Student) => {
    const updated = [...students, newStudent];
    setStudents(updated);
    saveToCloud(updated);
    setPendingNew(null);
    showToast(`¡${newStudent.integrante || 'Alumno'} agregado correctamente!`);
  };

  const handleDeleteStudent = (studentId: number) => {
    const updated = students.filter(s => s.id !== studentId);
    setStudents(updated);
    setSelectedStudent(null);
    saveToCloud(updated);
    showToast('Alumno dado de baja correctamente.');
  };

  const handleImportStudents = (imported: Student[]) => {
    setStudents(imported);
    saveToCloud(imported);
    showToast('Base de datos restaurada correctamente.');
  };

  const handleEmitReceipt = (
    student: Student,
    quotaType: 'Cuota 1' | 'Cuota 2',
    paymentNumber: 1 | 2,
    amount: number
  ) => {
    setActiveReceipt({ student, quotaType, paymentNumber, amount });
  };

  const cloudLabel =
    cloudStatus === 'synced' ? '☁️ Sincronizado' :
    cloudStatus === 'syncing' ? '⏳ Guardando...' :
    '⚠️ Sin conexión';

  const cloudColor =
    cloudStatus === 'synced' ? '#10b981' :
    cloudStatus === 'syncing' ? '#f59e0b' :
    '#ef4444';

  return (
    <div className="app-container">
      {/* Brand Header */}
      <header className="glass-panel app-header no-print">
        <div className="app-brand">
          <div className="brand-icon">P</div>
          <div className="brand-info">
            <h1>PERU INKA</h1>
            <p>Control de Cuotas, Recibos y Polos • Academia de Danza</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: cloudColor, fontWeight: 600 }}>
            {cloudLabel}
          </span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Moneda: <strong>Soles (S/.)</strong>
          </span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Pagos rápidos: <strong>⚡ YAPE</strong>
          </span>
          <span style={{ color: 'var(--border-light)' }}>|</span>
          <button
            onClick={() => setShowReport(true)}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}
          >
            📋 Reporte
          </button>
        </div>
      </header>

      <div className="no-print">
        <BackupPanel
          students={students}
          onImport={handleImportStudents}
          onShowToast={showToast}
        />
      </div>

      <div className="no-print">
        <DashboardStats students={students} />
      </div>

      <div className="no-print">
        <StudentList
          students={students}
          onSelectStudent={setSelectedStudent}
          onAddStudent={handleAddStudent}
        />
      </div>

      <footer className="no-print" style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>© 2026 PERU INKA. Desarrollado con 💜 para Academias de Baile.</p>
      </footer>

      {selectedStudent && (
        <div className="no-print">
          <StudentDetail
            student={selectedStudent}
            onSave={handleSaveStudent}
            onClose={() => setSelectedStudent(null)}
            onDelete={handleDeleteStudent}
            onEmitReceipt={handleEmitReceipt}
          />
        </div>
      )}

      {pendingNew && (
        <div className="no-print">
          <StudentDetail
            student={pendingNew}
            isNew
            onSave={handleConfirmNewStudent}
            onClose={() => setPendingNew(null)}
            onDelete={() => setPendingNew(null)}
            onEmitReceipt={handleEmitReceipt}
          />
        </div>
      )}

      {showReport && (
        <ReportModal students={students} onClose={() => setShowReport(false)} />
      )}

      {activeReceipt && (
        <ReceiptModal
          student={activeReceipt.student}
          quotaType={activeReceipt.quotaType}
          paymentNumber={activeReceipt.paymentNumber}
          amount={activeReceipt.amount}
          onClose={() => setActiveReceipt(null)}
        />
      )}

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
