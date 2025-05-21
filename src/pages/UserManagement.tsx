import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, deleteUser, updateUser, banUser, unbanUser, ExtendedUser } from "@/services/userService";
import { toast } from "sonner";
import { MoreVertical, Plus, Ban, Trash, CircleCheck, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import UserEditor from "@/components/admin/UserEditor";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserManagement = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário excluído com sucesso");
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      toast.error("Erro ao excluir usuário");
    },
  });

  const banUserMutation = useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário banido com sucesso");
    },
    onError: (error) => {
      console.error("Error banning user:", error);
      toast.error("Erro ao banir usuário");
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário desbanido com sucesso");
    },
    onError: (error) => {
      console.error("Error unbanning user:", error);
      toast.error("Erro ao desbanir usuário");
    },
  });

  const handleOpenEditor = (user?: ExtendedUser) => {
    setSelectedUser(user || null);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setSelectedUser(null);
    setIsEditorOpen(false);
  };

  const handleDeleteUser = (user: ExtendedUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser?.id) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const handleBanUser = (user: ExtendedUser) => {
    if (user.id) {
      banUserMutation.mutate(user.id);
    }
  };

  const handleUnbanUser = (user: ExtendedUser) => {
    if (user.id) {
      unbanUserMutation.mutate(user.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-300";
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <AdminLayout activeTab="users">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-gray-500 mt-1">
            Gerencie os usuários da plataforma
          </p>
        </div>
        <Button onClick={() => handleOpenEditor()} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-finance-600" />
            <span className="ml-2 text-lg text-gray-500">Carregando usuários...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: ExtendedUser) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.name} />
                          ) : (
                            <AvatarFallback className="bg-finance-100 text-finance-800">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRoleColor(user.role)}>
                        {user.role || "usuário"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.status === "banned" ? (
                        <Badge variant="destructive">Banido</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          Ativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEditor(user)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "banned" ? (
                            <DropdownMenuItem onClick={() => handleUnbanUser(user)}>
                              <CircleCheck className="mr-2 h-4 w-4" />
                              <span>Desbanir</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleBanUser(user)}>
                              <Ban className="mr-2 h-4 w-4" />
                              <span>Banir</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* User Editor Modal */}
      <UserEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        user={selectedUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita. Isso excluirá permanentemente o
              usuário {selectedUser?.name} e removerá seus dados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              {deleteUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default UserManagement;
