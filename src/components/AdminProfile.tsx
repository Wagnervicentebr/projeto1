import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  User, 
  Mail, 
  Phone,
  Camera,
  Save,
  Shield,
  Building2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminProfileProps {
  userData: any;
}

export default function AdminProfile({ userData }: AdminProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nome: userData.nome || '',
    email: userData.email || '',
    telefone: userData.telefone || '',
    cargo: userData.cargo || 'Administrador',
    departamento: userData.departamento || 'Gestão'
  });

  const getInitials = (nome: string) => {
    if (!nome) return 'US';
    return nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    const updatedUser = {
      ...userData,
      ...profileData
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const updatedUser = {
          ...userData,
          foto: imageUrl
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        toast.success('Foto atualizada com sucesso!');
        setTimeout(() => window.location.reload(), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground">Meu Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
      </div>

      {/* Card de Perfil Principal */}
      <Card className="border border-border shadow-lg bg-card rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-b border-border rounded-t-2xl">
          <CardTitle className="text-card-foreground">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-32 h-32 rounded-full border-4 border-border shadow-lg">
                {userData.foto ? (
                  <img src={userData.foto} alt={profileData.nome} className="object-cover rounded-full" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-3xl rounded-full">
                    {getInitials(profileData.nome)}
                  </AvatarFallback>
                )}
              </Avatar>
              <Label htmlFor="upload-foto" className="absolute bottom-0 right-0 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full flex items-center justify-center shadow-lg transition-colors border-2 border-white">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <Input
                  id="upload-foto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </Label>
            </div>

            {/* Informações */}
            <div className="flex-1 space-y-4 w-full">
              {!isEditing ? (
                <>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-foreground">{profileData.nome}</h3>
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        {profileData.cargo}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-foreground">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm">{profileData.email}</p>
                        </div>
                      </div>
                      {profileData.telefone && (
                        <div className="flex items-center gap-2 text-foreground">
                          <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-xs text-muted-foreground">Telefone</p>
                            <p className="text-sm">{profileData.telefone}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-foreground">
                        <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Departamento</p>
                          <p className="text-sm">{profileData.departamento}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="text-xs text-muted-foreground">Cargo</p>
                          <p className="text-sm">{profileData.cargo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                  >
                    Editar Perfil
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-foreground">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={profileData.nome}
                        onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                        className="border-border bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="telefone" className="text-foreground">Telefone</Label>
                      <Input
                        id="telefone"
                        value={profileData.telefone}
                        onChange={(e) => setProfileData({ ...profileData, telefone: e.target.value })}
                        placeholder="(11) 98765-4321"
                        className="border-border bg-input-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargo" className="text-foreground">Cargo</Label>
                      <Input
                        id="cargo"
                        value={profileData.cargo}
                        onChange={(e) => setProfileData({ ...profileData, cargo: e.target.value })}
                        placeholder="Ex: Administrador, Gerente"
                        className="border-border bg-input-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departamento" className="text-foreground">Departamento</Label>
                    <Input
                      id="departamento"
                      value={profileData.departamento}
                      onChange={(e) => setProfileData({ ...profileData, departamento: e.target.value })}
                      placeholder="Ex: Gestão, Financeiro"
                      className="border-border bg-input-background"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSave}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        setProfileData({
                          nome: userData.nome || '',
                          email: userData.email || '',
                          telefone: userData.telefone || '',
                          cargo: userData.cargo || 'Administrador',
                          departamento: userData.departamento || 'Gestão'
                        });
                      }}
                      variant="outline"
                      className="border-border"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}