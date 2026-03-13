import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Users, LogOut, Home, Settings, HelpCircle } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");

  // Sample team members data
  const teamMembers = [
    { id: 1, name: "John Doe", status: "Online", avatar: "JD" },
    { id: 2, name: "Jane Smith", status: "Busy", avatar: "JS" },
    { id: 3, name: "Mike Johnson", status: "Away", avatar: "MJ" },
    { id: 4, name: "Sarah Wilson", status: "Online", avatar: "SW" },
  ];

  // Sample activity logs
  const activityLogs = [
    { id: 1, user: "John Doe", action: "Created new task", time: "2 hours ago" },
    { id: 2, user: "Jane Smith", action: "Updated task status", time: "1 hour ago" },
    { id: 3, user: "Mike Johnson", action: "Added comment", time: "30 minutes ago" },
    { id: 4, user: "Sarah Wilson", action: "Assigned task", time: "15 minutes ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-500";
      case "Busy":
        return "bg-yellow-500";
      case "Away":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar as Navbar */}
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-2">
              <BarChart3 className="h-6 w-6" />
              <h1 className="text-xl font-bold">Task Manager</h1>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Navigation Menu */}
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "home"}
                  onClick={() => setActiveTab("home")}
                  className="cursor-pointer"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "team"}
                  onClick={() => setActiveTab("team")}
                  className="cursor-pointer"
                >
                  <Users className="h-4 w-4" />
                  <span>Team Members</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "logs"}
                  onClick={() => setActiveTab("logs")}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Activity Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "settings"}
                  onClick={() => setActiveTab("settings")}
                  className="cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="sticky top-0 z-50 flex items-center gap-4 border-b bg-white p-4">
            <SidebarTrigger />
            <h2 className="text-2xl font-bold">
              {activeTab === "home"
                ? "Dashboard"
                : activeTab === "team"
                  ? "Team Members"
                  : activeTab === "logs"
                    ? "Activity Logs"
                    : "Settings"}
            </h2>
          </div>

          <div className="p-6">
            {/* Home Tab */}
            {activeTab === "home" && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                      <p className="text-3xl font-bold">24</p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-3xl font-bold">8</p>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Completed</p>
                      <p className="text-3xl font-bold">16</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Welcome Back!</h3>
                  <p className="mt-2 text-gray-600">
                    You have 8 tasks in progress and 4 pending approvals.
                  </p>
                </div>
              </div>
            )}

            {/* Team Members Tab */}
            {activeTab === "team" && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-white shadow-sm">
                  <div className="border-b p-4">
                    <h3 className="font-semibold">Team Members Status</h3>
                  </div>
                  <div className="divide-y">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.status}</p>
                          </div>
                        </div>
                        <Badge
                          className={`text-white ${getStatusColor(member.status)}`}
                        >
                          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-white"></span>
                          {member.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === "logs" && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-white shadow-sm">
                  <div className="border-b p-4">
                    <h3 className="font-semibold">Recent Activity</h3>
                  </div>
                  <div className="divide-y">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start justify-between p-4">
                        <div className="flex flex-1 gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold">
                            {log.user.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{log.user}</p>
                            <p className="text-sm text-gray-600">{log.action}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{log.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p className="mt-2 text-gray-600">
                  Configure your dashboard preferences and account settings here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
