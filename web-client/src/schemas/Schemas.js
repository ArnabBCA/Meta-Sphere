import * as Yup from 'yup';
const MAX_FILE_SIZE = 2000000; //2MB
const validFileExtensions = { file: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
function isValidFileType(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}
export const registerSchema=Yup.object({
    userName:Yup.string().min(2).max(25).required("User Name cannot be empty"),
    fullName:Yup.string().min(2).max(25).required("Full Name cannot be empty"),
    email:Yup.string().email().required("Email cannot be empty"),
    password:Yup.string().min(6).required("Password cannot be empty"),
    confirmPassword:Yup.string().required("Confirm Password cannot be empty").oneOf([Yup.ref('password'),null],"Pasword must match"),
    /*file:Yup.mixed().nullable().required("Profile picture cannot be empty")
    .test("is-valid-type", "Unsupported file type",value => isValidFileType(value && value.name.toLowerCase(), "file"))
    .test("is-valid-size", "Max allowed size is 2Mb",value => value && value.size <= MAX_FILE_SIZE)*/
});

export const loginSchema=Yup.object({
  email:Yup.string().email().required("Email cannot be empty"),
  password:Yup.string().min(6).required("Password cannot be empty"),
});

export const profileSchema=Yup.object({
    name:Yup.string().min(2).max(25),
    email:Yup.string().email(),
    location:Yup.string().min(2).max(25),
    socialLink1:Yup.string().min(2).max(10),
    socialLink2:Yup.string().min(2).max(10),
    //password:Yup.string().min(6).required("Password cannot be empty"),
    //confirm_password:Yup.string().required("Confirm Password cannot be empty").oneOf([Yup.ref('password'),null],"Pasword must match"),
    profilePicture:Yup.mixed().nullable()
    .test("is-valid-type", "Unsupported file type",value => {
      if(!value) return true;
      return isValidFileType(value.name.toLowerCase(), "file");
    })
    .test("is-valid-size", "Max allowed size is 2Mb",value => {
      if(!value) return true;
      return value.size <= MAX_FILE_SIZE;
    })
});