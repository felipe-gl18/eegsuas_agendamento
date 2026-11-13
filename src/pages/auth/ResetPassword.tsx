import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
} from "lucide-react";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button, buttonVariants } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../../components/ui/input-group";
import { cn } from "../../lib/utils";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../schemas/reset-password.schema";
import { useAuthentication } from "../../contexts/authentication/useAuthentication";

export default function ResetPassword() {
  const { resetPassword, isLoading, error } = useAuthentication();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Guarda o token em memória e remove da URL: assim ele não fica no histórico
  // do navegador nem vaza para outros sites pelo cabeçalho Referer.
  const [token] = useState(() => searchParams.get("token") ?? "");

  useEffect(() => {
    if (searchParams.has("token")) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await resetPassword({ token, password: data.password });
      setIsSuccess(true);
    } catch {
      // O contexto já expõe a mensagem de erro.
    }
  }

  // Link sem token (acessou /reset-password direto).
  if (!token) {
    return (
      <Card className="border-0 py-8 shadow-2xl shadow-black/30">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircleIcon className="size-6" />
          </span>
          <CardTitle className="text-2xl font-bold tracking-tight text-egsuas-navy dark:text-foreground">
            Link inválido
          </CardTitle>
          <CardDescription>
            Este link de redefinição de senha é inválido ou expirou. Solicite um
            novo link para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link
            to="/forgot-password"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Solicitar novo link
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className="border-0 py-8 shadow-2xl shadow-black/30">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <CircleCheckIcon className="size-6" />
          </span>
          <CardTitle className="text-2xl font-bold tracking-tight text-egsuas-navy dark:text-foreground">
            Senha redefinida
          </CardTitle>
          <CardDescription>
            Sua senha foi alterada com sucesso. Use a nova senha para entrar na
            plataforma.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link
            to="/login"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Ir para o login
          </Link>
        </CardContent>
      </Card>
    );
  }

  const passwordToggle = (
    <InputGroupAddon align="inline-end">
      <InputGroupButton
        type="button"
        size="icon-xs"
        variant="ghost"
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </InputGroupButton>
    </InputGroupAddon>
  );

  return (
    <Card className="border-0 py-8 shadow-2xl shadow-black/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-egsuas-navy dark:text-foreground">
          Redefinir senha
        </CardTitle>
        <CardDescription>
          Escolha uma nova senha para a sua conta.
        </CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <CardContent>
          <FieldGroup>
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertCircleIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reset-password">Nova senha</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    {passwordToggle}
                  </InputGroup>
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : (
                    <FieldDescription>Mínimo de 8 caracteres.</FieldDescription>
                  )}
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="reset-confirm-password">
                    Confirmar nova senha
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="reset-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    {passwordToggle}
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Redefinindo...
                </>
              ) : (
                "Redefinir senha"
              )}
            </Button>
          </FieldGroup>
        </CardContent>
      </form>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Link expirado?&nbsp;
        <Link
          to="/forgot-password"
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-auto p-0 font-medium",
          )}
        >
          Solicitar novo link
        </Link>
      </CardFooter>
    </Card>
  );
}
