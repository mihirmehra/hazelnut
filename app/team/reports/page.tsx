'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TeamNav } from '@/components/team/team-nav'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import {
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Loader2,
  MessagesSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AgentMetric {
  id: string
  full_name: string
  email: string
  gmail_address: string
  role: string
  total_tickets: number
  open_tickets: number
  in_progress_tickets: number
  waiting_for_response_tickets: number
  resolved_tickets: number
  closed_tickets: number
  total_clients: number
  total_excel_uploads: number
  avg_response_time_hours: number
}

interface AgentClientDetail {
  agent_id: string
  agent_name: string
  customer_id: string
  company_name: string
  contact_person: string
  customer_email: string
  tickets_count: number
  resolved_count: number
  closed_count: number
  in_progress_count: number
  open_count: number
  excel_files_count: number
  last_message_time: string | null
}

interface Summary {
  totalAgents: number
  totalTickets: number
  totalResolvedTickets: number
  totalClosedTickets: number
  totalOpenTickets: number
  totalInProgressTickets: number
  totalWaitingForResponseTickets: number
  totalClients: number
  avgResponseTime: number
}

const roleLabels: Record<string, string> = {
  agent: 'Agent',
  manager: 'Manager',
  super_admin: 'Super Admin',
  accountant: 'Accountant',
}

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [agentMetrics, setAgentMetrics] = useState<AgentMetric[]>([])
  const [agentClientDetails, setAgentClientDetails] = useState<AgentClientDetail[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Agent table filters
  const [agentSearch, setAgentSearch] = useState('')
  const [agentRoleFilter, setAgentRoleFilter] = useState('all')

  // Client detail table filters
  const [clientSearch, setClientSearch] = useState('')
  const [clientAgentFilter, setClientAgentFilter] = useState('all')
  const [clientStatusFilter, setClientStatusFilter] = useState('all')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/session', { credentials: 'include' })
        if (!sessionResponse.ok) {
          router.push('/team/login')
          return
        }

        const sessionData = await sessionResponse.json()
        if (sessionData.type !== 'team' || sessionData.session?.role !== 'super_admin') {
          router.push('/team/dashboard')
          return
        }

        setUser(sessionData.session)

        const reportResponse = await fetch('/api/reports/agent-performance', { credentials: 'include' })
        if (reportResponse.ok) {
          const data = await reportResponse.json()
          setAgentMetrics(data.agentMetrics || [])
          setAgentClientDetails(data.agentClientDetails || [])
          setSummary(data.summary)
        } else {
          const errData = await reportResponse.json()
          setError(errData.error || 'Failed to load reports')
        }
      } catch (err) {
        console.error('[v0] Error fetching reports:', err)
        setError('An error occurred while loading reports')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'team' }),
      })
      router.push('/team/login')
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  // Filtered agents
  const filteredAgents = useMemo(() => {
    let list = [...agentMetrics]
    if (agentSearch.trim()) {
      const q = agentSearch.toLowerCase()
      list = list.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      )
    }
    if (agentRoleFilter !== 'all') {
      list = list.filter((a) => a.role === agentRoleFilter)
    }
    return list
  }, [agentMetrics, agentSearch, agentRoleFilter])

  // Unique agent names for filter dropdown
  const uniqueAgentNames = useMemo(
    () => Array.from(new Set(agentClientDetails.map((d) => d.agent_name))).sort(),
    [agentClientDetails]
  )

  // Filtered client details
  const filteredClientDetails = useMemo(() => {
    let list = [...agentClientDetails]
    if (clientSearch.trim()) {
      const q = clientSearch.toLowerCase()
      list = list.filter(
        (d) =>
          d.agent_name.toLowerCase().includes(q) ||
          d.company_name?.toLowerCase().includes(q) ||
          d.contact_person?.toLowerCase().includes(q) ||
          d.customer_email?.toLowerCase().includes(q)
      )
    }
    if (clientAgentFilter !== 'all') {
      list = list.filter((d) => d.agent_name === clientAgentFilter)
    }
    if (clientStatusFilter === 'has_open') {
      list = list.filter((d) => d.open_count > 0)
    } else if (clientStatusFilter === 'has_in_progress') {
      list = list.filter((d) => d.in_progress_count > 0)
    } else if (clientStatusFilter === 'fully_resolved') {
      list = list.filter((d) => d.tickets_count > 0 && d.open_count === 0 && d.in_progress_count === 0)
    }
    return list
  }, [agentClientDetails, clientSearch, clientAgentFilter, clientStatusFilter])

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <TeamNav user={null} onLogout={handleLogout} />
          <SidebarInset>
            <main className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 space-y-6">
                <Skeleton className="h-9 w-64" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
                </div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <TeamNav user={user} onLogout={handleLogout} />
          <SidebarInset>
            <main className="flex-1 overflow-auto flex items-center justify-center">
              <div className="text-center space-y-3">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <p className="text-lg font-medium text-destructive">{error}</p>
                <Button variant="outline" onClick={() => router.refresh()}>Retry</Button>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    )
  }

  if (!user) return null

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <TeamNav user={user} onLogout={handleLogout} />
        <SidebarInset>
          <header className="flex items-center gap-2 border-b p-4 md:hidden">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Agent Reports</h1>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 space-y-8">
              <div className="hidden md:block">
                <h1 className="text-3xl font-bold tracking-tight">Agent Performance Reports</h1>
                <p className="text-muted-foreground mt-1">Overview of all agent activity and customer assignments</p>
              </div>

              {/* ─── Overall Summary Cards ─── */}
              <section>
                <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Overall Summary — All Agents Combined
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <SummaryCard
                    label="Total Agents"
                    value={summary?.totalAgents ?? 0}
                    icon={Users}
                    iconClass="bg-primary/10 text-primary"
                  />
                  <SummaryCard
                    label="Total Customers"
                    value={summary?.totalClients ?? 0}
                    icon={TrendingUp}
                    iconClass="bg-chart-1/10 text-chart-1"
                  />
                  <SummaryCard
                    label="Open"
                    value={summary?.totalOpenTickets ?? 0}
                    icon={AlertCircle}
                    iconClass="bg-warning/10 text-warning"
                    sub="tickets"
                  />
                  <SummaryCard
                    label="In Progress"
                    value={summary?.totalInProgressTickets ?? 0}
                    icon={Loader2}
                    iconClass="bg-chart-1/10 text-chart-1"
                    sub="tickets"
                  />
                  <SummaryCard
                    label="Waiting Response"
                    value={summary?.totalWaitingForResponseTickets ?? 0}
                    icon={MessagesSquare}
                    iconClass="bg-chart-4/10 text-chart-4"
                    sub="tickets"
                  />
                  <SummaryCard
                    label="Resolved"
                    value={summary?.totalResolvedTickets ?? 0}
                    icon={CheckCircle2}
                    iconClass="bg-success/10 text-success"
                    sub="tickets"
                  />
                  <SummaryCard
                    label="Closed"
                    value={summary?.totalClosedTickets ?? 0}
                    icon={XCircle}
                    iconClass="bg-muted/60 text-muted-foreground"
                    sub="tickets"
                  />
                  <SummaryCard
                    label="Total Tickets"
                    value={summary?.totalTickets ?? 0}
                    icon={BarChart3}
                    iconClass="bg-primary/10 text-primary"
                    sub="all agents"
                  />
                  <SummaryCard
                    label="Avg Response"
                    value={`${summary?.avgResponseTime ?? 0}h`}
                    icon={Clock}
                    iconClass="bg-muted/60 text-muted-foreground"
                    sub="across all agents"
                  />
                </div>
              </section>

              {/* ─── Per-Agent Stats Table ─── */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
                    Per-Agent Breakdown
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search agents..."
                        value={agentSearch}
                        onChange={(e) => setAgentSearch(e.target.value)}
                        className="pl-9 w-[200px]"
                      />
                    </div>
                    <Select value={agentRoleFilter} onValueChange={setAgentRoleFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                      </SelectContent>
                    </Select>
                    {(agentSearch || agentRoleFilter !== 'all') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setAgentSearch(''); setAgentRoleFilter('all') }}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" /> Clear
                      </Button>
                    )}
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-semibold">Agent</TableHead>
                            <TableHead className="font-semibold">Role</TableHead>
                            <TableHead className="text-center font-semibold">Customers</TableHead>
                            <TableHead className="text-center font-semibold">Total Tickets</TableHead>
                            <TableHead className="text-center font-semibold">Open</TableHead>
                            <TableHead className="text-center font-semibold">In Progress</TableHead>
                            <TableHead className="text-center font-semibold">Waiting</TableHead>
                            <TableHead className="text-center font-semibold">Resolved</TableHead>
                            <TableHead className="text-center font-semibold">Closed</TableHead>
                            <TableHead className="text-center font-semibold">Avg Response</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAgents.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                                No agents found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredAgents.map((agent) => (
                              <TableRow key={agent.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{agent.full_name}</div>
                                    <div className="text-xs text-muted-foreground">{agent.email}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {roleLabels[agent.role] ?? agent.role}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center font-semibold">{agent.total_clients}</TableCell>
                                <TableCell className="text-center font-semibold">{agent.total_tickets}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                                    {agent.open_tickets}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/30">
                                    {agent.in_progress_tickets}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/30">
                                    {agent.waiting_for_response_tickets}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                                    {agent.resolved_tickets}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="text-muted-foreground">
                                    {agent.closed_tickets}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center text-sm">
                                  {(agent.avg_response_time_hours ?? 0).toFixed(2)}h
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-2">
                  Showing {filteredAgents.length} of {agentMetrics.length} agents
                </p>
              </section>

              {/* ─── Agent-Client Details Table ─── */}
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
                      Agent — Customer Detail
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Individual customer assignments per agent with ticket breakdown</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="pl-9 w-[180px]"
                      />
                    </div>
                    <Select value={clientAgentFilter} onValueChange={setClientAgentFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Agents" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Agents</SelectItem>
                        {uniqueAgentNames.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={clientStatusFilter} onValueChange={setClientStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="has_open">Has Open Tickets</SelectItem>
                        <SelectItem value="has_in_progress">Has In Progress</SelectItem>
                        <SelectItem value="fully_resolved">Fully Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    {(clientSearch || clientAgentFilter !== 'all' || clientStatusFilter !== 'all') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setClientSearch(''); setClientAgentFilter('all'); setClientStatusFilter('all') }}
                        className="gap-1"
                      >
                        <X className="h-4 w-4" /> Clear
                      </Button>
                    )}
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead className="font-semibold">Agent</TableHead>
                            <TableHead className="font-semibold">Customer Company</TableHead>
                            <TableHead className="font-semibold">Contact</TableHead>
                            <TableHead className="text-center font-semibold">Total</TableHead>
                            <TableHead className="text-center font-semibold">Open</TableHead>
                            <TableHead className="text-center font-semibold">In Progress</TableHead>
                            <TableHead className="text-center font-semibold">Waiting</TableHead>
                            <TableHead className="text-center font-semibold">Resolved</TableHead>
                            <TableHead className="text-center font-semibold">Closed</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">Last Message</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClientDetails.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                                No assignments found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredClientDetails.map((detail, index) => (
                              <TableRow key={`${detail.agent_id}-${detail.customer_id}-${index}`}>
                                <TableCell className="font-medium">{detail.agent_name}</TableCell>
                                <TableCell>{detail.company_name || 'N/A'}</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="text-sm">{detail.contact_person || '—'}</div>
                                    <div className="text-xs text-muted-foreground">{detail.customer_email}</div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center font-semibold">{detail.tickets_count}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className={cn(
                                    "text-xs",
                                    detail.open_count > 0
                                      ? "bg-warning/10 text-warning border-warning/30"
                                      : "text-muted-foreground"
                                  )}>
                                    {detail.open_count ?? 0}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className={cn(
                                    "text-xs",
                                    detail.in_progress_count > 0
                                      ? "bg-chart-1/10 text-chart-1 border-chart-1/30"
                                      : "text-muted-foreground"
                                  )}>
                                    {detail.in_progress_count}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="text-xs text-muted-foreground">
                                    {(detail as any).waiting_count ?? 0}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className={cn(
                                    "text-xs",
                                    detail.resolved_count > 0
                                      ? "bg-success/10 text-success border-success/30"
                                      : "text-muted-foreground"
                                  )}>
                                    {detail.resolved_count}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="text-xs text-muted-foreground">
                                    {detail.closed_count ?? 0}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                                  {detail.last_message_time
                                    ? new Date(detail.last_message_time).toLocaleDateString()
                                    : '—'}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground mt-2">
                  Showing {filteredClientDetails.length} of {agentClientDetails.length} assignments
                </p>
              </section>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

interface SummaryCardProps {
  label: string
  value: number | string
  icon: React.ElementType
  iconClass?: string
  sub?: string
}

function SummaryCard({ label, value, icon: Icon, iconClass, sub }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconClass || "bg-muted")}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  )
}
