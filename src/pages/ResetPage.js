import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Body from "../components/Body";
import { useApi } from "../contexts/ApiProvider";
import { useFlash } from "../contexts/FlashProvider";
import { useForm } from "@mantine/form";
import { Button, Divider, Group, Title } from "@mantine/core";
import SetPassword from "../components/SetPassword.js";

export default function ResetPage() {
  const api = useApi();
  const flash = useFlash();
  const navigate = useNavigate();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const userId = new URLSearchParams(search).get("id");
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      password: "",
      password2: "",
    },
    validate: {
      password: (value) => (value.length === 0 ? t("please-select-a-password") : null),
      password2: (value) => (value.length === 0 ? t("please-repeat-the-password") : null),
    },
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const onSubmit = async () => {
    const response = await api.put("/auth/reset-password", {
      userId,
      token,
      password: form.values.password,
    });
    if (response.ok) {
      flash("Your password has been successfully reset", "success");
      navigate("/login");
    } else {
      flash("Password could not be reset. Please try again.", "danger");
      navigate("/reset-request");
    }
  };

  const cancel = () => {
    navigate("/login");
  };

  return (
    <Body>
      <Title>{t("reset-your-password")}</Title>
      <Divider mb={8} />
      <form onSubmit={form.onSubmit(onSubmit)}>
        <SetPassword form={form} focus={true} />
        <Divider mb={8} />
        <Group justify="space-between" my={8} pt={16}>
          <Button type="submit">{t("register")}</Button>
          <Button variant="outline" onClick={cancel}>
            {t("cancel")}
          </Button>
        </Group>
      </form>
    </Body>
  );
}
