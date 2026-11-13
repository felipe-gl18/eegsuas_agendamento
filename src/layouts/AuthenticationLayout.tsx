import { Navigate, Outlet } from "react-router-dom";
import egsuasLogo from "../assets/egsuas.png";
import prefeituraSobral from "../assets/prefeitura_sobral.png";
import { useAuthentication } from "../contexts/authentication/useAuthentication";

export default function AuthLayout() {
  const { isAuthenticated, isInitializing } = useAuthentication();

  // Wait only for the first session check, not for every request.
  if (isInitializing) return null;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Lado esquerdo - Identidade institucional */}
      <section className="hidden md:flex relative bg-background items-center justify-center overflow-hidden p-12">
        {/* Elementos decorativos */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-egsuas-blue/10" />
        <div className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full bg-egsuas-cyan/15" />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
          {/* Logos */}
          <div className="flex flex-col items-center w-full gap-10">
            <img
              src={prefeituraSobral}
              alt="Prefeitura Municipal de Sobral"
              className="w-full max-w-[340px] max-h-36 object-contain"
            />

            <div className="w-20 h-px bg-border" />

            <img
              src={egsuasLogo}
              alt="EGSUAS"
              className="w-full max-w-[280px] max-h-44 object-contain"
            />
          </div>

          {/* Texto institucional */}
          <div className="mt-12 space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-egsuas-navy">
              Bem-vindo à EGSUAS
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground max-w-md mx-auto">
              Educação permanente, conhecimento e fortalecimento da política de
              Assistência Social.
            </p>
          </div>

          {/* Rodapé */}
          <div className="mt-16 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-egsuas-blue" />
            Plataforma de Gestão e Formação
          </div>
        </div>
      </section>

      {/* Lado direito - Autenticação */}
      <section className="relative flex min-h-screen items-center justify-center bg-egsuas-navy-dark px-6 py-12 sm:px-10">
        {/* Detalhes decorativos */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-egsuas-blue/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-egsuas-cyan/10 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          <Outlet />
        </div>

        {/* Rodapé */}
        <div className="absolute bottom-5 left-0 right-0 text-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} EGSUAS · Todos os direitos reservados
          </p>
        </div>
      </section>
    </main>
  );
}
