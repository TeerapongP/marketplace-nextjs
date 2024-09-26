// import { NextRequest, NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { prisma } from '../../../../lib/prisma'; // Adjust the path as necessary
// import { IncomingMessage } from 'http';
// import parseForm from '../../lib/formidableMiddleware';
// import formidable from 'formidable';

// const JWT_SECRET = process.env.JWT_SECRET || '';

// export async function PUT(req: NextRequest) {
//   try {
//     // Convert NextRequest to http.IncomingMessage
//     const incomingReq = req as unknown as IncomingMessage;

//     // Use the parseForm utility function
//     const { fields, files } = await parseForm(incomingReq);

//     const authHeader = req.headers.get('authorization') || '';
//     if (!authHeader) {
//       return NextResponse.json({ message: 'Authorization header is missing' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       return NextResponse.json({ message: 'Token is missing' }, { status: 401 });
//     }

//     let decoded;
//     try {
//       decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
//     } catch (err) {
//       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//     }

//     const { userId } = decoded;
//     const userName = Array.isArray(fields.userName) ? fields.userName[0] : fields.userName;
//     const firstName = Array.isArray(fields.firstName) ? fields.firstName[0] : fields.firstName;
//     const lastName = Array.isArray(fields.lastName) ? fields.lastName[0] : fields.lastName;
//     const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
//     const phoneNumber = Array.isArray(fields.phoneNumber) ? fields.phoneNumber[0] : fields.phoneNumber;
//     const address = Array.isArray(fields.address) ? fields.address[0] : fields.address;
//     const userImage = files.file ? (files.file[0] as formidable.File).newFilename : undefined;

//     if (!userId) {
//       return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
//     }

//     try {
//       const updatedUser = await prisma.user.update({
//         where: { userId: Number(userId) },
//         data: {
//           userName,
//           firstName,
//           lastName,
//           email,
//           phoneNumber,
//           address,
//           userImage,
//         },
//       });

//       return NextResponse.json(updatedUser, { status: 200 });
//     } catch (error) {
//       (error);
//       return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//     }
//   } catch (error) {
//     (error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Your logic to handle the request
  return NextResponse.json({ message: "User updated successfully" });
}
