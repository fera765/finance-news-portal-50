
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  TagIcon,
  LogOut,
  MenuIcon,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

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
  setActiveTab: (tab: string) => void;
}

const AdminSidebar = ({ 
  collapsed, 
  setCollapsed, 
  activeTab, 
  setActiveTab 
}: AdminSidebarProps) => {
  const navigate = useNavigate();
  
  const handleNavigate = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };
  
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} transition-width duration-300 ease-in-out h-screen bg-finance-900 text-white`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-finance-800 flex justify-between items-center">
          {!collapsed && (
            <div className="flex items-center">
              <span className="text-xl font-bold">Finance</span>
              <span className="text-xl font-normal text-gold-500">News</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-finance-800"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuIcon size={22} /> : <X size={22} />}
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 py-6">
          <nav>
            <ul className="space-y-2 px-3">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <Button 
                    variant="ghost"
                    className={`w-full justify-${collapsed ? 'center' : 'start'} text-white hover:bg-finance-800 ${activeTab === item.name.toLowerCase() ? 'bg-finance-800' : ''}`}
                    onClick={() => handleNavigate(item.name.toLowerCase(), item.path)}
                  >
                    <item.icon className={`h-5 w-5 ${!collapsed && 'mr-2'}`} />
                    {!collapsed && <span>{item.name}</span>}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-finance-800">
          <Button 
            variant="ghost"
            className={`w-full justify-${collapsed ? 'center' : 'start'} text-white hover:bg-finance-800`}
            onClick={handleLogout}
          >
            <LogOut className={`h-5 w-5 ${!collapsed && 'mr-2'}`} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
