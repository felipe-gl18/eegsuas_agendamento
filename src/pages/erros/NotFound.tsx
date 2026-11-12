import egsuasLogo from "../../assets/egsuas.png";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty";

import { Button } from "../../components/ui/button";

export default function NotFound() {
  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="default">
            <img
              src={egsuasLogo}
              alt="Logo EGSUAS"
              className="w-52 h-auto object-contain"
            />
          </EmptyMedia>

          <EmptyTitle>Página não encontrada</EmptyTitle>

          <EmptyDescription>
            A página que você tentou acessar não existe ou não está disponível
            em nossa plataforma. Por favor, verifique o endereço e tente
            novamente.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="flex-row justify-center gap-2">
          <Button>
            <a href="/login">Login</a>
          </Button>

          <Button variant="outline">
            <a href="/register">Cadastrar</a>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  );
}
