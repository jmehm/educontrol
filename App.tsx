
import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, CheckSquare, LayoutDashboard, 
  Plus, Search, ShieldCheck, Briefcase, Settings, 
  UserPlus, Activity, Trash2, Clock, Palette, GraduationCap,
  Layers, ChevronRight, Save, Image as ImageIcon
} from 'lucide-react';
import { Student, Teacher, Group, ViewType, AttendanceRecord, SchoolSection, UserRole } from './types';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_TEACHERS, SECTIONS } from './constants';

// --- INTERFAZ DE CONFIGURACIÓN DINÁMICA ---
interface AppConfig {
  schoolName: string;
  primaryColor: 'indigo' | 'blue' | 'rose' | 'emerald' | 'amber' | 'slate';
  borderRadius: string;
  welcomeMsg: string;
}

const App: React.FC = () => {
  // --- ESTADOS DE CONFIGURACIÓN (PERSONALIZACIÓN) ---
  const [config, setConfig] = useState<AppConfig>({
    schoolName: "INSTITUTO EDUCATIVO",
    primaryColor: 'indigo',
    borderRadius: '3xl',
    welcomeMsg: "Sistema de Control Escolar Integral"
  });

  // --- ESTADOS DE DATOS ---
  const [view, setView] = useState<ViewType>('dashboard');
  const [currentUserRole] = useState<UserRole>('Admin');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [sections, setSections] = useState<SchoolSection[]>(SECTIONS);
  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  // Estados para modales y formularios
  const [showAddModal, setShowAddModal] = useState<'student' | 'group' | 'section' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id);

  // --- MAPEO DE COLORES DINÁMICO ---
  const themeColors: any = {
    indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50", ring: "ring-indigo-500", border: "border-indigo-100" },
    blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50", ring: "ring-blue-500", border: "border-blue-100" },
    rose: { bg: "bg-rose-600", text: "text-rose-600", light: "bg-rose-50", ring: "ring-rose-500", border: "border-rose-100" },
    emerald: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50", ring: "ring-emerald-500", border: "border-emerald-100" },
    amber: { bg: "bg-amber-600", text: "text-amber-600", light: "bg-amber-50", ring: "ring-amber-500", border: "border-amber-100" },
    slate: { bg: "bg-slate-800", text: "text-slate-800", light: "bg-slate-50", ring: "ring-slate-500", border: "border-slate-200" },
  };

  const theme = themeColors[config.primaryColor];

  // --- LÓGICA DE ADMINISTRACIÓN ---
  const createSection = (name: string) => {
    const newSec: SchoolSection = { id: `sec_${Date.now()}`, name, color: config.primaryColor };
    setSections([...sections, newSec]);
  };

  const deleteStudent = (id: string) => {
    if (confirm("¿Seguro que desea dar de baja a este alumno?")) {
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

  return (
    <div className={`min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:${theme.bg} selection:text-white`}>
      
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-20 lg:w-64 bg-white border-r flex flex-col py-8 z-50">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className={`w-12 h-12 ${theme.bg} rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500`}>
            <ShieldCheck size={28} />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black text-sm tracking-tighter leading-none uppercase">{config.schoolName}</h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <MenuBtn icon={LayoutDashboard} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} theme={theme} />
          <MenuBtn icon={Users} label="Alumnos" active={view === 'students'} onClick={() => setView('students')} theme={theme} />
          <MenuBtn icon={Layers} label="Niveles" active={view === 'groups'} onClick={() => setView('groups')} theme={theme} />
          <MenuBtn icon={CheckSquare} label="Asistencia" active={view === 'attendance'} onClick={() => setView('attendance')} theme={theme} />
          <MenuBtn icon={Settings} label="Configuración" active={view === 'admin-panel'} onClick={() => setView('admin-panel')} theme={theme} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight uppercase">{view}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{config.welcomeMsg}</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase">Administrador</p>
                <p className="font-bold text-sm">Control Total</p>
             </div>
             <div className={`w-12 h-12 ${theme.light} ${theme.text} rounded-2xl flex items-center justify-center font-black shadow-sm`}>AD</div>
          </div>
        </header>

        {/* VISTA DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Alumnos" value={students.length} icon={Users} theme={theme} />
              <StatCard label="Niveles" value={sections.length} icon={GraduationCap} theme={theme} />
              <StatCard label="Grupos" value={groups.length} icon={BookOpen} theme={theme} />
              <StatCard label="Docentes" value={teachers.length} icon={Briefcase} theme={theme} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                 <h3 className="text-xl font-black mb-6 flex items-center gap-3">Niveles Educativos</h3>
                 <div className="space-y-3">
                    {sections.map(s => (
                      <div key={s.id} className={`p-4 rounded-2xl border ${theme.border} flex justify-between items-center bg-slate-50/50`}>
                        <span className="font-bold">{s.name}</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${theme.bg} text-white uppercase`}>Activo</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                 <h3 className="text-xl font-black mb-6 flex items-center gap-3">Grupos por Nivel</h3>
                 <div className="space-y-3">
                    {groups.map(g => (
                      <div key={g.id} className="p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">{g.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{sections.find(s => s.id === g.sectionId)?.name}</p>
                        </div>
                        <ChevronRight className="text-slate-300" />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA ADMINISTRACIÓN (PERSONALIZACIÓN) */}
        {view === 'admin-panel' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Palette size={20} className={theme.text} /> Identidad</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nombre Escuela</label>
                    <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-slate-100 mt-1 font-bold" value={config.schoolName} onChange={e => setConfig({...config, schoolName: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Color de Marca</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Object.keys(themeColors).map(c => (
                        <button key={c} onClick={() => setConfig({...config, primaryColor: c as any})} className={`h-10 rounded-xl transition-all ${themeColors[c].bg} ${config.primaryColor === c ? 'ring-4 ring-offset-2 ring-slate-200 scale-90' : 'hover:scale-105'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2"><ImageIcon size={20} className={theme.text} /> Recursos</h3>
                <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50">
                  <Plus size={16} /> Subir Logo
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">Control de Accesos y Roles</h3>
                <button className={`px-6 py-3 ${theme.bg} text-white rounded-2xl font-black text-[10px] uppercase shadow-lg flex items-center gap-2`}>
                  <UserPlus size={16} /> Crear Perfil
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                      <th className="pb-4">Usuario</th>
                      <th className="pb-4">Rol</th>
                      <th className="pb-4">Estado</th>
                      <th className="pb-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {teachers.map(t => (
                      <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-sm">{t.name}</td>
                        <td className="py-4 text-xs font-black text-slate-400">DOCENTE</td>
                        <td className="py-4"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full">ACTIVO</span></td>
                        <td className="py-4"><button className="p-2 text-slate-200 hover:text-slate-600"><Settings size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VISTA ALUMNOS (REUTILIZADA Y MEJORADA) */}
        {view === 'students' && (
           <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                 <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[2rem] outline-none font-bold text-sm" placeholder="Buscar por nombre o matrícula..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                 </div>
                 <button onClick={() => setShowAddModal('student')} className={`${theme.bg} text-white px-8 py-4 rounded-[2rem] font-black text-xs uppercase shadow-xl hover:scale-105 transition-all`}>
                    + Nuevo Alumno
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                   <div key={s.id} className="p-6 bg-slate-50/50 rounded-3xl flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 ${theme.light} ${theme.text} rounded-full flex items-center justify-center font-black`}>{s.name[0]}</div>
                         <div>
                            <p className="font-bold text-sm">{s.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase">{s.enrollmentId} • {sections.find(sec => sec.id === s.sectionId)?.name}</p>
                         </div>
                      </div>
                      <button onClick={() => deleteStudent(s.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={18} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* VISTA ASISTENCIA (TACTIL Y EN VIVO) */}
        {view === 'attendance' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
              <div className="lg:col-span-4 space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Seleccionar Grupo</p>
                 {groups.map(g => (
                   <button key={g.id} onClick={() => setSelectedGroupId(g.id)} className={`w-full p-8 rounded-[2.5rem] text-left transition-all border-2 ${selectedGroupId === g.id ? `${theme.bg} text-white shadow-2xl` : 'bg-white border-transparent text-slate-400 shadow-sm'}`}>
                      <p className="font-black text-xl leading-none">{g.name}</p>
                      <p className={`text-[10px] font-bold uppercase mt-2 ${selectedGroupId === g.id ? 'text-white/70' : 'text-slate-300'}`}>Control en vivo</p>
                   </button>
                 ))}
              </div>
              <div className="lg:col-span-8 bg-white p-10 lg:p-14 rounded-[4rem] shadow-sm border border-slate-100">
                 <div className="flex justify-between items-center mb-10 border-b pb-8">
                    <div>
                       <h3 className="text-2xl font-black">Pase de Lista</h3>
                       <p className="text-slate-400 font-bold uppercase text-[10px] mt-1">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                       <span className={`text-5xl font-black ${theme.text}`}>{attendanceRecords.filter(r => r.groupId === selectedGroupId).length}</span>
                       <p className="text-[10px] font-black text-slate-300 uppercase">Presentes</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {students.filter(s => s.groupId === selectedGroupId).map(s => {
                      const isP = attendanceRecords.some(r => r.studentId === s.id);
                      return (
                        <button key={s.id} onClick={() => toggleAttendance(s.id)} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${isP ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50'}`}>
                           <div className="text-left">
                              <p className="font-black text-sm">{s.name}</p>
                              <p className={`text-[9px] font-black uppercase ${isP ? 'text-emerald-600' : 'text-slate-300'}`}>{isP ? 'ASISTENCIA MARCADA' : 'PENDIENTE'}</p>
                           </div>
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isP ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                              {isP ? <CheckSquare size={18} /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />}
                           </div>
                        </button>
                      )
                    })}
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---
const MenuBtn = ({ icon: Icon, label, active, onClick, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? `${theme.bg} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="hidden lg:block font-black text-xs uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, theme }: any) => (
  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center shadow-sm group hover:shadow-xl transition-all">
    <div className={`p-4 rounded-2xl ${theme.light} ${theme.text} mb-4 group-hover:scale-110 transition-transform`}><Icon size={24} /></div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black">{value}</p>
  </div>
);

export default App;
