import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {IssueModel} from "@/model/User";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const issues = await IssueModel.aggregate([
      {
        $addFields: {
          isVoted: {
            $in: [userId, "$votes"]
          }
        }
      },
      {
        $set: {
          votes: {
            $size: "$votes",
          }
        }
      }
    ])

    console.log(issues)
    if (!issues) {
      return NextResponse.json(
        {error: "failed to fetch issues"},
        {status: 500}
      )
    }

    return NextResponse.json(issues, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching issues.' }, { status: 500 });
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

    const {title, description, attachments} = await req.json();

    if (!title.trim() || !description.trim()) {
      return NextResponse.json(
        {error: "title and description cannot be empty."},
        {status: 403}
      )
    }

    const issue = await IssueModel.create({
      author: userId,
      title,
      description,
      attachments,
      votes: []
    })

    if (!issue) {
      return NextResponse.json(
        {error: "failed to create issue"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while adding issue.' }, { status: 500 });
  }
}