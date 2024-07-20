import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/db/dbConnect';
import User from '@/models';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Connect to the database
  await dbConnect();

  const session = await getServerSession(authOptions);
  
  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const user= session?.user;

  const userId = user._id;
  const { acceptMessages } = await request.json();


  try {
    // Update the user's message acceptance status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    ).select('-password').select('-verifyCode').select('-verifyCodeExpiry').select('-isVerified');

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: 'User not found.',
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: 'Status updated successully',
        updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Something went wrong', error);
    return Response.json(
      { success: false, message: 'Something went wrong' },
      { status: 500 }
    );
  }
}


export async function GET() {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const isUser = await User.findById(user._id);

    if (!isUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: isUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message status' },
      { status: 500 }
    );
  }
}