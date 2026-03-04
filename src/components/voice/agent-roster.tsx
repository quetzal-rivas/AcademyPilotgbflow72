'use client';

import type { Agent } from '@/lib/agents';
import { AgentCard } from './agent-card';

interface AgentRosterProps {
  agents: Agent[];
  onCall: (agent: Agent) => void;
  isCalling: boolean;
}

export function AgentRoster({ agents, onCall, isCalling }: AgentRosterProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onCall={onCall}
          isCalling={isCalling}
        />
      ))}
    </div>
  );
}
