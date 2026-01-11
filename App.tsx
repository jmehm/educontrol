import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Calendar, CheckSquare, LayoutDashboard, 
  Plus, Search, ShieldCheck, Briefcase, Settings, 
  UserPlus, Activity, Trash2, Clock, Palette, GraduationCap,
  Layers, ChevronRight, Save, Image as ImageIcon,
  Edit3, ClipboardList, Star
} from 'lucide-react';
import { Student, Teacher, Group, ViewType, AttendanceRecord, SchoolSection, UserRole, ScheduleItem } from './types';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_TEACHERS, SECTIONS } from './constants';

interface AppConfig {
  schoolName: string;
  primaryColor: string;
  welcomeMsg: string;
  logoUrl?: string;
}

const App: React.FC = () => {
  // --- PERSISTENCIA LOCAL (Para que no se borre al recargar antes de la DB) ---
  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('school_config');
    return saved ? JSON.parse(saved) : {
      schoolName: "MI ESCUELA PROFESIONAL",
      primaryColor: 'indigo',
      welcomeMsg: "Panel de Control Administrativo"
    };
  });

  const [view, setView] = useState<ViewType>('dashboard');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });
  const [sections, setSections] = useState<SchoolSection[]>(SECTIONS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  // Fix: Added missing state variable to track the selected group in the attendance view
  const [selectedGroupId, setSelectedGroupId] = useState<string>(INITIAL_GROUPS[0]?.id || '');

  // Guardar automáticamente en el navegador
  useEffect(() => {
    localStorage.setItem('school_config', JSON.stringify(config));
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [config, students]);

  // --- TEMAS ---
  const themeColors: any = {
    indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50", ring: "ring-indigo-500", border: "border-indigo-100" },
    blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-50", ring: "ring-blue-500", border: "border-blue-100" },
    rose: { bg: "bg-rose-600", text: "text-rose-600", light: "bg-rose-50", ring: "ring-rose-500", border: "border-rose-100" },
    emerald: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50", ring: "ring-emerald-500", border: "border-emerald-100" },
    amber: { bg: "bg-amber-600", text: "text-amber-600", light: "bg-amber-50", ring: "ring-amber-500", border: "border-amber-100" },
  };
  const theme = themeColors[config.primaryColor] || themeColors.indigo;

  // --- FUNCIONES DE ADMINISTRACIÓN ---
  const addLevel = (name: string) => {
    const newSec: SchoolSection = { id: `sec_${Date.now()}`, name, color: config.primaryColor };
    setSections([...sections, newSec]);
  };

  const addStudent = (name: string, enrollment: string, groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    const newStudent: Student = {
      id: `st_${Date.now()}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@escuela.com`,
      enrollmentId: enrollment,
      groupId,
      sectionId: group?.sectionId || '',
      status: 'active',
      attendanceCount: 0
    };
    setStudents([...students, newStudent]);
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 font-sans text-slate-900 selection:${theme.bg} selection:text-white`}>
      
      {/* MENU LATERAL */}
      <aside className="fixed inset-y-0 left-0 w-20 lg:w-64 bg-white border-r flex flex-col py-8 z-50">
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className={`w-12 h-12 ${theme.bg} rounded-2xl flex items-center justify-center text-white shadow-xl`}>
            <ShieldCheck size={28} />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-black text-sm tracking-tighter leading-none uppercase">{config.schoolName}</h1>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">ADMINISTRADOR</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <MenuBtn icon={LayoutDashboard} label="Resumen" active={view === 'dashboard'} onClick={() => setView('dashboard')} theme={theme} />
          <MenuBtn icon={Users} label="Alumnos" active={view === 'students'} onClick={() => setView('students')} theme={theme} />
          <MenuBtn icon={Layers} label="Niveles y Grupos" active={view === 'groups'} onClick={() => setView('groups')} theme={theme} />
          <MenuBtn icon={CheckSquare} label="Pase de Lista" active={view === 'attendance'} onClick={() => setView('attendance')} theme={theme} />
          <MenuBtn icon={Settings} label="Plataforma" active={view === 'admin-panel'} onClick={() => setView('admin-panel')} theme={theme} />
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight uppercase">{view === 'admin-panel' ? 'PLATAFORMA' : view}</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{config.welcomeMsg}</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-3xl shadow-sm border border-slate-100">
             <div className={`w-10 h-10 ${theme.bg} text-white rounded-2xl flex items-center justify-center font-black`}>A</div>
             <p className="font-black text-xs uppercase tracking-tighter">Director General</p>
          </div>
        </header>

        {/* VISTA DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Total Alumnos" value={students.length} icon={Users} theme={theme} />
              <StatCard label="Niveles Educativos" value={sections.length} icon={GraduationCap} theme={theme} />
              <StatCard label="Grupos Activos" value={groups.length} icon={BookOpen} theme={theme} />
              <StatCard label="Asistencias Hoy" value={attendanceRecords.length} icon={Activity} theme={theme} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                  <h3 className="text-2xl font-black mb-6">Estado de los Niveles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {sections.map(s => (
                       <div key={s.id} className="p-6 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-200 transition-all">
                          <p className="font-black text-lg">{s.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                            {groups.filter(g => g.sectionId === s.id).length} Grupos inscritos
                          </p>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className={`w-16 h-16 ${theme.light} ${theme.text} rounded-3xl flex items-center justify-center mb-6`}>
                    <Star size={32} />
                  </div>
                  <h4 className="font-black text-xl mb-2">Bienvenido</h4>
                  <p className="text-slate-400 text-sm font-medium">Desde aquí puedes controlar toda la operación de tu escuela.</p>
               </div>
            </div>
          </div>
        )}

        {/* VISTA ALUMNOS (ALTA Y BAJA) */}
        {view === 'students' && (
           <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 animate-in fade-in">
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                 <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[2rem] outline-none font-bold" placeholder="Buscar alumno..." />
                 </div>
                 <button onClick={() => {
                   const name = prompt("Nombre del alumno:");
                   const id = prompt("Matrícula:");
                   if(name && id) addStudent(name, id, groups[0].id);
                 }} className={`${theme.bg} text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase shadow-xl hover:scale-105 transition-all`}>
                    + Dar de Alta Alumno
                 </button>
              </div>
              <div className="space-y-3">
                 {students.map(s => (
                   <div key={s.id} className="p-5 bg-slate-50/50 rounded-3xl flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 ${theme.bg} text-white rounded-full flex items-center justify-center font-black`}>{s.name[0]}</div>
                         <div>
                            <p className="font-bold">{s.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.enrollmentId} • {sections.find(sec => sec.id === s.sectionId)?.name}</p>
                         </div>
                      </div>
                      <button onClick={() => setStudents(students.filter(st => st.id !== s.id))} className="p-3 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={20} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        )}

        {/* VISTA CONFIGURACIÓN (PERSONALIZACIÓN) */}
        {view === 'admin-panel' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-6">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Palette className={theme.text} /> Identidad Visual</h3>
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nombre de la Institución</label>
                      <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-slate-100 font-bold mt-2" value={config.schoolName} onChange={e => setConfig({...config, schoolName: e.target.value})} />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Mensaje de Bienvenida</label>
                      <input className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-slate-100 font-bold mt-2" value={config.welcomeMsg} onChange={e => setConfig({...config, welcomeMsg: e.target.value})} />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Color de la Plataforma</label>
                      <div className="grid grid-cols-5 gap-3 mt-4">
                         {Object.keys(themeColors).map(c => (
                           <button key={c} onClick={() => setConfig({...config, primaryColor: c})} className={`h-12 rounded-2xl ${themeColors[c].bg} ${config.primaryColor === c ? 'ring-4 ring-slate-200 scale-90' : 'hover:scale-110'} transition-all`} />
                         ))}
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3"><Layers className={theme.text} /> Estructura Académica</h3>
                <div className="space-y-4">
                   <button onClick={() => {
                     const n = prompt("Nombre del nuevo nivel (ej. Bachillerato):");
                     if(n) addLevel(n);
                   }} className="w-full p-6 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400 font-bold hover:bg-slate-50 flex items-center justify-center gap-3">
                     <Plus size={20} /> Añadir Nivel Educativo
                   </button>
                   <div className="space-y-2">
                      {sections.map(s => (
                        <div key={s.id} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                           <span className="font-bold text-sm uppercase">{s.name}</span>
                           <button onClick={() => setSections(sections.filter(sec => sec.id !== s.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* VISTA PASE DE LISTA (FUNCIONAL) */}
        {view === 'attendance' && (
          <div className="animate-in fade-in">
             <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                {groups.map(g => (
                  <button key={g.id} onClick={() => setSelectedGroupId(g.id)} className={`px-8 py-4 rounded-full font-black text-xs uppercase whitespace-nowrap transition-all ${selectedGroupId === g.id ? `${theme.bg} text-white shadow-xl` : 'bg-white text-slate-400'}`}>
                    {g.name}
                  </button>
                ))}
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                   {students.filter(s => s.groupId === selectedGroupId).map(s => {
                     const isP = attendanceRecords.some(r => r.studentId === s.id);
                     return (
                       <button key={s.id} onClick={() => {
                         if(isP) setAttendanceRecords(attendanceRecords.filter(r => r.studentId !== s.id));
                         else setAttendanceRecords([...attendanceRecords, { id: Math.random().toString(), date: 'hoy', studentId: s.id, groupId: selectedGroupId, status: 'present', recordedBy: 'Profe' }]);
                       }} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${isP ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-slate-50'}`}>
                          <p className="font-bold text-sm">{s.name}</p>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isP ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>
                             {isP && <CheckSquare size={16} />}
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

const MenuBtn = ({ icon: Icon, label, active, onClick, theme }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${active ? `${theme.bg} text-white shadow-lg` : 'text-slate-400 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="hidden lg:block font-black text-[10px] uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, theme }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center shadow-sm group hover:shadow-xl transition-all">
    <div className={`p-4 rounded-2xl ${theme.light} ${theme.text} mb-4 group-hover:scale-110 transition-transform`}><Icon size={24} /></div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black">{value}</p>
  </div>
);

export default App;