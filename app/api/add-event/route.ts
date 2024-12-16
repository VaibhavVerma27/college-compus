import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { EventModel, ClubModel } from '../../../model/User';
import { StudentModel } from '../../../model/User'; 
import dbConnect from '../../../lib/connectDb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../(auth)/auth/[...nextauth]/options';
import { User } from 'next-auth';

export async function POST(req: Request) {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    if (!session || !user) {
        return NextResponse.json({ error: 'Unauthorized. User must be logged in.' }, { status: 401 });
    }
    
    const userId = new mongoose.Types.ObjectId(user._id);
    
    try {
        const {
            eventHostedBy,
            eventVenue,
            eventTime,
            eventAttachments,
            heading,
            description,
            tags,
        } = await req.json();
        
        const club = await ClubModel.findOne({ clubName: eventHostedBy });

        if (!eventHostedBy || !eventVenue || !eventTime || !heading || !description) {
            return NextResponse.json(
                { error: 'All required fields must be provided.' },
                { status: 400 }
            );
        }

        if (!club) {
            return NextResponse.json(
                { error: 'Club not found with the provided club name' },
                { status: 404 }
            );
        }

        const student = await StudentModel.findOne({ user_id: userId });
        if (!student) {
            return NextResponse.json({ error: 'Student not found.' }, { status: 404 });
        }
        if (!student.clubsHeadOf.includes((club._id)as mongoose.Schema.Types.ObjectId)) {
            return NextResponse.json(
                { error: 'Student must be the head of the club to create an event.' },
                { status: 403 }
            );
        }

        const newEvent = new EventModel({
            eventHostedBy: club._id,
            eventVenue,
            eventTime,
            interestedMembersArr:[],
            eventAttachments: eventAttachments || [],
            heading,
            description,
            tags,
        });
        const savedEvent = await newEvent.save();

        return NextResponse.json(savedEvent, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
