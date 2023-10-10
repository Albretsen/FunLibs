import { I18n } from "i18n-js";

const i18n = new I18n({
    en: {
        sign_in: "Sign in",
        signing_in: "Signing in",
        signed_in_as: "Signed in as",
        error_signing_in: "Error signing in",
        email: "Email",
        password: "Password",
        dont_have_an_account: "Don't have an account?",
        create_a_new_one: "Create a new one",
        forgot_password: "Forgot password?",
    },
    es: {
        sign_in: "Iniciar sesión",
        signing_in: "Iniciando sesión",
        signed_in_as: "Conectado como",
        error_signing_in: "Error al iniciar sesión",
        email: "Correo electrónico",
        password: "Contraseña",
        dont_have_an_account: "¿No tienes una cuenta?",
        create_a_new_one: "Crea una nueva",
        forgot_password: "¿Olvidaste tu contraseña?",
    },
});

i18n.defaultLocale = "es";
i18n.locale = "es";

export default i18n;