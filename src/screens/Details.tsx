import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Keyboard, Share, TouchableWithoutFeedback } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardPros } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";

interface RouteParams {
  id: string;
}

export const Details = () => {
  const [optionSelected, setOptionSelected] = useState<
    "Seus palpites" | "Ranking do grupo"
  >("Seus palpites");
  const [isLoading, setIsLoading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardPros>(
    {} as PoolCardPros
  );

  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;

  const fetchPoolDetails = async () => {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${id}`);

      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);

      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  const handleCodeShare = async () => {
    await Share.share({
      message: `Olha o código do meu bolão: ${poolDetails.code}`,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack flex={1} bgColor="gray.900">
        <Header
          title={poolDetails.title}
          showBackButton
          showShareButton
          onShare={() => handleCodeShare()}
        />

        {poolDetails._count.participants > 0 ? (
          <VStack px={5} flex={1}>
            <PoolHeader data={poolDetails} />
            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
              <Option
                title="Seus palpites"
                isSelected={optionSelected === "Seus palpites"}
                onPress={() => setOptionSelected("Seus palpites")}
              />
              <Option
                title="Ranking do grupo"
                isSelected={optionSelected === "Ranking do grupo"}
                onPress={() => setOptionSelected("Ranking do grupo")}
              />
            </HStack>
            <Guesses poolId={poolDetails.id} />
          </VStack>
        ) : (
          <EmptyMyPoolList
            code={poolDetails.code}
            onShare={() => handleCodeShare()}
          />
        )}
      </VStack>
    </TouchableWithoutFeedback>
  );
};
