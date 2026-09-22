function WorkspaceTabRail({ tabs, activeTab, onChange, className = '' }) {
  if (!tabs?.length) return null;

  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.id === activeTab));
  const hasActive = tabs.some((tab) => tab.id === activeTab);

  return (
    <div
      className={`workspace-tab-rail ${className} workspace-tab-rail-count-${tabs.length}`}
      style={{ '--workspace-tab-count': tabs.length, '--workspace-tab-index': activeIndex }}
    >
      {hasActive && <span className="workspace-tab-slider" aria-hidden="true" />}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? 'workspace-tab active' : 'workspace-tab'}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default function WorkspaceTabs({ tabs, leftTabs, rightTabs, activeTab, onChange }) {
  if (tabs) {
    return (
      <nav className="workspace-tabs" aria-label="Workspace sections">
        <WorkspaceTabRail tabs={tabs} activeTab={activeTab} onChange={onChange} />
      </nav>
    );
  }

  return (
    <nav className="workspace-tabs workspace-tabs-split" aria-label="Workspace sections">
      <WorkspaceTabRail className="workspace-tab-rail-left" tabs={leftTabs || []} activeTab={activeTab} onChange={onChange} />
      <WorkspaceTabRail className="workspace-tab-rail-right" tabs={rightTabs || []} activeTab={activeTab} onChange={onChange} />
    </nav>
  );
}
