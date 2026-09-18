import React, { useState } from 'react';
import { Project } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { Database, Upload, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface MigrationModalProps {
  localProjects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onMigrationComplete: () => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({
  localProjects,
  isOpen,
  onClose,
  onMigrationComplete,
}) => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleStartMigration = async () => {
    setIsMigrating(true);
    setErrorMsg(null);
    setProgress(0);
    setStatusMessage('Preparing migration to Cloud Firestore...');

    try {
      const total = localProjects.length;
      let count = 0;

      for (const project of localProjects) {
        count++;
        setStatusMessage(`Migrating project ${count}/${total}: "${project.name}"...`);

        // Check if project already exists in Firestore
        const existing = await FirebaseService.getProjectById(project.id);
        if (!existing) {
          await FirebaseService.saveProject(project);
        } else {
          setStatusMessage(`Project "${project.name}" already exists in Firestore. Skipping...`);
        }

        setProgress(Math.round((count / total) * 100));
      }

      setStatusMessage('Migration finished successfully!');
      setIsDone(true);
      setIsMigrating(false);
      onMigrationComplete();
    } catch (err: any) {
      console.error('Migration error:', err);
      setErrorMsg(err.message || 'Failed to complete migration to Firebase.');
      setIsMigrating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isMigrating}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950 border border-slate-800 transition disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Migrate Local Projects to Firebase</h3>
            <p className="text-xs text-slate-400">
              Found {localProjects.length} local project(s) in this browser.
            </p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          Transfer local browser projects into Cloud Firestore and upload screenshots to Firebase Storage so your projects become permanently accessible across all browsers and devices.
        </p>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isMigrating && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>{statusMessage}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {isDone && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>All projects successfully synced to Cloud Firestore!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          {!isDone ? (
            <button
              onClick={handleStartMigration}
              disabled={isMigrating}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isMigrating ? 'Migrating...' : 'Start Migration Now'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs md:text-sm transition"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
