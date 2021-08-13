// styling:
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { FormEventHandler, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  border: 1px solid red;

  border-radius: 5rem;
  margin: 0 1rem;
  padding: 0 0.5rem;
  min-height: 2rem;

  color: ${({ theme }) => theme.colors.onSurface.main};
  background-color: ${({ theme }) => theme.colors.surface.main};

  width: 100%;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary.main};
`;

type Props = {};

const Register = ({}: Props) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { user, register, login, logout } = useAuth();

  const submit = async () => {
    const { data, user, error, session } = await register(email, password);

    console.log(data, user, session);

    if (error) console.log(error);
  };

  const loginUser = async () => {
    const { data, user, error, session } = await login(email, password);

    console.log(data, user, session);

    if (error) console.log(error);
  };

  if (user)
    return (
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          logout();
        }}
      >
        logout
      </Button>
    );

  return (
    <Container>
      <Input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        register
      </Button>
      <Button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          loginUser();
        }}
      >
        login
      </Button>
    </Container>
  );
};

export default Register;
