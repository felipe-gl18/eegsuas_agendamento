import UsersList from "./UsersList";

export default function Users() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#514949]">
          Usuários
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie os usuários cadastrados na plataforma, consulte informações e
          acompanhe seus perfis de acesso.
        </p>
      </div>

      {/* Listagem */}
      <UsersList />
    </div>
  );
}
