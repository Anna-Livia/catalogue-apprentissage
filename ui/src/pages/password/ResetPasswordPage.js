import { Box, Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import queryString from "query-string";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";

import useAuth from "../../common/hooks/useAuth";
import { _post } from "../../common/httpClient";
import decodeJWT from "../../common/utils/decodeJWT";

const ResetPasswordPage = () => {
  const [, setAuth] = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { passwordToken } = queryString.parse(location.search);
  const username = decodeJWT(passwordToken).sub;

  const changePassword = async (values, { setStatus }) => {
    try {
      const user = await _post("/api/password/reset-password", { ...values, passwordToken });
      setAuth(user);
      history.push("/");
    } catch (e) {
      console.error(e);
      setStatus({
        error: (
          <span>
            Le lien est expiré ou invalide, merci de prendre contact avec un administrateur en précisant votre adresse
            mail :
            <br />
            <a href="mailto:catalogue@apprentissage.beta.gouv.fr">catalogue@apprentissage.beta.gouv.fr</a>
          </span>
        ),
      });
    }
  };

  return (
    <Center height="100vh" verticalAlign="center">
      <Box width={["auto", "28rem"]}>
        <Heading fontFamily="Marianne" fontWeight="700" marginBottom="2w">
          Changement du mot de passe pour l'utilisateur {username}
        </Heading>
        <Formik
          initialValues={{
            newPassword: "",
          }}
          validationSchema={Yup.object().shape({
            newPassword: Yup.string()
              .required("Veuillez saisir un mot de passe")
              .matches(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.=/])(?=.{8,})",
                "Le mot de passe doit contenir au moins 8 caractères, une lettre en minuscule, une lettre en majuscule, un chiffre et un caractère spécial"
              ),
          })}
          onSubmit={changePassword}
        >
          {({ status = {} }) => {
            return (
              <Form>
                <Field name="newPassword">
                  {({ field, meta }) => {
                    return (
                      <FormControl isRequired isInvalid={meta.error && meta.touched} marginBottom="2w">
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <Input {...field} id={field.name} type="password" placeholder="Votre nouveau mot de passe..." />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    );
                  }}
                </Field>
                <Button colorScheme="blue" type="submit">
                  Réinitialiser le mot de passe
                </Button>
                {status.error && (
                  <Text color="error" mt={2}>
                    {status.error}
                  </Text>
                )}
              </Form>
            );
          }}
        </Formik>
      </Box>
    </Center>
  );
};

export default ResetPasswordPage;
