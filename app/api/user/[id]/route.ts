import {NextRequest, NextResponse} from "next/server";
import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import mongoose from "mongoose";
import {StudentModel} from "@/model/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{id: string}>}) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({error: "id is required"  }, { status: 403 });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "id is not valid" },
        { status: 403 }
      )
    }
    
    const objectId = new mongoose.Types.ObjectId(id);
    
    const student = await StudentModel.aggregate([
      {
        $match: {
          _id: objectId,
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "friends",
          foreignField: "_id",
          as: "friends",
          pipeline: [
            {
              $project: {
                name: 1,
                profile: 1,
                student_id: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "clubs",
          localField: "clubsPartOf",
          foreignField: "_id",
          as: "clubsPartOf",
          pipeline: [
            {
              $project: {
                clubName: 1,
                clubLogo: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "clubs",
          localField: "clubsHeadOf",
          foreignField: "_id",
          as: "clubsHeadOf",
          pipeline: [
            {
              $project: {
                clubName: 1,
                clubLogo: 1
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "events",
          localField: "interestedEvents",
          foreignField: "_id",
          as: "interestedEvents",
          pipeline: [
            {
              $project: {
                eventVenue: 1,
                eventTime: 1,
                heading: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          name: 1,
          profile: 1,
          student_id: 1,
          semester: 1,
          branch: 1,
          friends: 1,
          clubsPartOf: 1,
          clubsHeadOf: 1,
          interestedEvents: 1
        }
      }
    ])
    
    if (!student || student.length === 0) {
      return NextResponse.json(
        { error: "student not found." },
        { status: 404 }
      )
    }
    
    return NextResponse.json(student[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}