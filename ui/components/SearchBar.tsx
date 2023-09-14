import { SearchBar as DSFRSearchBar, SearchBarProps } from "@codegouvfr/react-dsfr/SearchBar";
import { FC } from "react";

interface Props extends SearchBarProps {
  defaultValue?: string;
}

const SearchBar: FC<Props> = ({ defaultValue, ...rest }) => {
  return <DSFRSearchBar renderInput={(props) => <input {...props} defaultValue={defaultValue} />} {...rest} />;
};

export default SearchBar;
