import { useState } from "react";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  Loader2Icon,
  MailCheckIcon,
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "../../schemas/forgot-password.schema";
import { useAuthentication } from "../../contexts/authentication/useAuthentication";

export function ForgotPassword() {
  const { forgotPassword, isLoading, error } = useAuthentication();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await forgotPassword(data);
      setIsSubmitted(true);
    } catch {
      // O contexto já expõe a mensagem de erro.
    }
  }

  const backToLogin = (
    <Link
      to="/login"
      className={cn(
        buttonVariants({ variant: "link" }),
        "h-auto gap-1 p-0 font-medium",
      )}
    >
      <ArrowLeftIcon className="size-4" />
      Voltar para o login
    </Link>
  );

  // Resposta genérica: nunca confirma se o e-mail existe ou não.
  if (isSubmitted) {
    return (
      <Card className="border-0 py-8 shadow-2xl shadow-black/30">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <MailCheckIcon className="size-6" />
          </span>
          <CardTitle className="text-2xl font-bold tracking-tight text-egsuas-navy dark:text-foreground">
            Verifique seu e-mail
          </CardTitle>
          <CardDescription>
            Se existir uma conta associada a{" "}
            <span className="font-medium text-foreground">
              {form.getValues("email")}
            </span>
            , enviaremos as instruções para redefinir sua senha.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => {
              form.reset();
              setIsSubmitted(false);
            }}
          >
            Tentar outro e-mail
          </Button>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          {backToLogin}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-0 py-8 shadow-2xl shadow-black/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-egsuas-navy dark:text-foreground">
          Esqueceu a senha?
        </CardTitle>
        <CardDescription>
          Informe seu e-mail e enviaremos as instruções para redefinir sua
          senha.
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
                  <FieldLabel htmlFor="forgot-password-email">
                    E-mail
                  </FieldLabel>
                  <Input
                    {...field}
                    id="forgot-password-email"
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

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar instruções"
              )}
            </Button>
          </FieldGroup>
        </CardContent>
      </form>

      <CardFooter className="justify-center text-sm">{backToLogin}</CardFooter>
    </Card>
  );
}
