import { SubmitHandler, useForm } from "react-hook-form"
import "./StationSearchForm.css"
import { FaSearch } from "react-icons/fa"
import { useState } from "react"

type Inputs = {
  stationName: string
}

type StationSearchFormProps = {
  handleStationSearch: ({
    stationName,
    limit,
    offset,
  }: {
    stationName: string
    limit: number
    offset: number
  }) => void
}

function StationSearchForm(props: StationSearchFormProps) {
  const limit: number = 10
  const [offset] = useState<number>(0)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    props.handleStationSearch({
      offset,
      stationName: data.stationName,
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
      <button type="submit">
        <FaSearch size={16} /> Search
      </button>
    </form>
  )
}

export default StationSearchForm
