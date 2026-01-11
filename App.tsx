
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, CheckSquare, LayoutDashboard, 
  LogOut, Plus, Search, BrainCircuit, ShieldCheck, 
  Briefcase, ChevronDown, Settings, ShieldAlert, 
  Layers, UserPlus, Activity, Trash2, Clock, User
} from 'lucide-react';
import { Student, Teacher, Group, ViewType, AttendanceRecord, SchoolSection } from './types';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_TEACHERS, SECTIONS } from './constants';

// --- CONFIGURACIÓN DE IDENTIDAD (Personaliza esto) ---
const CONFIG = {
  schoolName: "Colegio Anahuac de Cuautitlan",
  accentColor: "indigo", // Opciones: indigo, blue, emerald, rose, slate
  logoColor: "bg-indigo-600",
  textColor: "text-indigo-600"
};

const App: React.FC = () => {
  // --- ESTADOS ---
  const [view, setView] = useState<ViewType>('dashboard');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [groups] = useState<Group[]>(INITIAL_GROUPS);
  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(INITIAL_GROUPS[0].id);
  const [showModal, setShowModal] = useState(false);
  
  // Nuevo Alumno Form
  const [form, setForm] = useState({ name: '', id: '', group: INITIAL_GROUPS[0].id });

  // --- LÓGICA ---
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `st_${Date.now()}`,
      name: form.name,
      enrollmentId: form.id,
      groupId: form.group,
      email: `${form.name.toLowerCase().replace(' ', '.')}@escuela.com`,
      sectionId: groups.find(g => g.id === form.group)?.sectionId || 'sec_pri',
      status: 'active',
      attendanceCount: 0
    };
    setStudents([...students, newStudent]);
    setShowModal(false);
    setForm({ name: '', id: '', group: INITIAL_GROUPS[0].id });
  };

  const deleteStudent = (id: string) => {
    if(confirm("¿Dar de baja definitiva?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const toggleAttendance = (studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const exists = attendanceRecords.find(r => r.studentId === studentId && r.date === today);
    
    if (exists) {
      setAttendanceRecords(attendanceRecords.filter(r => r !== exists));
    } else {
      setAttendanceRecords([...attendanceRecords, {
        id: Math.random().toString(),
        date: today,
        studentId,
        groupId: selectedGroupId,
        status: 'present',
        recordedBy: 'Admin'
      }]);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
      {/* MODAL ALTA */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black mb-6">Nuevo Alumno</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input required placeholder="Nombre Completo" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              <input required placeholder="Matrícula / ID" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-500" value={form.id} onChange={e => setForm({...form, id: e.target.value})} />
              <select className="w-full p-4 bg-slate-100 rounded-2xl outline-none" value={form.group} onChange={e => setForm({...form, group: e.target.value})}>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-400">Cancelar</button>
                <button type="submit" className={`flex-1 py-4 rounded-2xl text-white font-black ${CONFIG.logoColor} shadow-lg`}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-white border-r flex flex-col items-center lg:items-stretch py-8 transition-all">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className={`w-12 h-12 ${CONFIG.logoColor} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
            <ShieldCheck size={28} />
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tighter">{CONFIG.schoolName}</span>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          <MenuBtn icon={LayoutDashboard} label="Panel" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <MenuBtn icon={Users} label="Alumnos" active={view === 'students'} onClick={() => setView('students')} />
          <MenuBtn icon={CheckSquare} label="Pase de Lista" active={view === 'attendance'} onClick={() => setView('attendance')} />
          <MenuBtn icon={Clock} label="Horarios" active={view === 'schedule'} onClick={() => setView('schedule')} />
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <h2 className="text-3xl font-black capitalize">{view}</h2>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Usuario</p>
                <p className="font-bold">Director General</p>
             </div>
             <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center font-black">DG</div>
          </div>
        </header>

        {/* VISTAS */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
             <StatBox label="Total Alumnos" value={students.length} icon={Users} color="indigo" />
             <StatBox label="Asistencia Hoy" value="95%" icon={Activity} color="emerald" />
             <StatBox label="Grupos Activos" value={groups.length} icon={BookOpen} color="blue" />
          </div>
        )}

        {view === 'students' && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
             <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                   <input className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none" placeholder="Buscar por nombre o matrícula..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => setShowModal(true)} className={`${CONFIG.logoColor} text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform`}>
                  <UserPlus size={20} /> Alta
                </button>
             </div>
             <div className="space-y-3">
                {filteredStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">{s.name[0]}</div>
                        <div>
                           <p className="font-bold text-sm">{s.name}</p>
                           <p className="text-[10px] font-black text-slate-300 uppercase">{s.enrollmentId} • {groups.find(g => g.id === s.groupId)?.name}</p>
                        </div>
                     </div>
                     <button onClick={() => deleteStudent(s.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-4 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase ml-2">Selecciona Grupo</p>
                {groups.map(g => (
                  <button key={g.id} onClick={() => setSelectedGroupId(g.id)} className={`w-full p-6 rounded-[2rem] text-left transition-all border-2 ${selectedGroupId === g.id ? 'bg-white border-indigo-600 shadow-xl' : 'bg-white border-transparent text-slate-400'}`}>
                    <p className="font-black text-lg">{g.name}</p>
                    <p className="text-xs font-bold">{students.filter(s => s.groupId === g.id).length} alumnos</p>
                  </button>
                ))}
             </div>
             <div className="lg:col-span-8 bg-white p-8 lg:p-12 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="mb-10">
                   <h3 className="text-2xl font-black">Lista de Asistencia</h3>
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {students.filter(s => s.groupId === selectedGroupId).map(s => {
                     const isP = attendanceRecords.some(r => r.studentId === s.id && r.date === new Date().toISOString().split('T')[0]);
                     return (
                       <button key={s.id} onClick={() => toggleAttendance(s.id)} className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${isP ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                          <div className="text-left">
                             <p className="font-black text-sm">{s.name}</p>
                             <p className={`text-[10px] font-black uppercase ${isP ? 'text-emerald-600' : 'text-slate-400'}`}>{isP ? 'PRESENTE' : 'PENDIENTE'}</p>
                          </div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isP ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                            {isP ? <CheckSquare size={16} /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                          </div>
                       </button>
                     );
                   })}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- SUBCOMPONENTES ---
const MenuBtn = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="hidden lg:block font-black text-xs uppercase">{label}</span>
  </button>
);

const StatBox = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center shadow-sm">
    <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 mb-4`}><Icon size={24} /></div>
    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
    <p className="text-4xl font-black">{value}</p>
  </div>
);

export default App;
