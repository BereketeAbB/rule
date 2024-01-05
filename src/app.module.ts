import { Module } from '@nestjs/common';
import { RuleModule } from './rule/rule.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [RuleModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'rule',
      username: 'postgres',
      password: 'root',
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsRun: true,
      migrationsTableName: 'typeorm_migrations',
      logger: 'advanced-console',
      logging: 'all',
      synchronize: true,
      autoLoadEntities: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
