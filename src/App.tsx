import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, ShieldCheck, Zap, MessageSquare, Flame, Trophy, Activity } from 'lucide-react';

type Team = 'gold' | 'premium';

interface ActionLog {
  id: string;
  team: Team;
  action: string;
  points: number;
  timestamp: Date;
}

const ACTIONS = [
  { id: 'funny', label: 'Message drôle', points: 1, icon: MessageSquare },
];

export default function App() {
  const [goldScore, setGoldScore] = useState(0);
  const [premiumScore, setPremiumScore] = useState(0);
  const [logs, setLogs] = useState<ActionLog[]>([]);

  const handleAction = (team: Team, action: typeof ACTIONS[0]) => {
    if (team === 'gold') setGoldScore(s => s + action.points);
    else setPremiumScore(s => s + action.points);

    const newLog: ActionLog = {
      id: Math.random().toString(36).substr(2, 9),
      team,
      action: action.label,
      points: action.points,
      timestamp: new Date(),
    };

    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50
  };

  const totalScore = goldScore + premiumScore;
  const goldPercentage = totalScore === 0 ? 50 : (goldScore / totalScore) * 100;
  const premiumPercentage = totalScore === 0 ? 50 : (premiumScore / totalScore) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="py-6 text-center relative z-20 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
        <h1 className="text-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4">
          <Crown className="text-yellow-500" />
          <span className="bg-gradient-to-r from-yellow-500 via-zinc-400 to-emerald-500 bg-clip-text text-transparent">
            Clash des Rôles
          </span>
          <ShieldCheck className="text-emerald-500" />
        </h1>
      </header>

      {/* Main Arena */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* Background Split */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 bg-gradient-to-br from-yellow-950/10 to-zinc-950" />
          <div className="flex-1 bg-gradient-to-bl from-emerald-950/10 to-zinc-950" />
        </div>

        {/* Vortex Center */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
          <Vortex goldPercentage={goldPercentage} premiumPercentage={premiumPercentage} totalScore={totalScore} />
        </div>

        {/* Left Side - Gold */}
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-8 border-r border-zinc-900/50">
          <TeamPanel 
            team="gold" 
            name="Team Gold" 
            score={goldScore} 
            icon={Crown} 
            color="text-yellow-500" 
            bg="bg-yellow-500"
            border="border-yellow-500/30"
            onAction={(action) => handleAction('gold', action)}
          />
        </div>

        {/* Right Side - Premium */}
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-8">
          <TeamPanel 
            team="premium" 
            name="Premium Vérifié" 
            score={premiumScore} 
            icon={ShieldCheck} 
            color="text-emerald-500" 
            bg="bg-emerald-500"
            border="border-emerald-500/30"
            onAction={(action) => handleAction('premium', action)}
          />
        </div>
      </main>

      {/* Footer / Logs */}
      <footer className="h-56 border-t border-zinc-900 bg-zinc-950/90 backdrop-blur-xl z-20 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4 text-zinc-400 uppercase tracking-wider text-xs font-bold px-4">
          <Activity size={16} />
          <span>Dernières Interventions</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {logs.map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  log.team === 'gold' 
                    ? 'bg-yellow-950/20 border-yellow-900/30 text-yellow-200' 
                    : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {log.team === 'gold' ? <Crown size={16} className="text-yellow-500" /> : <ShieldCheck size={16} className="text-emerald-500" />}
                  <span className="font-medium">{log.action}</span>
                  <span className="text-xs opacity-50">{log.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="font-mono font-bold">+{log.points} pts</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="text-center text-zinc-600 italic py-8">Aucune intervention pour le moment. Que la bataille commence !</div>
          )}
        </div>
      </footer>
    </div>
  );
}

function TeamPanel({ team, name, score, icon: Icon, color, bg, border, onAction }: any) {
  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <motion.div 
        key={score}
        initial={{ scale: 1.2, color: '#fff' }}
        animate={{ scale: 1, color: '' }}
        className={`text-8xl md:text-9xl font-black mb-6 font-mono tracking-tighter drop-shadow-2xl ${color}`}
      >
        {score}
      </motion.div>
      
      <div className={`flex items-center gap-3 mb-12 px-6 py-2 rounded-full border ${border} bg-zinc-900/50 backdrop-blur-sm shadow-lg`}>
        <Icon className={color} size={24} />
        <h2 className={`text-xl font-bold uppercase tracking-widest ${color}`}>{name}</h2>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {ACTIONS.map(action => {
          const ActionIcon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction(action)}
              className={`group relative overflow-hidden rounded-xl border ${border} bg-zinc-900/80 p-4 transition-all hover:scale-105 hover:bg-zinc-800 active:scale-95 shadow-xl`}
            >
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${bg}`} />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <ActionIcon className={`${color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`} size={28} />
                <span className="text-sm font-medium text-zinc-300">{action.label}</span>
                <span className={`text-xs font-mono font-bold ${color}`}>+{action.points}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}

function Vortex({ goldPercentage, premiumPercentage, totalScore }: any) {
  // Base rotation speed (faster when more total score, but capped)
  const speed = Math.max(3, 20 - totalScore * 0.05);

  return (
    <div className="relative w-[400px] h-[400px] md:w-[600px] md:h-[600px] flex items-center justify-center opacity-90">
      {/* Outer Glow */}
      <motion.div 
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{
          background: `conic-gradient(from 0deg, #fbbf24 ${goldPercentage}%, #22c55e ${goldPercentage}% 100%)`
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed * 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Vortex Rings */}
      {[...Array(6)].map((_, i) => {
        const size = 100 + i * 16; // Percentage size
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full border border-dashed"
            style={{
              width: `${size}%`,
              height: `${size}%`,
              borderColor: i % 2 === 0 ? '#fbbf24' : '#22c55e',
              opacity: 0.15 + (i * 0.05),
              borderWidth: 1 + (i * 0.5)
            }}
            animate={{ 
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.02, 1]
            }}
            transition={{
              rotate: { duration: speed + i * 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        )
      })}

      {/* Center Core */}
      <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-950 border-4 border-zinc-800 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `conic-gradient(from 0deg, #fbbf24 ${goldPercentage}%, #22c55e ${goldPercentage}% 100%)`
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <Trophy className="relative z-10 text-zinc-300" size={40} />
      </div>
      
      {/* Tension Line */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[150%] h-[2px] bg-gradient-to-r from-yellow-500 via-zinc-500 to-emerald-500 opacity-40"
          animate={{ 
            rotate: (goldPercentage - 50) * 1.5 // Rotates based on who is winning
          }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
        />
      </div>
    </div>
  );
}
