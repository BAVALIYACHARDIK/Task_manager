import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, LogOut, Home, Settings, HelpCircle, LayoutGrid } from "lucide-react";
import KanbanBoard from "../components/KanbanBoard.tsx";
import ActivityLog from "../components/ActivityLog.tsx";
import { getAllMembers, Member } from "../service/userService";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMembers();
      
      if (response.success && response.data) {
        setMembers(response.data);
      } else {
        setError(response.error || "Failed to fetch members");
      }
    } catch (err) {
      setError("An error occurred while fetching members");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "members") {
      fetchMembers();
    }
  }, [activeTab]);

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
                  isActive={activeTab === "board"}
                  onClick={() => setActiveTab("board")}
                  className="cursor-pointer"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Board</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "members"}
                  onClick={() => setActiveTab("members")}
                  className="cursor-pointer"
                >
                  <Users className="h-4 w-4" />
                  <span>Members</span>
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
                : activeTab === "board"
                  ? "Task Board"
                  : activeTab === "members"
                    ? "Members"
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

            {/* Board Tab (Kanban Board) */}
            {activeTab === "board" && (
              <KanbanBoard />
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-6">
                {loading && (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading members...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">{error}</p>
                    <button
                      onClick={fetchMembers}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {!loading && !error && members.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No members found</p>
                  </div>
                )}

                {!loading && !error && members.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {members.map((member) => (
                        <Card key={member.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {member.firstName} {member.lastName}
                                </CardTitle>
                                <CardDescription className="text-sm truncate">
                                  {member.email}
                                </CardDescription>
                              </div>
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                {member.firstName.charAt(0)}
                                {member.lastName.charAt(0)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Active</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Summary Stats */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-blue-900 font-semibold">
                        Total Members: <span className="text-2xl">{members.length}</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === "logs" && (
              <div className="space-y-4">
                <ActivityLog limit={20} />
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
