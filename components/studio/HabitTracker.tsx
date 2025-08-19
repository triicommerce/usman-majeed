import React, { useMemo, useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

type Habit = { id: string; name: string; };
type Check = { date: string; habitId: string };

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([{ id: '1', name: 'Read 20m' }]);
  const [checks, setChecks] = useState<Check[]>([]);
  const [newHabit, setNewHabit] = useState('');

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const toggle = (habitId: string, date: Date) => {
    const iso = date.toISOString().slice(0, 10);
    const key = `${habitId}-${iso}`;
    const exists = checks.find(c => c.habitId === habitId && c.date === iso);
    if (exists) setChecks(prev => prev.filter(c => !(c.habitId === habitId && c.date === iso)));
    else setChecks(prev => prev.concat({ habitId, date: iso }));
  };

  const add = () => {
    if (!newHabit.trim()) return;
    setHabits(h => h.concat({ id: Math.random().toString(36).slice(2), name: newHabit.trim() }));
    setNewHabit('');
  };

  const completionRate = useMemo(() => {
    const total = habits.length * 7;
    const done = checks.filter(c => days.some(d => isSameDay(new Date(c.date), d))).length;
    return total ? Math.round((done / total) * 100) : 0;
  }, [habits, checks, days]);

  return (
    <div>
      <h2 className="text-xl text-white font-semibold mb-4">Habit Tracker</h2>
      <div className="flex gap-2 mb-4">
        <input value={newHabit} onChange={e => setNewHabit(e.target.value)} placeholder="Add habit" className="bg-slate-800 border border-slate-700 rounded px-3 py-2" />
        <button className="px-3 py-2 bg-cyan-600 rounded" onClick={add}>Add</button>
        <div className="ml-auto text-slate-300">This week: <span className="text-white font-semibold">{completionRate}%</span></div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Habit</th>
              {days.map(d => (
                <th key={d.toISOString()} className="p-2 text-slate-400">{format(d, 'EEE dd')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map(h => (
              <tr key={h.id} className="border-t border-slate-700">
                <td className="p-2 text-white font-medium">{h.name}</td>
                {days.map(d => {
                  const iso = d.toISOString().slice(0, 10);
                  const checked = checks.some(c => c.habitId === h.id && c.date === iso);
                  return (
                    <td key={iso} className="p-2">
                      <button onClick={() => toggle(h.id, d)} className={`w-6 h-6 rounded border ${checked ? 'bg-cyan-600 border-cyan-500' : 'border-slate-600'}`}></button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

