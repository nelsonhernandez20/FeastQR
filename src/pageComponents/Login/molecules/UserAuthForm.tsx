"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type Provider } from "@supabase/supabase-js";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { FormInput } from "~/components/FormInput/FormInput";
import { Icons } from "~/components/Icons";
import { Button, buttonVariants } from "~/components/ui/button";
import { Form, FormField } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { supabase } from "~/server/supabase/supabaseClient";
import { cn } from "~/utils/cn";
import {
  type LoginFormValues,
  loginValidationSchema,
} from "./UserAuthForm.schema";

const signInWithOauth = (provider: Provider) => {
  void supabase().auth.signInWithOAuth({
    provider: provider,
    options: { redirectTo: `${window.location.origin}/dashboard` },
  });
};

export function UserAuthForm() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginValidationSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { data: authData, error } = await supabase().auth.signInWithPassword(data);

      if (error) {
        toast({
          title: t("login.title"),
          description: error.message,
          variant: "destructive",
          duration: 9000,
        });
        return;
      }

      if (authData?.user) {
        // Marcar que estamos en proceso de redirección para evitar mensajes de error
        setIsRedirecting(true);
        
        // Usar setTimeout para asegurar que la redirección ocurra después de que el estado se actualice
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      }
    } catch (err) {
      // Solo mostrar el error si no estamos en proceso de redirección
      if (!isRedirecting) {
        toast({
          title: t("login.title"),
          description: "Ha ocurrido un error al iniciar sesión",
          variant: "destructive",
          duration: 9000,
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid gap-6"
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInput label={t("login.emailLabel")}>
              <Input {...field} />
            </FormInput>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormInput label={t("login.passwordLabel")}>
              <Input {...field} type="password" />
            </FormInput>
          )}
        />
        <Button loading={form.formState.isSubmitting || isRedirecting} type="submit">
          {t("login.submitButton")}
        </Button>
      </form>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }), "flex gap-2")}
        onClick={() => {
          signInWithOauth("google");
        }}
      >
        <Icons.google width={16} />
        Google
      </button>
    </Form>
  );
}
