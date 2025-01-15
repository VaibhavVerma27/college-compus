import dbConnect from "@/lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "@/app/api/(auth)/auth/[...nextauth]/options";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import {RequestToTeachModel, StudyRequestModel} from "@/model/User";

export async function GET(req: NextRequest) {
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

    const studyRequest = await StudyRequestModel.findOne({ _id: studyRequestObjectId, user_id: userId });

    if (!studyRequest || studyRequest.accepted === true) {
      return NextResponse.json(
        {error: "study request not found or accepted"},
        {status: 404}
      )
    }

    return NextResponse.json(studyRequest, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching study request.' }, { status: 500 });
  }
}



export async function PATCH(req: NextRequest) {
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

    const { subjectId, subjectName, description, attachments, price} = await req.json();

    if (!subjectName || !subjectId || !description.trim()) {
      return NextResponse.json(
        {error: "data not found for this request."},
        {status: 403}
      )
    }

    const studyRequest = await StudyRequestModel.findOneAndUpdate(
      { _id: studyRequestObjectId, user_id: userId },
      {
        subjectId,
        subjectName,
        description,
        attachments,
        price,
      }
    )

    if (!studyRequest) {
      return NextResponse.json(
        {error: "failed to update study request."},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while updating study request.' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
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

    await RequestToTeachModel.deleteMany({ studyRequestId: studyRequestObjectId });

    const studyRequest = await StudyRequestModel.findOneAndDelete({ _id: studyRequestObjectId, user_id: userId });

    if (!studyRequest) {
      return NextResponse.json(
        {error: "failed to delete study request."},
        {status: 404}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while deleting study request.' }, { status: 500 });
  }
}

