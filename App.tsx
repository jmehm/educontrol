
import React, { useState, useMemo } from 'react';
import { 
  Users, BookOpen, Calendar, CheckSquare, LayoutDashboard, 
  LogOut, Plus, Search, BrainCircuit, ShieldCheck, 
  Briefcase, ChevronDown, Settings, ShieldAlert, 
  Layers, UserPlus, Activity, Trash2, Clock, User, Palette
} from 'lucide-react';
import { Student, Teacher, Group, ViewType, AttendanceRecord, SchoolSection } from './types';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_TEACHERS, SECTIONS } from './constants';

// ==========================================
// 🎨 SECCIÓN DE PERSONALIZACIÓN (CAMBIA AQUÍ)
// ==========================================
const SCHOOL_THEME = {
  name: "COLEGIO AMERICANO", // Nombre de tu escuela
  primaryColor: "indigo",     // Opciones: indigo, blue, rose, emerald, amber, slate
  logoIcon: ShieldCheck,      // Icono principal
  welcomeMessage: "Gestión Administrativa y Control Escolar",
  borderRadius: "3xl",        // Redondeado de esquinas: xl, 2xl, 3xl, full
};

// Mapeo de colores para Tailwind
const colorMap: any = {
  indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50", ring: "ring-indigo-500/20", shadow: "shadow-indigo-200" },
  blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50", ring: "ring-blue-500/20", shadow: "shadow-blue-200" },
  rose: { bg: "bg-rose-600", text: "text-rose-600", light: "bg-rose-50", ring: "ring-rose-500/20", shadow: "shadow-rose-200" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50", ring: "ring-emerald-500/20", shadow: "shadow-emerald-200" },
};

const theme = colorMap[SCHOOL_THEME.primaryColor] || colorMap.indigo;

const App: React.FC = () => {
  // --- ESTADOS ---
  const [view, setView] = useState<ViewType>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<'Admin' | 'Docente'>('Admin'); // Simulador de login
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(INITIAL_GROUPS[0].id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', id: '', group: INITIAL_GROUPS[0].id });

  // --- LÓGICA DE ALUMNOS ---
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.id) return;
    
    const student: Student = {
      id: `st_${Date.now()}`,
      name: newStudent.name,
      enrollmentId: newStudent.id,
      groupId: newStudent.group,
      email: `${newStudent.name.toLowerCase().replace(' ', '.')}@escuela.com`,
      sectionId: INITIAL_GROUPS.find(g => g.id === newStudent.group)?.sectionId || 'sec_pri',
      status: 'active',
      attendanceCount: 0
    };
    
    setStudents([...students, student]);
    setShowAddModal(false);
    setNewStudent({ name: '', id: '', group: INITIAL_GROUPS[0].id });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Confirmar baja definitiva del alumno?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // --- LÓGICA DE ASISTENCIA ---
  const toggleAttendance = (studentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendanceRecords.find(r => r.studentId === studentId && r.date === today);
    
    if (existing) {
      setAttendanceRecords(attendanceRecords.filter(r => r !== existing));
    } else {
      setAttendanceRecords([...attendanceRecords, {
        id: Math.random().toString(),
        date: today,
        studentId,
        groupId: selectedGroupId,
        status: 'present',
        recordedBy: 'Usuario Actual'
      }]);
    }
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:${theme.bg} selection:text-white`}>
      
      {/* MODAL PARA ALTA DE ALUMNO */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`bg-white w-full max-w-md rounded-${SCHOOL_THEME.borderRadius} p-10 shadow-2xl scale-in-center`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">Alta de Alumno</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Trash2 size={20}/></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nombre Completo</label>
                <input required className={`w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ${theme.ring}`} placeholder="Ej. Juan Pérez" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Matrícula / ID</label>
                <input required className={`w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ${theme.ring}`} placeholder="ID-2024-X" value={newStudent.id} onChange={e => setNewStudent({...newStudent, id: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Asignar Grupo</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl outline-none" value={newStudent.group} onChange={e => setNewStudent({...newStudent, group: e.target.value})}>
                  {INITIAL_GROUPS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <button type="submit" className={`w-full py-5 ${theme.bg} text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:opacity-90 transition-all mt-4`}>Guardar Alumno</button>
            </form>
          </div>
        </div>
      )}

      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className={`fixed inset-y-0 left-0 w-20 lg:w-64 bg-white border-r flex flex-col items-center lg:items-stretch py-8 transition-all z-50`}>
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className={`w-12 h-12 ${theme.bg} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
            <SCHOOL_THEME.logoIcon size={28} />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black text-lg tracking-tighter leading-none">{SCHOOL_THEME.name}</h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Control de Grupo</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <MenuButton icon={LayoutDashboard} label="Resumen" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          {currentUserRole === 'Admin' && (
            <MenuButton icon={Users} label="Alumnos" active={view === 'students'} onClick={() => setView('students')} />
          )}
          <MenuButton icon={CheckSquare} label="Pase de Lista" active={view === 'attendance'} onClick={() => setView('attendance')} />
          <MenuButton icon={Clock} label="Horarios" active={view === 'schedule'} onClick={() => setView('schedule')} />
          <MenuButton icon={Palette} label="Ajustes" active={view === 'admin-panel'} onClick={() => setView('admin-panel')} />
        </nav>

        <div className="px-4 pt-6 border-t mt-auto">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
            <div className={`w-8 h-8 ${theme.bg} rounded-lg flex items-center justify-center text-white font-black text-xs`}>
              {currentUserRole[0]}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-[10px] font-black truncate">USUARIO {currentUserRole.toUpperCase()}</p>
              <button onClick={() => setCurrentUserRole(currentUserRole === 'Admin' ? 'Docente' : 'Admin')} className={`text-[8px] font-bold ${theme.text} uppercase hover:underline`}>Cambiar Rol</button>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight">{view.toUpperCase()}</h2>
            <p className="text-slate-400 font-medium">{SCHOOL_THEME.welcomeMessage}</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
             <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${theme.bg} text-white`}>Hoy: {new Date().toLocaleDateString()}</div>
          </div>
        </header>

        {/* VISTA DASHBOARD */}
        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatCard label="Inscritos" value={students.length} icon={Users} themeColor={theme} />
            <StatCard label="Profesores" value={INITIAL_TEACHERS.length} icon={Briefcase} themeColor={theme} />
            <StatCard label="Grupos" value={INITIAL_GROUPS.length} icon={BookOpen} themeColor={theme} />
            
            <div className="md:col-span-3 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Activity size={24} className={theme.text} /> Estado de Grupos</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {INITIAL_GROUPS.map(g => (
                    <div key={g.id} className="p-8 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-200 hover:bg-white hover:shadow-xl transition-all group">
                       <p className="text-xl font-black mb-1">{g.name}</p>
                       <p className="text-xs font-bold text-slate-400 uppercase mb-4">Titular: {INITIAL_TEACHERS.find(t => t.id === g.teacherId)?.name}</p>
                       <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className={`${theme.bg} h-full`} style={{width: '75%'}}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* VISTA ALUMNOS */}
        {view === 'students' && (
          <div className="bg-white rounded-[3rem] p-8 lg:p-10 shadow-sm border border-slate-100 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
                <input className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl outline-none focus:ring-2 ring-slate-200 font-medium" placeholder="Buscar alumno por nombre o ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={() => setShowAddModal(true)} className={`${theme.bg} text-white px-10 py-5 rounded-3xl font-black text-xs uppercase shadow-lg ${theme.shadow} hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3`}>
                <UserPlus size={20} /> Nuevo Alumno
              </button>
            </div>

            <div className="space-y-4">
               {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                 <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white rounded-[2rem] border border-transparent hover:border-slate-100 hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-slate-300 shadow-sm">{s.name[0]}</div>
                       <div>
                          <p className="font-black text-base">{s.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.enrollmentId} • {INITIAL_GROUPS.find(g => g.id === s.groupId)?.name}</p>
                       </div>
                    </div>
                    <button onClick={() => handleDelete(s.id)} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* VISTA ASISTENCIA (Pase de lista real) */}
        {view === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
             <div className="lg:col-span-4 space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Seleccionar Grupo</p>
                {INITIAL_GROUPS.map(g => (
                  <button key={g.id} onClick={() => setSelectedGroupId(g.id)} className={`w-full p-8 rounded-[2.5rem] text-left transition-all border-2 ${selectedGroupId === g.id ? `bg-white border-${SCHOOL_THEME.primaryColor}-600 shadow-2xl scale-[1.02]` : 'bg-white border-transparent text-slate-400 opacity-60'}`}>
                    <p className="font-black text-xl leading-none mb-2">{g.name}</p>
                    <p className="text-xs font-bold uppercase tracking-tighter">Pase de lista activo</p>
                  </button>
                ))}
             </div>
             <div className="lg:col-span-8 bg-white p-10 lg:p-14 rounded-[4rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-end mb-12 border-b border-slate-50 pb-10">
                   <div>
                      <h3 className="text-3xl font-black">Control de Asistencia</h3>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                   </div>
                   <div className="text-right">
                      <span className={`text-6xl font-black ${theme.text} leading-none`}>
                        {attendanceRecords.filter(r => r.groupId === selectedGroupId && r.date === new Date().toISOString().split('T')[0]).length}
                      </span>
                      <p className="text-[10px] font-black text-slate-300 uppercase">Presentes</p>
                   </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                   {students.filter(s => s.groupId === selectedGroupId).map(s => {
                     const isP = attendanceRecords.some(r => r.studentId === s.id && r.date === new Date().toISOString().split('T')[0]);
                     return (
                       <button key={s.id} onClick={() => toggleAttendance(s.id)} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${isP ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                          <div className="text-left">
                             <p className="font-black text-sm">{s.name}</p>
                             <p className={`text-[9px] font-black uppercase ${isP ? 'text-emerald-600' : 'text-slate-400'}`}>{isP ? 'ASISTENCIA MARCADA' : 'SIN REGISTRO'}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isP ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300'}`}>
                            {isP ? <CheckSquare size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
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
const MenuButton = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? `${colorMap[SCHOOL_THEME.primaryColor].bg} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="hidden lg:block font-black text-xs uppercase tracking-wider">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, themeColor }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-20 h-20 ${themeColor.light} rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform`} />
    <div className={`p-5 rounded-3xl ${themeColor.light} ${themeColor.text} mb-5 group-hover:scale-110 transition-transform`}><Icon size={28} /></div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-5xl font-black tracking-tighter">{value}</p>
  </div>
);

export default App;
