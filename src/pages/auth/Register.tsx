import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
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
import { Input } from "../../components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../../components/ui/input-group";
import { cn } from "../../lib/utils";

import {
  onlyDigits,
  registerSchema,
  type RegisterFormData,
} from "../../schemas/register.schema";
import { useAuthentication } from "../../contexts/authentication/useAuthentication";
import { Link } from "react-router-dom";
import {
  getVerifiedUniversities,
  type VerifiedUniversity,
} from "../../services/universities.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface RegisterProps {
  /** Chamado após o cadastro com sucesso (ex.: navegar para o login). */
  onSuccess?: () => void;
}

/** Aplica a máscara 000.000.000-00 enquanto o usuário digita. */
function maskCpf(value: string) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function Register({ onSuccess }: RegisterProps) {
  const {
    register,
    isLoading,
    error,
    unities,
    occupations,
    isLoadingOptions,
    fetchRegistrationOptions,
  } = useAuthentication();
  const [showPassword, setShowPassword] = useState(false);

  const [universities, setUniversities] = useState<VerifiedUniversity[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      universityId: "",
      password: "",
      confirmPassword: "",
      occupationId: "",
      unityId: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    const { confirmPassword: _confirmPassword, ...payload } = data;

    try {
      await register({
        ...payload,
        universityId: payload.universityId || null,
      });
      onSuccess?.();
    } catch {
      // O contexto já expõe a mensagem de erro.
    }
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

  useEffect(() => {
    getVerifiedUniversities()
      .then(setUniversities)
      .catch(console.error)
      .finally(() => setIsLoadingUniversities(false));
  }, []);

  useEffect(() => {
    fetchRegistrationOptions().catch(() => {
      // The provider already stores the error message.
    });
  }, [fetchRegistrationOptions]);

  return (
    <Card className="border-0 py-8 shadow-2xl shadow-black/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight text-egsuas-navy dark:text-foreground">
          Criar conta
        </CardTitle>
        <CardDescription>
          Preencha seus dados para se cadastrar na plataforma.
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
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-name">Nome completo</FieldLabel>
                  <Input
                    {...field}
                    id="register-name"
                    placeholder="Seu nome completo"
                    autoComplete="name"
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">E-mail</FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
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
              name="cpf"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-cpf">CPF</FieldLabel>
                  <Input
                    {...field}
                    id="register-cpf"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    autoComplete="off"
                    maxLength={14}
                    // O form guarda só os 11 dígitos (o schema exige isso); a máscara é só visual.
                    value={maskCpf(field.value)}
                    onChange={(event) =>
                      field.onChange(
                        onlyDigits(event.target.value).slice(0, 11),
                      )
                    }
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-4">
              <Controller
                name="unityId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-unity">Unidade</FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || isLoadingOptions}
                    >
                      <SelectTrigger id="register-unity">
                        <SelectValue
                          placeholder={
                            isLoadingOptions
                              ? "Carregando unidades..."
                              : "Selecione sua unidade"
                          }
                        >
                          {
                            unities.find((unity) => unity.id === field.value)
                              ?.name
                          }
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {unities.map((unity) => (
                          <SelectItem key={unity.id} value={unity.id}>
                            {unity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="occupationId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-occupation">Cargo</FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || isLoadingOptions}
                    >
                      <SelectTrigger id="register-occupation">
                        <SelectValue
                          placeholder={
                            isLoadingOptions
                              ? "Carregando ocupações..."
                              : "Selecione sua ocupação"
                          }
                        >
                          {
                            occupations.find(
                              (occupation) => occupation.id === field.value,
                            )?.name
                          }
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {occupations.map((occupation) => (
                          <SelectItem key={occupation.id} value={occupation.id}>
                            {occupation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="universityId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-university">
                    Universidade (opcional)
                  </FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading || isLoadingUniversities}
                  >
                    <SelectTrigger id="register-university">
                      <SelectValue
                        placeholder={
                          isLoadingUniversities
                            ? "Carregando universidades..."
                            : "Selecione sua universidade"
                        }
                      >
                        {
                          universities.find(
                            (university) => university.id === field.value,
                          )?.name
                        }
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem key={university.id} value={university.id}>
                          {university.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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
                  <FieldLabel htmlFor="register-password">Senha</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="register-password"
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
                  <FieldLabel htmlFor="register-confirm-password">
                    Confirmar senha
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="register-confirm-password"
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
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </FieldGroup>
        </CardContent>
      </form>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Já tem uma conta?&nbsp;
        <Link
          to="/login"
          className={cn(
            buttonVariants({ variant: "link" }),
            "h-auto p-0 font-medium",
          )}
        >
          Entrar
        </Link>
      </CardFooter>
    </Card>
  );
}
