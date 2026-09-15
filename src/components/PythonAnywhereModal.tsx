import React, { useState } from 'react';
import { X, Download, Terminal, Server, Check, ExternalLink, Copy, FolderArchive } from 'lucide-react';

interface PythonAnywhereModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonAnywhereModal: React.FC<PythonAnywhereModalProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const wsgiCode = `import os
import sys

# Replace with your actual PythonAnywhere username:
path = '/home/<your-username>/django_supermall'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'supermall.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">Download SuperMall Django ZIP</h3>
              <p className="text-xs text-stone-400">Pre-configured package for PythonAnywhere & Linux hosts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 leading-relaxed">
          {/* Direct Download Callout */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif font-bold text-stone-900 text-sm">
                SuperMall Malawi Django Project Archive
              </h4>
              <p className="text-stone-600 text-xs">
                Includes all Django models, views, templates, Tailwind styles, JavaScript cart & booking, seed data, and PythonAnywhere deployment config.
              </p>
            </div>
            <a
              href="/supermall_django.zip"
              download="supermall_django.zip"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP (35 Files)</span>
            </a>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-600" />
              <span>Quick PythonAnywhere Setup Instructions</span>
            </h4>

            {/* Step 1 */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>Step 1: Upload and Unzip in Bash Console</span>
                <button
                  onClick={() => copyToClipboard('unzip supermall_django.zip', 1)}
                  className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800"
                >
                  {copiedStep === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStep === 1 ? 'Copied' : 'Copy command'}</span>
                </button>
              </div>
              <p className="text-stone-600 text-[11px]">
                Upload <code>supermall_django.zip</code> in your PythonAnywhere <strong>Files</strong> tab to <code>/home/&lt;username&gt;/</code>, then run in a Bash Console:
              </p>
              <pre className="bg-stone-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                unzip supermall_django.zip
              </pre>
            </div>

            {/* Step 2 */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>Step 2: Virtualenv & Dependency Installation</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'mkvirtualenv --python=/usr/bin/python3.10 supermall-venv\ncd ~/django_supermall\npip install -r requirements.txt',
                      2
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800"
                >
                  {copiedStep === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStep === 2 ? 'Copied' : 'Copy commands'}</span>
                </button>
              </div>
              <pre className="bg-stone-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
{`mkvirtualenv --python=/usr/bin/python3.10 supermall-venv
cd ~/django_supermall
pip install -r requirements.txt`}
              </pre>
            </div>

            {/* Step 3 */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>Step 3: Migrations, Malawi Seed Data & Static Files</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      'python manage.py makemigrations mall\npython manage.py migrate\npython manage.py seed_mall\npython manage.py collectstatic --noinput',
                      3
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800"
                >
                  {copiedStep === 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStep === 3 ? 'Copied' : 'Copy commands'}</span>
                </button>
              </div>
              <pre className="bg-stone-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
{`python manage.py makemigrations mall
python manage.py migrate
python manage.py seed_mall
python manage.py collectstatic --noinput`}
              </pre>
            </div>

            {/* Step 4 */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between font-semibold text-stone-900">
                <span>Step 4: WSGI File Configuration</span>
                <button
                  onClick={() => copyToClipboard(wsgiCode, 4)}
                  className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800"
                >
                  {copiedStep === 4 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStep === 4 ? 'Copied WSGI' : 'Copy WSGI snippet'}</span>
                </button>
              </div>
              <p className="text-stone-600 text-[11px]">
                In PythonAnywhere <strong>Web</strong> tab, click <strong>WSGI configuration file</strong>, clear it, and paste:
              </p>
              <pre className="bg-stone-900 text-stone-300 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                {wsgiCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Guide also saved inside the zip as <code>PYTHONANYWHERE_DEPLOYMENT_GUIDE.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-xl text-xs hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
