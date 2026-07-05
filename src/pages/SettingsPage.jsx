import { AuthPanel } from '../components/AuthPanel';
import { SettingsCenter } from '../components/SettingsCenter';

export function SettingsPage({
  authState,
  syncState,
  settingsMessage,
  mode,
  records,
  storageEstimate,
  onSendOtp,
  onSignOut,
  onExport,
  onImport,
  onCreateBackup,
  onRestoreBackup,
  onClearAll,
  onFactoryReset,
  onRefreshStorage,
  onUpgradeDatabase,
}) {
  return (
    <>
      <AuthPanel
        authState={authState}
        syncState={syncState}
        onSendOtp={onSendOtp}
        onSignOut={onSignOut}
      />
      <SettingsCenter
        mode={mode}
        records={records}
        storageEstimate={storageEstimate}
        message={settingsMessage || syncState.message}
        onExport={onExport}
        onImport={onImport}
        onCreateBackup={onCreateBackup}
        onRestoreBackup={onRestoreBackup}
        onClearAll={onClearAll}
        onFactoryReset={onFactoryReset}
        onRefreshStorage={onRefreshStorage}
        onUpgradeDatabase={onUpgradeDatabase}
      />
    </>
  );
}
