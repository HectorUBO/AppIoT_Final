import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { PlotModule } from './plot/plot.module';
import { PlotDataModule } from './plot-data/plot-data.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { SensorDataModule } from './sensor/sensor.module';

@Module({
  imports: [UserModule, PlotModule, PlotDataModule, ScheduleModule.forRoot(), AuthModule, SensorDataModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
