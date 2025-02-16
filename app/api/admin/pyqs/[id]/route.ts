import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {PyqModel} from "@/model/User";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }>}) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json(
        { error: 'User is not admin' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 403 }
      )
    }

    const ObjectId = new mongoose.Types.ObjectId(id);

    if (!mongoose.Types.ObjectId.isValid(ObjectId)) {
      return NextResponse.json(
        { error: "id is not valid" },
        { status: 403 }
      )
    }

    const pyq = await PyqModel.deleteOne({
      _id: ObjectId
    })

    if (!pyq) {
      return NextResponse.json(
        { error: "failed to delete pyqs"},
        { status: 500 }
      )
    }

    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching pyqs.' }, { status: 500 });
  }
}