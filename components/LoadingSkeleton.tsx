// Loading skeleton components for better UX

export function StatCardSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-slate-800"></div>
        <div className="w-5 h-5 rounded bg-slate-800"></div>
      </div>
      <div>
        <div className="h-8 w-20 bg-slate-800 rounded mb-2"></div>
        <div className="h-4 w-24 bg-slate-800 rounded mb-2"></div>
        <div className="h-3 w-16 bg-slate-800 rounded"></div>
      </div>
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg animate-pulse">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-slate-700"></div>
        <div className="flex-1">
          <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
          <div className="h-3 w-40 bg-slate-700 rounded"></div>
        </div>
      </div>
      <div className="text-right">
        <div className="h-4 w-16 bg-slate-700 rounded mb-2 ml-auto"></div>
        <div className="h-3 w-20 bg-slate-700 rounded ml-auto"></div>
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 animate-pulse">
      <div className="h-6 w-48 bg-slate-800 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-800 rounded"></div>
        <div className="h-4 w-3/4 bg-slate-800 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-4 w-64 bg-slate-800 rounded animate-pulse"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="h-6 w-32 bg-slate-800 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-slate-800 rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="h-8 w-64 bg-slate-800 rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <CardSkeleton />
    </div>
  )
}
