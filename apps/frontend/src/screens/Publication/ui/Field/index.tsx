import React from "react";
import { Controller as ReactHookController } from "react-hook-form";
import type { ControllerProps } from "react-hook-form";
import type {
  PublicationFieldName,
  PublicationFormValues,
} from "../../model/types";

export const Field = (
  props: ControllerProps<PublicationFormValues, PublicationFieldName>,
) => {
  return <ReactHookController {...props} />;
};
