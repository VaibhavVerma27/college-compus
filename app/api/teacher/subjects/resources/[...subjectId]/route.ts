import dbConnect from "../../../../../../lib/connectDb";
import {getServerSession, User} from "next-auth";
import {authOptions} from "../../../../(auth)/auth/[...nextauth]/options";
import {NextRequest, NextResponse} from "next/server";
import {ResourceModel} from "../../../../../../model/User";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const subjectId = segments[segments.length - 1];

    if (!subjectId) {
      return NextResponse.json(
        {error: 'No subjectId provided'},
        {status: 403}
      )
    }

    const resources = await ResourceModel.aggregate([
      {
        $match: {
          subjectId: subjectId,
        }
      },
      {
        $project: {
          _id: 0,
          files: 1,
        }
      }
    ])

    if (!resources || resources.length === 0) {
      return NextResponse.json(
        {error: "Resources not found."},
        {status: 404}
      )
    }

    return NextResponse.json(resources[0].files, {status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


//add a group in a subject
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const subjectId = segments[segments.length - 1];

    if (!subjectId) {
      return NextResponse.json(
        {error: 'No subjectId provided'},
        {status: 403}
      )
    }

    const { file } = await req.json();

    if (!file) {
      return NextResponse.json(
        {error: "file not provided"},
        {status: 403}
      )
    }

    const resource = await ResourceModel.updateOne(
      { subjectId: subjectId },
      { $push: { files: file } }
    )

    if (!resource.modifiedCount) {
      return NextResponse.json(
        {error: "failed to update resource"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


//delete group  subjectId === groupId
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({error: 'Unauthorized. User must be logged in.'}, {status: 401});
    }

    if (!user.isTeacher) {
      return NextResponse.json(
        {error: 'User is not teacher'},
        {status: 401}
      );
    }

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const subjectId = segments[segments.length - 1];

    if (!subjectId) {
      return NextResponse.json(
        {error: 'No groupId provided'},
        {status: 403}
      )
    }

    const file = await req.body;

    if (!file) {
      return NextResponse.json(
        {error: "file not provided"},
        {status: 403}
      )
    }

    const resource = await ResourceModel.updateOne(
      { subjectId: subjectId },
      { $pull: { files: file } }
    )

    if (!resource.modifiedCount) {
      return NextResponse.json(
        {error: "failed to update resource"},
        {status: 500}
      )
    }

    return NextResponse.json({status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

