
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

const AdminLayout = ({ children, activeTab }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeTab={activeTab}
        setActiveTab={() => {}} // This is handled by the navigate function in AdminSidebar
      />
      
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
