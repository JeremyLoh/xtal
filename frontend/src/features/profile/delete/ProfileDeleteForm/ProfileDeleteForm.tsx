import "./ProfileDeleteForm.css"
import { JSX } from "react"
import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form"
import { MdDelete } from "react-icons/md"
import { PiWarningCircleBold } from "react-icons/pi"
import Separator from "../../../../components/Separator/Separator"

type Inputs = {
  email: string
}

const emailValidation: RegisterOptions<Inputs, "email"> = {
  required: { value: true, message: "Required" },
}

type ProfileDeleteFormProps = {
  onDelete: (email: string) => Promise<void>
}

function ProfileDeleteForm({ onDelete }: ProfileDeleteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { email: "" },
  })
  const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
    onDelete(data.email)
  }

  return (
    <form className="profile-delete-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="profile-delete-form-danger-text">
        <PiWarningCircleBold size={32} /> Danger Zone
      </h2>
      <Separator />
      <h3 className="profile-delete-form-title">Delete your xtal account</h3>
      <div>
        <span>Thank you for using xtal. Your profile will be deleted.</span>{" "}
        <b>This action cannot be undone!</b>
      </div>
      <br />
      <label htmlFor="email">Confirm deletion</label>
      <input
        type="text"
        placeholder="Enter your email"
        className="profile-delete-form-email-input"
        {...register("email", emailValidation)}
      />
      {errors.email && getErrorElement(errors.email.message)}
      <button className="profile-delete-form-delete-button">
        <MdDelete size={24} />
        Delete Account
      </button>
    </form>
  )
}

function getErrorElement(message: string | undefined): JSX.Element | null {
  if (message == undefined) {
    return null
  }
  return (
    <p role="alert" className="error-text">
      {message}
    </p>
  )
}

export default ProfileDeleteForm
