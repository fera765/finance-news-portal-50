
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const AdminLayout = ({ children, activeTab }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(true);
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen bg-gray-50 w-full">
        <AdminSidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          activeTab={activeTab}
        />
        
        <div className="flex-1 overflow-auto">
          {/* Menu trigger that is always visible */}
          <div className="p-4 border-b bg-white flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4"
            >
              <Menu size={22} />
            </Button>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
