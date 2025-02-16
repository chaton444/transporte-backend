import { Entity, PrimaryColumn, Column } from 'typeorm';
//codigo de la entidad 
@Entity('trnasport_data')
export class TransportData {
  @PrimaryColumn()
  id: string;

  @Column()
  anio: number;

  @Column()
  id_mes: number;

  @Column()
  transporte: string;

  @Column()
  variable: string;

  @Column()
  valor: number;

  @Column()
  estatus: string;

  @Column()
  id_entidad_unico: string;

  @Column()
  id_entidad: number;

  @Column()
  entidad: string;

  @Column()
  id_municipio_unico: string;

  @Column()
  id_municipio: number;

  @Column()
  municipio: string;
}
