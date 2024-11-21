import { db as prisma } from "@/lib/db"
import bcrypt from "bcrypt"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

    const data = await request.json()
    const { username, email, password, role } = data

    // Senão preencher algum formulário,dá erro
    if (!username || !email || !password) {
        return NextResponse.json({ error: "Erro: Dados incompletos." }, { status: 400 })
    }

    // Se usuário já existe
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (isUserExists) {
        return NextResponse.json({ error: "Erro: E-mail já existente." }, { status: 400 })
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Acrescentar role padrão de cadastro
    data.role = "Assinante";
    const user = await prisma.user.create({
        data: {
            email,
            username,
            role,
            hashedPassword
        }
    })

    return NextResponse.json(user)
}