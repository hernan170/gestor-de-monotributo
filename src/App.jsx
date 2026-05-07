import React, { useState, useEffect } from 'react'

function App() {
  const [ingresos, setIngresos] = useState([]);

  const traerDatos = async () => {
    try {
      const response = await fetch('http://localhost:8080/ingresos');
      const data = await response.json();
      setIngresos(data);
    } catch (error) {
      console.error("Error conectando con el backend...");
    }
  };

  useEffect(() => {
    traerDatos();
    const intervalo = setInterval(traerDatos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const handleFacturar = async (id) => {
    try {
      const response = await fetch('http://localhost:8080/facturar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (response.ok) traerDatos();
    } catch (error) {
      alert("Error al facturar");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('archivo', file);
    try {
      const response = await fetch('http://localhost:8080/procesar-comprobante', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) traerDatos();
    } catch (error) {
      console.error("Error al procesar el archivo");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased text-center">
      
      {/* Sidebar - Recuperada con todos sus íconos */}
      <nav className="fixed top-0 left-0 h-full w-20 bg-white border-r border-slate-100 flex flex-col items-center py-8 gap-10 z-50 hidden md:flex">
        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200">G</div>
        <div className="flex flex-col gap-8 text-slate-300">
          <i className="fa-solid fa-house text-emerald-600 text-xl"></i>
          <i className="fa-solid fa-chart-line text-xl"></i>
          <i className="fa-solid fa-file-invoice text-xl"></i>
        </div>
      </nav>

      <main className="md:ml-20 p-4 md:p-10 max-w-6xl mx-auto">
        
        {/* Header con Perfil de Hernán */}
        <header className="flex justify-between items-end mb-10 text-left">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 italic">Dashboard</h1>
            <p className="text-slate-400 font-medium">Gestión de Monotributo Agilizada</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right hidden sm:block px-2">
              <p className="text-xs font-bold text-slate-800">Hernán</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Lic. en Gestión</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 border border-slate-200">H</div>
          </div>
        </header>

        {/* Zona de Carga IA - Agregada sin quitar nada */}
        <label className="mb-10 p-12 border-4 border-dashed border-slate-200 rounded-[40px] bg-white/50 flex flex-col items-center justify-center group hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer">
          <input type="file" className="hidden" onChange={handleFileUpload} accept="application/pdf,image/*" />
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <p className="text-slate-600 font-black uppercase tracking-widest text-sm">Arrastrá el comprobante aquí</p>
          <p className="text-slate-400 text-[10px] mt-1 font-bold italic tracking-tighter uppercase">IA detectará monto y cliente automáticamente</p>
        </label>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Facturado Mes</p>
            <h3 className="text-3xl font-black text-slate-800">
              ${ingresos.filter(i => i.estado === 'facturado').reduce((acc, curr) => acc + (curr.monto || 0), 0).toLocaleString('es-AR')}
            </h3>
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-500 text-xs font-bold">
              <span className="bg-emerald-50 px-2 py-1 rounded-lg">↑ 12%</span> vs mes anterior
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-[32px] shadow-2xl shadow-slate-200 text-white">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 text-white/50">Límite Categoría B</p>
            <h3 className="text-3xl font-black text-white">$2.4M</h3>
            <div className="mt-4 w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[45%]"></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex flex-col justify-between items-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Próxima Alerta</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                <i className="fa-solid fa-bell"></i>
              </div>
              <p className="text-sm font-bold text-slate-700 italic">Mudanza en T-120 días</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
          
          {/* Pendientes - Con sus botones recuperados */}
          <div>
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              Ingresos a Conciliar
              <span className="bg-amber-400 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                {ingresos.filter(i => i.estado === 'pendiente').length} NUEVOS
              </span>
            </h2>
            
            {ingresos.filter(i => i.estado === 'pendiente').map(ingreso => (
              <div key={ingreso.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 h-2 w-24 bg-amber-400"></div>
                <div className="flex justify-between items-start mb-6 font-black uppercase tracking-tighter">
                  <div>
                    <p className="text-[10px] text-slate-300 mb-1">{ingreso.banco}</p>
                    <h3 className="text-xl text-slate-800 leading-tight">{ingreso.cliente}</h3>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-1 mb-8 font-black">
                  <span className="text-sm text-slate-400">$</span>
                  <span className="text-4xl text-slate-900 tracking-tighter">{(ingreso.monto || 0).toLocaleString('es-AR')}</span>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleFacturar(ingreso.id)}
                    className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-200 text-xs uppercase tracking-widest"
                  >
                    FACTURAR EN ARCA
                  </button>
                  <button className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl hover:bg-red-50 hover:text-red-400 transition-all text-xs uppercase tracking-widest">
                    IGNORAR
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Historial - Recuperado con íconos de check */}
          <div>
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tighter">Últimos Movimientos</h2>
            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
              {ingresos.map(i => (
                <div key={i.id} className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i.estado === 'facturado' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                      <i className={`fa-solid ${i.estado === 'facturado' ? 'fa-check' : 'fa-clock'}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{i.cliente}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                        {i.estado === 'facturado' ? (i.cae || 'Comprobante OK') : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-slate-700">${(i.monto || 0).toLocaleString('es-AR')}</p>
                </div>
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  )
}

export default App