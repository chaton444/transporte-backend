import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportController } from './controller/transport.controller';
import { TransportData } from './modules/transport/transport-data.entity';
import { DatabaseService } from './service/database/database.service';
import { DataService } from './service/data.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { User } from './auth/user.entity';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy'; // Importa LocalStrategy

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '172.31.6.98', // IP privada
      port: 5432,
      username: 'chaton44',
      password: '2001',
      database: 'transport_data',
      entities: [TransportData, User],
      synchronize: process.env.NODE_ENV !== 'production',
    })
    ,
    
    TypeOrmModule.forFeature([TransportData, User]), // Registra las entidades para su uso en los servicios
    PassportModule.register({ defaultStrategy: 'jwt' }), // Configura Passport con la estrategia JWT
    JwtModule.register({
      secret: 'tu_secreto_jwt', // Clave secreta para firmar los tokens JWT para la seguridad de auth
      signOptions: { expiresIn: '1h' }, // Tiempo de expiracion del token
    }),
  ],
  controllers: [TransportController, AuthController], // Registra los controladores que se van a usar para el login y lo de la api de transporte
  providers: [
    DatabaseService,
    DataService,
    AuthService,
    JwtStrategy,
    LocalStrategy, 
  ], 
})
export class AppModule implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  // Metodo que se va ejecutar cuando el modulo se inicializa
  async onModuleInit() {
    await this.databaseService.saveData(); // guardamos los nuevos datos de la api para la bd recordar modificar que se ejecute solo cuando sea necesesario y no siempre cargar los datos de la api
  }
}