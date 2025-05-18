import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma';

const defaultGoalValues = {
  calories: 2000,
  protein: 150,
  carbohydrates: 250,
  fats: 70,
};


export async function GET() {
  try {
    let nutritionalGoal = await prisma.nutritionalGoal.findUnique({
      where: { identifier: "current_user_goals" },
    });

    if (!nutritionalGoal) {
      nutritionalGoal = await prisma.nutritionalGoal.create({
        data: {
          identifier: "current_user_goals",
          calories: defaultGoalValues.calories,
          protein: defaultGoalValues.protein,
          carbohydrates: defaultGoalValues.carbohydrates,
          fats: defaultGoalValues.fats,
        }
      });
    }
    return NextResponse.json(nutritionalGoal);
  } catch (error) {
    console.error("Fehler beim Abrufen oder Erstellen der Nährwertziele:", error);
    return NextResponse.json({ error: 'Fehler beim Abrufen oder Erstellen der Nährwertziele' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dataToSave = {
      calories: typeof body.calories === 'number' ? body.calories : defaultGoalValues.calories,
      protein: typeof body.protein === 'number' ? body.protein : defaultGoalValues.protein,
      carbohydrates: typeof body.carbohydrates === 'number' ? body.carbohydrates : defaultGoalValues.carbohydrates,
      fats: typeof body.fats === 'number' ? body.fats : defaultGoalValues.fats,
    };

    if (
      typeof dataToSave.calories !== 'number' ||
      typeof dataToSave.protein !== 'number' ||
      typeof dataToSave.carbohydrates !== 'number' ||
      typeof dataToSave.fats !== 'number'
    ) {
      return NextResponse.json({ error: 'Ungültige Datentypen. Alle Nährwertziele müssen Zahlen sein.' }, { status: 400 });
    }

    const updatedOrCreatedGoal = await prisma.nutritionalGoal.upsert({
      where: { identifier: "current_user_goals" },
      update: {
        calories: dataToSave.calories,
        protein: dataToSave.protein,
        carbohydrates: dataToSave.carbohydrates,
        fats: dataToSave.fats,
      },
      create: {
        identifier: "current_user_goals",
        calories: dataToSave.calories,
        protein: dataToSave.protein,
        carbohydrates: dataToSave.carbohydrates,
        fats: dataToSave.fats,
      },
    });

    return NextResponse.json(updatedOrCreatedGoal);
  } catch (error) {
    console.error("Fehler beim Speichern der Nährwertziele:", error);
    return NextResponse.json({ error: 'Fehler beim Speichern der Nährwertziele' }, { status: 500 });
  }
}