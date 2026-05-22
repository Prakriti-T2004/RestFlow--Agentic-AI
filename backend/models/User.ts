import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
  }
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

class UserModel {
  static async create(userData: { name: string; email: string; password: string }): Promise<UserWithoutPassword> {
    const user = new User(userData);
    await user.save();
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async findByEmail(email: string): Promise<(IUser & { id: string }) | null> {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).exec();
    if (!user) return null;
    return { ...user.toObject(), id: user._id.toString() } as IUser & { id: string };
  }

  static async findById(id: string): Promise<UserWithoutPassword | null> {
    const user = await User.findById(id).select('name email createdAt updatedAt').exec();
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async update(id: string, userData: Partial<{ name: string }>): Promise<{ modifiedCount: number }> {
    const update = { ...(userData.name && { name: userData.name }) };
    const result = await User.updateOne({ _id: id }, update).exec();
    return { modifiedCount: result.modifiedCount };
  }
}

export default UserModel;
