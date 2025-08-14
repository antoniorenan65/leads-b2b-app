import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Trash2, LogOut, Users, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    validityDays: '30'
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, [user, navigate]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password) {
      toast({
        title: "❌ Erro",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const existingUser = users.find(u => u.email === newUser.email);
    if (existingUser) {
      toast({
        title: "❌ Erro",
        description: "Usuário já existe",
        variant: "destructive",
      });
      return;
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(newUser.validityDays));

    const userToAdd = {
      id: Date.now().toString(),
      email: newUser.email,
      password: newUser.password,
      createdAt: new Date().toISOString(),
      expiresAt: expirationDate.getTime(),
      validityDays: newUser.validityDays
    };

    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: "✅ Usuário criado!",
      description: `Usuário ${newUser.email} criado com sucesso`,
    });

    setNewUser({ email: '', password: '', validityDays: '30' });
  };

  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    toast({
      title: "✅ Usuário removido",
      description: "Usuário removido com sucesso",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR');
  };

  const isExpired = (timestamp) => {
    return new Date().getTime() > timestamp;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Painel Administrativo - Leads B2B</title>
        <meta name="description" content="Painel administrativo para gestão de usuários do sistema" />
        <meta property="og:title" content="Painel Administrativo - Leads B2B" />
        <meta property="og:description" content="Painel administrativo para gestão de usuários do sistema" />
      </Helmet>

      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Painel Administrativo</h1>
                <p className="text-white/70">Gestão de usuários do sistema</p>
              </div>
            </div>
            
            <Button onClick={handleLogout} variant="outline" className="btn-secondary">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Criar Usuário */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Plus className="w-5 h-5" />
                    Criar Novo Usuário
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Adicione um novo usuário ao sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@exemplo.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite a senha"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="validity" className="text-white">Validade (dias)</Label>
                      <Select
                        value={newUser.validityDays}
                        onChange={(e) => setNewUser({...newUser, validityDays: e.target.value})}
                        className="input-field"
                      >
                        <option value="7">7 dias</option>
                        <option value="15">15 dias</option>
                        <option value="30">30 dias</option>
                        <option value="60">60 dias</option>
                        <option value="90">90 dias</option>
                        <option value="365">1 ano</option>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Usuário
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Lista de Usuários */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-effect border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5" />
                    Usuários Cadastrados ({users.length})
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Lista de todos os usuários do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {users.length === 0 ? (
                      <div className="text-center py-8 text-white/60">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhum usuário cadastrado</p>
                      </div>
                    ) : (
                      users.map((user, index) => (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${
                            isExpired(user.expiresAt) 
                              ? 'bg-red-500/10 border-red-500/30' 
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white">{user.email}</span>
                                {isExpired(user.expiresAt) && (
                                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                    Expirado
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-white/60 space-y-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Criado: {formatDate(user.createdAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Expira: {formatDate(user.expiresAt)}
                                </div>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-400 border-red-400/30 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
