
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  TagIcon,
  LogOut,
  X,
  Settings
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
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

type SidebarItem = {
  name: string;
  icon: React.ElementType;
  path: string;
  adminOnly?: boolean;
  editorAccess?: boolean;
};

const allSidebarItems: SidebarItem[] = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin", adminOnly: true },
  { name: "Articles", icon: FileText, path: "/admin/articles", editorAccess: true },
  { name: "Categories", icon: TagIcon, path: "/admin/categories", adminOnly: true },
  { name: "Users", icon: Users, path: "/admin/users", adminOnly: true },
  { name: "Settings", icon: Settings, path: "/admin/settings", adminOnly: true },
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
  const { user, logout } = useAuth();
  
  // Filtrar itens baseado no role do usuário
  const sidebarItems = allSidebarItems.filter(item => {
    const userRole = user?.role || 'user';
    
    if (item.adminOnly && userRole !== 'admin') {
      return false;
    }
    
    if (item.editorAccess && !['admin', 'editor'].includes(userRole)) {
      return false;
    }
    
    return true;
  });
  
  // Synchronize the local state with the sidebar context
  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed, setOpen]);

  const handleToggleSidebar = () => {
    setOpen(!open);
    setCollapsed(!collapsed);
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-border transition-all duration-300",
        open ? "w-64" : "w-0 md:w-[70px]"
      )}
      collapsible="none"
    >
      <SidebarHeader>
        <div className={cn(
          "p-4 border-b border-border flex justify-between items-center",
          !open && "md:justify-center"
        )}>
          {open ? (
            <div className="flex items-center">
              <span className="text-xl font-bold">Finance</span>
              <span className="text-xl font-normal text-gold-500">News</span>
            </div>
          ) : (
            <div className="hidden md:flex justify-center items-center h-10 w-10 rounded-md bg-finance-900 text-white font-bold">
              F
            </div>
          )}
          {open && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:bg-gray-100"
              onClick={handleToggleSidebar}
            >
              <X size={20} />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-3 mb-1">
            Main
          </SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  tooltip={!open ? item.name : undefined}
                  isActive={activeTab === item.name.toLowerCase()}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    activeTab === item.name.toLowerCase() ? "bg-finance-50 text-finance-800" : "",
                    "hover:bg-finance-50 hover:text-finance-800 transition-colors"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {open && <span>{item.name}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost"
            className={cn(
              "w-full justify-start text-gray-600 hover:bg-gray-100",
              !open && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {open && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
      
      {/* Add a trigger that's visible when sidebar is collapsed */}
      {!open && (
        <SidebarTrigger 
          className="absolute top-4 right-0 transform translate-x-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-sm"
          onClick={handleToggleSidebar}
        />
      )}
    </Sidebar>
  );
};

export default AdminSidebar;
