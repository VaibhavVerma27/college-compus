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

    const pyq = await PyqModel.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "author",
          foreignField: "user_id",
          as: "author",
          pipeline: [
            {
              $project: {
                name: 1,
                student_id: 1,
                profile: 1
              }
            }
          ]
        }
      },
      {
        $unwind: "$author"
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

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const { subjectName, subjectCode, year, papers } = await req.json();

    if (!subjectName || !subjectCode || isNaN(year) || !papers.length) {
      return NextResponse.json(
        { error: "data not provided" },
        { status: 403 }

      )
    }

    const pyq = await PyqModel.create({
      subjectName,
      subjectCode,
      year,
      papers,
      author: userId
    })

    if (!pyq) {
      return NextResponse.json(
        { error: "failed to create pyqs"},
        { status: 500 }
      )
    }

    return NextResponse.json({ status: 200 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching pyqs.' }, { status: 500 });
  }
}