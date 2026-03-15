import { useState } from 'react'
import ScopeOfWorkTab  from './tabs/ScopeOfWorkTab.jsx'
import WBSTab          from './tabs/WBSTab.jsx'
import RiskRegisterTab from './tabs/RiskRegisterTab.jsx'
import GanttTab        from './tabs/GanttTab.jsx'
import PERTTab         from './tabs/PERTTab.jsx'
import ExportPanel     from './ExportPanel.jsx'

const TABS = [
  { id: 'sow',   label: '📋 Scope of Work' },
  { id: 'wbs',   label: '🗂 WBS' },
  { id: 'risk',  label: '⚠️ Risk Register' },
  { id: 'gantt', label: '📅 Gantt Chart' },
  { id: 'pert',  label: '🔗 PERT' },
]

export default function ResultsDashboard({ analysisData, statuses }) {
  const [activeTab, setActiveTab] = useState('sow')

  return (
    <div className="rm-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 4, flexWrap: 'wrap',
        borderBottom: '2px solid var(--rm-border)',
        marginBottom: 20,
      }}>
        {TABS.map(tab => {
          const active = tab.id === activeTab
          const status = statuses?.[tab.id]
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px', border: 'none', cursor: 'pointer',
                fontFamily: 'Sora, sans-serif', fontWeight: active ? 700 : 500,
                fontSize: '0.85rem',
                borderRadius: '10px 10px 0 0',
                background: active ? 'rgba(234,91,47,0.10)' : 'transparent',
                color: active ? 'var(--rm-brand)' : 'var(--rm-muted)',
                borderBottom: active ? '2px solid var(--rm-brand)' : '2px solid transparent',
                marginBottom: -2,
                position: 'relative',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              {status === 'running' && (
                <span style={{ marginLeft: 6, display: 'inline-block',
                  width: 7, height: 7, borderRadius: '50%', background: 'var(--rm-brand-2)',
                  verticalAlign: 'middle' }} />
              )}
              {status === 'error' && (
                <span style={{ marginLeft: 6, fontSize: '0.7rem', color: 'var(--rm-critical)' }}>✕</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1 }}>
        {activeTab === 'sow'   && <ScopeOfWorkTab  data={analysisData?.sow} />}
        {activeTab === 'wbs'   && <WBSTab          data={analysisData?.wbs} />}
        {activeTab === 'risk'  && <RiskRegisterTab data={analysisData?.risk} />}
        {activeTab === 'gantt' && <GanttTab        data={analysisData?.gantt} />}
        {activeTab === 'pert'  && <PERTTab         data={analysisData?.pert} />}
      </div>

      {/* Sticky export bar */}
      <ExportPanel analysisData={analysisData} />
    </div>
  )
}
