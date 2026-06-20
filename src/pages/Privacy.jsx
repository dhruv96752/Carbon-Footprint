import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Download,
  Lock,
  Shield,
  Trash2,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { dataInventory, exportAll, wipeAll } from '../lib/security';
import { useToast } from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/ui/Reveal';

export default function Privacy() {
  const [inventory] = useState(() => dataInventory());
  const [wipeModal, setWipeModal] = useState(false);
  const toast = useToast();

  const handleExport = () => {
    try {
      exportAll();
      toast.success('Data exported — check your downloads folder!');
    } catch {
      toast.error('Export failed. Your browser may block downloads here.');
    }
  };

  const handleWipe = () => {
    const count = wipeAll();
    setWipeModal(false);
    toast.success(`Erased ${count} data entries. Fresh start!`);
    // Reload to reflect clean state
    setTimeout(() => window.location.reload(), 1200);
  };

  const totalSize = inventory.reduce((s, i) => s + i.size, 0);
  const totalKeys = inventory.length;

  const securityFeatures = [
    {
      icon: WifiOff,
      title: 'Zero Network Calls',
      desc: 'Verdant makes no API requests, sends no data, and contacts no servers. Everything runs in your browser.',
    },
    {
      icon: Lock,
      title: '100% Local Storage',
      desc: 'All data lives in your browser\'s localStorage under the "verdant:" namespace. Nothing is uploaded.',
    },
    {
      icon: Shield,
      title: 'Content Security Policy',
      desc: 'A strict CSP meta tag restricts scripts, styles, and connections to this origin only. No third-party code injection.',
    },
    {
      icon: CheckCircle2,
      title: 'Input Sanitization',
      desc: 'All user input (especially chat messages) passes through a sanitization layer before processing. Defense-in-depth.',
    },
    {
      icon: Database,
      title: 'Full Data Transparency',
      desc: 'The inventory below shows exactly what Verdant stores — keys, types, and sizes. Full control, zero secrets.',
    },
    {
      icon: Download,
      title: 'Data Portability',
      desc: 'Export everything as a clean JSON file with one click. Your data, your format, your possession.',
    },
  ];

  return (
    <PageTransition className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Reveal>
          <div className="text-center mb-12">
            <div className="mx-auto grid mb-4 h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-soft">
              <Shield className="h-8 w-8" strokeWidth={2} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-earth-950 dark:text-white mb-3">
              Privacy & Security Center
            </h1>
            <p className="text-earth-500 dark:text-earth-400 max-w-lg mx-auto">
              Verdant is built with privacy-first principles. Here's exactly how your data is handled — and how it isn't.
            </p>
          </div>
        </Reveal>

        {/* Security features grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {securityFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card p-5"
              >
                <Icon className="h-6 w-6 text-leaf-500 mb-3" />
                <h3 className="font-bold text-earth-950 dark:text-white text-sm mb-1">{feat.title}</h3>
                <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Data inventory */}
        <Reveal>
          <div className="card p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-bold text-earth-950 dark:text-white mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-leaf-500" />
              Your Data Inventory
            </h2>
            <p className="text-sm text-earth-500 mb-4">
              {totalKeys} entries · {(totalSize / 1024).toFixed(1)} KB total
            </p>
            {inventory.length === 0 ? (
              <p className="text-sm text-earth-400 italic">No data stored yet. Complete the survey to start.</p>
            ) : (
              <div className="space-y-2">
                {inventory.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-lg border border-earth-100 dark:border-earth-800 bg-earth-50/50 dark:bg-earth-950/50 px-4 py-2.5 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <code className="font-mono text-xs text-leaf-600 dark:text-leaf-400">verdant:{item.key}</code>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-earth-500">
                      <span className="pill bg-earth-100 dark:bg-earth-800">{item.type}</span>
                      {item.entries != null && <span>{item.entries} items</span>}
                      <span>{(item.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Actions */}
        <Reveal>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleExport} className="btn-ghost flex-1">
              <Download className="h-4 w-4" /> Export All Data (JSON)
            </button>
            <button
              onClick={() => setWipeModal(true)}
              className="btn-ghost flex-1 border-red-200 dark:border-red-900 text-red-600 hover:border-red-400 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" /> Erase All Data
            </button>
          </div>
        </Reveal>

        {/* Wipe confirmation modal */}
        <Modal open={wipeModal} onClose={() => setWipeModal(false)} title="Erase all data?">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-earth-600 dark:text-earth-400">
              This will permanently delete all your Verdant data — footprint, streak, badges, chat history,
              everything. This action <strong>cannot be undone</strong>.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setWipeModal(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleWipe} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500 transition">
              <Trash2 className="h-4 w-4" /> Yes, erase everything
            </button>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
