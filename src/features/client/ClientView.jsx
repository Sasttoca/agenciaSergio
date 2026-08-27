import React, { useContext } from 'react';
import { AgencyContext } from '../../context/AgencyContext';
import CalendarView from '../tasks/CalendarView';
import SuggestionBox from './SuggestionBox';
import { Building2, Tag, UserCheck, LogOut, Calendar, Clock, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import logoApp from '../../assets/logo.webp';

const ClientView = () => {
  const { currentUser, businesses, logout, getSubscriptionStatus } = useContext(AgencyContext);

  // Buscar la información específica del negocio del cliente
  const business = businesses.find(b => b.id === currentUser?.businessId);

  // Obtener estado de suscripción quincenal
  const subscription = getSubscriptionStatus(business);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No definida';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // 1. PANTALLA DE SUSPENSIÓN POR FALTA DE PAGO (Superados los 2 días de gracia)
  if (subscription.status === 'suspended') {
    return (
      <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0B132B] border border-rose-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-rose-950/20 space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Suscripción Suspendida
            </span>
            <h2 className="text-2xl font-bold text-white pt-2">Acceso Restringido</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              El periodo de cobertura para <strong className="text-slate-200 font-semibold">{business?.name || 'su cuenta'}</strong> ha vencido el <span className="text-slate-200">{formatDate(subscription.nextBillingDate)}</span> y se superó el plazo límite de gracia.
            </p>
          </div>

          <div className="bg-[#060814] p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <p>Para restablecer el acceso a su calendario y métricas operativas, por favor comuníquese con el área de administración de la agencia.</p>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col">
      {/* Header exclusivo para Cliente */}
      <header className="h-16 bg-[#0B132B] border-b border-slate-800/80 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src={logoApp} 
              alt="Tap Social Logo" 
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.3)]" 
            />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide leading-none">Tap Social</h1>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Portal de Cliente</span>
          </div>
        </div>

        <button 
          onClick={logout}
          className="flex items-center gap-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* BANNER DE ALERTA: Periodo de Gracia Activo (Corte vencido dentro de 48h) */}
        {subscription.status === 'grace_period' && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-3 text-amber-300 shadow-lg">
            <AlertTriangle size={22} className="shrink-0 text-amber-400" />
            <div className="text-xs flex-1">
              <span className="font-bold">Aviso de Facturación: </span>
              El corte quincenal venció el {formatDate(subscription.nextBillingDate)}. Tu cuenta se encuentra en un periodo de gracia de 2 días. Comunícate con tu asesor para registrar tu pago y evitar la suspensión.
            </div>
          </div>
        )}

        {/* Card Informativa de la Empresa del Cliente y Widget de Suscripción */}
        <div className="bg-[#0B132B] border border-slate-800/80 rounded-2xl p-6 flex flex-wrap gap-6 items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Tu Empresa</span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2.5 mt-1">
              <Building2 className="text-indigo-500" size={26} />
              {business?.name || 'Mi Empresa'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Widget Contador de Quincena */}
            <div className="flex items-center gap-2.5 bg-[#060814] px-4 py-2.5 rounded-xl border border-slate-800">
              <Calendar size={16} className="text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Próximo Corte Quincenal</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs font-semibold text-slate-200">{formatDate(subscription.nextBillingDate)}</p>
                  {subscription.status === 'active' ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                      <CheckCircle2 size={10} />
                      {subscription.daysRemaining === 0 ? 'Corta hoy' : `${subscription.daysRemaining}d restantes`}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 border border-amber-500/20">
                      <Clock size={10} />
                      En gracia
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-[#060814] px-4 py-2.5 rounded-xl border border-slate-800">
              <Tag size={16} className="text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Sector / Industria</p>
                <p className="text-xs font-semibold text-slate-200">{business?.industry || 'Sin especificar'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-[#060814] px-4 py-2.5 rounded-xl border border-slate-800">
              <UserCheck size={16} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Gestor Asignado</p>
                <p className="text-xs font-semibold text-slate-200">
                  {Array.isArray(business?.workerIds) && business.workerIds.length > 0 
                    ? business.workerIds.join(', ') 
                    : (business?.workerId || 'Agencia')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rejilla: Calendario Filtrado + Caja de Comentarios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView />
          </div>
          <div className="lg:col-span-1">
            <SuggestionBox />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientView;