import * as Yup from 'yup';
const MAX_FILE_SIZE = 2000000; //2MB
const validFileExtensions = { file: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}
export const initialValues = {
  userName: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  location: "",
  occupation: "",
  socialLink1: "",
  socialLink2: "",
};
export const registerSchema=Yup.object({
    userName:Yup.string().min(2).max(20).required("User Name cannot be empty")
    .test("isLowerCaseNoSpaces", "User Name must be in lowercase and without spaces", value => {
      return /^[a-z0-9_]+$/.test(value) && !/\s/.test(value);
    }),
    fullName:Yup.string().min(2).max(20).required("Full Name cannot be empty"),
    email:Yup.string().email().required("Email cannot be empty"),
    password:Yup.string().min(6).required("Password cannot be empty"),
    confirmPassword:Yup.string().required("Confirm Password cannot be empty").oneOf([Yup.ref('password'),null],"Pasword must match"),
});

export const loginSchema=Yup.object({
  email:Yup.string().email().required("Email cannot be empty"),
  password:Yup.string().min(6).required("Password cannot be empty"),
});

export const profileSchema = Yup.object({
  fullName: Yup.string().min(2).max(20),
  location: Yup.string().min(2).max(20),
  occupation: Yup.string().min(2).max(20),
  socialLink1: Yup.string().min(2).max(20),
  socialLink2: Yup.string().min(2).max(20),
});