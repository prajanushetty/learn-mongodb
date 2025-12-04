import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    authentication: 
    {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
});

export const UserModel = mongoose.model("User", userSchema);
export const getUsers = async () => {
    return UserModel.find().exec();
}
export const getUserByUsername = async (username: string) => {
    return UserModel.findOne({ username }).exec();
}
export const getUSerByEmail = async (email:string)=>{
    return UserModel.findOne({email}).select('+authentication.password +authentication.salt +authentication.sessionToken').exec();
}
export const getUSerBySessionToken = (sessionToken:string)=>{
    return UserModel.findOne({'authentication.sessionToken':sessionToken});
}
export const getUserById = async (id: string) => {
    return UserModel.findById(id).exec();
}
export const createUser=(values: Record<string, any>)=>
{
   return new UserModel(values).save().then((user) => user.toObject());
}
export const deleteUserById=(id:string)=>
{
    return UserModel.findByIdAndDelete(id);
}
export const updateUserById=(id:string,values:Record<string,any>)=>
{
    return UserModel.findByIdAndUpdate(id,values,{new:true}).then((user)=>user?.toObject());
}

export default userSchema;