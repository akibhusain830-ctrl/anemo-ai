'use client'

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

// ================= ICONS =================
const ConversationsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> );
const ResolutionIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg> );
const SpeedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> );
const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> );
const DocumentsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> );
const UploadIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> );

// ================= TYPES =================
interface KpiCardProps { title: string; value: string | number; subtitle?: string; icon?: ReactNode; delay?: number; }
interface EmbedWidgetProps { delay?: number; }
interface QuickActionProps { title: string; description: string; icon: ReactNode; href: string; delay?: number; }
interface DashboardStats { totalConversations: number; resolutionRate: number; avgResponseTime: number; }

// ================= COMPONENTS =================
const KpiCard = ({ title, value, subtitle, icon, delay }: KpiCardProps) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: delay }} className="bg-gradient-to-b from-slate-900 to-[#1c1c1c] p-6 rounded-2xl border border-slate-800">
    <div className="flex justify-between items-center mb-2"><p className="text-sm text-slate-400">{title}</p><div className="text-slate-500">{icon}</div></div>
    <p className="text-4xl font-bold mb-1">{value}</p>
    {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
  </motion.div>
);

const QuickActionCard = ({ title, description, icon, href, delay }: QuickActionProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay: delay }}
    className="bg-gradient-to-b from-slate-900/50 to-[#1c1c1c]/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors group"
  >
    <Link href={href} className="block">
      <div className="flex items-center gap-4 mb-3">
        <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

const EmbedCodeWidget = ({ delay }: EmbedWidgetProps) => {
  const codeSnippet = `<script src="https://cdn.anemo.ai/widget.js" data-bot-id="USER-UNIQUE-ID" async defer></script>`;
  const [copyText, setCopyText] = useState('Copy');
  const { addToast } = useToast();
  
  const handleCopy = async () => { 
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopyText('Copied!');
      addToast({
        type: 'success',
        title: 'Code copied!',
        message: 'Embed code has been copied to your clipboard.'
      });
      setTimeout(() => setCopyText('Copy'), 2000);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Copy failed',
        message: 'Failed to copy code to clipboard. Please try again.'
      });
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: delay }} className="md:col-span-2 lg:col-span-3 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
      <h3 className="text-lg font-bold">Embed Your Chatbot</h3>
      <p className="text-sm text-slate-400 mt-1 mb-4">Paste this snippet into your website&apos;s HTML right before the closing <code>&lt;/body&gt;</code> tag.</p>
      <div className="bg-black rounded-lg p-4 flex items-center justify-between">
        <code className="text-sm text-slate-300 overflow-x-auto whitespace-nowrap">{codeSnippet}</code>
        <button onClick={handleCopy} className="ml-4 flex-shrink-0 flex items-center gap-2 bg-slate-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-slate-600 transition-colors">{copyText === 'Copy' ? <CopyIcon /> : <CheckIcon />}{copyText}</button>
      </div>
    </motion.div>
  );
};

// ================= PAGE =================
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-400 animate-pulse">Loading dashboard data...</div>;
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, here&apos;s a summary of your bot&apos;s activity.</p>
        </div>
      </header>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <KpiCard title="Total Conversations" value={stats?.totalConversations?.toLocaleString() || '0'} subtitle="Last 30 days" icon={<ConversationsIcon />} delay={0.1} />
        <KpiCard title="Resolution Rate" value={`${stats?.resolutionRate || 0}%`} subtitle="Automated" icon={<ResolutionIcon />} delay={0.2} />
        <KpiCard title="Avg. Response Time" value={`${stats?.avgResponseTime || 0}s`} subtitle="Instantaneous" icon={<SpeedIcon />} delay={0.3} />
        <EmbedCodeWidget delay={0.4} />
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-2">Quick Actions</h2>
          <p className="text-slate-400 text-sm">Common tasks to manage your chatbot.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActionCard
            title="Upload Documents"
            description="Upload PDFs to expand your chatbot's knowledge base"
            icon={<UploadIcon />}
            href="/upload"
            delay={0.6}
          />
          <QuickActionCard
            title="Manage Documents"
            description="View, edit, and organize your document library"
            icon={<DocumentsIcon />}
            href="/documents"
            delay={0.7}
          />
        </div>
      </div>
    </div>
  );
}
