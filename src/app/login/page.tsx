"use client";

import {
  Box,
  Button,
  Image,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { AuthPage, useLogin, useNavigation } from "@refinedev/core";

export default function LoginPage() {
  const { mutate: login } = useLogin();
  const { list } = useNavigation();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    login(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          list("dashboard");
        },
        onError: (error) => {
          console.error("Login Error:", error);
          alert("Login gagal. Periksa email atau password Anda.");
        },
      }
    );
  };

  return (
    <AuthPage
      type="login"
      renderContent={() => (
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: theme.colors.gray[0],
          })}
        >
          <div
            style={{
              marginBottom: "70px",
              marginTop: "-80px",
              textAlign: "center",
            }}
          >
            <img src="/octarine-logo.svg" alt="My App" style={{ height: 70 }} />
          </div>
          <Box
            sx={(theme) => ({
              maxWidth: 400,
              width: "100%",
              padding: theme.spacing.xl,
              borderRadius: theme.radius.md,
              boxShadow: theme.shadows.md,
              backgroundColor: theme.white,
            })}
          >
            <Text size="md" weight={200} color="black" align="center">
              Welcome Back!
            </Text>
            <Text size="lg" weight={700} color="black" align="center" mb="md">
              Sign in to your account
            </Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
                mt="md"
                size="md"
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...form.getInputProps("password")}
                mt="md"
                size="md"
              />
              <Button
                type="submit"
                fullWidth
                mt="xl"
                size="md"
                style={{ backgroundColor: "#111", color: "#fff" }}
              >
                Sign in
              </Button>
            </form>
          </Box>
        </Box>
      )}
    />
  );
}
