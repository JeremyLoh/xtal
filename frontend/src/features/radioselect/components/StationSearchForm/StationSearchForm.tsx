import "./StationSearchForm.css"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { FaSearch } from "react-icons/fa"
import { languages, LanguageEnum } from "../../../../api/radiobrowser/languages"

export type StationSearchValues = {
  stationName: string
  language: string
  sort: string
  limit: number
  offset: number
}

type Inputs = {
  stationName: string
  language: LanguageEnum
  sort: string
}

type StationSearchFormProps = {
  handleStationSearch: ({
    stationName,
    language,
    sort,
    limit,
    offset,
  }: StationSearchValues) => void
}

function StationSearchForm(props: StationSearchFormProps) {
  const limit: number = 10
  const [offset] = useState<number>(0)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: {
      stationName: "",
      language: LanguageEnum.english,
      sort: "",
    },
  })
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    props.handleStationSearch({
      stationName: data.stationName,
      language:
        data.language === LanguageEnum.any ? "" : LanguageEnum[data.language],
      sort: data.sort,
      offset,
      limit,
    })
  }
  return (
    <form className="station-search-form" onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="stationName">Search By Name</label>
      <input
        type="text"
        id="stationName"
        {...register("stationName", {
          required: true,
          maxLength: {
            value: 255,
            message: "Station Name cannot be longer than 255 characters",
          },
        })}
      />
      {errors.stationName && (
        <p role="alert" className="error-text">
          {errors.stationName.type === "required"
            ? "Station Name is required"
            : errors.stationName.message}
        </p>
      )}
      <label htmlFor="language">Language</label>
      <select
        className="language-select"
        id="language"
        {...register("language")}
      >
        <option value="">any language</option>
        {languages.map((option: string, index: number) => {
          return (
            <option key={`${option}-${index}`} value={option}>
              {option}
            </option>
          )
        })}
      </select>
      <label htmlFor="sort">Sort By</label>
      <select id="sort" className="sort-select" {...register("sort")}>
        <option value="">none</option>
        {["bitrate", "votes"].map((value: string, index: number) => {
          return (
            <option key={`${value}-${index}`} value={value}>
              {value}
            </option>
          )
        })}
      </select>
      <button type="submit">
        <FaSearch size={16} /> Search
      </button>
    </form>
  )
}

export default StationSearchForm
