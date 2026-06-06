/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Cake, Sparkles, ShoppingBag, User } from 'lucide-react';
import { INITIAL_CAKE } from './constants';
import { CakeConfig } from './types';
import CakeCanvas from './components/CakeCanvas';
import Controls from './components/Controls';

export default function App() {
  const [config, setConfig] = useState<CakeConfig>(INITIAL_CAKE);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-pink rounded-lg flex items-center justify-center">
            <Cake className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Tier & Toast <span className="font-normal text-slate-400 ml-1">v2.0</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
              {config.occasion}
            </span>
          </div>
          <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Order Design
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Main 3D Viewport */}
        <section className="flex-1 relative bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#e2e8f0_100%)]">
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-brand-pink" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Professional Studio</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">Live Preview</h3>
              <p className="text-xs text-slate-500 mt-1">{config.tiers.length} Tiers • {config.tiers.reduce((acc, t) => acc + t.height, 0).toFixed(1)}ft Design</p>
            </motion.div>
          </div>

          <CakeCanvas 
            config={config} 
            onChange={setConfig}
            selectedId={selectedId} 
            setSelectedId={setSelectedId} 
          />
        </section>

        {/* Customization Sidebar */}
        <Controls 
          config={config} 
          onChange={setConfig} 
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </main>
    </div>
  );
}

