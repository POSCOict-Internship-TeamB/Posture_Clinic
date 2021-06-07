import styled from "@emotion/styled";
import spacing from "lib/styles/stylesheet/spacing";
import size from "../lib/styles/stylesheet/size";

export const BaseContainer = styled.div`
  ${size("100%", "100vh")}
  padding: ${spacing[40]};
  background-color: #f0f0f0;
`;

export default BaseContainer;
