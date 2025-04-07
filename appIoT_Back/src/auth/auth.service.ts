import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async initialLogin(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generamos token temporal para verificación (expira en 5 minutos)
        const tempToken = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { expiresIn: '5m' }
        );

        return {
            tempToken,
            securityQ: user.securityQ // Enviamos la pregunta para mostrar en el front
        };
    }

    async verifySecurityAnswer(tempToken: string, answer: string) {
        try {
            // Verificamos el token temporal
            const payload = this.jwtService.verify(tempToken);
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub }
            });

            if (!user || user.securityA !== answer) {
                throw new UnauthorizedException('Respuesta de seguridad incorrecta');
            }

            // Generamos token final de acceso (expira en 24 horas)
            const accessToken = this.jwtService.sign(
                { email: user.email, sub: user.id },
                { expiresIn: '24h' }
            );

            return {
                access_token: accessToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (err) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }

    async register(userData: {
        name: string;
        email: string;
        password: string;
        securityQ: string;
        securityA: string;
    }) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            }
        });
    }

    async getSecurityQuestion(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { securityQ: true }
        });

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return { securityQ: user.securityQ };
    }
}