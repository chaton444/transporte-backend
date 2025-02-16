import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransportData } from 'src/modules/transport/transport-data.entity';
import { DataService } from '../data.service';
//servicios generales para la conexion de postgreSql
@Injectable()
export class DatabaseService {
  
  constructor(
    @InjectRepository(TransportData)
    private readonly transportDataRepository: Repository<TransportData>,
    private readonly dataService: DataService,
  ) {}
  //servicio para la captacion del ID con el controlador
  async getById(id: string) {
    return this.transportDataRepository.findOne({ where: { id } });
  }
  // metodo para guardar los datos de la entidad
  async saveData() {
    const data = await this.dataService.fetchData();
    if (!data || data.length === 0) {
      throw new Error('no hay datos para guardar');
    }
  
    for (const item of data) {
      const existingRecord = await this.transportDataRepository.findOne({ where: { id: item._id } });
      if (!existingRecord) {
        const transportRecord = new TransportData();
        transportRecord.id = item._id;
        transportRecord.anio = item.Anio;
        transportRecord.id_mes = item.ID_mes;
        transportRecord.transporte = item.Transporte;
        transportRecord.variable = item.Variable;
        transportRecord.valor = item.Valor ?? 0;
        transportRecord.estatus = item.Estatus;
        transportRecord.id_entidad_unico = item.ID_entidad_unico;
        transportRecord.id_entidad = item.ID_entidad;
        transportRecord.entidad = item.Entidad;
        transportRecord.id_municipio_unico = item.ID_municipio_unico;
        transportRecord.id_municipio = item.ID_Municipio;
        transportRecord.municipio = item.Municipio;
        await this.transportDataRepository.save(transportRecord);
      }
    }
  }
//separar transporte nombre para posteriormente poder verlos en angular
async getTransportes(): Promise<string[]> {
  const transportes = await this.transportDataRepository
      .createQueryBuilder('transport')
      .select('DISTINCT transport.transporte', 'transporte')
      .getRawMany();
// ver que transportes se obtuvieron en el query
  console.log('Transportes obtenidos:', transportes); 

  return transportes.map((t) => t.transporte);
}

    // Metodo de filtrado de datos
    async getFilteredData(
      anioInicio: number,
      anioFin: number,
      mesInicio: number,
      mesFin: number,
      transporte: string,
      incluirPreliminares: boolean
    ) {
      // query para la consulta filtrada 
      const query = this.transportDataRepository
        .createQueryBuilder('transport')
        .where('transport.anio BETWEEN :anioInicio AND :anioFin', { anioInicio, anioFin })
        .andWhere('transport.id_mes BETWEEN :mesInicio AND :mesFin', { mesInicio, mesFin })
        .andWhere('transport.variable IN (:...variables)', {
          variables: [
            'Ingresos por pasaje',
            'Kilómetros recorridos',
            'Longitud de servicio',
            'Pasajeros transportados',
            'Unidades en operación',
          ],
        });
    
      // Aplicar filtro de transporte si no es todo para posteriormente arrojar todos los datos de los transportes
      if (transporte !== 'Todos') {
        query.andWhere('transport.transporte = :transporte', { transporte });
      }
    
      // Aplicar filtro de estatus si no se incluyen preliminares que vinene en algunos datos de transportes mas recientes 
      if (!incluirPreliminares) {
        query.andWhere('transport.estatus = :estatus', { estatus: 'Cifras Definitivas' });
      }
    
      // Ejecutar la consulta
      const datos = await query.getMany();
    
      // Procesa los datos  por año, mes y transporte para posteriormente poder crear un identificador y unificar los datos en una llave de control
      // definida por año-mes-transporte de esta manera poder unificar los datos de km,pasajeros, etc.
      const datosProcesados = datos.reduce((aux, item) => {
        const key = `${item.anio}-${item.id_mes}-${item.transporte}`;
        if (!aux[key]) {
          aux[key] = {
            anio: item.anio,
            id_mes: item.id_mes,
            transporte: item.transporte,
            ingresos: null,
            kilometros: null,
            longitud: null,
            pasajeros: null,
            unidades: null,
          };
        }
        //filtrar por tipo de variable para posterior guardar el valor en el item con el identificador(llave) para poder agrupar los datos 
        switch (item.variable) {
          case 'Ingresos por pasaje':
            aux[key].ingresos = item.valor;
            break;
          case 'Kilómetros recorridos':
            aux[key].kilometros = item.valor;
            break;
          case 'Longitud de servicio':
            aux[key].longitud = item.valor;
            break;
          case 'Pasajeros transportados':
            aux[key].pasajeros = item.valor;
            break;
          case 'Unidades en operación':
            aux[key].unidades = item.valor;
            break;
        }
        return aux;
      }, {});
    
      // Convertir el objeto procesado a un array y retornarlo
      return Object.values(datosProcesados);
    }
}
