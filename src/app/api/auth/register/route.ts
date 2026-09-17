import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, username, password, role, student_no } = body;

    if (!full_name || !username || !password || !role) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ-นามสกุล, ชื่อผู้ใช้, รหัสผ่าน, ตำแหน่ง)' },
        { status: 400 }
      );
    }

    // Role validation
    if (role !== 'ADMIN' && role !== 'TREASURER') {
      return NextResponse.json(
        { error: 'ตำแหน่งที่สามารถสมัครได้คือ "อาจารย์ที่ปรึกษา" หรือ "เหรัญญิก" เท่านั้น' },
        { status: 400 }
      );
    }

    // Check 1-person limit for this role
    const existingInRole = await prisma.user.findFirst({
      where: { role: role },
    });

    if (existingInRole) {
      const roleName = role === 'ADMIN' ? 'อาจารย์ที่ปรึกษา (Admin)' : 'เหรัญญิก';
      return NextResponse.json(
        { error: `ตำแหน่ง${roleName}มีผู้ลงทะเบียนแล้ว (${existingInRole.full_name}) ระบบจำกัด 1 คนต่อตำแหน่งครับ` },
        { status: 400 }
      );
    }

    // Check duplicate username
    const existingUsername = await prisma.user.findFirst({
      where: { username: username.trim() },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่อผู้ใช้อื่น' },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        full_name: full_name.trim(),
        username: username.trim(),
        password: password, // Store password
        role: role,
        student_no: student_no || (role === 'ADMIN' ? 'อาจารย์' : 'เหรัญญิก'),
      },
      select: {
        id: true,
        full_name: true,
        username: true,
        role: true,
        student_no: true,
      }
    });

    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
