import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {RequestToTeachModel, StudyRequest, StudyRequestModel} from "@/model/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const studyRequestId = segments[segments.length - 1];

    if (!studyRequestId) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(studyRequestId)) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const studyRequestObjectId = new mongoose.Types.ObjectId(studyRequestId);

    const studyRequest = await StudyRequestModel.findOne({ _id: studyRequestObjectId});

    if (!studyRequest) {
      return NextResponse.json(
        {error: "study request not found"},
        {status: 404}
      )
    }

    return NextResponse.json(studyRequest, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study request.' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const studyRequestId = segments[segments.length - 1];

    if (!studyRequestId) {
      return NextResponse.json(
        { error: 'Study request id not found.' },
        { status: 403}
      );
    }

    if (!mongoose.Types.ObjectId.isValid(studyRequestId)) {
      return NextResponse.json(
        { error: 'Study request id not valid.' },
        { status: 403 }
      );
    }

    const studyRequestObjectId = new mongoose.Types.ObjectId(studyRequestId);

    const { description, attachments, phoneNumber } = await req.json();

    if (!description.trim() || !phoneNumber || isNaN(phoneNumber)) {
      return NextResponse.json(
        {error: "data not found or invalid phone number.",},
        {status: 403}
      )
    }

    const studyRequest: StudyRequest|null = await StudyRequestModel.findOne({ _id: studyRequestObjectId });

    if (!studyRequest) {
      return NextResponse.json(
        {error: "study request not found"},
        {status: 404}
      )
    }

    if (studyRequest.applied.some(id => id.toString() === userId.toString())) {
      return NextResponse.json(
        {error: "already applied"},
        {status: 403}
      )
    }

    const requestToTeach = await RequestToTeachModel.create({
      studyRequestId: studyRequestObjectId,
      user_id: userId,
      description,
      phoneNumber,
      attachments
    })

    if (!requestToTeach) {
      return NextResponse.json(
        {error: "failed to create request to teach"},
        {status: 500}
      )
    }

    studyRequest.applied = [...studyRequest.applied, userId as unknown as mongoose.Schema.Types.ObjectId];
    await studyRequest.save();

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while creating request to teach.' }, { status: 500 });
  }
}
