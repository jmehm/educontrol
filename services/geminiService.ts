
import { GoogleGenAI } from "@google/genai";
import { Student, Group, AttendanceRecord } from "../types";

export const getAttendanceSummary = async (students: Student[], groups: Group[], attendance: AttendanceRecord[]) => {
  // Fix: Strictly follow SDK initialization rules with process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Como consultor educativo, analiza los siguientes datos escolares y proporciona un resumen ejecutivo breve (máximo 200 palabras) sobre el rendimiento de asistencia.
    Alumnos totales: ${students.length}
    Grupos: ${groups.map(g => g.name).join(', ')}
    Registros de asistencia recientes: ${attendance.length}
    
    Por favor identifica:
    1. Un patrón positivo.
    2. Un área de preocupación.
    3. Una recomendación pedagógica para mejorar el compromiso de los alumnos.
    Responde en español y usa un tono profesional pero motivador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "No se pudo generar el análisis en este momento.";
  }
};
