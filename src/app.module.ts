import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserTaskModule } from './usersTasks/userTasks.module';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin#123',
      database: 'tareas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserTaskModule,
    TaskModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
