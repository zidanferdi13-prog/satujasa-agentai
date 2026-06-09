interface EmptyStateProps {
  title?: string
  message: string
  icon?: React.ReactNode
}

export function EmptyState({ title = 'Tidak ada data', message, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">{message}</p>
    </div>
  )
}
