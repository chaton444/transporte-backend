import { Controller, Get, Query, Param } from '@nestjs/common';
import { DatabaseService } from 'src/service/database/database.service';
//nuestro controlador y endpoints ademas de los datos para lo del query
@Controller('transport')
export class TransportController {
  constructor(private readonly databaseService: DatabaseService) {}
  @Get()
async getData(
  @Query('anioInicio') anioInicio: number,
  @Query('anioFin') anioFin: number,
  @Query('mesInicio') mesInicio: number,
  @Query('mesFin') mesFin: number,
  @Query('transporte') transporte: string,
  @Query('incluirPreliminares') incluirPreliminares: boolean
) {
  return this.databaseService.getFilteredData(
    anioInicio,
    anioFin,
    mesInicio,
    mesFin,
    transporte,
    incluirPreliminares
  );
}

  @Get(':id') // Nueva ruta para obtener un registro por ID
  async getById(@Param('id') id: string) {
    return this.databaseService.getById(id);
  }
  //endpoint para poder ver los transportes 
  @Get('transportes')
async getTransportes(): Promise<string[]> {
  return this.databaseService.getTransportes();
}

}
