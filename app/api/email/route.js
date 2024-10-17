import {
  ConnectDB
} from "@/lib/config/db";
import {
  NextResponse
} from "next/server";
import EmailModel from "@/lib/models/EmailModel"

const LoadDB = async () => {
  await ConnectDB();
}

LoadDB();

export async function POST(request) {
  const formData = await request.formData();
  const emailData = {
    email: `${formData.get('email')}`,
  }

  await EmailModel.create(emailData);
  return NextResponse.json({
    success: true,
    msg: "Email Subscribed"
  })
}

export async function GET(request) {
  try {
    const emails = await EmailModel.find({});
    return NextResponse.json({
      emails
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      msg: "Error fetching emails",
      error: error.message
    });
  }
}

export async function DELETE(request) {
  const id = await request.nextUrl.searchParams.get('id');
  const blog = await EmailModel.findById(id);

  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({
    success: true,
    msg: "Email Deleted."
  });

}