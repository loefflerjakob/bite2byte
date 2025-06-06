import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma';


export async function POST(req: Request) {
  const body = await req.json()
  const { text, calories, protein, fats, carbohydrates } = body

  try {
    const entry = await prisma.entry.create({
      data: { text, calories, protein, fats, carbohydrates },
    })
    return NextResponse.json(entry)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }
}

export async function GET() {
  const entries = await prisma.entry.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(entries)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()

  try {
    const entry = await prisma.entry.delete({
      where: { id },
    })
    return NextResponse.json(entry)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}


export async function PUT(req: Request) {
  const { id, text, calories, protein, fats, carbohydrates } = await req.json()

  try {
    const entry = await prisma.entry.update({
      where: { id },
      data: { text, calories, protein, fats, carbohydrates },
    })
    return NextResponse.json(entry)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}