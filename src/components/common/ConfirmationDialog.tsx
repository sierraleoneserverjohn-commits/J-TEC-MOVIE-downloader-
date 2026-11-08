import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#13151b] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDestructive ? 'bg-red-950/60 text-red-400 border border-red-800/40' : 'bg-white/5 text-slate-300'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-base text-white">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed pl-12">{message}</p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/50'
                : 'bg-white text-black hover:bg-slate-200'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
