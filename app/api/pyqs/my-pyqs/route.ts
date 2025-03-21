import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import {PyqModel} from "@/model/User";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const pyq = await PyqModel.aggregate([
      {
        $match: {
          author: userId
        }
      }
    ])

    if (!pyq) {
      return NextResponse.json(
        { error: "failed to fetch pyqs"},
        { status: 500 }
      )
    }

    return NextResponse.json(pyq, { status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching pyqs.' }, { status: 500 });
  }
}
