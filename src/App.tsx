import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Search, Download, ArrowLeft, GraduationCap, School, MapPin, Calendar, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Student {
  id: string;
  name: string;
  graduated: boolean;
  nisn: string | null;
  school_year: string;
}

interface Grade {
  subject: string;
  score: number;
}

const mockGrades: Grade[] = [
  { subject: 'Pendidikan Agama', score: 92 },
  { subject: 'Pancasila & Kewarganegaraan', score: 95 },
  { subject: 'Bahasa Indonesia', score: 96 },
  { subject: 'Matematika', score: 88 },
  { subject: 'Ilmu Pengetahuan Alam (IPA)', score: 91 },
];

type AppState = 'login' | 'loading' | 'result';

function App() {
  const [state, setState] = useState<AppState>('login');
  const [name, setName] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loadingText, setLoadingText] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (state === 'result' && student?.graduated) {
      triggerConfetti();
    }
  }, [state, student]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#dc2626', '#059669', '#2563eb', '#f59e0b'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#dc2626', '#059669', '#2563eb', '#f59e0b'],
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#dc2626', '#059669', '#2563eb', '#f59e0b'],
      });
    }, 500);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);

    if (!name.trim()) return;

    setState('loading');
    setLoadingText('Menghubungkan ke server dinas...');

    setTimeout(() => setLoadingText('Mencocokkan dengan basis data kelulusan...'), 1000);
    setTimeout(() => setLoadingText('Membuat Dokumen SKL Digital...'), 2000);

    setTimeout(async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('name', name.trim())
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setState('login');
        return;
      }

      setStudent(data);
      setState('result');
    }, 3000);
  };

  const handleDownloadSKL = () => {
    alert('Fitur unduh SKL akan tersedia setelah verifikasi admin sekolah. Silakan hubungi pihak sekolah untuk dokumen resmi.');
  };

  const handleReset = () => {
    setState('login');
    setName('');
    setStudent(null);
    setNotFound(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 via-red-800 to-red-700 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <School className="w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide uppercase">
              Dinas Pendidikan Kabupaten Sumedang
            </h1>
          </div>
          <p className="text-center text-sm md:text-base font-medium opacity-95">
            Sistem Informasi Kelulusan Online (SIKO)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        {/* Login Card */}
        {state === 'login' && (
          <div className="w-full max-w-md animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 text-center border-b">
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">SDN CONGGEANG 1</h3>
                <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
                  Silakan masukkan Nama Lengkap untuk mengecek status kelulusan Tahun Ajaran 2025/2026
                </p>
              </div>

              {/* Form */}
              <div className="p-6">
                <form onSubmit={handleSearch} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Nama Lengkap Siswa
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="Contoh: Adi Pratama"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all capitalize text-gray-800"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Ketik nama sesuai daftar hadir kelas
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      NISN / Nomor Ujian (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ketik angka bebas saja"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-gray-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Search className="w-5 h-5" />
                    Cek Kelulusan
                  </button>
                </form>

                {notFound && (
                  <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded animate-fadeIn">
                    <p className="text-yellow-800 text-sm font-medium">
                      Nama tidak ditemukan. Pastikan penulisan nama sudah sesuai.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading Card */}
        {state === 'loading' && (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-sm w-full animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="text-gray-700 font-medium animate-pulse text-lg">
              {loadingText}
            </p>
            <div className="flex justify-center gap-1 mt-4">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        )}

        {/* Result Card */}
        {state === 'result' && student && (
          <div className="w-full max-w-2xl animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-700 to-red-800 text-white text-center py-6 px-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FileText className="w-7 h-7" />
                  <h4 className="text-lg font-bold tracking-widest uppercase">
                    Surat Keterangan Hasil Ujian
                  </h4>
                </div>
                <h3 className="text-2xl font-bold mt-1">SDN CONGGEANG 1</h3>
                <div className="flex items-center justify-center gap-2 mt-2 text-red-100 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Kec. Conggeang, Kabupaten Sumedang, Jawa Barat</span>
                </div>
              </div>

              {/* Student Details */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Nama Siswa</p>
                      <p className="font-bold text-gray-800 text-base mt-1">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">NISN</p>
                      <p className="font-bold text-gray-800 text-base mt-1">{student.nisn || '-'}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-gray-500 font-medium">Sekolah</p>
                      <p className="font-bold text-gray-800 text-base mt-1">SDN CONGGEANG 1</p>
                    </div>
                    <div className="col-span-2 md:col-span-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <p className="text-gray-500 font-medium">Tahun Ajaran:</p>
                        <p className="font-bold text-gray-800">{student.school_year}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Box */}
                <div
                  className={`p-8 rounded-xl text-center mb-6 shadow-lg ${
                    student.graduated
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      : 'bg-gradient-to-br from-gray-700 to-gray-900 text-white'
                  }`}
                >
                  <p className="text-sm uppercase tracking-wider opacity-90 mb-2">Status Kelulusan</p>
                  <p className="text-3xl md:text-4xl font-black tracking-wide">
                    {student.graduated ? 'LULUS' : 'TIDAK LULUS'}
                  </p>
                </div>

                {/* Grades Table */}
                <div className="overflow-x-auto mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Daftar Nilai Ujian
                  </h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700">
                        <th className="px-4 py-3 text-left font-bold border border-gray-200 rounded-tl-lg">
                          Mata Pelajaran
                        </th>
                        <th className="px-4 py-3 text-center font-bold border border-gray-200 rounded-tr-lg w-32">
                          Nilai Ujian
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockGrades.map((grade, index) => (
                        <tr
                          key={grade.subject}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } hover:bg-red-50 transition-colors`}
                        >
                          <td className="px-4 py-3 border border-gray-200 text-gray-700">
                            {grade.subject}
                          </td>
                          <td className="px-4 py-3 border border-gray-200 text-center font-bold text-gray-800">
                            {grade.score}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadSKL}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Unduh SKL Resmi (PDF)
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Pencarian
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm">&copy; 2026 SDN CONGGEANG 1. All Rights Reserved.</p>
          <p className="text-center text-xs opacity-60 mt-1">
            Sistem Pengumuman Kelulusan Elektronik Terintegrasi
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;
