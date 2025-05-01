import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const body = await req.json()
  const { text, calories, protein, fat, carbs } = body

  try {
    const entry = await prisma.entry.create({
      data: { text, calories, protein, fat, carbs },
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
