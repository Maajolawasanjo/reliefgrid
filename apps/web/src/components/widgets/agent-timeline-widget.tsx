'use client';

import React, { useState } from 'react';
import { env } from '@/lib/config';
import { Icon } from '@/components/ui/icons';
import { Spinner } from '@/components/ui/loader';

interface Assignment {
  id: string;
  agent_name: string;
  instruction: string;
  status: string;
  result_summary: string;
}

interface Props {
  incidentId: string;
  token: string | null;
}

export function AgentTimelineWidget({ incidentId, token }: Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [planSummary, setPlanSummary] = useState<string>('');

  React.useEffect(() => {
    const fetchTimeline = async () => {
      if (!token || !incidentId) return;
      try {
        const res = await fetch(`${env.apiUrl}/incidents/${incidentId}/agent-timeline`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const plans = data.plans || [];
          if (plans.length > 0) {
            setPlanSummary(plans[0].plan_summary);
          } else {
            setPlanSummary('');
          }
          setAssignments(data.assignments || []);
        }
      } catch (err) {
        console.error('Failed to fetch agent timeline', err);
      }
    };

    setPlanSummary('');
    setAssignments([]);
    fetchTimeline();
  }, [incidentId, token]);

  const triggerAIAnalysis = async () => {
    if (!token) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${env.apiUrl}/incidents/${incidentId}/analyze`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPlanSummary(data.plan_summary);
        setAssignments(data.assignments || []);
      }
    } catch (err) {
      console.error('AI Orchestration failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-500 animate-ping" />
            AI Multi-Agent Autonomous Command Engine
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Coordinator Agent & Specialist Task Dispatch</p>
        </div>
        <button
          onClick={triggerAIAnalysis}
          disabled={isAnalyzing}
          className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-500 disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5"
        >
          {isAnalyzing ? (
            <>
              <Spinner size="sm" color="white" />
              Orchestrating Bedrock Agents...
            </>
          ) : (
            <>
              <Icon name="ai" size={14} />
              Trigger Agent Reasoning Loop
            </>
          )}
        </button>
      </div>

      {planSummary ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-brand-500/20 bg-brand-500/10 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-400">Coordinator Master Plan</h4>
            <p className="text-sm text-slate-200 mt-1 font-sans leading-relaxed">{planSummary}</p>
          </div>

          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-2">Specialist Dispatch Matrix</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {assignments.map((asg, idx) => (
              <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold font-mono text-emerald-400">{asg.agent_name}</span>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
                    {asg.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{asg.instruction}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-sm text-slate-500">
          Click above to invoke Bedrock Coordinator Agent to analyze situational risks and dispatch tasks.
        </div>
      )}
    </div>
  );
}
