import { useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export const Find = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const { navigate } = useNavigation();

  const toast = useToast();

  const handleJoinPool = async () => {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: "Informe o código do bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/pools/join", { code });

      return toast.show({
        title: "Você entrou no bolão!",
        placement: "top",
        bgColor: "green.500",
      });

      navigate("pools");
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error.response?.data?.message === "Pool not found") {
        return toast.show({
          title: "Bolão não encontrado!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if (error.response?.data?.message === "You are already in this pool") {
        return toast.show({
          title: "Você já está participando do bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack flex={1} bgColor="gray.900">
        <Header title="Buscar por código" showBackButton />

        <VStack mt={8} mx={5} alignItems="center">
          <Heading
            fontFamily="heading"
            color="white"
            fontSize="xl"
            mb={8}
            textAlign="center"
          >
            Encontre um bolão através de{"\n"}seu código único
          </Heading>

          <Input
            mb={2}
            placeholder="Qual o código do bolão?"
            onChangeText={(value) => setCode(value)}
            autoCapitalize="characters"
            value={code}
          />

          <Button
            title="Buscar bolão"
            isLoading={isLoading}
            onPress={() => handleJoinPool()}
          />
        </VStack>
      </VStack>
    </TouchableWithoutFeedback>
  );
};
