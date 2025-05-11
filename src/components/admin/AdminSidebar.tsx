
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  TagIcon,
  LogOut,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";

type SidebarItem = {
  name: string;
  icon: React.ElementType;
  path: string;
};

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Articles", icon: FileText, path: "/admin/articles" },
  { name: "Categories", icon: TagIcon, path: "/admin/categories" },
  { name: "Users", icon: Users, path: "/admin/users" },
];

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeTab: string;
}

const AdminSidebar = ({ 
  collapsed, 
  setCollapsed, 
  activeTab
}: AdminSidebarProps) => {
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();
  
  // Synchronize the local state with the sidebar context
  const handleToggleSidebar = () => {
    setOpen(!open);
    setCollapsed(!collapsed);
  };
  
  const handleNavigate = (tab: string, path: string) => {
    navigate(path);
  };
  
  const handleLogout = () => {
    navigate("/");
  };

  // Use the sidebar's open state to determine if the sidebar is collapsed
  const sidebarStyle = open ? 'w-64' : 'w-0';

  return (
    <Sidebar
      className={`${sidebarStyle} transition-all duration-300 ease-in-out`}
      collapsible="offcanvas"
    >
      <SidebarHeader>
        <div className="p-4 border-b border-finance-800 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold">Finance</span>
            <span className="text-xl font-normal text-gold-500">News</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:bg-gray-100"
            onClick={handleToggleSidebar}
          >
            <X size={22} />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={activeTab === item.name.toLowerCase()}
                onClick={() => handleNavigate(item.name.toLowerCase(), item.path)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
