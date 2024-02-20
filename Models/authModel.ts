import mongoose, {Document, Schema} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

interface Iuser extends Document{
    name: string,
    email: string,
    gender: string,
    password: string,
    confirmPassword: string | undefined,
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>; //Returns a promise that will eventually return a boolean value
}


const userSchema: Schema<Iuser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide a valid email'],
        unique: true,
        validate: {
            validator: async function (value: string){
                const count = await mongoose.model('User', userSchema)
                .countDocuments({ email: value });
                if(count === 0){
                    return true
                }else{
                    return false
                }
            },
        message: "Email already in use. Please provide a different email id to sign up",
        } 
    },
    gender: {
        type: String,
        required: [true, 'Please mention your gender'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          validator: function(this: Iuser, confirmpass: string): boolean {
            return confirmpass === this.password;
          },
        message: 'Passwords are not the same!'
    }
    }
});

userSchema.pre<Iuser>('save', async function(next) {  // This will make sure confirmpassword is not written to db
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword: string,
    userPassword: string 
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema)

export default User;