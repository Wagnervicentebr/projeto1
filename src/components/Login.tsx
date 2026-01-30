import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Building2, Shield, ArrowRight, Lock, Mail, Moon, Sun, Check, BarChart3, FileText, Users2, TrendingUp, Globe, Zap, Building, UserCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import novigoLogo from 'figma:asset/8bae1cc516bcd2caddce7ede9f944e7d79bb5b32.png';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface LoginProps {
  onLogin: (userType: 'admin' | 'user', userData: any) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export default function Login({ onLogin, isDark, toggleDarkMode }: LoginProps) {
  const [loginType, setLoginType] = useState<'admin' | 'user' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [nome, setNome] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    let userData: any = {
      email,
      nome: email.split('@')[0],
      tipo: loginType
    };

    // Se for comercial, buscar dados do colaborador
    if (loginType === 'user') {
      const colaboradoresStr = localStorage.getItem('colaboradores');
      if (colaboradoresStr) {
        const colaboradores = JSON.parse(colaboradoresStr);
        const vendedor = colaboradores.find((c: any) => 
          c.email.toLowerCase() === email.toLowerCase() && c.tipo === 'vendedor'
        );
        
        if (vendedor) {
          userData = {
            ...userData,
            ...vendedor,
            tipo: loginType
          };
        } else {
          alert('Email não encontrado como vendedor. Por favor, verifique suas credenciais.');
          return;
        }
      }
    }

    // Salvar no localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    onLogin(loginType!, userData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !nome) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    let userData: any = {
      email,
      nome,
      tipo: loginType
    };

    // Se for comercial, buscar dados do colaborador
    if (loginType === 'user') {
      const colaboradoresStr = localStorage.getItem('colaboradores');
      if (colaboradoresStr) {
        const colaboradores = JSON.parse(colaboradoresStr);
        const vendedor = colaboradores.find((c: any) => 
          c.email.toLowerCase() === email.toLowerCase() && c.tipo === 'vendedor'
        );
        
        if (vendedor) {
          userData = {
            ...userData,
            ...vendedor,
            tipo: loginType
          };
        } else {
          alert('Email não encontrado como vendedor. Por favor, verifique suas credenciais.');
          return;
        }
      }
    }

    // Salvar no localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    onLogin(loginType!, userData);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      alert('Por favor, insira seu email');
      return;
    }

    // Simular envio de email de recuperação
    alert(`Um link de recuperação foi enviado para ${forgotPasswordEmail}`);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
  };

  if (!loginType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(white,transparent_85%)]"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500/10 dark:bg-slate-500/20 rounded-full blur-3xl"></div>
        
        {/* Botão Dark Mode - Canto superior direito */}
        <Button
          onClick={toggleDarkMode}
          variant="outline"
          size="sm"
          className="fixed top-6 right-6 border-border bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg z-50"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <div className="relative z-10">
          {/* Hero Section with Login */}
          <header className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left Side - Hero Content */}
              <div className="text-center lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                <a 
                  href="https://novigo-it.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-56 h-56 bg-white dark:bg-slate-900 rounded-3xl mb-8 shadow-2xl shadow-slate-900/20 dark:shadow-blue-500/30 p-8 lg:mx-0 mx-auto relative overflow-hidden cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: -5,
                    }}
                  >
                    {/* Animated background glow - pulsing effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-3xl blur-xl"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    
                    {/* Logo with subtle floating animation */}
                    <motion.div
                      className="relative z-10 w-full h-full flex items-center justify-center"
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "reverse"
                      }}
                    >
                      <motion.img 
                        src={novigoLogo} 
                        alt="Novigo IT" 
                        className="w-full h-full object-contain drop-shadow-2xl"
                        animate={{
                          filter: [
                            'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                            'drop-shadow(0 0 40px rgba(59, 130, 246, 0.5))',
                            'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </a>
                <h1 className="text-foreground mb-6 tracking-tight">
                  Faturamento Novigo
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Solução completa para gestão de faturamento empresarial. Controle total de colaboradores, notas fiscais e métricas em tempo real.
                </p>
              </div>

              {/* Right Side - Login Card */}
              <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                <Card className="border-2 border-blue-500/50 dark:border-blue-400/50 bg-card/95 backdrop-blur-sm shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent dark:from-blue-600/10"></div>
                  <CardHeader className="text-center space-y-4 pb-6 relative pt-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl mx-auto shadow-xl">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-card-foreground text-2xl mb-2">Acesso ao Sistema</CardTitle>
                      <p className="text-muted-foreground text-sm">
                        Faça login para acessar o painel administrativo
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center relative pb-8 px-8">
                    <div className="space-y-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-lg h-14 text-lg"
                        onClick={() => setLoginType('admin')}
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        Entrar como Administrador
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 h-14 text-lg"
                        onClick={() => setLoginType('user')}
                      >
                        <UserCheck className="w-5 h-5 mr-2" />
                        Entrar como Comercial
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Acesso exclusivo para usuários autorizados
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </header>

          {/* Features Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
              <Card className="border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all group">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-foreground mb-2">Dashboard em Tempo Real</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Visualize métricas importantes, faturamento mensal com gráficos interativos e atualizados.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all group">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-foreground mb-2">Gestão de Notas Fiscais</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Emita, gerencie e acompanhe todas as suas notas fiscais de forma simples e organizada.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all group">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Users2 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-foreground mb-2">Controle de Colaboradores</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gerencie colaboradores das empresas parceiras com informações detalhadas e organizadas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all group">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Building className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-foreground mb-2">Gestão de Empresas</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Cadastre e gerencie empresas parceiras com informações completas e organizadas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all group">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <UserCheck className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-foreground mb-2">Controle de Vendedores</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gerencie vendedores com controle detalhado de performance e informações pessoais.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer Simples */}
          <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
            <div className="max-w-6xl mx-auto text-center border-t border-border pt-8">
              <p className="text-sm text-muted-foreground">
                © 2025 Faturamento Novigo. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(white,transparent_85%)]"></div>
      
      {/* Botão Dark Mode */}
      <Button
        onClick={toggleDarkMode}
        variant="outline"
        size="sm"
        className="fixed top-6 right-6 border-border bg-card/80 backdrop-blur-sm hover:bg-card shadow-lg z-10"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <Card className="w-full max-w-md border border-border shadow-2xl bg-card/80 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo Animada */}
          <a 
            href="https://novigo-it.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-24 h-24 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-900/20 dark:shadow-blue-500/30 p-4 mx-auto relative overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: -5,
              }}
            >
              {/* Animated background glow - pulsing effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-2xl blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              {/* Logo with subtle floating animation */}
              <motion.div
                className="relative z-10 w-full h-full flex items-center justify-center"
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse"
                }}
              >
                <motion.img 
                  src={novigoLogo} 
                  alt="Novigo IT" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                  animate={{
                    filter: [
                      'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                      'drop-shadow(0 0 40px rgba(59, 130, 246, 0.5))',
                      'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))',
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          </a>
          
          <div>
            <CardTitle className="text-card-foreground mb-2">Faturamento Novigo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Login de Usuário
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 dark:text-blue-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-border bg-input-background h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-card-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 dark:text-blue-500" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-border bg-input-background h-11"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isRegistering && (
                <div className="text-center mt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}
            </div>
            {isRegistering && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-card-foreground">Nome</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="border-border bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-card-foreground">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 dark:text-blue-500" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 border-border bg-input-background h-11"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-border h-11"
                onClick={() => {
                  setLoginType(null);
                  setEmail('');
                  setPassword('');
                }}
              >
                Voltar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-lg h-11"
              >
                {isRegistering ? 'Cadastrar' : 'Entrar'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>

          {/* Dica de login para funcionário */}
          {loginType === 'user' && !isRegistering && (
            <div className="pt-4 border-t border-border">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-2">💡 Dica de teste:</p>
                <p className="text-sm text-foreground mb-1">
                  <strong>Email:</strong> luis@novigoIT.com
                </p>
                <p className="text-sm text-foreground">
                  <strong>Senha:</strong> qualquer senha
                </p>
              </div>
            </div>
          )}

          {/* Botão de Cadastro */}
          {!isRegistering && loginType === 'admin' && (
            <div className="pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Não tem uma conta?
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-border hover:bg-blue-50 dark:hover:bg-blue-950/30 h-11"
                onClick={() => setIsRegistering(true)}
              >
                Criar Nova Conta
              </Button>
            </div>
          )}

          {/* Botão de Voltar para Login */}
          {isRegistering && (
            <div className="pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Já tem uma conta?
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-border hover:bg-blue-50 dark:hover:bg-blue-950/30 h-11"
                onClick={() => {
                  setIsRegistering(false);
                  setNome('');
                  setConfirmPassword('');
                }}
              >
                Voltar para Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Recuperação de Senha */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recuperar Senha</DialogTitle>
            <DialogDescription>
              Insira o email associado à sua conta para receber um link de recuperação.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-card-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600 dark:text-blue-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="pl-10 border-border bg-input-background h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-border h-11"
                onClick={() => setShowForgotPassword(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white shadow-lg h-11"
              >
                Enviar Link
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}