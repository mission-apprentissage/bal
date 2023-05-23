import { Button, HStack, Input } from "@chakra-ui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface IForm {
  q: string;
}

interface Props {
  onSearch: (q: string) => void;
  defaultValue?: string;
}

const FormSearch: FC<Props> = ({ onSearch, defaultValue = "" }) => {
  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: { q: defaultValue },
  });

  const onSubmit = (data: IForm) => {
    onSearch(data.q);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HStack gap={0} width={500}>
        <Input type="search" {...register("q")} />
        <Button type="submit" title="Rechercher" m={0} marginInlineStart={0}>
          <i className="ri-search" />
          Rechercher
        </Button>
      </HStack>
    </form>
  );
};

export default FormSearch;
