import React from 'react';

const CalendarGrid = ({ currentDate, viewMode, tasks, today, onToggleStatus }) => {
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (date) => {
    let day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const formatDayString = (dayNum) => {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = dayNum.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getWeekDays = () => {
    const currentDay = currentDate.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + distanceToMonday);

    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return day;
    });
  };

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  if (viewMode === 'monthly') {
    const totalDays = getDaysInMonth(currentDate);
    const blankDays = getFirstDayOfWeek(currentDate);

    return (
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map(d => (
          <div key={d} className="text-center font-bold text-slate-500 text-xs md:text-sm py-2">
            {d}
          </div>
        ))}

        {Array.from({ length: blankDays }).map((_, i) => (
          <div 
            key={`blank-${i}`} 
            className="h-24 bg-[#060814]/10 rounded-xl border border-dashed border-slate-800/40"
          ></div>
        ))}

        {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
          const dateStr = formatDayString(day);
          const dayTasks = tasks.filter(t => t.dueDate === dateStr);
          const isToday = dateStr === today;

          return (
            <div 
              key={day} 
              className={`h-24 border rounded-xl p-2 flex flex-col justify-between overflow-y-auto bg-[#060814] scrollbar-thin transition-colors hover:bg-slate-800/20 ${
                isToday ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-800/80'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold ${isToday ? 'text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md' : 'text-slate-500'}`}>
                  {day}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400 font-semibold">
                    {dayTasks.length}
                  </span>
                )}
              </div>
              <div className="space-y-1 flex-1 overflow-y-auto">
                {dayTasks.map(task => {
                  const isCompleted = task.status === 'Realizada';
                  return (
                    <button
                      key={task.id}
                      onClick={() => onToggleStatus && onToggleStatus(task.id)}
                      className={`w-full text-left text-[9px] p-1 rounded truncate block transition-all hover:scale-[0.98] ${
                        isCompleted 
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 line-through' 
                          : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                      }`}
                    >
                      {task.title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const weekDays = getWeekDays();

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((dayDate) => {
        const formattedDateStr = dayDate.toISOString().split('T')[0];
        const dayTasks = tasks.filter(t => t.dueDate === formattedDateStr);
        const isToday = formattedDateStr === today;

        return (
          <div 
            key={formattedDateStr}
            className={`bg-[#060814] p-4 rounded-2xl border min-h-[300px] flex flex-col ${
              isToday ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-slate-800/80'
            }`}
          >
            <div className="border-b border-slate-800/80 pb-3 mb-3 text-center">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                {dayDate.toLocaleDateString('es-ES', { weekday: 'short' })}
              </p>
              <p className={`text-lg font-extrabold mt-1 ${isToday ? 'text-indigo-400' : 'text-white'}`}>
                {dayDate.getDate()}
              </p>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {dayTasks.length === 0 ? (
                <p className="text-[10px] text-slate-600 text-center py-4">Sin tareas</p>
              ) : (
                dayTasks.map(task => {
                  const isCompleted = task.status === 'Realizada';
                  return (
                    <div 
                      key={task.id}
                      onClick={() => onToggleStatus && onToggleStatus(task.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-all hover:border-slate-700 active:scale-95 ${
                        isCompleted 
                          ? 'bg-emerald-950/20 border-emerald-900/20 text-emerald-500/70 line-through' 
                          : 'bg-[#0B132B] border-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="font-semibold truncate">{task.title}</p>
                      {task.notes && (
                        <p className="text-[9px] text-slate-500 mt-1 line-clamp-2 italic">{task.notes}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;