import { RegisterOptions } from "react-hook-form"
import { Inputs } from "./StationSearchForm"

export const stationNameValidation: RegisterOptions<Inputs, "stationName"> = {
  required: true,
  maxLength: {
    value: 255,
    message: "Station Name cannot be longer than 255 characters",
  },
}

export const stationTagValidation: RegisterOptions<Inputs, "tag"> = {
  required: false,
  maxLength: {
    value: 30,
    message: "Tag cannot be longer than 30 characters",
  },
}
