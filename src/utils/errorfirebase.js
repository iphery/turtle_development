import { toast } from "react-toastify";

export const ErrorMessage = (error) => {
  let message = "";
  switch (error) {
    case "auth/invalid-email":
      console.log("Invalid email format.");
      message = "Invalid email";
      //setError("Invalid email format.");
      break;
    case "auth/email-already-in-use":
      console.log("This email is already in use.");
      //setError("This email is already in use.");
      message = "Email already in use";
      break;
    case "auth/weak-password":
      console.log("Password should be at least 6 characters.");
      //setError("Password should be at least 6 characters.");
      message = "Password should be at least 6 characters";
      break;
    case "auth/invalid-credential":
      message = "Wrong password/password";
    default:
      console.log("An unknown error occurred.Invalid email format.");
      //setError("An unknown error occurred.");
      break;
  }
  toast.error(message, {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
    theme: "light",
  });
};
