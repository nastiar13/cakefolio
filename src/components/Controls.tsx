import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Trash2, Layers, Heart, Star, Type, Box, Sparkles, Wand2 } from 'lucide-react';
import { CakeConfig, TierConfig, TopperType } from '../types';
import { SPONGE_FLAVORS, FROSTING_FLAVORS } from '../constants';

const DECO_PRICES: Record<string, number> = {
  flower_rose: 5,
  macaron: 3,
  strawberry: 2,
};
const DRIP_PRICE = 10;

type ControlsProps = {
  config: CakeConfig;
  onChange: (config: CakeConfig) => void;
  selectedId?: string | null;
  setSelectedId?: (id: string | null) => void;
};

export default function Controls({ config, onChange, selectedId, setSelectedId }: ControlsProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'details'>('structure');

  const selectedDecorationInfo = useMemo(() => {
    if (!selectedId) return null;
    for (const tier of config.tiers) {
      const deco = tier.decorations.find(d => d.id === selectedId);
      if (deco) return { tier, deco };
    }
    return null;
  }, [config, selectedId]);

  const addTier = () => {
    if (config.tiers.length >= 5) return;
    const lastTier = config.tiers[config.tiers.length - 1];
    const newTier: TierConfig = {
      id: Math.random().toString(36).substr(2, 9),
      radius: Math.max(0.6, lastTier.radius - 0.3),
      height: 0.6,
      flavorId: 'vanilla',
      frostingId: 'buttercream',
      frostingStyle: 'smooth',
      hasDrip: false,
      dripColor: '#3D1C02',
      decorations: [],
    };
    onChange({ ...config, tiers: [...config.tiers, newTier] });
  };

  const removeTier = (id: string) => {
    if (config.tiers.length <= 1) return;
    onChange({ ...config, tiers: config.tiers.filter(t => t.id !== id) });
  };

  const updateTier = (id: string, updates: Partial<TierConfig>) => {
    onChange({
      ...config,
      tiers: config.tiers.map(t => (t.id === id ? { ...t, ...updates } : t)),
    });
  };

  const calculatePrice = () => {
    const base = 120;
    const tierCost = config.tiers.length * 45;
    const decoCost = config.tiers.reduce((acc, t) => {
      const dripCost = t.hasDrip ? DRIP_PRICE : 0;
      const itemsCost = t.decorations.reduce((sum, d) => sum + (DECO_PRICES[d.type] || 0), 0);
      return acc + dripCost + itemsCost;
    }, 0);
    const topperCost = config.topper.type !== 'none' ? 25 : 0;
    return base + tierCost + decoCost + topperCost;
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-80 overflow-y-auto shadow-2xl relative">
      {selectedDecorationInfo ? (
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
          <header className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-brand-pink" />
              Inspector
            </h2>
            <button 
              onClick={() => setSelectedId?.(null)}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Done
            </button>
          </header>
          
          <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase text-brand-pink mb-4">
                {selectedDecorationInfo.deco.type.replace('flower_', '')}
              </div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">Color</label>
              <input 
                type="color" 
                value={selectedDecorationInfo.deco.color || '#ff6b95'} 
                onChange={(e) => {
                  const newColor = e.target.value;
                  const tierId = selectedDecorationInfo.tier.id;
                  const decoId = selectedDecorationInfo.deco.id;
                  updateTier(tierId, {
                    decorations: selectedDecorationInfo.tier.decorations.map(d => d.id === decoId ? { ...d, color: newColor } : d)
                  });
                }}
                className="w-full h-10 rounded-xl border-none cursor-pointer bg-slate-100"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Scale</span>
                <span className="text-slate-600">{selectedDecorationInfo.deco.scale[0].toFixed(2)}x</span>
              </div>
              <input 
                type="range" min="0.2" max="3" step="0.1" 
                value={selectedDecorationInfo.deco.scale[0]}
                onChange={(e) => {
                  const s = parseFloat(e.target.value);
                  const tierId = selectedDecorationInfo.tier.id;
                  const decoId = selectedDecorationInfo.deco.id;
                  updateTier(tierId, {
                    decorations: selectedDecorationInfo.tier.decorations.map(d => d.id === decoId ? { ...d, scale: [s, s, s] } : d)
                  });
                }}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-brand-pink"
              />
            </div>
          </div>

          <button
            onClick={() => {
              const tierId = selectedDecorationInfo.tier.id;
              const decoId = selectedDecorationInfo.deco.id;
              updateTier(tierId, {
                decorations: selectedDecorationInfo.tier.decorations.filter(d => d.id !== decoId)
              });
              setSelectedId?.(null);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase bg-red-50 text-red-500 hover:bg-red-100 transition-all border border-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove Item
          </button>
        </div>
      ) : (
        <>
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('structure')}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'structure' ? 'text-brand-pink border-b-2 border-brand-pink bg-brand-pink-light/30' : 'text-slate-400'
              }`}
            >
              Structure
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'details' ? 'text-brand-pink border-b-2 border-brand-pink bg-brand-pink-light/30' : 'text-slate-400'
              }`}
            >
              Topper & Details
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeTab === 'structure' ? (
          <>
            <header className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-pink" />
                Layer Studio
              </h2>
              <button 
                onClick={addTier}
                disabled={config.tiers.length >= 5}
                className="w-8 h-8 flex items-center justify-center bg-brand-pink text-white rounded-full hover:scale-105 disabled:opacity-30 transition-all shadow-lg shadow-brand-pink/20"
              >
                <Plus className="w-4 h-4" />
              </button>
            </header>

            <AnimatePresence mode="popLayout">
              {[...config.tiers].reverse().map((tier, reversedIdx) => {
                const originalIdx = config.tiers.length - 1 - reversedIdx;
                return (
                <motion.div
                  layout
                  key={tier.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Layer {config.tiers.length - originalIdx}</span>
                    <button 
                      onClick={() => removeTier(tier.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">Frosting Style</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['smooth', 'textured', 'naked'] as const).map(style => (
                          <button
                            key={style}
                            onClick={() => updateTier(tier.id, { frostingStyle: style })}
                            className={`py-2 text-[8px] font-bold uppercase rounded-lg border transition-all ${
                              tier.frostingStyle === style ? 'border-brand-pink bg-brand-pink-light/50 text-brand-pink' : 'border-slate-200 text-slate-400 bg-white'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 block">Coloring</label>
                      <div className="grid grid-cols-5 gap-2">
                        {FROSTING_FLAVORS.map(flavor => (
                          <button
                            key={flavor.id}
                            onClick={() => updateTier(tier.id, { frostingId: flavor.id })}
                            className={`w-full aspect-square rounded-full border-2 transition-all ${
                              tier.frostingId === flavor.id ? 'border-brand-pink scale-110' : 'border-white'
                            }`}
                            style={{ backgroundColor: flavor.hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Width</span>
                          <span className="text-slate-600">{(tier.radius * 2).toFixed(1)}"</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="2.5" step="0.1" value={tier.radius}
                          onChange={(e) => updateTier(tier.id, { radius: parseFloat(e.target.value) })}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-brand-pink"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Height</span>
                          <span className="text-slate-600">{tier.height.toFixed(1)}"</span>
                        </div>
                        <input 
                          type="range" min="0.3" max="1.5" step="0.1" value={tier.height}
                          onChange={(e) => updateTier(tier.id, { height: parseFloat(e.target.value) })}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none accent-brand-pink"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200/50 flex flex-col gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Add Decoration</label>
                      <div className="flex flex-wrap gap-2">
                        {(['flower_rose', 'macaron', 'strawberry'] as const).map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              const newDeco = {
                                id: Math.random().toString(36).substring(2),
                                type,
                                position: [
                                  (Math.random() - 0.5) * tier.radius * 1.5,
                                  tier.height / 2,
                                  (Math.random() - 0.5) * tier.radius * 1.5
                                ] as [number, number, number],
                                rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
                                scale: [1, 1, 1] as [number, number, number]
                              };
                              updateTier(tier.id, { decorations: [...tier.decorations, newDeco] });
                            }}
                            className="flex-1 py-2 rounded-xl text-[9px] font-bold uppercase bg-white border border-slate-200 text-slate-400 hover:border-brand-pink transition-all flex flex-col items-center justify-center gap-1"
                          >
                            <span>+ {type.replace('flower_', '')}</span>
                            <span className="text-[7px] text-slate-300">+${DECO_PRICES[type]}</span>
                          </button>
                        ))}
                        <button
                          onClick={() => updateTier(tier.id, { decorations: [] })}
                          className="w-full py-2 rounded-xl text-[9px] font-bold uppercase bg-slate-100 text-red-400 hover:bg-red-50 transition-all mt-1"
                        >
                          Clear Decorations
                        </button>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1">
                        {tier.decorations.length} items added
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => updateTier(tier.id, { hasDrip: !tier.hasDrip })}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
                          tier.hasDrip ? 'border-brand-pink bg-brand-pink-light/30 text-brand-pink' : 'border-slate-200 text-slate-400'
                        }`}
                      >
                         <span className="text-[10px] font-bold uppercase tracking-tighter">
                           {tier.hasDrip ? 'Remove Drip' : `Add Drip (+$${DRIP_PRICE})`}
                         </span>
                      </button>
                      {tier.hasDrip && (
                        <input type="color" value={tier.dripColor} onChange={(e) => updateTier(tier.id, { dripColor: e.target.value })} className="w-8 h-8 rounded border-none bg-transparent" />
                      )}
                    </div>
                  </div>
                </motion.div>
              )})}
            </AnimatePresence>
          </>
        ) : (
          <div className="space-y-8">
             <div>
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                 <Wand2 className="w-4 h-4 text-brand-pink" />
                 Cake Topper
               </h3>
               <div className="grid grid-cols-4 gap-3 mb-6">
                 {(['none', 'heart', 'star', 'text'] as TopperType[]).map(type => (
                   <button
                    key={type}
                    onClick={() => onChange({ ...config, topper: { ...config.topper, type }})}
                    className={`aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border-2 transition-all ${
                      config.topper.type === type ? 'border-brand-pink bg-brand-pink-light/20 scale-105 shadow-xl shadow-brand-pink/5' : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                   >
                     {type === 'none' && <X className="w-4 h-4 text-slate-300" />}
                     {type === 'heart' && <Heart className="w-4 h-4 text-brand-pink" />}
                     {type === 'star' && <Star className="w-4 h-4 text-yellow-500" />}
                     {type === 'text' && <Type className="w-4 h-4 text-slate-500" />}
                     <span className="text-[8px] font-bold uppercase text-slate-400 tracking-tighter">{type}</span>
                   </button>
                 ))}
               </div>

               {config.topper.type === 'text' && (
                 <div className="space-y-4">
                    <input 
                      type="text"
                      maxLength={12}
                      placeholder="Custom Text"
                      value={config.topper.text}
                      onChange={(e) => onChange({ ...config, topper: { ...config.topper, text: e.target.value }})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                    />
                 </div>
               )}

               <div className="mt-6 flex flex-col gap-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Topper Color</label>
                 <input 
                  type="color" 
                  value={config.topper.color} 
                  onChange={(e) => onChange({ ...config, topper: { ...config.topper, color: e.target.value }})}
                  className="w-full h-10 rounded-xl border-none cursor-pointer bg-slate-100"
                 />
               </div>
             </div>

              <div className="p-6 bg-brand-pink-light/30 rounded-3xl border border-brand-pink/10">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-pink mb-2">Designer Tips</h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Try a <strong>textured</strong> finish on the bottom tier with a <strong>pearl</strong> base for a classic luxury look. Click any decoration on the cake to customize it."
                </p>
              </div>
          </div>
        )}
      </div>
      </>
      )}

      <div className="p-6 bg-slate-50 border-t border-slate-200">
        <div className="flex justify-between items-end mb-4">
          <div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Estimated Total</div>
            <div className="text-3xl font-bold tracking-tighter text-slate-900">${calculatePrice().toFixed(2)}</div>
          </div>
          <div className="text-[9px] text-brand-pink font-bold uppercase tracking-[0.2em]">Prep time: 48h</div>
        </div>
        
        <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold tracking-tight hover:bg-slate-800 transition-all transform active:scale-95 shadow-xl shadow-slate-200">
          Confirm & Reserve
        </button>
      </div>
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
