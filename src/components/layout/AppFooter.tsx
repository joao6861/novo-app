export default function AppFooter() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 text-center py-10 text-slate-900">
      <img src="/tureggon-logo.png" alt="Tureggon" className="mx-auto h-14 mb-4 grayscale opacity-80" />

      <div className="text-emerald-600 text-xs font-bold mb-2 uppercase tracking-widest">🟢 Sistema Online e Operacional</div>

      <p className="text-slate-500 text-sm font-medium">
        © 2024 Tureggon. Todos os direitos reservados.
      </p>
      <p className="text-slate-400 text-xs mt-2 uppercase tracking-tighter">
        Consulta veicular inteligente e segura
      </p>
    </footer>
  );
}
