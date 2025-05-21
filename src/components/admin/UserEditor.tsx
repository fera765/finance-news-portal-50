
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createUser, updateUser, ExtendedUser } from "@/services/userService";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Corrigindo a interface para usar o tipo ExtendedUser do userService
interface UserEditorProps {
  isOpen: boolean;
  onClose: () => void;
  user: ExtendedUser | null;
}

const userSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "editor", "admin"]).default("user"),
  avatar: z.string().optional().or(z.literal("")),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserEditor({ isOpen, onClose, user }: UserEditorProps) {
  const queryClient = useQueryClient();
  const isEditing = !!user?.id;

  const form = useForm<UserFormData>({
    resolver: zodResolver(
      isEditing
        ? userSchema.omit({ password: true }).extend({
            password: z.string().optional().or(z.literal("")),
          })
        : userSchema
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      avatar: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email || "",
        password: "",
        role: user.role || "user",
        avatar: user.avatar || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        role: "user",
        avatar: "",
      });
    }
  }, [user, form]);

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário criado com sucesso");
      onClose();
    },
    onError: () => {
      toast.error("Erro ao criar usuário");
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário atualizado com sucesso");
      onClose();
    },
    onError: () => {
      toast.error("Erro ao atualizar usuário");
    },
  });

  function onSubmit(values: UserFormData) {
    if (isEditing && user?.id) {
      const updateData = { ...values, id: user.id };
      // Only send password if it was changed
      if (!values.password) {
        delete updateData.password;
      }
      updateUserMutation.mutate(updateData);
    } else {
      // Ensure password is provided for new users
      if (!values.password) {
        form.setError("password", {
          message: "Senha é obrigatória para novos usuários",
        });
        return;
      }
      // Corrigido: Converter os valores para o tipo ExtendedUser antes de enviar
      createUserMutation.mutate(values as ExtendedUser);
    }
  }

  const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="joao@exemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "Senha (deixe em branco para manter atual)" : "Senha"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Foto de Perfil</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://exemplo.com/avatar.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
