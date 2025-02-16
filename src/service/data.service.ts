import { Injectable } from '@nestjs/common';
import axios from 'axios';

// Esta es la interfaz para la respuesta de la API
interface ApiResponse {
  success: boolean;
  message: string;
  data: Array<{
    _id: string;
    Anio: number;
    ID_mes: number;
    Transporte: string;
    Variable: string;
    ID_entidad_unico: string;
    ID_entidad: number;
    Entidad: string;
    ID_municipio_unico: string;
    ID_Municipio: number;
    Municipio: string;
    Valor: number;
    Estatus: string;
  }>;
}
//creacion del servicio para la captacion de datos de la api del gob sobre transporte publico
@Injectable()
export class DataService {
  private readonly apiUrl = 'http://apiiieg.jalisco.gob.mx/api/etup';
  async fetchData() {
    try {
      const response = await axios.get<ApiResponse>(this.apiUrl);
      console.log(response.data); // Verifica si los datos se estan guardando
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Error no se ha podido obtener los datos de la Api Etup');
      }
    } catch (error) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
  }
}
