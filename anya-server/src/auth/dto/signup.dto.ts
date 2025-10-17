import LoginBody from "./login.dto";

export default interface SignupBody extends LoginBody {
    email: string,
    age : number
}