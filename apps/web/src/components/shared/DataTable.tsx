interface DataTableColumn<T> {
  key: keyof T
  label: string
  render?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (row: T, index: number) => string
  isLoading?: boolean
  isEmpty?: boolean
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  isEmpty = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (isEmpty || data.length === 0) {
    return <div className="text-center py-8 text-slate-500">No data available</div>
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3 text-left font-semibold text-slate-700">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={keyExtractor(row, idx)} className="border-b hover:bg-slate-50">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-6 py-3 text-slate-700">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
