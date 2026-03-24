"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChevronRight,
  User,
  Users,
  Ticket,
  Upload,
  Mail,
  Lock,
  Home,
  Package,
  FileText,
  Activity,
  BarChart3,
  Settings,
  Bell,
  ShieldCheck,
  FolderTree,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  AlertCircle,
  Building2,
  UserCog,
  Eye,
  MessageSquare,
} from "lucide-react"

const ROLES = [
  { name: "Super Admin", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", description: "Full system access. Can manage everything including reports and all users." },
  { name: "Admin", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", description: "Manage customers, products, tickets, and team members." },
  { name: "Manager", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", description: "Manage customers, products, tickets, and view team." },
  { name: "Agent", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", description: "Handle assigned tickets and customer communication." },
  { name: "Accountant / Account", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", description: "Manage invoice requests, upload invoices, view invoice history." },
]

const CUSTOMER_ROLES = [
  { name: "Customer Admin", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", description: "Can approve/reject invoice requests and manage users within the company." },
  { name: "Customer Agent", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", description: "Can create tickets, request invoices, and view products." },
  { name: "Customer Account", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", description: "View-only access to tickets and invoices." },
]

const TICKET_STATUSES = [
  { name: "Pending Approval", color: "bg-yellow-100 text-yellow-800", description: "Ticket submitted and awaiting team approval before it opens." },
  { name: "Open", color: "bg-amber-100 text-amber-800", description: "Ticket is live and awaiting a team response." },
  { name: "In Progress", color: "bg-blue-100 text-blue-800", description: "A team member is actively working on the ticket." },
  { name: "Waiting for Response", color: "bg-purple-100 text-purple-800", description: "Team has replied and is waiting for the customer." },
  { name: "Resolved", color: "bg-green-100 text-green-800", description: "Issue has been resolved by the team." },
  { name: "Closed", color: "bg-gray-100 text-gray-800", description: "Ticket is closed and archived." },
  { name: "Rejected", color: "bg-red-100 text-red-800", description: "Ticket was rejected during approval." },
]

const INVOICE_STATUSES = [
  { name: "Pending Approval", color: "bg-yellow-100 text-yellow-800", description: "Invoice request submitted by a customer user, awaiting customer admin approval." },
  { name: "Approved", color: "bg-blue-100 text-blue-800", description: "Approved by customer admin, waiting for accountant to upload the invoice file." },
  { name: "Invoice Ready", color: "bg-green-100 text-green-800", description: "Invoice uploaded. A countdown timer shows time remaining to download." },
  { name: "Rejected", color: "bg-red-100 text-red-800", description: "Request was rejected with a reason." },
  { name: "Expired", color: "bg-gray-100 text-gray-800", description: "The download window has passed. Customer must request again." },
]

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
          {number}
        </span>
        {title}
      </h3>
      <div className="ml-10 space-y-1.5 text-sm text-muted-foreground">{children}</div>
    </div>
  )
}

function SectionTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
  )
}

export default function DocsPage() {
  const [selectedTab, setSelectedTab] = useState("getting-started")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-base font-bold text-primary-foreground">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none">Hazelnucyborg CRM</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Platform Documentation</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8 h-auto gap-1 p-1">
            <TabsTrigger value="getting-started" className="text-xs">Getting Started</TabsTrigger>
            <TabsTrigger value="roles" className="text-xs">Roles & Access</TabsTrigger>
            <TabsTrigger value="team" className="text-xs">Team Guide</TabsTrigger>
            <TabsTrigger value="customer" className="text-xs">Customer Guide</TabsTrigger>
            <TabsTrigger value="invoices" className="text-xs">Invoices</TabsTrigger>
            <TabsTrigger value="faq" className="text-xs">FAQ</TabsTrigger>
          </TabsList>

          {/* ── GETTING STARTED ── */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Welcome to Hazelnucyborg CRM
                </CardTitle>
                <CardDescription>
                  Hazelnucyborg is an enterprise CRM platform with two separate portals — one for your internal team and one for your customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <Step number={1} title="Access the Correct Portal">
                  <p><strong className="text-foreground">Team Members</strong> (agents, managers, admins, accountants): visit <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/team/login</code></p>
                  <p><strong className="text-foreground">Customers</strong> (your clients): visit <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/customer/login</code></p>
                </Step>

                <Separator />

                <Step number={2} title="Login or Register">
                  <p>Enter your email and password to log in.</p>
                  <p>New team users are created by an admin — they cannot self-register unless the registration page is enabled.</p>
                  <p>Customer users can self-register at <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/customer/register</code>, or be created by a team admin through the customer profile page.</p>
                </Step>

                <Separator />

                <Step number={3} title="Navigate with the Sidebar">
                  <p>After login you will be taken to your dashboard. Use the left sidebar to navigate between sections.</p>
                  <p>On mobile, tap the hamburger icon at the top-left to open the sidebar.</p>
                  <p>The sidebar shows only the sections your role has access to.</p>
                </Step>

                <Separator />

                <Step number={4} title="Real-Time Notifications">
                  <p>Click the bell icon in the top-right of the sidebar header to view your notifications.</p>
                  <p>Notifications are delivered in real-time for events like new tickets, replies, approvals, and invoice uploads.</p>
                  <p>Click a notification to mark it as read and navigate to the relevant page.</p>
                </Step>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-5">
                  <h3 className="font-semibold mb-1 flex items-center justify-between">
                    Team Login <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Access the team dashboard</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/team/login">Go to Login</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-5">
                  <h3 className="font-semibold mb-1 flex items-center justify-between">
                    Customer Login <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Access the customer portal</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/customer/login">Go to Login</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardContent className="pt-5">
                  <h3 className="font-semibold mb-1 flex items-center justify-between">
                    Customer Register <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">Create a new customer account</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/customer/register">Register</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── ROLES & ACCESS ── */}
          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Team Roles
                </CardTitle>
                <CardDescription>Each team member is assigned one of the following roles, which controls what they can see and do.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ROLES.map((role) => (
                  <div key={role.name} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge className={role.color}>{role.name}</Badge>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                ))}

                <Separator />

                <div className="mt-4 space-y-3">
                  <h4 className="font-semibold text-sm">Role Permission Matrix</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left p-2 font-medium border">Feature</th>
                          <th className="p-2 border">Super Admin</th>
                          <th className="p-2 border">Admin</th>
                          <th className="p-2 border">Manager</th>
                          <th className="p-2 border">Agent</th>
                          <th className="p-2 border">Accountant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Dashboard", "✓", "✓", "✓", "✓", "✓"],
                          ["Customers (view)", "✓", "✓", "✓", "✓", "—"],
                          ["Customers (create/edit)", "✓", "✓", "✓", "—", "—"],
                          ["Tickets (all)", "✓", "✓", "✓", "✓", "—"],
                          ["Products & Catalog", "✓", "✓", "✓", "—", "—"],
                          ["Product Requests", "✓", "✓", "✓", "—", "—"],
                          ["Invoice Requests", "✓", "✓", "—", "—", "✓"],
                          ["Invoice History", "✓", "✓", "—", "—", "✓"],
                          ["Team Members", "✓", "✓", "✓", "—", "—"],
                          ["Activity Logs", "✓", "✓", "✓", "—", "—"],
                          ["Reports", "✓", "—", "—", "—", "—"],
                        ].map(([feature, ...perms]) => (
                          <tr key={feature} className="border-b">
                            <td className="p-2 border font-medium">{feature}</td>
                            {perms.map((p, i) => (
                              <td key={i} className={`p-2 border text-center ${p === "✓" ? "text-green-600" : "text-muted-foreground"}`}>{p}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Customer Roles
                </CardTitle>
                <CardDescription>Customers also have role-based access within their own company portal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {CUSTOMER_ROLES.map((role) => (
                  <div key={role.name} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Badge className={role.color}>{role.name}</Badge>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── TEAM GUIDE ── */}
          <TabsContent value="team" className="space-y-6">

            {/* Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> Team Dashboard</CardTitle>
                <CardDescription>Your command centre for monitoring the platform at a glance.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong>Stats cards</strong> — Total Customers, Open Tickets, In Progress, and Closed counts, updating in real time.</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong>Recent Tickets</strong> — Quick list of the latest support requests with their current status.</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong>Top Customers</strong> — Companies ranked by total ticket activity.</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong>Recent Activity</strong> — Timeline of the latest system events (ticket created, customer added, etc.).</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong>Quick Actions</strong> — Admins and managers see "Add Customer" and "Add Team Member" buttons directly from the header.</span></li>
                </ul>
                <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  The dashboard tabs (Overview / Customers / Tickets / Activity) let you drill into specific data without leaving the page.
                </div>
              </CardContent>
            </Card>

            {/* Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5 text-primary" /> Ticket Management</CardTitle>
                <CardDescription>Handle all customer support requests end-to-end.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <SectionTitle icon={Eye} title="Viewing & Filtering Tickets" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>Go to <strong className="text-foreground">Tickets</strong> in the sidebar to see all tickets you have access to.</li>
                    <li>Filter by <strong className="text-foreground">status</strong> (open, in progress, closed, etc.), <strong className="text-foreground">priority</strong>, or search by ticket number / customer name.</li>
                    <li>Click any ticket row to open the full ticket detail view.</li>
                  </ul>
                </div>

                <div>
                  <SectionTitle icon={MessageSquare} title="Responding to a Ticket" />
                  <ol className="space-y-1.5 text-sm text-muted-foreground ml-9 list-decimal">
                    <li>Click the ticket to open its detail page.</li>
                    <li>Read the full conversation thread on the right side.</li>
                    <li>Type your reply in the message box at the bottom and click <strong className="text-foreground">Send</strong>.</li>
                    <li>Your reply is delivered to the customer and triggers an SMS notification.</li>
                    <li>Attach files (images, documents) directly from the message box if needed.</li>
                  </ol>
                </div>

                <div>
                  <SectionTitle icon={Settings} title="Managing Ticket Status & Assignment" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>Change the <strong className="text-foreground">Status</strong> from the dropdown in the ticket detail sidebar (e.g., Open → In Progress → Resolved → Closed).</li>
                    <li>Use <strong className="text-foreground">Assign To</strong> to reassign the ticket to another team member.</li>
                    <li>Tickets in <strong className="text-foreground">Pending Approval</strong> status require an admin/manager to approve or reject before the customer can see them.</li>
                    <li>Approved tickets change to <strong className="text-foreground">Open</strong> status automatically.</li>
                  </ul>
                </div>

                <div>
                  <SectionTitle icon={AlertCircle} title="Ticket Statuses" />
                  <div className="ml-9 space-y-2">
                    {TICKET_STATUSES.map((s) => (
                      <div key={s.name} className="flex items-start gap-2">
                        <Badge className={`${s.color} text-xs shrink-0 mt-0.5`}>{s.name}</Badge>
                        <span className="text-sm text-muted-foreground">{s.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionTitle icon={Clock} title="Priority Levels" />
                  <div className="ml-9 flex flex-wrap gap-2">
                    {["Low", "Medium", "High", "Urgent"].map((p) => (
                      <Badge key={p} variant="outline">{p}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground ml-9 mt-2">Priority is set when a ticket is created and can be changed by team members from the detail page.</p>
                </div>
              </CardContent>
            </Card>

            {/* Customers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Customer Management</CardTitle>
                <CardDescription>Create and manage your client accounts and their users. (Admin / Manager)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <SectionTitle icon={Building2} title="Creating a Customer" />
                  <ol className="space-y-1.5 text-sm text-muted-foreground ml-9 list-decimal">
                    <li>Go to <strong className="text-foreground">Customers</strong> {">"} click <strong className="text-foreground">Create Customer</strong>.</li>
                    <li>Fill in company name, contact person, email, and phone.</li>
                    <li>Submit the form — the customer account is created immediately.</li>
                    <li>After creation, open the customer profile to add users, assign products, upload Excel files, and assign an agent.</li>
                  </ol>
                </div>

                <div>
                  <SectionTitle icon={UserCog} title="Managing Customer Users" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>Open a customer profile and go to the <strong className="text-foreground">Users</strong> tab.</li>
                    <li>Click <strong className="text-foreground">Add User</strong> to create a new login for someone at that company.</li>
                    <li>Assign them a role: <em>Customer Admin</em>, <em>Customer Agent</em>, or <em>Customer Account</em>.</li>
                    <li>Admins can also reset a customer user's password directly from this tab.</li>
                  </ul>
                </div>

                <div>
                  <SectionTitle icon={Users} title="Assigning an Agent" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>On the customer profile, use the <strong className="text-foreground">Assign Agent</strong> section.</li>
                    <li>Select an agent from the dropdown — that agent will be the primary contact for that customer.</li>
                    <li>Assignment is tracked in activity logs and appears on reports.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Products & Catalog */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Product Catalog</CardTitle>
                <CardDescription>Manage your product inventory and assign products to customers. (Admin / Manager)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <SectionTitle icon={FolderTree} title="Categories" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>Navigate to <strong className="text-foreground">Catalog {">"} Categories</strong> to create and manage product categories.</li>
                    <li>Default categories: Computer, Printer, Network Hardware, Accessories, Software, Other.</li>
                    <li>Custom categories can be created from the categories page.</li>
                  </ul>
                </div>

                <div>
                  <SectionTitle icon={Package} title="Creating a Product" />
                  <ol className="space-y-1.5 text-sm text-muted-foreground ml-9 list-decimal">
                    <li>Go to <strong className="text-foreground">Catalog {">"} Products {">"} Create Product</strong>.</li>
                    <li>Enter product name, description, and select a category.</li>
                    <li>A unique product code is auto-generated.</li>
                    <li>Save the product — it is now available to assign to customers.</li>
                  </ol>
                </div>

                <div>
                  <SectionTitle icon={Users} title="Assigning Products to Customers" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>Open a product and click <strong className="text-foreground">Assign to Customer</strong>, or go to the product's Assign page.</li>
                    <li>Search and select the target customer company.</li>
                    <li>The product appears on the customer's portal immediately.</li>
                    <li>You can also assign from the customer profile under the Products tab.</li>
                  </ul>
                </div>

                <div>
                  <SectionTitle icon={Mail} title="Product Requests" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>Customers can request new products from their portal. These appear under <strong className="text-foreground">Catalog {">"} Requests</strong>.</li>
                    <li>Filter by All, Pending, Approved, or Rejected.</li>
                    <li>Click <strong className="text-foreground">Approve</strong> to create the product and assign it, or <strong className="text-foreground">Reject</strong> to decline.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Excel Files */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-primary" /> Excel File Management</CardTitle>
                <CardDescription>Upload spreadsheets to customer accounts and view them as interactive tables.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-4">
                  <li>Open a customer profile and go to the <strong className="text-foreground">Files</strong> or <strong className="text-foreground">Excel</strong> tab.</li>
                  <li>Click <strong className="text-foreground">Upload File</strong> and select an <code className="bg-muted px-1 rounded">.xlsx</code>, <code className="bg-muted px-1 rounded">.xls</code>, or <code className="bg-muted px-1 rounded">.csv</code> file (up to 50MB).</li>
                  <li>After upload, the file appears in the list. Click <strong className="text-foreground">View</strong> to see all sheet data in a responsive table.</li>
                  <li>Switch between multiple sheets using the tabs at the top of the Excel viewer.</li>
                  <li>Customers can view these same files from their portal under <strong className="text-foreground">Dashboard {">"} Files</strong> or directly in their products section.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCog className="h-5 w-5 text-primary" /> Team Member Management</CardTitle>
                <CardDescription>Add, edit, and manage team accounts. (Admin / Manager)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-4">
                  <li>Go to <strong className="text-foreground">Administration {">"} Team Members</strong>.</li>
                  <li>Click <strong className="text-foreground">Add User</strong> and fill in name, email, password, and role.</li>
                  <li>To edit a user, click <strong className="text-foreground">Edit</strong> in the table row — you can update their name, email, role, and Gmail settings.</li>
                  <li>To delete a user, open the edit page and use the Delete action.</li>
                  <li>Each user can configure their own Gmail / App Password on their profile page for email notifications.</li>
                </ol>
              </CardContent>
            </Card>

            {/* Activity Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Activity Logs</CardTitle>
                <CardDescription>Audit trail of everything that happens on the platform. (Admin / Manager)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Go to <strong className="text-foreground">Administration {">"} Activity Logs</strong> to see a complete chronological log.</p>
                <p>Each entry shows: <strong className="text-foreground">who</strong> performed the action, <strong className="text-foreground">what</strong> entity was affected (ticket, customer, product, user), and <strong className="text-foreground">when</strong> it happened.</p>
                <p>Logs are generated automatically for all create, update, delete, approve, and reject actions across the platform.</p>
              </CardContent>
            </Card>

            {/* Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Reports</CardTitle>
                <CardDescription>Detailed performance analytics. (Super Admin only)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Go to <strong className="text-foreground">Administration {">"} Reports</strong>. Only Super Admins can access this page.</p>
                <div className="space-y-2">
                  <p><strong className="text-foreground">Agent Performance Tab:</strong> Shows each agent's total tickets, open/in-progress/resolved counts, number of clients, Excel files uploaded, and average response time in hours.</p>
                  <p><strong className="text-foreground">Agent-Client Details Tab:</strong> Shows which agents are assigned to which client companies, with per-client ticket counts, resolved counts, in-progress counts, Excel file counts, and last message time.</p>
                </div>
                <p>Summary cards at the top show: Total Agents, Total Tickets, Total Clients, and Average Response Time across the whole platform.</p>
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Email Notifications</CardTitle>
                <CardDescription>Set up Gmail-based email alerts for ticket activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ol className="space-y-2 list-decimal ml-4">
                  <li>Go to <strong className="text-foreground">Profile</strong> in the sidebar.</li>
                  <li>Enter your <strong className="text-foreground">Gmail Address</strong> in the email settings section.</li>
                  <li>Generate a Gmail App Password at <code className="bg-muted px-1 rounded">myaccount.google.com/apppasswords</code> (requires 2-factor authentication on your Google account).</li>
                  <li>Paste the App Password into the <strong className="text-foreground">Gmail App Password</strong> field and save.</li>
                </ol>
                <p className="mt-2"><strong className="text-foreground">Triggers:</strong> You will receive emails when new tickets are created for your assigned customers, and when customers reply to an open ticket.</p>
              </CardContent>
            </Card>

            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profile Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Go to <strong className="text-foreground">Profile</strong> in the sidebar to:</p>
                <ul className="space-y-1.5 ml-4 list-disc">
                  <li>Update your full name and contact details.</li>
                  <li>Change your login password.</li>
                  <li>Configure Gmail address and App Password for email notifications.</li>
                  <li>View your current role and account information.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── CUSTOMER GUIDE ── */}
          <TabsContent value="customer" className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> Customer Dashboard</CardTitle>
                <CardDescription>Your home page after logging into the customer portal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>The dashboard shows 4 stat cards: <strong className="text-foreground">Your Products</strong>, <strong className="text-foreground">Open Tickets</strong>, <strong className="text-foreground">In Progress</strong>, and <strong className="text-foreground">Closed</strong>. Click a card to go directly to that section.</p>
                <p>The <strong className="text-foreground">Overview tab</strong> shows Recent Tickets and Your Products at a glance, plus any Excel files uploaded to your account.</p>
                <p>Use the sidebar to access Products, Requests, Tickets, Invoices, and Profile.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ticket className="h-5 w-5 text-primary" /> Creating & Managing Support Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <SectionTitle icon={FileText} title="Creating a New Ticket" />
                  <ol className="space-y-1.5 text-sm text-muted-foreground ml-9 list-decimal">
                    <li>Go to <strong className="text-foreground">Tickets</strong> and click <strong className="text-foreground">Create Ticket</strong>, or use the "New Ticket" button on the dashboard.</li>
                    <li>Select the relevant <strong className="text-foreground">product category</strong> from the dropdown.</li>
                    <li>Enter a clear <strong className="text-foreground">subject / title</strong> describing the issue.</li>
                    <li>Provide a detailed <strong className="text-foreground">description</strong> of the problem.</li>
                    <li>Optionally attach files (screenshots, logs, documents).</li>
                    <li>Click <strong className="text-foreground">Submit</strong> — the ticket goes to <em>Pending Approval</em> until the team reviews it.</li>
                  </ol>
                </div>

                <div>
                  <SectionTitle icon={Eye} title="Tracking Your Tickets" />
                  <ul className="space-y-1.5 text-sm text-muted-foreground ml-9">
                    <li>Go to <strong className="text-foreground">Tickets</strong> to see all your tickets with their current status badge.</li>
                    <li>Click any ticket to open the full conversation thread.</li>
                    <li>Type in the message box and click <strong className="text-foreground">Send</strong> to reply to the support team.</li>
                    <li>You will receive a notification (bell icon) when the team responds.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Go to <strong className="text-foreground">Products</strong> in the sidebar to see all products assigned to your account.</p>
                <p>Click a product to view its full details, description, and any files associated with it.</p>
                <p>If you need a new product that is not listed, go to <strong className="text-foreground">Requests</strong> and submit a product request. An admin will review and approve it.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /> Product Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ol className="space-y-2 list-decimal ml-4">
                  <li>Go to <strong className="text-foreground">Requests</strong> in the sidebar.</li>
                  <li>Click <strong className="text-foreground">Request Product</strong> and fill in the product name and description.</li>
                  <li>Submit — the request goes to the team for review.</li>
                  <li>Once approved, the product is automatically added to your account.</li>
                  <li>Track all your requests and their status (Pending / Approved / Rejected) from the Requests page.</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> Profile & Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Go to <strong className="text-foreground">Profile</strong> in the sidebar to update your name, email, and phone number.</p>
                <p>To change your password, enter your current password and then your new password in the Password section and click Save.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── INVOICES ── */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> How the Invoice System Works</CardTitle>
                <CardDescription>A 4-step workflow from request to download, with time-limited availability and real-time countdowns.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { step: 1, label: "Customer Requests", desc: "Any customer user submits an invoice request for a billing date range." },
                    { step: 2, label: "Customer Admin Approves", desc: "The Customer Admin reviews and approves or rejects the request from within the portal." },
                    { step: 3, label: "Accountant Uploads", desc: "An accountant uploads the invoice PDF and sets the availability window (from/to dates)." },
                    { step: 4, label: "Customer Downloads", desc: "Status shows Invoice Ready with a live countdown. Customer downloads before the timer expires." },
                  ].map(({ step, label, desc }) => (
                    <div key={step} className="rounded-lg border p-4 space-y-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{step}</div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <SectionTitle icon={AlertCircle} title="Invoice Request Statuses" />
                  <div className="ml-9 space-y-2">
                    {INVOICE_STATUSES.map((s) => (
                      <div key={s.name} className="flex items-start gap-2">
                        <Badge className={`${s.color} text-xs shrink-0 mt-0.5`}>{s.name}</Badge>
                        <span className="text-sm text-muted-foreground">{s.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Customer: Requesting an Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-4">
                  <li>Go to <strong className="text-foreground">Invoices</strong> in the sidebar.</li>
                  <li>Click <strong className="text-foreground">Request Invoice</strong>.</li>
                  <li>Select the <strong className="text-foreground">From Date</strong> and <strong className="text-foreground">To Date</strong> for the billing period you need.</li>
                  <li>Optionally add notes or special requirements in the description field.</li>
                  <li>Click <strong className="text-foreground">Submit Request</strong> — the status shows as <em>Pending Approval</em>.</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Customer Admin: Approving Requests
                </CardTitle>
                <CardDescription>If you are a Customer Admin, you will see a highlighted panel for pending approvals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-4">
                  <li>Go to <strong className="text-foreground">Invoices</strong> — you will see a yellow <em>Pending Your Approval</em> panel at the top if any requests are waiting.</li>
                  <li>Review the request number, date range, and any notes.</li>
                  <li>Click <strong className="text-foreground">Approve</strong> to forward to the accountant, or <strong className="text-foreground">Reject</strong> (you will be prompted for a reason).</li>
                  <li>Approved requests change to <em>Approved</em> status and appear in the accountant's queue.</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" /> Accountant: Uploading an Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-4">
                  <li>Go to <strong className="text-foreground">Finance {">"} Invoice Requests</strong> in the sidebar.</li>
                  <li>Find requests with status <em>Ready for Upload</em> (Approved).</li>
                  <li>Click <strong className="text-foreground">Upload Invoice</strong> — a dialog opens showing the requested date range.</li>
                  <li>Select the invoice file (PDF, DOC, DOCX, XLS, XLSX supported).</li>
                  <li>Set the <strong className="text-foreground">Download Available From</strong> and <strong className="text-foreground">Download Available Until</strong> dates (defaults to today + 30 days).</li>
                  <li>Click <strong className="text-foreground">Upload Invoice</strong> — the file is uploaded to secure cloud storage and the customer is notified via SMS.</li>
                </ol>
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground mt-2">
                  The invoice file is automatically deleted from the system and unavailable for download once the visibility end date passes.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" /> Customer: Downloading an Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal ml-4">
                  <li>Go to <strong className="text-foreground">Invoices</strong> in the sidebar.</li>
                  <li>Find the request with status <em>Invoice Ready</em> (green badge).</li>
                  <li>A live <strong className="text-foreground">countdown timer</strong> shows the exact time remaining to download (counts down in days, hours, minutes, seconds).</li>
                  <li>Click the green <strong className="text-foreground">Download Invoice</strong> button to download the file.</li>
                  <li>If the timer expires before you download, the status changes to <em>Expired</em> — click <strong className="text-foreground">Request Again</strong> to submit a new request.</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" /> Accountant: Invoice History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Go to <strong className="text-foreground">Finance {">"} Invoice History</strong> to see all invoices ever uploaded, including expired ones.</p>
                <p>Each row shows the request number, customer, date range, visibility window, download count, and uploaded-by name.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── FAQ ── */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  {
                    q: "How do I reset my password?",
                    a: "Team members: go to your Profile page and use the Change Password form. Customers: go to Profile and change your password there. If you are locked out, contact your team admin to reset it from the customer users management page."
                  },
                  {
                    q: "Why am I not receiving email notifications?",
                    a: "Email notifications are for team members only. Go to your Profile and make sure you have entered a valid Gmail address and a Gmail App Password (generated at myaccount.google.com/apppasswords). Also check your spam folder."
                  },
                  {
                    q: "What file formats are supported for Excel uploads?",
                    a: "The platform supports .xlsx, .xls, and .csv files up to 50MB."
                  },
                  {
                    q: "How do I assign a ticket to another team member?",
                    a: "Open the ticket detail page and use the 'Assign To' dropdown to select another team member. The ticket will appear in their queue."
                  },
                  {
                    q: "Can customers see all tickets or only their own?",
                    a: "Customers can only see tickets submitted by users within their own company. They cannot see tickets from other companies."
                  },
                  {
                    q: "What happens when an invoice download timer expires?",
                    a: "The invoice file is automatically removed from storage and the status changes to Expired. The customer must submit a new invoice request to get another copy uploaded."
                  },
                  {
                    q: "Who can approve invoice requests?",
                    a: "Invoice requests go through two layers: first the Customer Admin must approve the request from within the customer portal, then an accountant (or admin) on the team side uploads the actual invoice file."
                  },
                  {
                    q: "How are tickets prioritised?",
                    a: "Tickets can be set to Low, Medium, High, or Urgent priority when created and updated at any time. Team members can filter and sort by priority from the tickets list."
                  },
                  {
                    q: "Is my data secure?",
                    a: "Yes. All passwords are hashed with bcrypt. Sessions use secure HTTP-only cookies. Invoice files are stored in encrypted Vercel Blob cloud storage. All actions are logged in the activity log for auditing."
                  },
                  {
                    q: "Can I see who is assigned to which customer?",
                    a: "Yes. Super Admins can see the full Agent-Client assignment and performance data from the Reports page. Managers can view assignments from the customer profile."
                  },
                  {
                    q: "How do real-time notifications work?",
                    a: "The platform uses Server-Sent Events (SSE) to push notifications to your browser instantly. No page refresh is needed — the bell icon in the sidebar will show a badge when you have new unread notifications."
                  },
                  {
                    q: "What happens to a ticket if no one responds for a long time?",
                    a: "A cron job runs periodically to auto-close tickets that have been inactive beyond a configured threshold. Closed tickets are archived but remain visible in history."
                  },
                ].map(({ q, a }, i) => (
                  <div key={q} className={`py-5 space-y-1.5 ${i > 0 ? "border-t" : ""}`}>
                    <h4 className="font-semibold text-sm">{q}</h4>
                    <p className="text-sm text-muted-foreground">{a}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer links */}
        <div className="mt-10 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="text-xs font-bold text-primary-foreground">H</span>
            </div>
            <span>Hazelnucyborg CRM — Platform Documentation</span>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/team/login">Team Login</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/customer/login">Customer Login</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
