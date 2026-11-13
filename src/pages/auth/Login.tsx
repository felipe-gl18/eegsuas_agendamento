import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
} from "lucide-react";

import { loginSchema, type LoginFormData } from "../../schemas/login.schema";
import { useAuthentication } from "../../contexts/authentication/useAuthentication";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../components/ui/field";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Input } from "../../components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../../components/ui/input-group";
import { Button, buttonVariants } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

interface LoginProps {
  /** Called after a successful login (e.g. navigate to the dashboard). */
  onSuccess?: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const { login, isLoading, error } = useAuthentication();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data);
      onSuccess?.();
    } catch {
      // The context already exposes the error message.
    }
  }

  return (
    <Card className="border-0 py-8 shadow-2xl shadow-black/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-egsuas-navy dark:text-foreground">
          Entrar
        </CardTitle>
        <CardDescription>
          Informe suas credenciais para acessar a plataforma.
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login-password">Senha</FieldLabel>
                    {/* Swap for your router's <Link> */}
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-egsuas-navy hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      disabled={isLoading}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        aria-label={
                          showPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
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
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </FieldGroup>
        </CardContent>
      </form>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Não tem uma conta?&nbsp;
        <Link
          to="/register"
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-auto p-0 font-medium",
          )}
        >
          Cadastra-se
        </Link>
      </CardFooter>
    </Card>
  );
}
