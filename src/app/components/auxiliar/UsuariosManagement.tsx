import { useEffect, useState } from "react";
import { Users, Plus, Search, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { usuariosApi } from "../../../lib/api/usuarios";
import { mensagemDeErro } from "../../auth/AuthContext";
import type { Perfil, UsuarioResponse } from "../../../lib/api/types";

interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
  ativo: boolean;
}

const emptyForm: UsuarioForm = {
  nome: "",
  email: "",
  senha: "",
  perfil: "PROFESSOR",
  ativo: true,
};

export function UsuariosManagement() {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<UsuarioResponse | null>(null);
  const [form, setForm] = useState<UsuarioForm>(emptyForm);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosApi.listar();
      setUsuarios(data);
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao buscar usuários."));
    } finally {
      setLoading(false);
    }
  };

  const abrirNovo = () => {
    setEditando(null);
    setForm(emptyForm);
    setModalAberto(true);
  };

  const abrirEdicao = (usuario: UsuarioResponse) => {
    setEditando(usuario);
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      perfil: usuario.perfil,
      ativo: usuario.ativo,
    });
    setModalAberto(true);
  };

  const handleSubmit = async () => {
    if (!form.nome.trim() || !form.email.trim()) return;
    if (!editando && form.senha.length < 6) {
      toast.error("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    setSalvando(true);
    try {
      if (editando) {
        await usuariosApi.atualizar(editando.id, {
          nome: form.nome,
          email: form.email,
          perfil: form.perfil,
          ativo: form.ativo,
          senha: form.senha ? form.senha : null,
        });
        toast.success("Usuário atualizado com sucesso.");
      } else {
        await usuariosApi.criar({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          perfil: form.perfil,
        });
        toast.success("Usuário cadastrado com sucesso.");
      }
      setModalAberto(false);
      fetchUsuarios();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao salvar usuário."));
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (usuario: UsuarioResponse) => {
    if (!confirm(`Remover o usuário "${usuario.nome}"?`)) return;
    try {
      await usuariosApi.remover(usuario.id);
      toast.success("Usuário removido (ou inativado, se houver histórico vinculado).");
      fetchUsuarios();
    } catch (err) {
      toast.error(mensagemDeErro(err, "Erro ao remover usuário."));
    }
  };

  const filtrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">Usuários</h1>
          </div>
          <p className="text-muted-foreground">
            Cadastre e gerencie os usuários do sistema (professores e auxiliares)
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Novo Usuário</span>
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-medium">E-mail</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Perfil</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filtrados.map((usuario) => (
                  <tr key={usuario.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">{usuario.nome}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{usuario.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs border bg-accent">
                        {usuario.perfil === "PROFESSOR" ? "Professor" : "Auxiliar de Laboratório"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs border ${
                          usuario.ativo
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEdicao(usuario)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors text-primary"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRemover(usuario)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors text-red-600"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalAberto(false)} />
          <div className="relative bg-card border-2 border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b-2 border-border">
              <h2 className="text-xl font-semibold">{editando ? "Editar Usuário" : "Novo Usuário"}</h2>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Senha {editando ? "(deixe em branco para manter)" : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  value={form.senha}
                  onChange={(e) => setForm((p) => ({ ...p, senha: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Perfil</label>
                  <select
                    value={form.perfil}
                    onChange={(e) => setForm((p) => ({ ...p, perfil: e.target.value as Perfil }))}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                  >
                    <option value="PROFESSOR">Professor</option>
                    <option value="AUXILIAR_LABORATORIO">Auxiliar de Laboratório</option>
                  </select>
                </div>
                {editando && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Status</label>
                    <select
                      value={form.ativo ? "ativo" : "inativo"}
                      onChange={(e) => setForm((p) => ({ ...p, ativo: e.target.value === "ativo" }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t-2 border-border">
              <button
                onClick={() => setModalAberto(false)}
                className="px-6 py-3 rounded-xl border-2 border-border hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={salvando}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-60"
              >
                {salvando ? "Salvando..." : editando ? "Salvar Alterações" : "Cadastrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
