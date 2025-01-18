import { NextRequest, NextResponse } from "next/server";
import extractTextFromImageLinks from "../../../../lib/sidVerification";
import { StudentModel, UserModel } from "@/model/User";
import dbConnect from "../../../../lib/connectDb";
import Groq from 'groq-sdk';

const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ExtractedInfo {
  name: string | null;
  department: string | null;
  identityNo: string | null;
  emailNameMatch: boolean;
  correctedName: string | null;
}

const cleanAndParseJSON = (content: string): any => {
  try {
    // First try direct parsing
    return JSON.parse(content);
  } catch (err) {
    console.error(err);
    try {
      // Try to extract JSON if it's wrapped in other text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error(e);
      console.error('Failed to parse JSON from content:', content);
      return null;
    }
  }
  return null;
};

export const extractAllDetails = async (text: string, email: string): Promise<ExtractedInfo> => {
  if (!text) {
    console.error('Invalid text input:', text);
    return {
      name: null,
      department: null,
      identityNo: null,
      emailNameMatch: false,
      correctedName: null
    };
  }

  const emailName = email.match(/^([a-zA-Z]+)\.bt\d+([a-z]+)@pec\.edu\.in$/)?.[1] ?? null;

  const prompt = `Analyze the following OCR text and email. You must respond with a valid JSON object and nothing else. The response should look exactly like this:
{
  "studentId": "(extracted student ID number)",
  "name": "(extracted full name from OCR text)",
  "department": "(extracted department name)",
  "emailNameMatch": (true/false based on comparing "${emailName}" with extracted name),
  "correctedName": "(proper capitalized name from ${email})"
}

OCR Text: "${text}"

Remember: Return ONLY the JSON object, no other text. Use null for any missing values.`;

  try {
    const completion = await groqClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
      temperature: 0.1,
      max_tokens: 500,
      top_p: 1,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content;
    console.log('Raw GROQ response:', content); // Debug log

    if (!content) {
      throw new Error('Empty response from GROQ');
    }

    const result = cleanAndParseJSON(content);
    
    if (!result) {
      throw new Error('Failed to parse GROQ response');
    }

    return {
      name: result.name || null,
      department: result.department || null,
      identityNo: result.studentId || null,
      emailNameMatch: Boolean(result.emailNameMatch),
      correctedName: result.correctedName || null
    };
  } catch (error) {
    console.error('Error in extractAllDetails:', error);
    return {
      name: null,
      department: null,
      identityNo: null,
      emailNameMatch: false,
      correctedName: null
    };
  }
};

export async function POST(request: NextRequest) {
  console.log("Processing SID verification request");
  await dbConnect();

  try {
    const { username, image } = await request.json();

    if (!username || !image) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or image data' },
        { status: 400 }
      );
    }

    const [user, student] = await Promise.all([
      UserModel.findOne({ username }),
      StudentModel.findOne({ name: username })
    ]);

    if (!student || !user) {
      console.log("User or student record not found:", { user: !!user, student: !!student });
      return NextResponse.json(
        { success: false, message: 'User or student record not found' },
        { status: 404 }
      );
    }

    if (student.sid_verification) {
      console.log(`SID verification already completed for student: ${username}`);
      return NextResponse.json(
        { success: false, message: 'SID verification already completed' },
        { status: 400 }
      );
    }

    const results = await extractTextFromImageLinks([image]);
    console.log('Extracted OCR text:', results[image]); // Debug log
    
    if (!results[image]) {
      user.sid_verification = false;
      await user.save();
      return NextResponse.json(
        { success: false, message: 'Failed to extract text from image' },
        { status: 500 }
      );
    }

    const extractedInfo = await extractAllDetails(results[image], student.email as string);
    console.log('Extracted info:', extractedInfo); // Debug log
    
    if (!extractedInfo.name || !extractedInfo.identityNo || !extractedInfo.emailNameMatch) {
      console.log("Failed to extract or verify details:", extractedInfo);
      user.sid_verification = false;
      await user.save();
      return NextResponse.json(
        { success: false, message: 'Failed to extract or verify details from image' },
        { status: 400 }
      );
    }

    student.name = extractedInfo.correctedName ?? extractedInfo.name;
    student.sid_verification = true;
    if (extractedInfo.department) student.branch = extractedInfo.department;
    student.student_id = extractedInfo.identityNo;
    user.sid_verification = true;

    await Promise.all([
      student.save(),
      user.save()
    ]);

    return NextResponse.json({
      success: true,
      message: 'SID verification completed',
      data: {
        name: extractedInfo.name,
        department: extractedInfo.department,
        identityNo: extractedInfo.identityNo
      },
    });

  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error during verification. Try with a new and more clear image.' },
      { status: 500 }
    );
  }
}
